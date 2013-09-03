(function() {
  goog.provide('ga_importwms_directive');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_importwms_directive', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaImportWmsDirectiveController',
      ['$scope', '$http', '$q', '$log', '$translate', 'gaUrlUtils',
        function($scope, $http, $q, $log, $translate, gaUrlUtils) {

          // List of layers available in the GetCapabilities
          $scope.layers = [];

          // copy from ImportKml
          $scope.fileUrl = null;
          $scope.userMessage = '';
          $scope.progress = 0;

          // Handle URL of WMS
          $scope.handleFileUrl = function() {
            var url = $scope.fileUrl;

            if (isValidUrl(url)) {

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
              var parser = new ol.parser.ogc.WMSCapabilities();
              var result = parser.read(data);

              $scope.wmsConstraintsMessage = (result.service.maxWidth) ?
                  $translate('wms_max_size_allowed') + ' ' +
                    result.service.maxWidth +
                    ' * ' + result.service.maxHeight :
                  '';

              for (var i = 0, len = result.capability.layers.length;
                  i < len; i++) {
                var layer = result.capability.layers[i];

                // If the  WMS layer has no name or if it can't be
                // displayed in the current SRS, we don't add it
                // to the list
                if (layer.name && (layer.srs &&
                    (layer.srs[srsCode.toUpperCase()] ||
                    layer.srs[srsCode.toLowerCase()]))) {
                  $scope.layers.push(layer);
                }
              }

              $scope.userMessage = $translate('parse_succeeded');
              $scope.progress += 20;

            } catch (e) {
              $scope.userMessage = $translate('parse_failed') + e.message;
              $scope.progress = 0;
              //$log.log($scope.userMessage);
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
              var layerAdded = $scope.addLayer($scope.layerSelected);

              if (layerAdded) {
                $scope.userMessage = $translate('add_wms_layer_succeeded');
              }

              alert($scope.userMessage);
            }
          };

          // Add the hovered layer to the map
          $scope.addLayerHovered = function(getCapLayer) {
            if (getCapLayer) {
              $scope.layerHovered = getCapLayer;
              $scope.olLayerHovered = $scope.addLayer($scope.layerHovered);
            }
          };

          // Remove layer hovered
          $scope.removeLayerHovered = function() {
            if ($scope.olLayerHovered) {
              $scope.map.removeLayer($scope.olLayerHovered);
              $scope.layerHovered = null;
              $scope.olLayerHovered = null;
            }
          };

          // Select the layer clicked
          $scope.toggleLayerSelected = function(getCapLayer) {
            $scope.layerSelected = ($scope.layerSelected &&
                $scope.layerSelected.name == getCapLayer.name) ?
                null :
                getCapLayer;
          };

          // Zoom on layer extent
          $scope.zoomOnLayerExtent = function(getCapLayer) {
            var layer = getCapLayer;
            var extent = getLayerExtentFromGetCap(layer);
            var view2D = $scope.map.getView().getView2D();
            var mapSize = $scope.map.getSize();

            // If a minScale is defined
            if (layer.minScale && extent) {

              // We test if the layer extent specified in the
              // getCapabilities fit the minScale value.
              var layerExtentScale = getScaleFromExtent(extent, mapSize);

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
                    getResolutionFromExtent(extent, mapSize), 0, -1);
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
                var olAttributions = null;

                if (layer.attribution) {
                  olAttributions = [new ol.Attribution({
                    html: '<a href="' + layer.attribution.href + '">' +
                        ((layer.attribution.logo) ?
                          '<img src="' + layer.attribution.logo.href +
                             '" title="' + layer.attribution.title +
                             '" alt="' + layer.attribution.title + '" />"' :
                          layer.attribution.title) +
                      '</a>'
                  })];
                }

                var olSource = new ol.source.SingleImageWMS({
                  params: {
                    'LAYERS': layer.name
                  },
                  url: $scope.fileUrl,
                  extent: getLayerExtentFromGetCap(layer),
                  attributions: olAttributions,
                  ratio: 1
                });

                var olLayer = new ol.layer.ImageLayer({
                  label: layer.title,
                  source: olSource
                });

                $scope.map.addLayer(olLayer);
                return olLayer;

              } catch (e) {
                $scope.userMessage = $translate('add_wms_layer_failed') +
                    e.message;
                //$log.log($scope.userMessage);

                return null;
              }
            }
          };



          /**** UTILS functions ****/

          // from Angular
          // https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L3
          var URL_REGEXP =
          /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;


          // from ImportKml
          // Test validity of a user input
          function isValidUrl(url) {
            return URL_REGEXP.test(url);
          };


          // from OL3
          //TO FIX: copy from OpenLayers 3, should be elsewhere?
          function getResolutionFromExtent(extent, size) {
            var xResolution = (extent[1] - extent[0]) / size[0];
            var yResolution = (extent[3] - extent[2]) / size[1];
            return Math.max(xResolution, yResolution);
          }

          // from OL2
          //TO FIX: utils function to get scale from an extent, should be
          //elsewhere?
          function getScaleFromExtent(extent, mapSize) {
            // Constants get from OpenLayers 2, see:
            // https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Util.js
            //
            // 39.37 INCHES_PER_UNIT
            // 72 DOTS_PER_INCH
            return getResolutionFromExtent(extent, mapSize) * 39.37 * 72;
          }

          // Get the layer extent defines in the GetCapabilities
          function getLayerExtentFromGetCap(getCapLayer) {
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

            return extent;
          }
  }]);

  module.directive('gaImportWms',
      ['$http', '$log', '$translate',
        function($http, $log, $translate) {
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
              var taElt = elt.find('input[type=url]').typeahead({
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
              elt.find('.open-wms-list').on('click', function(evt) {
                elt.find('.tt-dropdown-menu').toggle();
                // Re-initialize the list of suggestions
                initSuggestions();
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
      ]
  );
})();

