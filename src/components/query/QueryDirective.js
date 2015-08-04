goog.provide('ga_query_directive');

goog.require('ga_map_service');
goog.require('ga_query_service');
goog.require('ga_storage_service');
(function() {

  var module = angular.module('ga_query_directive', [
    'ga_map_service',
    'ga_query_service',
    'ga_storage_service'
  ]);

  module.controller('GaQueryDirectiveController', function($filter, $rootScope,
      $scope, $timeout, $translate, gaLayers, gaLayerFilters, gaQuery,
      gaMapUtils, gaStorage) {
    var geojson = new ol.format.GeoJSON();
    var stored;
    $scope.queryType = 1; // Filter attributes
    $scope.searchableLayers = [];
    $scope.selectByRectangleLayers = [];
    $scope.queriesPredef = [];
    $scope.filters = [];
    $scope.featuresByLayer = {};
    // return the year of the timestamp
    var getYear = function(time) {
      return (time && time.substr(0, 4) != '9999') ?
          time.substr(0, 4) : undefined;
    };

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
            params: {
              timeInstant: getYear(filter.layer.time)
            }
          };
          list.push(paramsByLayer[filter.layer.bodId]);
        }
        var params = paramsByLayer[filter.layer.bodId].params;
        // Where condition
        var where = (params.where) ? params.where + ' and ' : '';
        where += filter.attribute.name + ' ' + filter.operator + ' ' +
            filter.attribute.transformToLiteral(filter.value);
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
    var lastFilterAttr; // Use to refresh labels on language change
    $scope.onChangeLayer = function(idx, filter) {
      filter.attribute = null;
      filter.operator = null;
      filter.value = null;
      gaQuery.getLayerAttributes($scope, filter.layer).then(function() {
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
    $scope.toggleAttributeValues = function($event, idx,  filter) {
      var target = $($event.target);
      if (!filter.moreValues) {
        gaQuery.getAttributeValues(
            $scope,
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

    var getGeometryParams = function() {
      var imgDisplay = $scope.map.getSize().concat([96]).join(',');
      var mapExtent = $scope.map.getView().calculateExtent(
          $scope.map.getSize()).join(',');
      var geom = $scope.geometry.getExtent().join(',');
      return {
        geometry: geom,
        geometryType: 'esriGeometryEnvelope',
        mapExtent: mapExtent,
        imageDisplay: imgDisplay,
        tolerance: 5
      };
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

      if ($scope.selectByRectangleLayers.length == 0) {
        resetResults();
        return;
      }

      $scope.loading = true;
      if ($scope.geometry) {
        var common = angular.extend({
          lang: $translate.use(),
          geometryFormat: 'geojson',
          offset: offset
        }, getGeometryParams());

        var layersRequested = $scope.selectByRectangleLayers;
        if (layerBodId) {
          layersRequested = [
            gaMapUtils.getMapOverlayForBodId($scope.map, layerBodId)
          ];
        }
        angular.forEach(layersRequested, function(layer) {
          gaQuery.getLayerIdentifyFeatures(
              $scope,
              layer.bodId,
              angular.extend({
                timeInstant: getYear(layer.time)
              }, common)
          ).then(function(layerFeatures) {
            onSearchSuccess(layerFeatures, layer.bodId, offset);
          }, function(reason) {
            resetResults(reason, layer.bodId);
          });
        });
      } else {
        $scope.loading = false;
      }
    };

    // Search by attributes using feature identify service
    $scope.searchByAttributes = function(layerBodId, offset) {
      $scope.queryType = 1;
      $scope.loading = true;

      var params = getParamsByLayer($scope.filters);
      if (params.length == 0) {
        if ($scope.useBbox) {
          $scope.searchByGeometry();
        } else {
          resetResults();
        }
        return;
      }

      var common = {
        lang: $translate.use(),
        geometryFormat: 'geojson',
        offset: offset
      };

      if ($scope.useBbox) {
        // here $scope.geometry can't be null
        $scope.showBox();
        angular.extend(common, getGeometryParams());
      }

      angular.forEach(params, function(paramsByLayer) {
        if (layerBodId && layerBodId != paramsByLayer.bodId) {
          $scope.loading = false;
          return;
        }
        gaQuery.getLayerIdentifyFeatures(
            $scope,
            paramsByLayer.bodId,
            angular.extend(paramsByLayer.params, common)
        ).then(function(layerFeatures) {
          onSearchSuccess(layerFeatures, paramsByLayer.bodId, offset);
        }, function(reason) {
          resetResults(reason, paramsByLayer.bodId);
        });
      });
    };

    // Launch a search according to the active tab
    $scope.search = function(layerBodId, offset) {
      if ($scope.queryType == 0) {
        $scope.searchByGeometry(layerBodId, offset);
      } else {
        $scope.searchByAttributes(layerBodId, offset);
      }
    };


    // Watcher/listener
    $scope.layers = $scope.map.getLayers().getArray();
    $scope.selectByRectangleFilter = gaLayerFilters.selectByRectangle;
    $scope.$watchCollection('layers | filter:selectByRectangleFilter',
        function(layers) {
      $scope.selectByRectangleLayers = layers;
      if ($scope.isActive) {
        $scope.search();
      }
    });

    $scope.searchableFilter = gaLayerFilters.searchable;
    $scope.$watchCollection('layers | filter:searchableFilter',
        function(layers) {
      $scope.searchableLayers = layers;

      // Load new list of predefines queries and queryable attributes
      var predef = [];
      angular.forEach($scope.searchableLayers, function(layer) {
        var queries = gaQuery.getPredefQueries(layer.bodId);
        if (queries) {
          angular.forEach(queries, function(query, idx) {
            query.layer = layer;
            query.label = $translate.instant(query.id);
            angular.forEach(query.filters, function(filter, idx) {
              filter.layer = layer;
              gaQuery.getLayerAttributes($scope, filter.layer).then(function() {
                angular.forEach(filter.layer.attributes, function(attr) {
                  if (attr.name == filter.attrName) {
                    filter.attribute = attr;
                  }
                });
              });
            });

            // Apply a predefined query if exist
            if ($scope.queryPredef &&
                $scope.queryPredef.id == query.id &&
                $scope.queryPredef.layer == layer) {
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
            if (layer.id == $scope.filters[i].layer.id) {
              exist = true;
            }
          });
          if (!exist) {
            $scope.filters[i] = getEmptyFilter();
          }
        }
      }

      if ($scope.isActive) {
        $scope.search();
      }
    });

    $rootScope.$on('$translateChangeEnd', function(evt) {
      // Update attributes translations
      for (var i = 0; i < $scope.filters.length; i++) {
        var layer = $scope.filters[i].layer;
        if (layer) {
          gaQuery.getLayerAttributes($scope, layer);
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

  module.directive('gaQuery', function($translate, gaBrowserSniffer,
      gaLayers, gaQuery, gaStyleFactory) {
    var parser = new ol.format.GeoJSON();
    var dragBox;
    var dragBoxStyle = gaStyleFactory.getStyle('selectrectangle');
    var boxFeature = new ol.Feature();
    var boxOverlay = new ol.FeatureOverlay({
      style: dragBoxStyle
    });
    boxOverlay.addFeature(boxFeature);

    return {
      restrict: 'A',
      templateUrl: 'components/query/partials/query.html',
      controller: 'GaQueryDirectiveController',
      scope: {
        map: '=gaQueryMap',
        options: '=gaQueryOptions',
        isActive: '=gaQueryActive'
      },
      link: function(scope, element, attrs, controller) {

        // Init the map stuff
        if (!dragBox) {
          dragBox = new ol.interaction.DragBox({
            condition: function(evt) {
              //MacEnvironments don't get here because the event is not
              //recognized as mouseEvent on Mac by the google closure.
              //We have to use the apple key on those devices
              return evt.originalEvent.ctrlKey ||
                  (gaBrowserSniffer.mac && evt.originalEvent.metaKey);
            },
            style: dragBoxStyle
          });
          scope.map.addInteraction(dragBox);
          dragBox.on('boxstart', function(evt) {
            scope.resetGeometry();
          });
          dragBox.on('boxend', function(evt) {
            boxFeature.setGeometry(evt.target.getGeometry());
            scope.geometry = boxFeature.getGeometry();
            scope.useBbox = true;

            if (scope.selectByRectangleLayers.length == 0) {
              scope.isActive = true;
              scope.$apply();
            } else {
              if (scope.isActive && scope.queryType == 1 &&
                  scope.filters[0].value) {
                scope.searchByAttributes();
              } else {
                scope.searchByGeometry();
              }
              scope.isActive = true;
            }
          });
        }

        // Activate/Deactivate
        scope.resetGeometry = function() {
          boxFeature.setGeometry(null);
        };

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

          if (scope.queryType == 0) {
            scope.showBox();
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
          if (filter.attribute && filter.attribute.inputType == 'date') {
            input.datetimepicker({
              pickDate: true,
              pickTime: false,
              language: $translate.use()
            });
          }
        };

        var firstLoad = true;
        scope.$watch('isActive', function(newVal, oldVal) {
          if (newVal != oldVal) {
            if (newVal) {
              activate();
            } else {
              deactivate();
            }
          }
        });

        scope.$watch('queryType', function(newVal, oldVal) {
          if (newVal != oldVal) {
            if (newVal == 0) {
              scope.showBox();
              scope.queryPredef = null;
              scope.applyQueryPredef(null);
              scope.useBbox = true;
            }
            scope.search();
          }
        });

        var currentYear;
        scope.$on('gaTimeSelectorChange', function(event, newYear) {
          if (newYear !== currentYear) {
            currentYear = newYear;
            if (scope.queryType == 0) {
              scope.search();
            }
          }
        });
      }
    };
  });
})();

