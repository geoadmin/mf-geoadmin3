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

         // Display the list of layers available in the GetCapabilties
         $scope.displayFileContent = function() {
           $scope.userMessage = $translate('parsing_file');
           $scope.progress = 80;
           $scope.layers = [];

           var parser = new ol.parser.ogc.WMSCapabilities();

           try {
             var result = parser.read($scope.fileContent);
             $log.log(result);

             for (var i = 0, len = result.capability.layers.length;
                 i < len; i++) {
               var layer = result.capability.layers[i];

               if (layer.name) {
               var olSource = new ol.source.SingleImageWMS({
                 params: {'LAYERS': layer.name},
                 url: $scope.fileUrl,
                 name: layer.name,
                 title: layer.title,
                 'abstract': layer['abstract'],
                 minScale: layer.minScaleDenominator,
                 maxScale: layer.maxScaleDenominator
               });


               /* var olLayer =  new ol.layer.ImageLayer({
                 source: olSource
               });*/
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
               }

               // Fill the list  of suggestions with all the data
               var taView = $(this).data('ttView');
               var dataset = taView.datasets[0];
               dataset.getSuggestions('http', function(suggestions) {
                 taView.dropdownView.renderSuggestions(dataset, suggestions);
               });
             });


             // Toggle list of suggestions
             elt.find('.open-wms-list').on('click', function(evt) {
               elt.find('.tt-dropdown-menu').toggle();
             });
           }
         };
       }]
  );
})();

