(function() {
  goog.provide('ga_featuretree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_featuretree_directive', [
    'ga_map_service'
  ]);

  module.directive('gaFeaturetree',
      ['$timeout', '$http', '$q', 'gaLayers',
      function($timeout, $http, $q, gaLayers) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            options: '=gaFeaturetreeOptions',
            map: '=gaFeaturetreeMap'
          },
          link: function(scope, element, attrs) {
            var currentTopic;
            var timeoutPromise = null;
            var canceler = null;
            var map = scope.map;
            var view = map.getView();
            var featureTolerance = 1;

            var getLayersToQuery = function(layers) {
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
            };

            var cancel = function() {
              if (timeoutPromise !== null) {
                $timeout.cancel(timeoutPromise);
              }
              if (canceler !== null) {
                canceler.resolve();
              }
              canceler = $q.defer();
            };

            var updateTree = function() {
              var size = map.getSize();
              var extent = view.calculateExtent(size);
              var identifyUrl = scope.options.identifyUrlTemplate
                                .replace('{Topic}', currentTopic),
                  layersToQuery = getLayersToQuery();
              if (layersToQuery.length) {

                // Look for all features in current bounding box
                $http.jsonp(identifyUrl, {
                  timeout: canceler.promise,
                  params: {
                    geometryType: 'esriGeometryEnvelope',
                    geometry: extent[0] + ',' + extent[2] +
                                  ',' + extent[1] + ',' + extent[3],
                    // FIXME: make sure we are passing the right dpi here.
                    imageDisplay: size[0] + ',' + size[1] + ',96',
                    mapExtent: extent[0] + ',' + extent[2] +
                                  ',' + extent[1] + ',' + extent[3],
                    tolerance: featureTolerance,
                    layers: 'all:' + layersToQuery,
                    callback: 'JSON_CALLBACK'
                  }
                }).success(function(features) {
                  var tree = {};

                  if (features.results &&
                      features.results.length > 0) {

                    angular.forEach(features.results, function(result) {

                      if (!angular.isDefined(tree[result.layerBodId])) {
                        tree[result.layerBodId] = {
                          label: gaLayers.getLayer(result.layerBodId).label,
                          features: []
                        };
                      }

                      var node = tree[result.layerBodId];
                      node.features.push({
                        id: result.featureId,
                        label: result.value
                      });

                    });
                  }
                  scope.tree = tree;
                }).error(function() {
                  scope.tree = {};
                });
              }
            };

            // Update the tree based on map changes. We use a timeout in
            // order to not trigger angular digest cycles and too many
            // updates. We don't use the permalink here because we want
            // to separate these concerns.
            var triggerChange = function() {
              if (scope.options.active) {
                cancel();
                timeoutPromise = $timeout(function() {
                  updateTree();
                  timeoutPromise = null;
                }, 1000);
              }
            };

            scope.tree = {};

            view.on('change', triggerChange);

            scope.$on('gaTopicChange', function(event, topic) {
              currentTopic = topic.id;
            });

            scope.$watch('options.active', function(newVal, oldVal) {
              cancel();
              if (newVal === true) {
                updateTree();
              }
            });


          }
        };

      }]
  );
})();

