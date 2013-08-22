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
      ['$http', '$q', '$translate', 'gaPopup', 'gaLayers',
        function($http, $q, $translate, gaPopup, gaLayers) {
          var currentTopic, canceler, popup = null;
          return {
            restrict: 'A',
            scope: {
              map: '=gaTooltipMap',
              options: '=gaTooltipOptions'
            },
            link: function($scope, element, attrs) {

              $scope.map.on('click', function(evt) {
                var size = $scope.map.getSize();
                var extent = $scope.map.getView().calculateExtent(size);
                $scope.layers = $scope.map.getLayers();

                $scope.$apply(function() {
                  handleMapClick($scope,
                                 evt.getPixel(),
                                 evt.getCoordinate(),
                                 size,
                                 extent);
                });
              });

              $scope.$on('gaTopicChange', function(event, topic) {
                currentTopic = topic.id;
              });
            }
          };

          function handleMapClick(scope, pixel, coordinate, size, extent) {
            var identifyUrl = scope.options.identifyUrlTemplate
                              .replace('{topic}', currentTopic),
                layersToQuery = getLayersToQuery(scope.layers);
            //cancel all pending requests
            if (canceler) {
              canceler.resolve();
            }
            //create new cancel object
            canceler = $q.defer();
            if (layersToQuery.length) {
              //look for all features under clicked pixel
              $http.jsonp(identifyUrl, {
                timeout: canceler.promise,
                params: {
                  'geometryType': 'esriGeometryPoint',
                  'geometry': coordinate[0] + ',' + coordinate[1],
                  //FIXME: make sure we are passing the right dpi here. Can we?
                  'imageDisplay': size[0] + ',' + size[1] + ',96',
                  'mapExtent': extent[0] + ',' + extent[2] +
                               ',' + extent[1] + ',' + extent[3],
                  'tolerance': scope.options.tolerance,
                  //FIXME: layers should come from the map
                  'layers': 'all:' + layersToQuery,
                  'callback': 'JSON_CALLBACK'
                }
              }).success(function(features) {
                showInformation(scope, pixel, features.results);
              });
            }

            removePopup();
          }

          function showInformation(scope, pixel, foundFeatures) {
            var content, htmls;
            if (foundFeatures && foundFeatures.length > 0) {
              htmls = [];
              content = '<div ng-repeat="htmlsnippet in options.htmls">' +
                          '<div ng-bind-html-unsafe="htmlsnippet"></div>' +
                          '<div class="tooltip-separator" ' +
                            'ng-show="!$last"></div>' +
                        '</div>';

              angular.forEach(foundFeatures, function(value) {
                var htmlUrl = scope.options.htmlUrlTemplate
                              .replace('{topic}', currentTopic)
                              .replace('{layer}', value.layerBodId)
                              .replace('{feature}', value.featureId);
                $http.jsonp(htmlUrl, {
                  timeout: canceler.promise,
                  params: {
                    'lang': $translate.uses(),
                    'callback': 'JSON_CALLBACK'

                  }
                }).success(function(html) {
                  //first result, show popup
                  if (htmls.length === 0) {
                    popup = gaPopup.create({
                      title: 'object_information',
                      content: content,
                      htmls: htmls,
                      x: pixel[0],
                      y: pixel[1]
                    });
                    popup.open(scope);
                  }
                  //add result to array. ng-repeat will take care of the rest
                  htmls.push(html);
                });
              });
            }
          }

          function getLayersToQuery(layers) {
            var layerstring = '';
            layers.forEach(function(l) {
                var id = l.get('id');
                if (gaLayers.getLayerProperty(id, 'queryable')) {
                  if (layerstring.length) {
                    layerstring = layerstring + ',';
                  }
                  layerstring = layerstring + id;
                }
            });
            return layerstring;
          }

          function removePopup() {
            if (popup) {
              popup.close();
              popup = null;
            }
          }

        }]);
})();
