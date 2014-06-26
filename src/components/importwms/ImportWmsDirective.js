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
      function($scope, $http, $q, $translate, gaUrlUtils,
          gaWms, gaPreviewLayers) {

          // List of layers available in the GetCapabilities
          $scope.layers = [];

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
                url = gaUrlUtils.append(url, 'lang=' + $translate.uses());
              }

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
                $scope.displayFileContent(data);
              })
              .error(function(data, status, headers, config) {
                $scope.userMessage = $translate('upload_failed');
                $scope.progress = 0;
                $scope.layers = [];
                $scope.wmsConstraintsMessage = '';
              });
            }
          };

          // Display the list of layers available from the GetCapabilties in the
          // table
          $scope.displayFileContent = function(data) {
            $scope.userMessage = $translate('parsing_file');
            $scope.progress = 80;

            // The layerXXXX properties use layer objects from the parsing of
            // a  GetCapabilities file, not ol layer object
            $scope.layers = [];
            $scope.layerSelected = null; // the layer selected on user click
            $scope.layerHovered = null; // the layer when mouse is over it

            try {
              var srsCode = $scope.map.getView().getProjection().getCode();
              var parser = new ol.format.WMSCapabilities();
              var result = parser.read(data);
              $scope.wmsConstraintsMessage = (result.Service.MaxWidth) ?
                  $translate('wms_max_size_allowed') + ' ' +
                    result.Service.MaxWidth +
                    ' * ' + result.Service.MaxHeight :
                  '';

              if (result.Capability.Layer) {
                $scope.layers = getChildLayers(result.Capability.Layer,
                    srsCode);

                // We remove the root layer node in the list
                $scope.layers.shift();
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

          // Add the selected layer to the map
          $scope.addLayerSelected = function() {
            if ($scope.layerSelected) {
              var layerAdded = $scope.addLayer(
                  $scope.layerSelected, /* isPreview */ false);

              if (layerAdded) {
                $scope.userMessage = $translate('add_wms_layer_succeeded');
              }

              alert($scope.userMessage);
            }
          };

          // Add preview  dlayer to the map
          $scope.addPreviewLayer = function(getCapLayer) {
            $scope.layerHovered = getCapLayer;
            gaPreviewLayers.addGetCapWMSLayer($scope.map, getCapLayer);
          };

          // Remove preview layer
          $scope.removePreviewLayer = function() {
            gaPreviewLayers.removeAll($scope.map);
            $scope.layerHovered = null;
          };

          // Select the layer clicked
          $scope.toggleLayerSelected = function(getCapLayer) {
            $scope.layerSelected = ($scope.layerSelected &&
                $scope.layerSelected.Name == getCapLayer.Name) ?
                null :
                getCapLayer;
          };

          // Zoom on layer extent
          $scope.zoomOnLayerExtent = function(getCapLayer) {
            var layer = getCapLayer;
            var extent = layer.extent || getLayerExtentFromGetCap(layer);
            var view2D = $scope.map.getView().getView2D();
            var mapSize = $scope.map.getSize();

            // If a minScale is defined
            if (layer.MaxScaleDenominator && extent) {

              // We test if the layer extent specified in the
              // getCapabilities fit the minScale value.
              var layerExtentScale = getScaleFromExtent(extent, mapSize);

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

                var res = view2D.constrainResolution(
                    view2D.getResolutionForExtent(extent, mapSize), 0, -1);
                view2D.setCenter(layerExtentCenter);
                view2D.setResolution(res);
                return;
              }
            }

            if (extent) {
              view2D.fitExtent(extent, mapSize);
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
                $scope.userMessage = $translate('add_wms_layer_failed') +
                    e.message;
                return null;
              }
            }
          };

          /**** UTILS functions ****/
          // from OL2
          //TO FIX: utils function to get scale from an extent, should be
          //elsewhere?
          function getScaleFromExtent(extent, mapSize) {
            // Constants get from OpenLayers 2, see:
            // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Util.js
            //
            // 39.37 INCHES_PER_UNIT
            // 72 DOTS_PER_INCH
            return $scope.map.getView().getView2D().
                getResolutionForExtent(extent, mapSize) * 39.37 * 72;
          }

          // Get the layer extent defines in the GetCapabilities
          function getLayerExtentFromGetCap(getCapLayer) {
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
          }

          function getChildLayers(getCapLayer, srsCode) {
            var layers = [];
            // If the  WMS layer has no name or if it can't be
            // displayed in the current SRS, we don't add it
            // to the list
            if (getCapLayer.Name && getCapLayer.CRS &&
                (getCapLayer.CRS.indexOf(srsCode.toUpperCase()) != -1 ||
                getCapLayer.CRS.indexOf(srsCode.toLowerCase()) != -1)) {
              getCapLayer.wmsUrl = $scope.fileUrl;
              getCapLayer.id = 'WMS||' + getCapLayer.wmsUrl + '||' +
                getCapLayer.Name;
              getCapLayer.extent = getLayerExtentFromGetCap(getCapLayer);
              layers.push(getCapLayer);
            }
            if (getCapLayer.Layer) {
              for (var i = 0, ii = getCapLayer.Layer.length; i < ii; i++) {
                layers = layers.concat(getChildLayers(getCapLayer.Layer[i],
                    srsCode));
              }
            }
            return layers;
          }
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
                scope.handleFileUrl();
              });

              // Fill the list of suggestions with all the data
              function initSuggestions() {
                var taView = $(taElt).data('ttView');
                var dataset = taView.datasets[0];
                dataset.getSuggestions('http', function(suggestions) {
                  taView.dropdownView.renderSuggestions(dataset, suggestions);
                });
              }
            }
          };
        }
  );
})();

