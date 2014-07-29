(function() {
  goog.provide('ga_importkml_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_filereader_service');
  goog.require('ga_map_service');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_importkml_directive', [
    'ga_browsersniffer_service',
    'ga_filereader_service',
    'ga_map_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportKmlDirectiveController',
      function($scope, $http, $q, $log, $translate, gaBrowserSniffer,
            gaLayers, gaKml, gaUrlUtils, gaFileReader) {
        $scope.isIE9 = (gaBrowserSniffer.msie == 9);
        $scope.isIE = !isNaN(gaBrowserSniffer.msie);
        $scope.currentTab = ($scope.isIE9) ? 2 : 1;
        $scope.file = null;
        $scope.userMessage = '';
        $scope.progress = 0;
        var fileReader = gaFileReader($scope);

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
            var proxyUrl = gaKml.proxyUrl +
                encodeURIComponent($scope.fileUrl);
            $scope.cancel();// Kill the current uploading
            $scope.fileContent = null;
            $scope.userMessage = $translate('uploading_file');
            $scope.progress = 0.1;
            $scope.canceler = $q.defer();

            // Angularjs doesn't handle onprogress event
            $http.get(proxyUrl, {timeout: $scope.canceler.promise})
            .success(function(data, status, headers, config) {
              var fileSize = headers('content-length');
              if (gaKml.isValidFileContent(data) &&
                  gaKml.isValidFileSize(fileSize)) {
                $scope.userMessage = $translate('upload_succeeded');
                $scope.fileContent = data;
                $scope.fileSize = fileSize;
              } else {
                $scope.userMessage = $translate('upload_failed');
                $scope.progress = 0;
              }
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
            if (gaKml.isValidFileSize(file.size)) {
              $scope.file = file;
              $scope.fileSize = file.size;
              if ($scope.isDropped) {
                $scope.handleFile();
              }
            }
          }
        };

        $scope.$on('gaFileProgress', function(evt, progress) {
          $scope.$apply(function() {
            $scope.progress = (progress.loaded / progress.total) * 80;
          });
        });

        // Callback when FileReader has finished
        var handleReaderLoadEnd = function(result) {
          if (gaKml.isValidFileContent(result)) {
            $scope.userMessage = $translate('read_succeeded');
            $scope.fileContent = result;
          } else {
            handleReaderError();
          }
        };

        // Callback when FileReader has failed
        var handleReaderError = function() {
          $scope.userMessage = $translate('read_failed');
          $scope.progress = 0;
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
            fileReader.readAsText($scope.file).then(function(result) {
              if (result) {
                handleReaderLoadEnd(result);
              }
            }, function() {
              handleReaderError();
            });
          }
          $scope.isDropped = false;
        };

        // Display the KML file content on the map
        $scope.displayFileContent = function() {
          if ($scope.fileContent) {
            $scope.userMessage = $translate('parsing_file');
            $scope.progress = 80;

            try {
              // Add the layer
              gaKml.addKmlToMap($scope.map, $scope.fileContent, {
                url: ($scope.currentTab === 2) ? $scope.fileUrl :
                    undefined,
                attribution: ($scope.currentTab === 2) ?
                    gaUrlUtils.getHostname($scope.fileUrl) :
                    undefined,
                useImageVector: gaKml.useImageVector($scope.fileSize)
              });

              $scope.userMessage = $translate('parse_succeeded');
              $scope.progress += 20;

            } catch (e) {
              $scope.userMessage = $translate('parse_failed') + e.message;
              $scope.progress = 0;
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
          // Kill file reading
          fileReader.abort();
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
      }
  );

  module.directive('gaImportKml',
      function($log, $compile, $translate, gaBrowserSniffer,
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
            elt.find('.ga-import-kml-validate').click(function() {
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
              elt.find('button.ga-import-kml-browse').
                  click(triggerInputFileClick);
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
                  '<div class="ga-import-kml-drop-zone">' +
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
                    scope.currentTab = 1;
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
                      scope.currentTab = 2;
                    });

                  } else {
                    alert($translate('drop_invalid_url') + text);
                  }

                } else {
                 // No FileAPI available
                }
              });

              // Watchers
              scope.$watchCollection('files', function() {
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
