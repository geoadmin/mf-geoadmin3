(function() {
  goog.provide('ga_tooltip_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_debounce_service');
  goog.require('ga_map_service');
  goog.require('ga_popup_service');

  var module = angular.module('ga_tooltip_directive', [
    'ga_debounce_service',
    'ga_popup_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaTooltip',
      function($timeout, $http, $q, $translate, $sce, gaPopup, gaLayers,
          gaBrowserSniffer, gaDefinePropertiesForLayer, gaMapClick, gaDebounce,
          gaPreviewFeatures) {
        var popupContent = '<div ng-repeat="htmlsnippet in options.htmls">' +
                            '<div ng-bind-html="htmlsnippet"></div>' +
                            '<div class="ga-tooltip-separator" ' +
                              'ng-show="!$last"></div>' +
                           '</div>';
        return {
          restrict: 'A',
          scope: {
            map: '=gaTooltipMap',
            options: '=gaTooltipOptions',
            isActive: '=gaTooltipActive'
          },
          link: function($scope, element, attrs) {
            var htmls = [],
                onCloseCB = angular.noop,
                map = $scope.map,
                popup,
                canceler,
                currentTopic,
                vector,
                vectorSource,
                parser,
                year,
                listenerKey;

            parser = new ol.format.GeoJSON();

            $scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
              initTooltip();
            });

            $scope.$on('gaTimeSelectorChange', function(event, currentyear) {
              year = currentyear;
            });

            $scope.$on('gaTriggerTooltipRequest', function(event, data) {
              var size = map.getSize();
              var mapExtent = map.getView().calculateExtent(size);
              initTooltip();

              // We use $timeout to execute the showFeature when the
              // popup is correctly closed.
              $timeout(function() {
                showFeatures(mapExtent, size, data.features);
                onCloseCB = data.onCloseCB;
              }, 0);

            });

            $scope.$on('gaTriggerTooltipInit', function(event) {
              initTooltip();
            });

            $scope.$on('gaTriggerTooltipInitOrUnreduce', function(event) {
              if (popup && popup.scope.options.isReduced) {
                popup.close();
              } else {
                initTooltip();
              }
            });

            // Change cursor style on mouse move, only on desktop
            var updateCursorStyle = function(evt) {
              var feature = findVectorFeature(map.getEventPixel(evt));
              map.getTarget().style.cursor = (feature) ? 'pointer' : '';
            };
            var updateCursorStyleDebounced = gaDebounce.debounce(
                updateCursorStyle, 10, false, false);

            if (!gaBrowserSniffer.mobile) {
              $(map.getViewport()).on('mousemove', function(evt) {
                if (!$scope.isActive) {
                  return;
                }
                updateCursorStyleDebounced(evt);
              });
            }

            function initTooltip() {
               // Cancel all pending requests
              if (canceler) {
                canceler.resolve();
              }
              // Create new cancel object
              canceler = $q.defer();
              // htmls = [] would break the reference in the popup
              htmls.splice(0, htmls.length);
              if (popup) {
                popup.close();
                $timeout(function() {
                  // We destroy the popup only if it's still closed
                  if (popup && popup.scope &&
                      popup.scope.toggle === false) {
                    popup.destroy();
                    popup = undefined;
                  }
                },0);
              }

              // Clear the preview features
              gaPreviewFeatures.clear(map);

              // Remove the remove layer listener if exist
              if (listenerKey) {
                map.getLayers().unByKey(listenerKey);
              }
            }

            gaMapClick.listen(map, function(evt) {
              if (!$scope.isActive) {
                return;
              }
              var size = map.getSize();
              var mapExtent = map.getView().calculateExtent(size);
              var coordinate = (evt.originalEvent) ?
                  map.getEventCoordinate(evt.originalEvent) :
                  evt.coordinate;

              // A digest cycle is necessary for $http requests to be
              // actually sent out. Angular-1.2.0rc2 changed the $evalSync
              // function of the $rootScope service for exactly this. See
              // Angular commit 6b91aa0a18098100e5f50ea911ee135b50680d67.
              // We use a conservative approach and call $apply ourselves
              // here, but we instead could also let $evalSync trigger a
              // digest cycle for us.

              $scope.$apply(function() {
                findFeatures(coordinate, size, mapExtent);
              });
            });

            // Test if the layer is a vector layer
            function isVectorLayer(olLayer) {
              return (olLayer instanceof ol.layer.Vector ||
                  (olLayer instanceof ol.layer.Image &&
                  olLayer.getSource() instanceof ol.source.ImageVector));
            };

            // Test if the layer is a queryable bod layer
            function isQueryableBodLayer(olLayer) {
              return (olLayer.bodId &&
                  gaLayers.getLayerProperty(olLayer.bodId, 'queryable'));
            };

            // Get all the queryable layers
            function getLayersToQuery() {
              var layersToQuery = [];
              map.getLayers().forEach(function(l) {
                if (l.visible && !l.preview &&
                    (isQueryableBodLayer(l) || isVectorLayer(l))) {
                  layersToQuery.push(l);
                }
              });
              return layersToQuery;
            }

            // Find the first feature from a vector layer
            function findVectorFeature(pixel, vectorLayer) {
              var featureFound;
              map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                if (!vectorLayer || vectorLayer == layer) {
                  if (!featureFound &&
                      (feature.get('name') ||
                      feature.get('description'))) {
                    feature.set('layerId', layer.id);
                    featureFound = feature;
                  }
                }
              });
              return featureFound;
            };

            // Find features for all type of layers
            function findFeatures(coordinate, size, mapExtent) {
              var identifyUrl = $scope.options.identifyUrlTemplate
                  .replace('{Topic}', currentTopic),
                  layersToQuery = getLayersToQuery(),
                  pixel = map.getPixelFromCoordinate(coordinate);
              initTooltip();
              for (var i = 0, ii = layersToQuery.length; i < ii; i++) {
                var layerToQuery = layersToQuery[i];
                if (isVectorLayer(layerToQuery)) {
                  var feature = findVectorFeature(pixel, layerToQuery);
                  if (feature) {
                    var htmlpopup =
                      '<div class="htmlpopup-container">' +
                        '<div class="htmlpopup-header">' +
                          '<span>' + layerToQuery.label + ' &nbsp;</span>' +
                          '(' + feature.get('name') + ')' +
                        '</div>' +
                        '<div class="htmlpopup-content">' +
                          feature.get('description') +
                        '</div>' +
                      '</div>';
                    feature.set('htmlpopup', htmlpopup);
                    showFeatures(layerToQuery.getExtent(), size,
                        [feature]);
                  }
                } else { // queryable bod layers
                  var params = {
                    geometryType: 'esriGeometryPoint',
                    geometryFormat: 'geojson',
                    geometry: coordinate[0] + ',' + coordinate[1],
                    // FIXME: make sure we are passing the right dpi here.
                    imageDisplay: size[0] + ',' + size[1] + ',96',
                    mapExtent: mapExtent.join(','),
                    tolerance: $scope.options.tolerance,
                    layers: 'all:' + layerToQuery.bodId
                  };

                  // Only timeEnabled layers use the timeInstant parameter
                  if (layerToQuery.timeEnabled) {
                    params.timeInstant = year ||
                        yearFromString(layerToQuery.time);
                  }

                  $http.get(identifyUrl, {
                    timeout: canceler.promise,
                    params: params
                  }).success(function(features) {
                    showFeatures(mapExtent, size, features.results);
                  });
                }
              }
            }

            // Highlight the features found
            function showFeatures(mapExtent, size, foundFeatures) {
              if (foundFeatures && foundFeatures.length > 0) {

                // Remove the tooltip, if a layer is removed, we don't care
                // which layer. It worked like that in RE2.
                listenerKey = $scope.map.getLayers().on('remove',
                  function(event) {
                    if (!event.element.preview) {
                      initTooltip();
                    }
                  }
                );

                angular.forEach(foundFeatures, function(value) {

                  if (value instanceof ol.Feature) {
                    var feature = new ol.Feature(value.getGeometry());
                    feature.set('layerId', value.get('layerId'));
                    gaPreviewFeatures.add(map, feature);
                    showPopup(value.get('htmlpopup'));

                  } else {
                    //draw feature, but only if it should be drawn
                    if (gaLayers.getLayer(value.layerBodId) &&
                        gaLayers.getLayerProperty(value.layerBodId,
                                                  'highlightable')) {
                      var features = parser.readFeatures(value);
                      for (var i = 0, ii = features.length; i < ii; ++i) {
                        features[i].set('layerId', value.layerBodId);
                        gaPreviewFeatures.add(map, features[i]);
                      }
                    }

                    var htmlUrl = $scope.options.htmlUrlTemplate
                                  .replace('{Topic}', currentTopic)
                                  .replace('{Layer}', value.layerBodId)
                                  .replace('{Feature}', value.featureId);
                    $http.get(htmlUrl, {
                      timeout: canceler.promise,
                      params: {
                        lang: $translate.use(),
                        mapExtent: mapExtent.join(','),
                        imageDisplay: size[0] + ',' + size[1] + ',96'
                      }
                    }).success(function(html) {
                      showPopup(html);
                    });
                  }
                });
              }
            }

            // Show the popup with all features informations
            function showPopup(html) {
              // Show popup on first result
              if (htmls.length === 0) {
                if (!popup) {
                  popup = gaPopup.create({
                    className: 'ga-tooltip',
                    onCloseCallback: function() {
                      if (onCloseCB) {
                        onCloseCB();
                      }
                      onCloseCB = angular.noop;
                      gaPreviewFeatures.clear(map);
                    },
                    title: 'object_information',
                    content: popupContent,
                    htmls: htmls,
                    showPrint: true
                  });
                }
                popup.open();
                //always reposition element when newly opened
                if (!gaBrowserSniffer.mobile) {
                  popup.element.css({
                    left: ((map.getSize()[0] / 2) -
                        (parseFloat(popup.element.css('max-width')) / 2))
                  });
                }
              }
              // Add result to array. ng-repeat will take
              // care of the rest
              htmls.push($sce.trustAsHtml(html));
            }

            function yearFromString(timestamp) {
              if (timestamp && timestamp.length) {
                timestamp = parseInt(timestamp.substr(0, 4));
                if (timestamp <= new Date().getFullYear()) {
                  return timestamp;
                }
              }
            }
          }
        };
      });
})();
