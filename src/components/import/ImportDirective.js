goog.provide('ga_import_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_kml_service');
goog.require('ga_urlutils_service');
goog.require('ga_wms_service');

(function() {

  var module = angular.module('ga_import_directive', [
    'ga_browsersniffer_service',
    'ga_kml_service',
    'ga_urlutils_service',
    'ga_wms_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportDirectiveController',
      function($scope, $http, $q, $log, $translate, gaBrowserSniffer, 
            gaKml, gaUrlUtils, gaWms) {
          var fileReader;
          $scope.isIE9 = (gaBrowserSniffer.msie == 9);
          $scope.isIE = !isNaN(gaBrowserSniffer.msie);
          $scope.currentTab = ($scope.isIE9) ? 2 : 1;
          $scope.file = null;
          $scope.fileUrl = null;
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
            $scope.handleFile();
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

          // Callback when FileReader has finished
          var handleReaderLoadEnd = function(evt) {
            var result = evt.target.result;
            if (gaKml.isValidFileContent(result)) {
              $scope.userMessage = $translate.instant('read_succeeded');
              $scope.fileContent = result;
              $scope.$digest();
            } else {
              handleReaderError();
            }
          };

          // Callback when FileReader has failed
          var handleReaderError = function() {
            $scope.userMessage = $translate.instant('read_failed');
            $scope.progress = 0;
            $scope.$digest();
          };

          // Callback when FileReader is reading
          var handleReaderProgress = function(evt) {
            if (evt.lengthComputable) {
              $scope.progress = (evt.loaded / evt.total) * 80;
              $scope.$digest();
            }
          };

          // Handle a File (from a FileList),
          // works only with FileAPI
          $scope.handleFile = function() {
            if ($scope.file) {
              $scope.cancel();// Kill the current uploading
              $scope.fileContent = null;
              $scope.userMessage = $translate.instant('reading_file');
              $scope.progress = 0.1;

              if (!fileReader) {
                // Initialize the fileReader
                fileReader = new FileReader();
                fileReader.onload = handleReaderLoadEnd;
                fileReader.onerror = handleReaderError;
                fileReader.onprogress = handleReaderProgress;
              }

              // Read the file
              fileReader.readAsText($scope.file);
            }
            $scope.isDropped = false;
          };

          // Display the KML file content on the map
          $scope.displayFileContentKml = function() {
            if ($scope.fileContent) {
              $scope.userMessage = $translate.instant('parsing_file');
              $scope.progress = 80;

              // Add the layer
              gaKml.addKmlToMap($scope.map, $scope.fileContent, {
                // url: ($scope.currentTab === 2) ? $scope.fileUrl
                // : $scope.file.name,
                url: $scope.file.name,
                useImageVector: gaKml.useImageVector($scope.fileSize),
                zoomToExtent: true
              }).then(function() {
                $scope.userMessage = $translate.instant('parse_succeeded');
                $scope.progress += 20;
              }, function(msg) {
                $scope.userMessage = $translate.instant('parse_failed') + msg;
                $scope.progress = 0;
              });
            }
          };

          $scope.clearUserOutput = function() {
            $scope.userMessage = '';
            $scope.progress = 0;
          };

          $scope.cancel = function() {
            $scope.userMessage = $translate.instant('operation_canceled');
            $scope.progress = 0;
            // Kill file reading
            if (fileReader) {
              fileReader.abort();
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
            $scope.fileContent = null;
            $scope.fileUrl = null;
            $scope.fileContent = null;
          };

          // List of layers available in the GetCapabilities.
          // The layerXXXX properties use layer objects from the parsing of
          // a  GetCapabilities file, not ol layer object.
          $scope.layers = [];
          $scope.options.layerSelected = null; // the layer selected on click
          $scope.options.layerHovered = null;

          // Handle URL of WMS
          $scope.handleFileUrl = function() {
            var url = $scope.fileUrl;

            if (gaUrlUtils.isValid(url)) {

              // Append GetCapabilities default parameters
              url = gaUrlUtils.append(url, $scope.options.defaultGetCapParams);

              // Use lang param only for admin.ch servers
              if (url.indexOf('admin.ch') > 0) {
                url = gaUrlUtils.append(url, 'lang=' + $translate.use());
              }

              // Kill the current uploading
              $scope.cancel();

              var proxyUrl = gaUrlUtils.proxifyUrl(url);
              $scope.error = false;
              $scope.userMessage = $translate.instant('uploading_file');
              $scope.progress = 0.1;
              $scope.canceler = $q.defer();

              // Angularjs doesn't handle onprogress event
              $http.get(proxyUrl, {timeout: $scope.canceler.promise})
              .success(function(data, status, headers, config) {
                $scope.userMessage =
                    $translate.instant('upload_succeeded');
                $scope.displayFileContent(data);
              })
              .error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.userMessage = $translate.instant('upload_failed');
                $scope.progress = 0;
                $scope.layers = [];
              });
            } else {
              $scope.error = true;
              $scope.userMessage = $translate.instant('drop_invalid_url');
            }
          };

          // Display the list of layers available from the GetCapabilties in the
          // table
          $scope.displayFileContent = function(data) {
            $scope.userMessage = $translate.instant('parsing_file');
            $scope.progress = 80;
            $scope.layers = [];
            $scope.options.layerSelected = null;
            $scope.options.layerHovered = null;

            try {
              var result = new ol.format.WMSCapabilities().read(data);
              $scope.userMessage = (result.Service.MaxWidth) ?
                  $translate.instant('wms_max_size_allowed') + ' ' +
                    result.Service.MaxWidth +
                    ' * ' + result.Service.MaxHeight : '';

              if (result.Capability.Layer) {
                var root = getChildLayers(result.Capability.Layer,
                    $scope.map, result.version);
                if (root) {
                  $scope.layers = root.Layer || [root];
                }
              }

              $scope.userMessage = $translate.instant('parse_succeeded');
              $scope.progress += 20;

            } catch (e) {
              $scope.error = true;
              $scope.userMessage = $translate.instant('parse_failed') +
                                   ' ' + e.message;
              $scope.progress = 0;
            }
          };

          // Add a layer from GetCapabilities object to the map
          $scope.addLayer = function(getCapLayer) {
            if (getCapLayer) {
              try {
                var olLayer = gaWms.getOlLayerFromGetCapLayer(getCapLayer);
                if (olLayer) {
                  $scope.map.addLayer(olLayer);
                }
                return olLayer;

              } catch (e) {
                $scope.userMessage = $translate.instant(
                                     'add_wms_layer_failed') + e.message;
                return null;
              }
            }
          };

          // Add the selected layer to the map
          $scope.addLayerSelected = function() {
            if ($scope.options.layerSelected) {
              var layerAdded = $scope.addLayer($scope.options.layerSelected,
                  /* isPreview */ false);

              if (layerAdded) {
                $scope.userMessage = $translate.instant(
                                      'add_wms_layer_succeeded');
              }

              alert($scope.userMessage);
            }
          };

          // Get the abstract to display in the text area
          $scope.getAbstract = function() {
            var l = $scope.options.layerSelected ||
                $scope.options.layerHovered || {};
            return ((l.isInvalid) ? $translate.instant(l.Abstract) :
                                    l.Abstract) || '';
          };

          // Test if the layer can be displayed with a specific projection
          var canUseProj = function(layer, projCode) {
            var projCodeList = layer.CRS || layer.SRS || [];
            return (projCodeList.indexOf(projCode.toUpperCase()) != -1 ||
                projCodeList.indexOf(projCode.toLowerCase()) != -1);
          };

          // Go through all layers, assign needed properties,
          // and remove useless layers (no name or bad crs without children
          // or no intersection between map extent and layer extent)
          var getChildLayers = function(layer, map, wmsVersion) {

            // If the WMS layer has no name, it can't be displayed
            if (!layer.Name) {
              layer.isInvalid = true;
              layer.Abstract = 'layer_invalid_no_name';
            }

            if (!layer.isInvalid) {
              layer.wmsUrl = $scope.fileUrl;
              layer.wmsVersion = wmsVersion;
              layer.id = 'WMS||' + layer.wmsUrl + '||' + layer.Name;
              layer.extent = getLayerExtentFromGetCap(layer, map);

              // if the layer has no extent, it is set as invalid.
              // We don't have proj codes list for wms 1.1.1 so we assume the
              // layer can be displayed (wait for
              // https://github.com/openlayers/ol3/pull/2944)
              var projCode = map.getView().getProjection().getCode();
              if (wmsVersion == '1.3.0' && !canUseProj(layer, projCode)) {
                layer.useReprojection = true;

                if (!layer.extent) {
                  layer.isInvalid = true;
                  layer.Abstract = 'layer_invalid_outside_map';
                }
              }
            }

            // Go through the child to get valid layers
            if (layer.Layer) {

              for (var i = 0; i < layer.Layer.length; i++) {
                var l = getChildLayers(layer.Layer[i], map, wmsVersion);
                if (!l) {
                  layer.Layer.splice(i, 1);
                  i--;
                }
              }

              // No valid child
              if (layer.Layer.length == 0) {
                layer.Layer = undefined;
              }
            }

            if (layer.isInvalid && !layer.Layer) {
              return undefined;
            }

            return layer;
          };

          // Get the layer extent defines in the GetCapabilities
          var getLayerExtentFromGetCap = function(getCapLayer, map) {
            var wgs84 = 'EPSG:4326';
            var layer = getCapLayer;
            var proj = map.getView().getProjection();
            var projCode = proj.getCode();

            if (layer.BoundingBox) {
              for (var i = 0, ii = layer.BoundingBox.length; i < ii; i++) {
                var bbox = layer.BoundingBox[i];
                var code = bbox.crs || bbox.srs;
                if (code && code.toUpperCase() == projCode.toUpperCase()) {
                  return bbox.extent;
                }
              }
            }

            var wgs84Extent = layer.EX_GeographicBoundingBox ||
                layer.LatLonBoundingBox;
            if (wgs84Extent) {
              // If only an extent in wgs 84 is available, we use the
              // intersection between proj extent and layer extent as the new
              // layer extent. We compare extients in wgs 84 to avoid
              // transformations errors of large wgs 84 extent like
              // (-180,-90,180,90)
              var projWgs84Extent = ol.proj.transformExtent(proj.getExtent(),
                  projCode, wgs84);
              var layerWgs84Extent = ol.extent.getIntersection(projWgs84Extent,
                  wgs84Extent);
              if (layerWgs84Extent) {
                return ol.proj.transformExtent(layerWgs84Extent, wgs84,
                    projCode);
              }
            }
         };
  });

  module.controller('GaImportItemDirectiveController', function($scope,
      $translate, gaPreviewLayers) {

    // Add preview layer
    $scope.addPreviewLayer = function(evt, getCapLayer) {
      evt.stopPropagation();
      $scope.options.layerHovered = getCapLayer;
      if (getCapLayer.isInvalid) {
        return;
      }
      gaPreviewLayers.addGetCapWMSLayer($scope.map, getCapLayer);
    };

    // Remove preview layer
    $scope.removePreviewLayer = function(evt) {
      evt.stopPropagation();
      $scope.options.layerHovered = null;
      gaPreviewLayers.removeAll($scope.map);
    };

    // Select the layer clicked
    $scope.toggleLayerSelected = function(evt, getCapLayer) {
      evt.stopPropagation();

      $scope.options.layerSelected = ($scope.options.layerSelected &&
          $scope.options.layerSelected.Name == getCapLayer.Name) ?
          null : getCapLayer;
    };
  });

  module.directive('gaImportItem', function($compile, gaMapUtils) {

    /**** UTILS functions ****/
    // from OL2
    //TO FIX: utils function to get scale from an extent, should be
    //elsewhere?
    var getScaleFromExtent = function(view, extent, mapSize) {
      // Constants get from OpenLayers 2, see:
      // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Util.js
      //
      // 39.37 INCHES_PER_UNIT
      // 72 DOTS_PER_INCH
      return view.getResolutionForExtent(extent, mapSize) *
          39.37 * 72;
    };

    // Zoom to layer extent
    var zoomToLayerExtent = function(layer, map) {
      var extent = gaMapUtils.intersectWithDefaultExtent(layer.extent);
      var view = map.getView();
      var mapSize = map.getSize();

      // Test this with this wms:
      // http://wms.vd.ch/public/services/VD_WMS/Mapserver/Wmsserver
      // If a minScale is defined
      if (layer.MaxScaleDenominator && extent) {

        // We test if the layer extent specified in the
        // getCapabilities fit the minScale value.
        var layerExtentScale = getScaleFromExtent(view, extent, mapSize);

        if (layerExtentScale > layer.MaxScaleDenominator) {
          var layerExtentCenter = ol.extent.getCenter(extent);
          var factor = layerExtentScale / layer.MaxScaleDenominator;
          var width = ol.extent.getWidth(extent) / factor;
          var height = ol.extent.getHeight(extent) / factor;
          extent = [
            layerExtentCenter[0] - width / 2,
            layerExtentCenter[1] - height / 2,
            layerExtentCenter[0] + width / 2,
            layerExtentCenter[1] + height / 2
          ];
          extent = gaMapUtils.intersectWithDefaultExtent(extent);

          if (extent) {
            var res = view.constrainResolution(
                view.getResolutionForExtent(extent, mapSize), 0, -1);
            view.setCenter(layerExtentCenter);
            view.setResolution(res);
          }
          return;
        }
      }

      if (extent) {
        view.fit(extent, mapSize);
      }
    };

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import-item.html',
      controller: 'GaImportItemDirectiveController',
      compile: function(tEl, tAttr) {
        var contents = tEl.contents().remove();
        var compiledContent;
        return function(scope, iEl, iAttr, controller) {
          if (!compiledContent) {
            compiledContent = $compile(contents);
          }
          compiledContent(scope, function(clone, scope) {
            iEl.append(clone);
          });

          var headerGroup = iEl.find('> .ga-header-group');
          var toggleBt = headerGroup.find('.fa-plus');
          var childGroup;

          headerGroup.find('.fa-zoom-in').on('click', function(evt) {
            evt.stopPropagation();
            zoomToLayerExtent(scope.layer, scope.map);
          });

          toggleBt.on('click', function(evt) {
            evt.stopPropagation();
            toggleBt.toggleClass('fa-minus');
            if (!childGroup) {
              childGroup = iEl.find('> .ga-child-group');
            }
            childGroup.slideToggle();
          });
        };
      }
    };
  });

  module.directive('gaImport',
      function($http, $translate, $rootScope, $log, $compile, $document,
        gaBrowserSniffer, gaUrlUtils) {
          return {
            restrict: 'A',
            templateUrl: 'components/import/partials/import.html',
            scope: {
              map: '=gaImportMap',
              options: '=gaImportOptions'
            },
            controller: 'GaImportDirectiveController',
            link: function(scope, elt, attrs, controller) {
            //--For KML import
              // Use a local KML file only available on browser
              // more recent than ie9
              if (!gaBrowserSniffer.msie || gaBrowserSniffer.msie > 9) {

                var triggerInputFileClick = function() {
                  elt.find('input[type="file"]').click();
                };

                // Trigger the hidden input[type=file] onclick event
                elt.find('button.ga-import-kml-browse').
                  click(triggerInputFileClick);
                elt.find('input.form-control[type=text][readonly]').
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
                    '  <div translate>drop_me_here</div>' +
                    '</div>');

                // Block drag of all elements by default to avoid
                // unwanted display of dropzone.
                $document.on('dragstart', function() {return false;});

                // Hide the drop zone on click,
                // used when for some reasons unknown
                // the element stays displayed. See:
                // https://github.com/geoadmin/mf-geoadmin3/issues/1908
                dropZone.click(function() {
                  this.style.display = 'none';
                });

                // We use $compile only for the translation,
                // $translate.instant("drop_me_here") didn't work in prod mode
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
                      alert($translate.instant('drop_invalid_url') + text);
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

              scope.$watch('fileContent', function() {
                scope.displayFileContentKml();
              });

              // for WMS import
              // Create the typeAhead input for the list of WMSs available
              var taElt = elt.find('input[name=url]').typeahead({
                local: scope.options.defaultWMSList,
                limit: 500

              }).on('typeahead:initialized', function(evt) {
                // Re-initialize the list of suggestions
                initSuggestions();

              }).on('typeahead:selected', function(evt, datum) {

                // When a WMS is selected in the list, start downloading the
                // GetCapabilities
                scope.error = false;
                scope.fileUrl = datum.value;
                scope.handleFileUrl();
                scope.$digest();
                // Re-initialize the list of suggestions
                initSuggestions();
              });


              // Toggle list of suggestions
              elt.find('.ga-import-open').on('click', function(evt) {
                elt.find('.tt-dropdown-menu').toggle();
                // Re-initialize the list of suggestions
                initSuggestions();
              });

              $rootScope.$on('$translateChangeEnd', function() {
                if (scope.fileUrl) {
                  scope.handleFileUrl();
                }
              });

              // Fill the list of suggestions with all the data
              var initSuggestions = function() {
                var taView = $(taElt).data('ttView');
                var dataset = taView.datasets[0];
                dataset.getSuggestions('http', function(suggestions) {
                  taView.dropdownView.renderSuggestions(dataset, suggestions);
                });
              };

            }
          };
        }
  );
})();

