(function() {
  goog.provide('ga_tooltip_directive');

  goog.require('ga_map_service');
  goog.require('ga_popup_service');

  var module = angular.module('ga_tooltip_directive', [
    'ga_popup_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaTooltip',
      ['$http', '$q', '$translate', '$sce', 'gaPopup', 'gaLayers',
        function($http, $q, $translate, $sce, gaPopup, gaLayers) {
          var waitclass = 'ga-tooltip-wait',
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
                  currentTopic;

              map.on('click', function(evt) {
                var size = map.getSize();
                var extent = map.getView().calculateExtent(size);

                $scope.$apply(function() {
                  findFeatures(evt.getCoordinate(),
                               size,
                               extent);
                });
              });

              $scope.$on('gaTopicChange', function(event, topic) {
                currentTopic = topic.id;
              });

              function findFeatures(coordinate, size, extent) {
                var identifyUrl = $scope.options.identifyUrlTemplate
                                  .replace('{Topic}', currentTopic),
                    layersToQuery = getLayersToQuery();
                // Cancel all pending requests
                if (canceler) {
                  canceler.resolve();
                }
                // Create new cancel object
                canceler = $q.defer();
                if (layersToQuery.length) {
                  // Show wait cursor
                  angular.element(map.getTarget()).addClass(waitclass);

                  // Look for all features under clicked pixel
                  $http.jsonp(identifyUrl, {
                    timeout: canceler.promise,
                    params: {
                      geometryType: 'esriGeometryPoint',
                      geometry: coordinate[0] + ',' + coordinate[1],
                      // FIXME: make sure we are passing the right dpi here.
                      imageDisplay: size[0] + ',' + size[1] + ',96',
                      mapExtent: extent[0] + ',' + extent[2] +
                                   ',' + extent[1] + ',' + extent[3],
                      tolerance: $scope.options.tolerance,
                      layers: 'all:' + layersToQuery,
                      callback: 'JSON_CALLBACK'
                    }
                  }).success(function(features) {
                    angular.element(map.getTarget())
                        .removeClass(waitclass);
                    showFeatures(size, features.results);
                  }).error(function() {
                    angular.element(map.getTarget())
                        .removeClass(waitclass);
                  });
                }

                // htmls = [] would break the reference in the popup
                htmls.splice(0, htmls.length);

                if (popup) {
                  popup.close();
                }
              }

              function showFeatures(size, foundFeatures) {
                if (foundFeatures && foundFeatures.length > 0) {
                  angular.forEach(foundFeatures, function(value) {
                    var htmlUrl = $scope.options.htmlUrlTemplate
                                  .replace('{Topic}', currentTopic)
                                  .replace('{Layer}', value.layerBodId)
                                  .replace('{Feature}', value.featureId);
                    $http.jsonp(htmlUrl, {
                      timeout: canceler.promise,
                      params: {
                        lang: $translate.uses(),
                        callback: 'JSON_CALLBACK'
                      }
                    }).success(function(html) {
                      // Show popup on first result
                      if (htmls.length === 0) {
                        if (!popup) {
                          popup = gaPopup.create({
                            className: 'ga-tooltip',
                            destroyOnClose: false,
                            title: 'object_information',
                            content: popupContent,
                            htmls: htmls
                          }, $scope);
                        }
                        popup.open();
                        //always reposition element when newly opened
                        popup.element.css({
                          top: 89,
                          left: ((size[0] / 2) -
                              (parseFloat(popup.element.css('max-width')) / 2))
                        });
                      }
                      // Add result to array. ng-repeat will take
                      // care of the rest
                      htmls.push($sce.trustAsHtml(html));
                    });
                  });
                }
              }

              function getLayersToQuery(layers) {
                var layerstring = '';
                map.getLayers().forEach(function(l) {
                    var id = l.get('id');
                    if (gaLayers.getLayer(id) &&
                        gaLayers.getLayerProperty(id, 'queryable')) {
                      if (layerstring.length) {
                        layerstring = layerstring + ',';
                      }
                      layerstring = layerstring + id;
                    }
                });
                return layerstring;
              }
            }
          };
        }]);
})();
