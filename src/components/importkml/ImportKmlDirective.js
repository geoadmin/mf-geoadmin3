(function() {
  goog.provide('ga_importkml_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_popup_service');

  var module = angular.module('ga_importkml_directive', [
    'ga_browsersniffer_service',
    'ga_popup_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportKmlDirectiveController',
      ['$scope', '$http', '$q', '$log', '$translate',
       'gaBrowserSniffer', 'gaPopup',
       function($scope, $http, $q, $log, $translate, gaBrowserSniffer,
       gaPopup) {

         // from Angular
         // https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L3
         var URL_REGEXP =
         /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

         $scope.isIE9 = (gaBrowserSniffer.msie == 9);
         $scope.isIE = !isNaN(gaBrowserSniffer.msie);
         $scope.file = null;
         $scope.fileUrl = null;
         $scope.fileContent = null;
         $scope.userMessage = '';
         $scope.progress = 0;


         // Handle fileURL
         $scope.handleFileUrl = function() {
           var url = $scope.fileUrl;

           if ($scope.isValidUrl(url)) {
             // info: Angular test the validation of the input but the
             // content is sent by the onchange event

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
               //$log.error('Display KML failed');
             });
           }
         };


         // Handle a FileList (from input[type=file] or DnD),
         // works only with FileAPI
         $scope.handleFileList = function(files) {

           var file = files[0];

           // Test the validity of the file
           if (!/\.kml$/g.test(file.name)) {
             alert($translate('file_is_not_kml'));
             return;
           }

           if (file.size > $scope.options.maxFileSize) {
             alert($translate('file_too_large'));
             return;
           }

           // Kill the current uploading
           $scope.cancel();

           $scope.file = file;
           $scope.userMessage = $translate('reading_file');
           $scope.progress = 0.1;

           // Read the file
           $scope.fileReader = new FileReader();
           $scope.fileReader.onprogress = $scope.handleReaderProgress;
           $scope.fileReader.onload = $scope.handleReaderLoadEnd;
           $scope.fileReader.onerror = $scope.handleReaderError;
           $scope.fileReader.readAsText(file);
         };

          // Callback when FileReader is processing
         $scope.handleReaderProgress = function(evt) {
           if (evt.lengthComputable) {
             $scope.$apply(function() {
               $scope.progress = (evt.loaded / evt.total) * 80;
             });
           }
         };

         // Callback when FileReader has finished
         $scope.handleReaderLoadEnd = function(evt) {
           $scope.$apply(function() {
             $scope.userMessage = $translate('read_succeeded');
             $scope.fileContent = evt.target.result;
             $scope.displayFileContent();
           });
         };

         // Callback when FileReader has failed
         $scope.handleReaderError = function(evt) {
           $scope.$apply(function() {
             $scope.userMessage = $translate('read_failed');
             $scope.progress = 0;
           });
         };

         // Display the KML file content on the map
         $scope.displayFileContent = function() {
           $scope.userMessage = $translate('parsing_file');
           $scope.progress = 80;


           try {

             // Create the Parser the KML file
             var kmlParser = new ol.parser.KML({
               maxDepth: 1,
               dimension: 2,
               extractStyles: true,
               extractAttributes: true
             });


             // Create vector layer
             var vector = new ol.layer.Vector({
               source: new ol.source.Vector({
                 parser: kmlParser,
                 data: $scope.fileContent
               })
             });

             // Add the layer
             $scope.map.addLayer(vector);

             $scope.userMessage = $translate('parse_succeeded');
             $scope.progress += 20;
             $scope.map.on('click', function(evt) {
               $scope.map.getFeatures({
                 pixel: evt.getPixel(),
                 layers: [vector],
                 success: function(features) {
                   if (features[0] && features[0][0]) {
                     var pixel = evt.getPixel();
                     $scope.popupPositionX = pixel[0];
                     $scope.popupPositionY = pixel[1];
                     gaPopup.open(features[0][0].values_.description, $scope);
                   }
                 }
               });
             });
           } catch (e) {
             $scope.userMessage = $translate('parse_failed') + e.message;
             $scope.progress = 0;

             if (vector)
               $scope.map.removeLayer(vector);
           }

         };


         $scope.clearUserOutput = function() {
           $scope.userMessage = '';
           $scope.progress = 0;
         };

         $scope.cancel = function() {
           $scope.userMessage = $translate('operation_canceled');
           $scope.progress = 0;

           // Abort file reader process
           if ($scope.fileReader && $scope.fileReader.readyState == 1) {
             $scope.fileReader.abort();
           }

           // Kill $http request
           if ($scope.canceler) {
             $scope.canceler.resolve();
           }
         };

         $scope.reset = function() {
           $scope.cancel();
           $scope.clearUserOutput();
           $scope.file = null;
           $scope.fileUrl = null;
           $scope.fileContent = null;
         };

         // Test validity of a user input
         $scope.isValidUrl = function(url) {
           return (url && url.length > 0 && URL_REGEXP.test(url));
         };

  }]);

  module.directive('gaImportKml',
      ['$http', '$log', '$compile', '$translate', 'gaBrowserSniffer',
       function($http, $log, $compile, $translate, gaBrowserSniffer) {
         return {
           restrict: 'A',
           templateUrl: 'components/importkml/partials/importkml.html',
           scope: {
             map: '=gaImportKmlMap',
             options: '=gaImportKmlOptions'
           },
           controller: 'GaImportKmlDirectiveController',
           link: function(scope, elt, attrs, controller) {

             // Deactivate user form submission with Enter key
             elt.find('input').keypress(function(evt) {
               var charCode = evt.charCode || evt.keyCode;
               if (charCode == 13) { //Enter key's keycode
                 return false;
               }
             });

             // Submit the current form displayed for validation
             elt.find('.validate-kml-file').click(function() {
               var form = $(elt).find('.tab-pane.active form');
               form.submit();
             });

             // Use a local KML file features only available on browser
             // more recent than ie9
             if (!gaBrowserSniffer.msie || gaBrowserSniffer.msie > 9) {

               // Trigger the hidden input[type=file] onclick event
               elt.find('button').click(function() {
                 elt.find('input[type="file"]').click();
               });

               // Register input[type=file] onchange event
               elt.find('input[type=file]').bind('change', function(evt) {

                 if (evt.target.files && evt.target.files.length > 0) {
                   // Use HTML5 fileAPI
                   scope.$apply(function() {
                     scope.handleFileList(evt.target.files);
                   });

                 } else {
                   // No FileAPI available
                 }
               });


               // Register drag'n'drop events on <body>
               var dropZone = angular.element(
                   '<div class="import-kml-drop-zone">' +
                   '  <div>{{"drop_me_here" | translate}}</div>' +
                   '</div>');

               // We use $compile only for the translation,
               // $translate("drop_me_here") didn't work in prod mode
               $compile(dropZone)(scope);

               var dragEnterZone = angular.element(document.body);
               dragEnterZone.append(dropZone);
               dragEnterZone.bind('dragenter', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log('dragenter');
                 dropZone.css('display', 'table');
               });

               dropZone.bind('dragleave', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log('dragleave');
                 this.style.display = 'none';
               });

               dropZone.bind('dragover', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log('dragover');
               });

               dropZone.bind('drop', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 this.style.display = 'none';

                 // A file, an <a> html tag or a plain text url can be dropped
                 var files = evt.originalEvent.dataTransfer.files;

                 if (files && files.length > 0) {
                   scope.$apply(function() {
                     scope.handleFileList(files);
                   });

                 } else if (evt.originalEvent.dataTransfer.types) {
                   // No files so may be it's HTML link or a URL which has been
                   // dropped
                   var text = evt.originalEvent.dataTransfer
                       .getData('text/plain');

                   if (scope.isValidUrl(text)) {
                     scope.$apply(function() {
                       scope.fileUrl = text;
                       scope.handleFileUrl();
                     });

                   } else {
                     alert($translate('drop_invalid_url') + text);
                   }

                 } else {
                   // No FileAPI available
                 }
               });
             }
           }
         };
       }]
  );
})();
