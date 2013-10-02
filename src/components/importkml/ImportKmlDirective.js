(function() {
  goog.provide('ga_importkml_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_map_service');
  goog.require('ga_popup_service');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_importkml_directive', [
    'ga_browsersniffer_service',
    'ga_map_service',
    'ga_popup_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportKmlDirectiveController',
      function($scope, $http, $q, $log, $translate, gaBrowserSniffer,
            gaPopup, gaDefinePropertiesForLayer, gaUrlUtils) {

        $scope.isIE9 = (gaBrowserSniffer.msie == 9);
        $scope.isIE = !isNaN(gaBrowserSniffer.msie);
        $scope.currentTab = ($scope.isIE9) ? 2 : 1;
        $scope.file = null;
        $scope.userMessage = '';
        $scope.progress = 0;

        // Tabs management stuff
        $scope.activeTab = function(numTab) {
          $scope.currentTab = numTab;
          $scope.clearUserOutput();
        };
        $scope.getTabClass = function(numTab) {
          return (numTab === $scope.currentTab) ? 'active' : '';
        };

        // Load a KML file
        $scope.loadKML = function() {
          if ($scope.currentTab === 1) {
            $scope.handleFile();
          } else {
            $scope.handleFileUrl();
          }
        };

        // Handle fileURL
        $scope.handleFileUrl = function() {
          if ($scope.fileUrl) {
            var proxyUrl = $scope.options.proxyUrl +
                encodeURIComponent($scope.fileUrl);
            $scope.cancel();// Kill the current uploading
            $scope.fileContent = null;
            $scope.userMessage = $translate('uploading_file');
            $scope.progress = 0.1;
            $scope.canceler = $q.defer();

            // Angularjs doesn't handle onprogress event
            $http.get(proxyUrl, {timeout: $scope.canceler.promise})
            .success(function(data, status, headers, config) {
              $scope.userMessage = $translate('upload_succeeded');
              $scope.fileContent = data;
            })
            .error(function(data, status, headers, config) {
              $scope.userMessage = $translate('upload_failed');
              $scope.progress = 0;
            });
          }
          $scope.isDropped = false;
        };

        // Handle a FileList (from input[type=file] or DnD),
        // works only with FileAPI
        $scope.handleFileList = function() {
          if ($scope.files && $scope.files.length > 0) {
            var file = $scope.files[0];
            if ($scope.isValidFile(file)) {
              $scope.file = file;
              if ($scope.isDropped) {
                $scope.handleFile();
              }
            }
          }
        };

        // Handle a File (from a FileList),
        // works only with FileAPI
        $scope.handleFile = function() {
          if ($scope.file) {
            $scope.cancel();// Kill the current uploading
            $scope.fileContent = null;
            $scope.userMessage = $translate('reading_file');
            $scope.progress = 0.1;

            // Read the file
            $scope.fileReader = new FileReader();
            $scope.fileReader.onprogress = $scope.handleReaderProgress;
            $scope.fileReader.onload = $scope.handleReaderLoadEnd;
            $scope.fileReader.onerror = $scope.handleReaderError;
            $scope.fileReader.readAsText($scope.file);
          }
          $scope.isDropped = false;
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
          if ($scope.fileContent) {
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
              // FIXME currently ol3 doesn't allow to get the name of the KML
              // document, making it impossible to use a proper label for the
              // layer.
              var vector = new ol.layer.Vector({
                label: 'KML',
                source: new ol.source.Vector({
                  parser: kmlParser,
                  data: $scope.fileContent
                }),
                style: new ol.style.Style({
                  symbolizers: [
                    new ol.style.Fill({
                      color: '#ff0000'
                    }),
                    new ol.style.Stroke({
                      color: '#ff0000',
                      width: 2
                    }),
                    new ol.style.Shape({
                      size: 10,
                      fill: new ol.style.Fill({
                        color: '#ff0000'
                      }),
                      stroke: new ol.style.Stroke({
                        color: '#ff0000',
                        width: 2
                      })
                    })
                  ]
                })
              });
              gaDefinePropertiesForLayer(vector);

              // Add the layer
              $scope.map.addLayer(vector);

              $scope.userMessage = $translate('parse_succeeded');
              $scope.progress += 20;
              $scope.map.on('click', function(evt) {
                $scope.map.getFeatures({
                  pixel: evt.getPixel(),
                  layers: [vector],
                  success: function(features) {
                    if (features[0] && features[0][0] &&
                        features[0][0].get('description')) {
                      var feature = features[0][0];
                      var pixel = evt.getPixel();
                      $scope.$apply(function() {
                        gaPopup.create({
                          title: feature.get('name'),
                          content: feature.get('description'),
                          x: pixel[0],
                          y: pixel[1]
                        }, $scope).open();
                      });
                    }
                  }
                });
              });
            } catch (e) {
              $scope.userMessage = $translate('parse_failed') + e.message;
              $scope.progress = 0;

              if (vector) {
                $scope.map.removeLayer(vector);
              }
            }
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
          $scope.files = null;
          $scope.fileUrl = null;
          $scope.fileContent = null;
        };

        // Test the validity of the file
        $scope.isValidFile = function(file) {
          if (!/\.kml$/g.test(file.name)) {
            alert($translate('file_is_not_kml'));
            return false;
          }
          if (file.size > $scope.options.maxFileSize) {
            alert($translate('file_too_large'));
            return false;
          }
          return true;
        };
      }
  );

  module.directive('gaImportKml',
      function($http, $log, $compile, $translate, gaBrowserSniffer,
          gaUrlUtils) {
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

              var triggerInputFileClick = function() {
                elt.find('input[type="file"]').click();
              };

              // Trigger the hidden input[type=file] onclick event
              elt.find('button.browse').click(triggerInputFileClick);
              elt.find('input[type=text][readonly]').
                  click(triggerInputFileClick);

              // Register input[type=file] onchange event, use HTML5 File api
              elt.find('input[type=file]').bind('change', function(evt) {
                if (evt.target.files && evt.target.files.length > 0) {
                  scope.clearUserOutput();
                  scope.$apply(function() {
                    scope.files = evt.target.files;
                  });
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
                var types = evt.originalEvent.dataTransfer.types;
                if (types) {
                  var i, len = types.length;
                  for (i = 0; i < len; ++i) {
                    if (['files', 'text/plain']
                        .indexOf(types[i].toLowerCase()) > -1) {
                      dropZone.css('display', 'table');
                      break;
                    }
                  }
                }
              });

              dropZone.bind('dragleave', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                this.style.display = 'none';
              });

              dropZone.bind('dragover', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
              });

              dropZone.bind('drop', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                this.style.display = 'none';

                // A file, an <a> html tag or a plain text url can be dropped
                var files = evt.originalEvent.dataTransfer.files;

                if (files && files.length > 0) {
                  scope.$apply(function() {
                    scope.isDropped = true;
                    scope.files = files;
                  });

                } else if (evt.originalEvent.dataTransfer.types) {
                  // No files so may be it's HTML link or a URL which has been
                  // dropped
                  var text = evt.originalEvent.dataTransfer
                      .getData('text/plain');

                  if (gaUrlUtils.isValid(text)) {
                    scope.$apply(function() {
                      scope.isDropped = true;
                      scope.fileUrl = text;
                    });

                  } else {
                    alert($translate('drop_invalid_url') + text);
                  }

                } else {
                 // No FileAPI available
                }
              });

              // Watchers
              scope.$watch('files', function() {
                scope.clearUserOutput();
                scope.handleFileList();
              });
            }

            scope.$watch('fileUrl', function() {
              scope.clearUserOutput();
              if (scope.isDropped) {
                scope.handleFileUrl();
              }
            });

            scope.$watch('fileContent', function() {
              scope.displayFileContent();
            });

          }
        };
      }
  );
})();
