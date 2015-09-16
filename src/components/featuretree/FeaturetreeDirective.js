goog.provide('ga_featuretree_directive');

goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_featuretree_directive', [
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  /**
   * TODOs:
   * - create all sphinxsearch indices (querable layers)
   * - translations
   * - rectangle drawing always active. auto-open accordion
   **/

  module.directive('gaFeaturetree',
      function($rootScope, $timeout, $http, $q, $translate, gaLayers,
          gaPreviewFeatures) {
        var canceler = null;
        var timeoutPromise = null;
        var parser = new ol.format.GeoJSON();

        var getTranslatedLabel = function(obj) {
          var possibleKey = 'label_' + $translate.use();
          if (angular.isDefined(obj[possibleKey])) {
            return obj[possibleKey];
          } else {
            return obj.label;
          }
        };

        var getItemText = function(number) {
          return $translate.instant((number <= 1) ? 'item' : 'items');
        };

        // Load the feature in geojson format
        var loadGeojson = function(scope, feature) {
          var deferred = $q.defer();
          if (!feature.geojson) {
            $http.get(
              scope.options.msUrl + '/' + feature.layerBodId + '/' +
                   feature.id, {
              cache: true,
              timeout: canceler.promise,
              params: {
                geometryFormat: 'geojson'
              }
            }).success(function(data) {
              feature.geojson = data.feature;
              deferred.resolve(true);
            }).error(function() {
              deferred.reject(false);
            });
          } else {
           deferred.resolve(true);
          }
          return deferred.promise;
        };

        var cancel = function(scope) {
          if (timeoutPromise !== null) {
            $timeout.cancel(timeoutPromise);
          }
          if (canceler !== null) {
            canceler.resolve();
          }
          scope.loading = false;
          canceler = $q.defer();
        };

        var deactivate = function(scope) {
          // Clean the display in any case
          $rootScope.$broadcast('gaTriggerTooltipInit');
          scope.clearHighlight();
        };

        return {
          restrict: 'A',
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            map: '=gaFeaturetreeMap',
            options: '=gaFeaturetreeOptions',
            isActive: '=gaFeaturetreeActive'
          },
          link: function(scope, element, attrs) {
            var map = scope.map;
            var featureSelected, features;
            var ignoreOneClick = false;
            var fromMouseDown = false;
            scope.tree = {};

            var drawFeature = function(f) {
              loadGeojson(scope, f).then(function() {
                if (f.geojson) {
                  gaPreviewFeatures.add(map,
                      parser.readFeature(f.geojson));
                }
              });
            };

            // Draw the current results
            var drawFeatures = function() {
              for (var i = 0, ii = features.length; i < ii; i++) {
                drawFeature(features[i]);
              }
            };

            /**
             * The tree represent a list of features grouped by layer
             */
            var updateTree = function(tree) {
              gaPreviewFeatures.clearHighlight();
              gaPreviewFeatures.clear(map);
              var newTree = {};
              features = [];

              angular.forEach(tree, function(layerNode, layerBodId) {
                var oldNode = scope.tree[layerBodId];
                var newNode = {
                  label: gaLayers.getLayer(layerBodId).label +
                     ' (' + ((layerNode.hasMoreResults) ? '+' : '') +
                     layerNode.features.length + ' ' +
                     getItemText(layerNode.features.length) + ')',
                  hasMoreResults: layerNode.hasMoreResults,
                  offset: layerNode.offset,
                  open: oldNode ? oldNode.open : true,
                  features: []
                };
                newTree[layerBodId] = newNode;

                for (var i = 0, ii = layerNode.features.length; i < ii; i++) {
                  var feature = layerNode.features[i];
                  //look if feature exists already. We do this
                  //to avoid loading the same feature again and
                  //to preserve state (selected)
                  if (oldNode) {
                    for (var j = 0, jj = oldNode.features.length; j < jj; j++) {
                      var oldFeature = oldNode.features[j];
                      if (oldFeature.id === feature.id) {
                        feature = oldFeature;
                        break;
                      }
                    }
                  }

                  feature.geojson = (feature.type == 'Feature' &&
                      feature.geometry) ? feature : null;
                  feature.label = getTranslatedLabel(feature.properties);
                  newNode.features.push(feature);
                  features.push(feature);
                  if (scope.isActive) {
                    drawFeature(feature);
                  }
                }
              });
              scope.tree = newTree;
              scope.$emit('gaUpdateFeatureTree', scope.tree);
            };

            // Selects a feature and displays the htm popup corresponding
            var selectAndTriggerTooltip = function(feature) {
              featureSelected = feature;
              loadGeojson(scope, feature).then(function() {
                if (feature.geojson) {
                  $rootScope.$broadcast('gaTriggerTooltipRequest', {
                    features: [feature.geojson],
                    onCloseCB: function() {
                      if (scope.isFeatureSelected(feature)) {
                        featureSelected = null;
                        if (scope.isActive) {
                          drawFeatures();
                        }
                      }
                    }
                  });
                }
              });
            };

            scope.highlight = function(feature) {
              loadGeojson(scope, feature).then(function() {
                if (feature.geojson) {
                  gaPreviewFeatures.highlight(map,
                      parser.readFeature(feature.geojson));
                }
              });
            };

            scope.clearHighlight = function() {
              gaPreviewFeatures.clearHighlight();
            };

            scope.isFeatureSelected = function(feature) {
              return (feature === featureSelected);
            };

            scope.onFocus = function(evt, feature) {
              if (!scope.isFeatureSelected(feature)) {
                if (fromMouseDown) {
                  ignoreOneClick = true;
                }
                selectAndTriggerTooltip(feature);
              }
            };

            scope.onMouseDown = function(evt, feature) {
              fromMouseDown = true;
            };

            scope.onClick = function(evt, feature) {
              fromMouseDown = false;
              if (ignoreOneClick) {
                ignoreOneClick = false;
              } else {
                if (scope.isFeatureSelected(feature)) {
                  $rootScope.$broadcast('gaTriggerTooltipInitOrUnreduce');
                } else {
                  selectAndTriggerTooltip(feature);
                }
              }
            };

            scope.onKeyDown = function(evt, feature) {
              //arrow up key
              if (evt.keyCode == 38) {
                $(evt.target).prev().focus();
                evt.preventDefault();
              //arrow down key
              } else if (evt.keyCode == 40) {
                $(evt.target).next().focus();
                evt.preventDefault();
              }
            };

            scope.zoom = function(evt, feature) {
              evt.stopPropagation();
              gaPreviewFeatures.zoom(map, undefined,
                  parser.readFeature(feature.geojson));
            };

            scope.more = function(evt, layer) {
              evt.stopPropagation();
              scope.$emit('gaGetMoreFeatureTree', layer);
            };


            // Watchers and scope events
            scope.$watch('isActive', function(newVal, oldVal) {
              cancel(scope);
              if (newVal != oldVal) {
                if (!newVal) {
                  deactivate(scope);
                }
              }
            });

            // When language change
            scope.$on('gaLayersTranslationChange', function(evt, newLayers) {
              updateTree(scope.tree);
            });

            // When another directive calls for an update
            scope.$on('gaNewFeatureTree', function(evt, tree) {
              updateTree(tree);
            });

          }
        };
      }
  );
})();

