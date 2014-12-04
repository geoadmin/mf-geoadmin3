(function() {
  goog.provide('ga_importwms_directive');

  goog.require('ga_map_service');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_importwms_directive', [
    'ga_map_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportWmsDirectiveController',
      function($scope, $http, $q, $translate, gaUrlUtils, gaWms) {

          // List of layers available in the GetCapabilities.
          // The layerXXXX properties use layer objects from the parsing of
          // a  GetCapabilities file, not ol layer object.
          $scope.layers = [];
          $scope.options.layerSelected = null; // the layer selected on click
          $scope.options.layerHovered = null;

          // copy from ImportKml
          $scope.fileUrl = null;
          $scope.userMessage = '';
          $scope.progress = 0;

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

              var proxyUrl = $scope.options.proxyUrl + encodeURIComponent(url);
              $scope.error = false;
              $scope.userMessage = $translate.instant('uploading_file');
              $scope.progress = 0.1;
              $scope.canceler = $q.defer();

              // Angularjs doesn't handle onprogress event
              $http.get(proxyUrl, {timeout: $scope.canceler.promise})
              .success(function(data, status, headers, config) {
                $scope.userMessage = $translate.instant('upload_succeeded');
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
              var srsCode = $scope.map.getView().getProjection().getCode();
              var parser = new ol.format.WMSCapabilities();
              var result = parser.read(data);
              $scope.userMessage = (result.Service.MaxWidth) ?
                  $translate.instant('wms_max_size_allowed') + ' ' +
                    result.Service.MaxWidth +
                    ' * ' + result.Service.MaxHeight :
                  '';

              if (result.Capability.Layer) {
                $scope.layers = getChildLayers(result.Capability.Layer,
                    srsCode).Layer;
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

          // copy from ImportKml
          $scope.cancel = function() {
            $scope.userMessage = $translate.instant('operation_canceled');
            $scope.progress = 0;

            // Kill $http request
            if ($scope.canceler) {
              $scope.canceler.resolve();
            }
          };

          // Add a layer from GetCapabilities object to the map
          $scope.addLayer = function(getCapLayer) {
            if (getCapLayer) {
              try {
                var layer = getCapLayer;
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

          // Go through all layers, assign needed properties,
          // and remove useless layers (no name or bad crs without childs)
          var getChildLayers = function(layer, srsCode) {
            // If the  WMS layer has no name or if it can't be
            // displayed in the current SRS, we set it as invalid
            if (!layer.Name) {
              layer.isInvalid = true;
              layer.Abstract = 'layer_invalid_no_name';
            } else if (!layer.CRS ||
                (layer.CRS.indexOf(srsCode.toUpperCase()) == -1 &&
                layer.CRS.indexOf(srsCode.toLowerCase()) == -1)) {
              layer.isInvalid = true;
              layer.Abstract = 'layer_invalid_no_crs';
            } else {
              layer.wmsUrl = $scope.fileUrl;
              layer.id = 'WMS||' + layer.wmsUrl + '||' + layer.Name;
              layer.extent = getLayerExtentFromGetCap(layer);
            }

            // Go through the child to get valid layers
            if (layer.Layer) {

              for (var i = 0; i < layer.Layer.length; i++) {
                var l = getChildLayers(layer.Layer[i], srsCode);
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
          var getLayerExtentFromGetCap = function(getCapLayer) {
            var extent = null;
            var layer = getCapLayer;
            var srsCode = $scope.map.getView().getProjection().getCode();

            if (layer.BoundingBox) {
              for (var i = 0, ii = layer.BoundingBox.length; i < ii; i++) {
                var bbox = layer.BoundingBox[i];
                if (bbox.crs == srsCode.toUpperCase()) {
                  extent = bbox.extent;
                  break;
                }
              }
            }

            if (!extent && layer.EX_GeographicBoundingBox) {
              var extent = layer.EX_GeographicBoundingBox;
              var bottomLeft = ol.proj.transform(
                  ol.extent.getBottomLeft(extent), 'EPSG:4326', srsCode);
              var topRight = ol.proj.transform(
                  ol.extent.getTopRight(extent), 'EPSG:4326', srsCode);
              extent = bottomLeft.concat(topRight);
            }

            return extent;
          };
  });

  module.controller('GaImportWmsItemDirectiveController', function($scope,
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

  module.directive('gaImportWmsItem', function($compile) {

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
      var extent = layer.extent;
      var view = map.getView();
      var mapSize = map.getSize();

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

          var res = view.constrainResolution(
              view.getResolutionForExtent(extent, mapSize), 0, -1);
          view.setCenter(layerExtentCenter);
          view.setResolution(res);
          return;
        }
      }

      if (extent) {
        view.fitExtent(extent, mapSize);
      }
    };

    return {
      restrict: 'A',
      templateUrl: 'components/importwms/partials/importwms-item.html',
      controller: 'GaImportWmsItemDirectiveController',
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
          var toggleBt = headerGroup.find('.icon-plus');
          var childGroup;

          headerGroup.find('.icon-zoom-in').on('click', function(evt) {
            evt.stopPropagation();
            zoomToLayerExtent(scope.layer, scope.map);
          });

          toggleBt.on('click', function(evt) {
            evt.stopPropagation();
            toggleBt.toggleClass('icon-minus');
            if (!childGroup) {
              childGroup = iEl.find('> .ga-child-group');
            }
            childGroup.slideToggle();
          });
        };
      }
    };
  });

  module.directive('gaImportWms',
      function($http, $translate, $rootScope) {
          return {
            restrict: 'A',
            templateUrl: 'components/importwms/partials/importwms.html',
            scope: {
              map: '=gaImportWmsMap',
              options: '=gaImportWmsOptions'
            },
            controller: 'GaImportWmsDirectiveController',
            link: function(scope, elt, attrs, controller) {

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
                scope.$apply(function() {
                  scope.handleFileUrl();
                });

                // Re-initialize the list of suggestions
                initSuggestions();
              });


              // Toggle list of suggestions
              elt.find('.ga-import-wms-open').on('click', function(evt) {
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

