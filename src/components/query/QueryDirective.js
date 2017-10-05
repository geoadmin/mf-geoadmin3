goog.provide('ga_query_directive');

goog.require('ga_identify_service');
goog.require('ga_map_service');
goog.require('ga_query_service');

(function() {

  var module = angular.module('ga_query_directive', [
    'ga_map_service',
    'ga_query_service',
    'ga_identify_service'
  ]);

  module.controller('GaQueryDirectiveController', function($rootScope, $scope,
      $timeout, $translate, gaLayerFilters, gaQuery, gaMapUtils, gaIdentify) {
    $scope.queryType = 1; // Filter attributes
    $scope.queryableLayers = [];
    $scope.tooltipLayers = [];
    $scope.queriesPredef = [];
    $scope.filters = [];
    $scope.featuresByLayer = {};

    var getEmptyFilter = function() {
      return {
        layer: null,
        attribute: null,
        operator: null,
        value: null
      };
    };
    $scope.filters[0] = getEmptyFilter();

    // Get parameters for an ESRI query request.
    var getParamsByLayer = function(filters, geometry) {
      // In this case filters contains all the filter on one layer */
      var list = [];
      var paramsByLayer = {};

      angular.forEach(filters, function(filter, idx) {
        if (!filter.layer || !filter.value) {
          return;
        }
        if (!paramsByLayer[filter.layer.bodId]) {
          paramsByLayer[filter.layer.bodId] = {
            bodId: filter.layer.bodId,
            params: {}
          };
          list.push(paramsByLayer[filter.layer.bodId]);
        }
        var params = paramsByLayer[filter.layer.bodId].params;
        var operator = $scope.selectedQueryOperator.value;

        // Where condition
        var where = (params.where) ? params.where + ' ' + operator + ' ' : '';
        where += filter.attribute.name + ' ';

        // Manage 'null' value
        if (/^null$/i.test(filter.value)) {
          where += 'is ';
          if (/^(!=|<|>|not ilike)$/i.test(filter.operator)) {
            where += 'not ';
          }
          where += 'null';
        } else {
          where += filter.operator + ' ' +
              filter.attribute.transformToLiteral(filter.value);
        }

        params.where = where;
      });
      return list;
    };

    // Display the first attribute as selected
    var noAttr = {label: 'query_no_attr'};
    var updateAttr = function(idx, filter) {
      filter.attribute = filter.layer.attributes[0] || noAttr;
      $scope.updateOp(idx, filter);
    };

    $scope.queryOperators = [{
      label: 'AND',
      value: 'and'
    }, {
      label: 'OR',
      value: 'or'
    }];

    $scope.selectedQueryOperator = $scope.queryOperators[0];

    // Display the first operator as selected
    $scope.updateOp = function(idx, filter) {
      if (filter.attribute.operators) {
        filter.operator = filter.attribute.operators[0];
      }
      filter.value = null;
      filter.moreValues = null;
      $scope.updateInputValue(idx, filter);
    };

    // When the list or value of filters change
    $scope.onChange = function() {
      $scope.queryPredef = null;
      $scope.featuresByLayer = {};
    };

    // Load attributes of the selected layer in the select box
    $scope.onChangeLayer = function(idx, filter) {
      filter.attribute = null;
      filter.operator = null;
      filter.value = null;
      gaQuery.getLayerAttributes(filter.layer.bodId).then(function(attrs) {
        if (!filter.layer.attributes) {
          filter.layer.attributes = attrs;
        }
        updateAttr(idx, filter);
      });
    };

    // Use predefined query to fill the filters
    $scope.applyQueryPredef = function(queryPredef) {
      if (!queryPredef) {
        $scope.filters = [getEmptyFilter()];
      } else {
        $scope.filters = [];
        angular.forEach(queryPredef.filters, function(filter) {
          this.push(clone(filter));
        }, $scope.filters);

        // Update input value after the filters are displayed
        $timeout(function() {
          for (var i = 0; i < $scope.filters.length; i++) {
            $scope.updateInputValue(i, $scope.filters[i]);
          }
        }, 0, false);
      }
    };

    // Clone a filter
    var clone = function(filter) {
      return {
        layer: filter.layer,
        attribute: filter.attribute,
        operator: filter.operator,
        value: filter.value
      };
    };

    // Duplicate a filter
    $scope.duplicate = function(idx) {
      $scope.filters.splice(idx, 0, clone($scope.filters[idx]));
    };

    // Clear a filter
    $scope.clear = function(idx) {
      $scope.filters[idx] = getEmptyFilter();
    };

    // Remove a filter
    $scope.remove = function(idx) {
      $scope.filters.splice(idx, 1);
    };

    // Get all valuse for an attribute (only min/max for date and number)
    $scope.toggleAttributeValues = function($event, idx, filter) {
      var target = $($event.target);
      if (!filter.moreValues) {
        gaQuery.getAttributeValues(
            filter.layer.bodId,
            filter.attribute.name
        ).then(function(values) {
          filter.attribute.moreValues = values;
          filter.moreValues = filter.attribute.moreValues;
          filter.value = filter.moreValues[0];
        });
      } else {
        filter.moreValues = null;
      }
      $timeout(function() {
        target.prev().focus();
        $scope.updateInputValue(idx, filter);
      }, 0, false);
    };

    // When the user click on the query bbox checkbox
    $scope.onChangeUseBbox = function() {
      if ($scope.useBbox) {
        $scope.showBox();
      } else {
        $scope.hideBox();
      }
    };

    // Search callbacks
    var onSearchSuccess = function(layerFeatures, layerBodId, offset) {
      var featuresByLayer = $scope.featuresByLayer[layerBodId] ||
          {features: []};
      var features = (offset) ? featuresByLayer.features : [];

      // If there is 201 results that means there is more results to
      // display
      featuresByLayer.hasMoreResults = (layerFeatures.length >
          $scope.options.max);
      featuresByLayer.offset = offset || 0;
      if (featuresByLayer.hasMoreResults) {
        layerFeatures.pop(); // We remove the feature 201
      }
      featuresByLayer.features = features.concat(layerFeatures);
      $scope.featuresByLayer[layerBodId] = featuresByLayer;
      $scope.loading = false;
      $scope.$emit('gaQueryResultsUpdated', $scope.featuresByLayer);
    };

    var resetResults = function(reason, layerBodId) {
      if (layerBodId) {
        $scope.featuresByLayer[layerBodId] = undefined;
      } else {
        $scope.featuresByLayer = {};
      }
      $scope.loading = false;
      $scope.$emit('gaQueryResultsUpdated', $scope.featuresByLayer);
    };

    // Search by geometry using feature identify servioce
    $scope.searchByGeometry = function(layerBodId, offset) {
      $scope.queryType = 0;

      if (!$scope.tooltipLayers.length) {
        resetResults();
        return;
      }

      $scope.loading = true;
      if (!$scope.geometry) {
        $scope.loading = false;
        return;
      }

      var layersRequested = $scope.tooltipLayers;
      if (layerBodId) {
        layersRequested = [
          gaMapUtils.getMapOverlayForBodId($scope.map, layerBodId)
        ];
      }
      angular.forEach(layersRequested, function(layer) {
        gaIdentify.get(
            $scope.map,
            [layer],
            $scope.geometry,
            5,
            true,
            undefined,
            undefined,
            undefined,
            offset
        ).then(function(response) {
          onSearchSuccess(response.data.results, layer.bodId, offset);
        }, function(response) {
          resetResults(response, layer.bodId);
        });
      });
    };

    // Search by attributes using feature identify service
    $scope.searchByAttributes = function(layerBodId, offset) {
      $scope.queryType = 1;
      $scope.loading = true;

      var params = getParamsByLayer($scope.filters);
      if (!params.length) {
        if ($scope.useBbox) {
          $scope.searchByGeometry();
        } else {
          resetResults();
        }
        return;
      }

      if ($scope.useBbox) {
        // here $scope.geometry can't be null
        $scope.showBox();
      }

      angular.forEach(params, function(paramsByLayer) {

        if (layerBodId && layerBodId !== paramsByLayer.bodId) {
          $scope.loading = false;
          return;
        }
        var layer = gaMapUtils.getMapOverlayForBodId($scope.map,
            paramsByLayer.bodId);
        gaIdentify.get(
            $scope.map,
            [layer],
            $scope.useBbox ? $scope.geometry : undefined,
            5,
            true,
            undefined,
            undefined,
            undefined,
            offset,
            paramsByLayer.params.where
        ).then(function(response) {
          onSearchSuccess(response.data.results, layer.bodId, offset);
        }, function(response) {
          resetResults(response, layer.bodId);
        });
      });
    };

    // Launch a search according to the active tab
    $scope.search = function(layerBodId, offset) {
      if (!offset) {
        resetResults('', layerBodId);
      }
      if ($scope.queryType === 0) {
        $scope.searchByGeometry(layerBodId, offset);
      } else {
        $scope.searchByAttributes(layerBodId, offset);
      }
    };

    // Watcher/listener
    $scope.layers = $scope.map.getLayers().getArray();
    $scope.tooltipFilter = gaLayerFilters.potentialTooltip;
    $scope.$watchCollection('layers | filter:tooltipFilter',
        function(layers) {
          $scope.tooltipLayers = layers;
          if ($scope.isResultsActive) {
            $scope.search();
          }
        });

    $scope.queryableFilter = gaLayerFilters.queryable;
    $scope.$watchCollection('layers | filter:queryableFilter',
        function(layers) {
          $scope.queryableLayers = layers;

          // Load new list of predefines queries and queryable attributes
          var predef = [];
          angular.forEach($scope.queryableLayers, function(layer) {
            var queries = gaQuery.getPredefQueries(layer.bodId);
            if (queries) {
              angular.forEach(queries, function(query, idx) {
                query.layer = layer;
                query.label = $translate.instant(query.id);
                angular.forEach(query.filters, function(filter, idx) {
                  filter.layer = layer;
                  gaQuery.getLayerAttributes(filter.layer.bodId).
                      then(function(attrs) {
                        if (!filter.layer.attributes) {
                          filter.layer.attributes = attrs;
                        }
                        filter.layer.attributes.forEach(function(attr) {
                          if (attr.name === filter.attrName) {
                            filter.attribute = attr;
                          }
                        });
                      });
                });

                // Apply a predefined query if exist
                if ($scope.queryPredef &&
                $scope.queryPredef.id === query.id &&
                $scope.queryPredef.layer === layer) {
                  $scope.applyQueryPredef($scope.queryPredef);
                }
              });
              predef = predef.concat(queries);
            }
          });
          $scope.queriesPredef = predef;

          // Clear the query using a removed/hidden layer
          for (var i = 0; i < $scope.filters.length; i++) {
            if ($scope.filters[i].layer) {
              var exist = false;
              angular.forEach(layers, function(layer) {
                if (layer.id === $scope.filters[i].layer.id) {
                  exist = true;
                }
              });
              if (!exist) {
                $scope.filters[i] = getEmptyFilter();
              }
            }
          }

          if ($scope.isResultsActive) {
            $scope.search();
          }
        });

    $rootScope.$on('$translateChangeEnd', function(evt) {
      // Update attributes translations
      for (var i = 0; i < $scope.filters.length; i++) {
        var layer = $scope.filters[i].layer;
        if (layer) {
          gaQuery.getLayerAttributes(layer.bodId).then(function(attrs) {
            angular.forEach(layer.attributes, function(attr, idx) {
              attr.label = attrs[idx].label;
            });
          });
        }
      }
    });

    $scope.$on('gaQueryMore', function(evt, layerId, offset) {
      $scope.search(layerId, offset);
    });
    $scope.$on('gaLayersTranslationChange', function(evt, newLayers) {
      // We refresh the labels here because the layer's label is not updated
      // correctly when we use the filter in ng-options
      angular.forEach($scope.queriesPredef, function(query) {
        query.label = $translate.instant(query.id);
      });
    });
  });

  module.directive('gaQuery', function($translate, gaBrowserSniffer, gaQuery,
      gaStyleFactory, gaMapUtils) {
    var dragBox;
    var dragBoxStyle = gaStyleFactory.getStyle('selectrectangle');
    var boxFeature = new ol.Feature();
    var boxOverlay = gaMapUtils.getFeatureOverlay([boxFeature], dragBoxStyle);

    return {
      restrict: 'A',
      templateUrl: 'components/query/partials/query.html',
      controller: 'GaQueryDirectiveController',
      scope: {
        map: '=gaQueryMap',
        options: '=gaQueryOptions',
        isActive: '=gaQueryActive',
        isResultsActive: '=gaQueryResultsActive'
      },
      link: function(scope, element, attrs, controller) {

        // Init the map stuff
        if (!dragBox) {
          dragBox = new ol.interaction.DragBox({
            condition: function(evt) {
              // MacEnvironments don't get here because the event is not
              // recognized as mouseEvent on Mac by the google closure.
              // We have to use the apple key on those devices
              return evt.originalEvent.ctrlKey || evt.originalEvent.metaKey;
            },
            style: dragBoxStyle
          });
          scope.map.addInteraction(dragBox);
          dragBox.on('boxstart', function(evt) {
            scope.hideBox();
          });
          dragBox.on('boxend', function(evt) {
            boxFeature.setGeometry(evt.target.getGeometry());
            scope.showBox();
            scope.geometry = boxFeature.getGeometry();
            scope.useBbox = true;

            if (!scope.tooltipLayers.length) {
              scope.isResultsActive = true;
              scope.$applyAsync();
            } else {
              if (scope.isResultsActive && scope.queryType === 1 &&
                  scope.filters[0].value) {
                scope.searchByAttributes();
              } else {
                scope.searchByGeometry();
              }
              scope.isResultsActive = true;
            }
          });
        }
        scope.showBox = function() {
          boxOverlay.setMap(scope.map);
        };
        scope.hideBox = function() {
          boxOverlay.setMap(null);
        };
        var activate = function() {
          if (!$.datetimepicker) {
            $.getScript(gaQuery.dpUrl, function() {
              // On first activation we set the predefQueries as default.
              if (scope.queriesPredef.length > 0) {
                scope.queryPredef = scope.queriesPredef[0];
                scope.applyQueryPredef(scope.queryPredef);
                scope.$digest();
              }
            });
          }

          if (scope.queryType === 0) {
            scope.showBox();
            scope.useBbox = true;
          }

          // Re-launch the search in case the list of layers has changed
          scope.search();
        };
        var deactivate = function() {
          scope.hideBox();
        };

        // Display an input date or a text depending on the attribute
        scope.updateInputValue = function(idx, filter) {
          var input = element.find('.ga-inputs:eq(' + idx + ') input');
          var data = input.data('DateTimePicker');
          if (data) {
            data.destroy();
          }
          if (gaBrowserSniffer.msie <= 9 && filter.value) {
            // We manually set then trigger a change event to update correctly
            // the placeholder directive
            input.val(filter.value);
            input.change();
          }
          if (filter.attribute && filter.attribute.inputType === 'date') {
            input.datetimepicker({
              pickDate: true,
              pickTime: false,
              language: $translate.use()
            });
          }
        };

        scope.$watch('isResultsActive', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            if (newVal) {
              activate();
            } else {
              deactivate();
            }
          }
        });

        scope.$watch('isActive', function(newVal, oldVal) {
          dragBox.setActive(newVal);
        });

        scope.$watch('queryType', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            if (newVal === 0) {
              scope.showBox();
              scope.queryPredef = null;
              scope.applyQueryPredef(null);
              scope.useBbox = true;
            }
            scope.search();
          }
        });

        var currentYear;
        scope.$on('gaTimeChange', function(event, newYear) {
          if (newYear !== currentYear) {
            currentYear = newYear;
            if (scope.queryType === 0) {
              scope.search();
            }
          }
        });
      }
    };
  });
})();
