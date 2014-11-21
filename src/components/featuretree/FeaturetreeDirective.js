(function() {
  goog.provide('ga_featuretree_directive');

  goog.require('ga_map_service');

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
            var featureSelected;
            var ignoreOneClick = false;
            var fromMouseDown = false;
            scope.tree = {};

            var updateTree = function(features) {
              gaPreviewFeatures.clearHighlight();
              var res = features, tree = {};

              if (features) {
                for (var i = 0, li = res.length; i < li; i++) {
                  var result = res[i];
                  var layerBodId = result.layerBodId || result.attrs.layer;
                  var featureId = result.id || result.attrs.id;
                  var newNode = tree[layerBodId];
                  var oldNode = scope.tree[layerBodId];
                  var feature = undefined;

                  if (!angular.isDefined(newNode)) {
                    newNode = {
                      label: '',
                      features: [],
                      open: oldNode ? oldNode.open : true
                    };
                    tree[layerBodId] = newNode;
                  }

                  //look if feature exists already. We do this
                  //to avoid loading the same feature again and
                  //to preserve state (selected)
                  if (oldNode) {
                    for (var j = 0, lj = oldNode.features.length; j < lj; j++) {
                      var oldFeature = oldNode.features[j];
                      if (oldFeature.id === featureId) {
                        feature = oldFeature;
                        break;
                      }
                    }
                  }

                  if (!angular.isDefined(feature)) {
                    feature = {
                      id: featureId,
                      layerBodId: layerBodId,
                      geojson: (result.type == 'Feature' && result.geometry) ?
                          result : null
                    };
                  }
                  feature.label = getTranslatedLabel((result.attrs ||
                      result.properties));
                  newNode.features.push(feature);
                }
              }
              //assure that label contains number of items
              angular.forEach(tree, function(value, key) {
                var l = gaLayers.getLayer(key).label +
                        ' (' + value.features.length + ' ' +
                        getItemText(value.features.length) + ')';
                value.label = l;
              });
              scope.tree = tree;
              scope.$emit('gaUpdateFeatureTree', tree);
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
              gaPreviewFeatures.zoom(map, parser.readFeature(feature.geojson));
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

            /* A list of features can be pass via the options object */
            scope.$watch('options.features', function(features) {
              scope.features = features;
              updateTree(scope.features);
            });

            // When language change
            scope.$on('gaLayersChange', function(evt, labelsOnly) {
              if (labelsOnly) {
                updateTree(scope.features);
              }
            });

          }
        };
      }
  );
})();

