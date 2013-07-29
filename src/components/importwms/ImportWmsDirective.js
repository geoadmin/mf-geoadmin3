(function() {
  goog.provide('ga_importwms_directive');

  var module = angular.module('ga_importwms_directive', [
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
             } else if (!/\?$/.test(url) && !/&$/.test(url)) {
               url += '&';
             }

             url += $scope.options.defaultGetCapParams;


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
           $scope.layerHovered = null; // the layer when mouse is over it

           var parser = new ol.parser.ogc.WMSCapabilities();

           try {
             var result = parser.read($scope.fileContent);
             $scope.wmsConstraintsMessage = (result.service.maxWidth) ? 
                 $translate('wms_max_size_allowed') + ' ' + result.service.maxWidth +
                 ' * ' + result.service.maxHeight :
                 ''; 

             for (var i = 0, len = result.capability.layers.length;
                 i < len; i++) {
               var layer = result.capability.layers[i];

               // WMS layer with no name can't be added to the map
               if (layer.name) {
                 var srsCode = $scope.map.getView().getProjection().getCode();

                 // Set srsCompatible property
                 layer.srsCompatible = (layer.srs &&
                     (layer.srs[srsCode.toUpperCase()] ||
                     layer.srs[srsCode.toLowerCase()]));

                 $scope.layers.push(layer);
               }
             }

             $scope.userMessage = $translate('parse_succeeded');
             $scope.progress += 20;

           } catch (e) {
               $scope.userMessage = $translate('parse_failed') + e.message;
               $scope.progress = 0;
               $log.log($scope.userMessage);
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

           if (getCapLayer && getCapLayer.srsCompatible) {
             $scope.layerSelected = getCapLayer;
           }

           $scope.addLayer($scope.layerSelected);
         };

         // Add the hovered layer to the map, only if the uesr hasn't selected a
         // layer yet
         $scope.addLayerHovered = function(getCapLayer) {

           if (!$scope.layerSelected && getCapLayer && getCapLayer.srsCompatible) {
             $scope.layerHovered = getCapLayer;
             $scope.olLayerHovered = $scope.addLayer($scope.layerHovered);
           }
         };

         // Remove layer hovered
         $scope.removeLayerHovered = function() {
           if (!$scope.layerSelected && $scope.olLayerHovered) {
             $scope.map.removeLayer($scope.olLayerHovered);
             $scope.layerHovered = null;
             $scope.olLayerHovered = null;
           }
         };

         // Add a layer from GetCapabilities object to the map
         $scope.addLayer = function(getCapLayer) {

           if (getCapLayer) {

             try {
               var extent = null;
               var layer = getCapLayer;
               var srsCode = $scope.map.getView().getProjection().getCode();

               if (layer.bbox) {

                 if (srsCode.toUpperCase() in layer.bbox) {
                   extent = layer.bbox[srsCode.toUpperCase()].bbox;
                   // ol extent is [minx, maxx, miny, maxy]
                   extent = [extent[0], extent[2], extent[1], extent[3]];
                 }
               }

               var olAttributions = null;

               if (layer.attribution) {
                 olAttributions = [new ol.Attribution(
                   '<a href="' + layer.attribution.href + '">' +
                     ((layer.attribution.logo) ?
                       '<img src="' + layer.attribution.logo.href +
                          '" title="' + layer.attribution.title +
                          '" alt="' + layer.attribution.title + '" />"' :
                       layer.attribution.title) +
                   '</a>'
                 )];
               }

               var olSource = new ol.source.SingleImageWMS({
                   params: {
                     'LAYERS': layer.name
                   },
                   url: $scope.fileUrl,
                   extent: extent,
                   attributions: olAttributions
               });
               var olLayer = new ol.layer.ImageLayer({
                   source: olSource
               });
//olLayer.source_.image_.on('change', function(evt){alert('imageLodaded');});


               $scope.map.addLayer(olLayer);

               var view2D = $scope.map.getView().getView2D();
               var mapSize = $scope.map.getSize();
              
               // If a minScale is defined
               if (layer.minScale) {

                 // We test if the layer extent specified in the
                 // getCapabilities fit the minScale value.
                 var layerExtentScale =
                   view2D.getResolutionForExtent(extent, mapSize) * 39.37 * 72;

                 if (layerExtentScale > layer.minScale) {
                   var layerExtentCenter = ol.extent.getCenter(extent);
                   var factor = layerExtentScale / layer.minScale;
                   var width = ol.extent.getWidth(extent) / factor;
                   var height = ol.extent.getHeight(extent) / factor;
                   extent = [
                     layerExtentCenter[0] - width / 2,
                     layerExtentCenter[0] + width / 2,
                     layerExtentCenter[1] - height / 2,
                     layerExtentCenter[1] + height / 2
                   ];

                   var res = view2D.constrainResolution(
                       view2D.getResolutionForExtent(extent, mapSize), 0, -1);
                   view2D.setCenter(layerExtentCenter);
                   view2D.setResolution(res);
                   return olLayer;
                 }
               }

               view2D.fitExtent(extent, mapSize);
               return olLayer;

             } catch (e) {
               $scope.userMessage = $translate('add_wms_layer_failed') +
                   e.message;
               $log.log($scope.userMessage);
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

