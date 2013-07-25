(function() {
  goog.provide('ga_importwms_directive');

//  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_importwms_directive', [
  //  'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportWmsDirectiveController',
      ['$scope', '$http', '$q', '$log', '$translate',
       function($scope, $http, $q, $log, $translate) {

         $scope.layers = [];

         // from Angular
         // https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L3
         var URL_REGEXP =
         /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;


         // copy from ImportKml
         $scope.fileUrl = null;
         $scope.fileContent = null;
         $scope.userMessage = '';
         $scope.progress = 0;

         // Handle URL of WMS
         $scope.handleFileUrl = function() {
           var url = $scope.fileUrl;

           if ($scope.isValidUrl(url)) {

             // TODO:May be we should do something stronger
             var idx = url.indexOf('?');

             if (idx === -1) {
               url += '?';
             }

             url += 'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0';

             // Kill the current uploading
             $scope.cancel();

             var proxyUrl = $scope.options.proxyUrl + encodeURIComponent(url);
             $scope.userMessage = $translate('uploading_file');
             $scope.progress = 0.1;
             $scope.canceler = $q.defer();

             // Angularjs doesn't handle onprogress event
             $http.get(proxyUrl, {timeout: $scope.canceler.promise})
            .success(function(data, status, headers, config) {
               $scope.userMessage = $translate('upload_succeeded');
               $scope.fileContent = data;
               $scope.displayFileContent();
             })
            .error(function(data, status, headers, config) {
               $scope.userMessage = $translate('upload_failed');
               $scope.progress = 0;
             });
           }
         };

         // Display the list of layers available from the GetCapabilties in the
         // table
         $scope.displayFileContent = function() {
           $scope.userMessage = $translate('parsing_file');
           $scope.progress = 80;

           // The layerXXXX properties use layer objects from the parsing of 
           // a  GetCapabilities file, not ol layer object
           $scope.layers = [];
           $scope.layerSelected = null; // the layer selected on user click
           $scope.layerHovered = null; // the layer selected when mouse is over it

           var parser = new ol.parser.ogc.WMSCapabilities();

           try {
             var result = parser.read($scope.fileContent);
             $log.log(result);

             for (var i = 0, len = result.capability.layers.length;
                 i < len; i++) {
               var layer = result.capability.layers[i];

               // WMS layer with no name can't be added to the map
               if (layer.name) {
                 $scope.layers.push(layer);
               }
             }

             $scope.userMessage = $translate('parse_succeeded');
             $scope.progress += 20;

           } catch (e) {
             $scope.userMessage = $translate('parse_failed') + e.message;
             $scope.progress = 0;
           }
         };

         // copy from ImportKml
         $scope.cancel = function() {
           $scope.userMessage = $translate('operation_canceled');
           $scope.progress = 0;

           // Kill $http request
           if ($scope.canceler) {
             $scope.canceler.resolve();
           }
         };

         // copy from ImportKml
         // Test validity of a user input
         $scope.isValidUrl = function(url) {
           return (url && url.length > 0 && URL_REGEXP.test(url));
         };

         // Add the selected layer to the map
         $scope.addLayerSelected = function(getCapLayer) {

           if (getCapLayer) {
             $scope.layerSelected = getCapLayer;
           }
  
           $scope.addLayer($scope.layerSelected);
         }
         
         // Add the hovered layer to the map
         $scope.addLayerHovered = function(getCapLayer) {
           $scope.layerHovered = getCapLayer;
           $scope.olLayerHovered = $scope.addLayer($scope.layerHovered);
         }
 
         // Remove layer hovered
         $scope.removeLayerHovered = function() {
           if ($scope.olLayerHovered) {
             $scope.map.removeLayer($scope.olLayerHovered);
             $scope.layerHovered = null;
             $scope.olLayerHovered = null;
           }
         }
        
         // Add a layer from GetCapabilities object to the map
         $scope.addLayer = function(getCapLayer) {

           if (getCapLayer) {
             
             try {
               var extent = null;
               var layer = getCapLayer;
               var srsCode = $scope.map.getView().getProjection().code_;

               if (layer.bbox) {
                
                 if (srsCode.toUpperCase() in layer.bbox) {
                   extent = layer.bbox[srsCode.toUpperCase()].bbox;
                   // ol extent is [minx, maxx, miny, maxy]
                   extent = [extent[0], extent[2], extent[1], extent[3]];
                 }
               }
               
               var olSource = new ol.source.SingleImageWMS({
                   params: {
                     'LAYERS': layer.name 
                   },
                   url: $scope.fileUrl,
                   extent: extent                   
               });

               var olLayer =  new ol.layer.ImageLayer({
                   source: olSource
               });
               
               $scope.map.addLayer(olLayer);
               $scope.map.getView().getView2D().fitExtent(extent, $scope.map.getSize());
        
               return olLayer;
                                         
             } catch (e) {
               $scope.userMessage = $translate('add_wms_layer_failed') + 
                   e.message;
               return null;
             }
           }
         };
  }]);

  module.directive('gaImportWms',
      ['$http', '$log', '$translate',
       function($http, $log, $translate) {
         return {
           retsrict: 'A',
           templateUrl: 'components/importwms/partials/importwms.html',
           scope: {
             map: '=gaImportWmsMap',
             options: '=gaImportWmsOptions'
           },
           controller: 'GaImportWmsDirectiveController',
           link: function(scope, elt, attrs, controller) {

             var taElt = elt.find('input[type=url]').keydown(function(evt) {
               // Block keyboard pan events when the focus is in the input
               // text
               if (evt.keyCode >= 37 && evt.keyCode <= 40) {
                 evt.preventDefault();
                 evt.stopPropagation();
               }

             }).typeahead({
               local: scope.options.defaultWMSList,
               limit: 500

             }).on('typeahead:initialized typeahead:selected', function(evt) {

               if (evt.type === 'typeahead:selected') {
                 scope.fileUrl = this.value;
                 scope.$apply(function() {
                   scope.handleFileUrl();
                 });
               }
               
               // Fill the list of suggestions
               initSuggestions();
            });
             

             // Toggle list of suggestions
             elt.find('.open-wms-list').on('click', function(evt) {
               elt.find('.tt-dropdown-menu').toggle();
               initSuggestions();
             });


             // Initalize the list of suggestions with all the data
             function initSuggestions() {
               var taView = $(taElt).data('ttView');
               var dataset = taView.datasets[0];
               dataset.getSuggestions('http', function(suggestions) {
                 taView.dropdownView.renderSuggestions(dataset, suggestions);
               }); 
             }
           }
         };
       }]
  );
})();

