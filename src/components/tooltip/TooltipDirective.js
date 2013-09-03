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
              $scope.htmls = [];

              $scope.map.on('click', function(evt) {
                var size = $scope.map.getSize();
                var extent = $scope.map.getView().calculateExtent(size);

                $scope.$apply(function() {
                  findFeatures($scope,
                               evt.getCoordinate(),
                               size,
                               extent);
                });
              });

              $scope.$on('gaTopicChange', function(event, topic) {
                $scope.currentTopic = topic.id;
              });

            }
          };

          function findFeatures(scope, coordinate, size, extent) {
            var identifyUrl = scope.options.identifyUrlTemplate
                              .replace('{Topic}', scope.currentTopic),
                layersToQuery = getLayersToQuery(scope.map.getLayers());
            // Cancel all pending requests
            if (scope.canceler) {
              scope.canceler.resolve();
            }
            // Create new cancel object
            scope.canceler = $q.defer();
            if (layersToQuery.length) {
              // Show wait cursor
              angular.element(scope.map.getTarget()).addClass(waitclass);

              // Look for all features under clicked pixel
              $http.jsonp(identifyUrl, {
                timeout: scope.canceler.promise,
                params: {
                  geometryType: 'esriGeometryPoint',
                  geometry: coordinate[0] + ',' + coordinate[1],
                  // FIXME: make sure we are passing the right dpi here. Can we?
                  imageDisplay: size[0] + ',' + size[1] + ',96',
                  mapExtent: extent[0] + ',' + extent[2] +
                               ',' + extent[1] + ',' + extent[3],
                  tolerance: scope.options.tolerance,
                  layers: 'all:' + layersToQuery,
                  callback: 'JSON_CALLBACK'
                }
              }).success(function(features) {
                angular.element(scope.map.getTarget()).removeClass(waitclass);
                showFeatures(scope, size, features.results);
              }).error(function() {
                angular.element(scope.map.getTarget()).removeClass(waitclass);
              });
            }

            // scope.htmls = [] would break the reference in the popup
            scope.htmls.splice(0, scope.htmls.length);

            if (scope.popup) {
              scope.popup.close();
            }
          }

          function showFeatures(scope, size, foundFeatures) {
            if (foundFeatures && foundFeatures.length > 0) {
              angular.forEach(foundFeatures, function(value) {
                var htmlUrl = scope.options.htmlUrlTemplate
                              .replace('{Topic}', scope.currentTopic)
                              .replace('{Layer}', value.layerBodId)
                              .replace('{Feature}', value.featureId);
                $http.jsonp(htmlUrl, {
                  timeout: scope.canceler.promise,
                  params: {
                    lang: $translate.uses(),
                    callback: 'JSON_CALLBACK'
                  }
                }).success(function(html) {
                  // Show popup on first result
                  if (scope.htmls.length === 0) {
                    if (!scope.popup) {
                      scope.popup = gaPopup.create({
                        className: 'ga-tooltip',
                        destroyOnClose: false,
                        title: 'object_information',
                        content: popupContent,
                        htmls: scope.htmls
                      }, scope);
                    }
                    scope.popup.open();
                    //always reposition element when newly opened
                    scope.popup.element.css({
                      top: 89,
                      left: ((size[0] / 2) -
                             (parseFloat(
                                 scope.popup.element.css('max-width')) / 2)
                             )
                    });
                  }
                  // Add result to array. ng-repeat will take care of the rest
                  scope.htmls.push($sce.trustAsHtml(html));
                });
              });
            }
          }

          function getLayersToQuery(layers) {
            var layerstring = '';
            layers.forEach(function(l) {
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
        }]);
})();
