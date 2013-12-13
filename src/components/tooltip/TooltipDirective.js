(function() {
  goog.provide('ga_tooltip_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_map_service');
  goog.require('ga_popup_service');
  goog.require('ga_styles_service');

  var module = angular.module('ga_tooltip_directive', [
    'ga_popup_service',
    'ga_map_service',
    'ga_styles_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaTooltip',
    function($timeout, $document, $http, $q, $translate, $sce, gaPopup,
      gaLayers, gaBrowserSniffer, gaDefinePropertiesForLayer, gaMapClick,
      gaStyleFunctionFactory)
      {
        var waitclass = 'ga-tooltip-wait',
            bodyEl = angular.element($document[0].body),
            popupContent = '<div ng-repeat="htmlsnippet in options.htmls">' +
                              '<div ng-bind-html="htmlsnippet"></div>' +
                              '<div class="tooltip-separator" ' +
                                'ng-show="!$last"></div>' +
                            '</div>';
        return {
          restrict: 'A',
          scope: {
            map: '=gaTooltipMap',
            options: '=gaTooltipOptions'
          },
          link: function($scope, element, attrs) {
            var htmls = [],
                map = $scope.map,
                popup,
                canceler,
                currentTopic,
                vector,
                vectorSource,
                parser,
                year,
                source;

            //FIXME: as the tooltip highlight is never printed, we could draw
            //these features using the 'postcompose' function on either the
            //layer or the map directly.
            //See ol3 examples: dynamic-data.js or geojson.js
            parser = new ol.format.GeoJSON();
            vectorSource = new ol.source.Vector();

            vector = new ol.layer.Vector({
              source: vectorSource,
              styleFunction: gaStyleFunctionFactory('select')
            });
            gaDefinePropertiesForLayer(vector);
            vector.highlight = true;
            vector.invertedOpacity = 0.25;

            $scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            $scope.$on('gaTimeSelectorChange', function(event, currentyear) {
              year = currentyear;
            });

            function clearAll() {
              vectorSource.clear();
              map.removeLayer(vector);
            }

            gaMapClick.listen(map, function(evt) {
              var size = map.getSize();
              var mapExtent = map.getView().calculateExtent(size);
              var coordinate = (evt.originalEvent) ?
                  map.getEventCoordinate(evt.originalEvent) :
                  evt.getCoordinate();

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

            function findFeatures(coordinate, size, mapExtent) {
              var identifyUrl = $scope.options.identifyUrlTemplate
                                .replace('{Topic}', currentTopic),
                  layersToQuery = getLayersToQuery(),
                  responseCount = 0,
                  layerToQuery,
                  params,
                  identifyCount,
                  i;
              // Cancel all pending requests
              if (canceler) {
                canceler.resolve();
              }
              // Create new cancel object
              canceler = $q.defer();
              identifyCount = layersToQuery.length;
              if (identifyCount) {
                // Show wait cursor
                //
                // The tricky part: without the $timeout, the call to
                // canceler.resolve above may schedule the execution of the
                // $http.get error callback, but the execution of the callback
                // will happen after the call to `addClass`. So the class is
                // added and then removed. With $timeout we force the right
                // order of execution.
                $timeout(function() {
                  bodyEl.addClass(waitclass);
                }, 0);

                for (i = 0; i < identifyCount; i++) {
                  layerToQuery = layersToQuery[i];
                  params = {
                    geometryType: 'esriGeometryPoint',
                    geometryFormat: 'geojson',
                    geometry: coordinate[0] + ',' + coordinate[1],
                    // FIXME: make sure we are passing the right dpi here.
                    imageDisplay: size[0] + ',' + size[1] + ',96',
                    mapExtent: mapExtent.join(','),
                    tolerance: $scope.options.tolerance,
                    layers: 'all:' + layerToQuery.id
                  };
                  if (layerToQuery.year) {
                    params.timeInstant = layerToQuery.year;
                  }

                  $http.get(identifyUrl, {
                    timeout: canceler.promise,
                    params: params
                  }).success(function(features) {
                    if (features.results.length == 0) {
                      incResponseCount();
                    }
                    showFeatures(mapExtent, size, features.results);
                  }).error(function() {
                    incResponseCount();
                  });
                }

                function incResponseCount() {
                  responseCount += 1;
                  if (responseCount == identifyCount) {
                    bodyEl.removeClass(waitclass);
                  }
                }
             }

              // htmls = [] would break the reference in the popup
              htmls.splice(0, htmls.length);

              if (popup) {
                popup.close();
              }
              clearAll();
              map.addLayer(vector);
            }

            function showFeatures(mapExtent, size, foundFeatures) {
              if (foundFeatures && foundFeatures.length > 0) {

                angular.forEach(foundFeatures, function(value) {

                  //draw feature, but only if it should be drawn
                  if (gaLayers.getLayer(value.layerBodId) &&
                      gaLayers.getLayerProperty(value.layerBodId,
                                                'highlightable')) {
                    var features = parser.readFeatures(value);
                    for (var i = 0, ii = features.length; i < ii; ++i) {
                      vectorSource.addFeature(features[i]);
                    }
                  }

                  var htmlUrl = $scope.options.htmlUrlTemplate
                                .replace('{Topic}', currentTopic)
                                .replace('{Layer}', value.layerBodId)
                                .replace('{Feature}', value.featureId);
                  $http.get(htmlUrl, {
                    timeout: canceler.promise,
                    params: {
                      lang: $translate.uses(),
                      mapExtent: mapExtent.join(','),
                      imageDisplay: size[0] + ',' + size[1] + ',96'
                    }
                  }).success(function(html) {
                    bodyEl.removeClass(waitclass);
                    // Show popup on first result
                    if (htmls.length === 0) {
                      if (!popup) {
                        popup = gaPopup.create({
                          className: 'ga-tooltip',
                          onCloseCallback: function() {
                            clearAll();
                          },
                          destroyOnClose: false,
                          title: 'object_information',
                          content: popupContent,
                          htmls: htmls
                        }, $scope);
                      }
                      popup.open();
                      //always reposition element when newly opened
                      if (!gaBrowserSniffer.mobile) {
                        popup.element.css({
                          top: 89,
                          left: ((size[0] / 2) -
                              (parseFloat(popup.element.css('max-width')) / 2))
                        });
                      }
                    }
                    // Add result to array. ng-repeat will take
                    // care of the rest
                    htmls.push($sce.trustAsHtml(html));
                  }).error(function() {
                    bodyEl.removeClass(waitclass);
                  });
                });
              }
            }

            function getLayersToQuery(layers) {
              var layersToQuery = [];
              map.getLayers().forEach(function(l) {
                var bodId = l.bodId,
                    layerToQuery = {},
                    timestamps,
                    src;
                if (gaLayers.getLayer(bodId) &&
                    gaLayers.getLayerProperty(bodId, 'queryable') &&
                    l.visible &&
                    layersToQuery.indexOf(bodId) < 0) {
                  layerToQuery.id = bodId;

                  timestamps = getLayerTimestamps(bodId);
                  if (angular.isDefined(timestamps)) {
                    src = l.getSource();
                    layerToQuery.year = year;
                    //FIXME: we should use new 'timebehaviour' attribute
                    //to define what should happen if we have
                    //year === undefined (either take last year or no
                    //time attribute at all (meaning all))
                    //Note: year === null does not exist anymore
                    if (src instanceof ol.source.WMTS &&
                        !angular.isDefined(year)) {
                      layerToQuery.year = yearFromString(timestamps[0]);
                    }
                  }

                  layersToQuery.push(layerToQuery);
                }
              });
              return layersToQuery;
            }

            function getLayerTimestamps(id) {
              var timestamps;
              if (id && gaLayers.getLayer(id) &&
                  gaLayers.getLayerProperty(id, 'timeEnabled')) {
                timestamps = gaLayers.getLayerProperty(id, 'timestamps');
              }
              return timestamps;
            }

            function yearFromString(timestamp) {
              return parseInt(timestamp.substr(0, 4));
            }
          }
        };
      });
})();
