(function() {
  goog.provide('ga_query_directive');

  goog.require('ga_map_service');
  goog.require('ga_query_service');
  goog.require('ga_storage_service');

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
    $scope.queriesPredef = [];
    $scope.filters = [];

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
              time: getYear(filter.layer.time)
            }
          };
          list.push(paramsByLayer[filter.layer.bodId]);
        }
        var params = paramsByLayer[filter.layer.bodId].params;

        // Geometry condition
        if (geometry) {
          params.geometry = geojson.writeGeometry(geometry);
        }

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

    $scope.onChange = function() {
      $scope.queryPredef = null;
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
      $scope.search();
    };

    // Remove a filter
    $scope.remove = function(idx) {
      $scope.filters.splice(idx, 1);
      $scope.search();
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

    // Search by geometry using the search server
    /*$scope.searchByGeometry = function() {
      $scope.loading = true;
      $scope.queryType = 0;

      if ($scope.geometry) {
        var geom = $scope.geometry.getExtent();
        var features = [];
        gaQuery.getLayersFeaturesByBbox($scope,
            $scope.searchableLayers,
            geom
        ).then(function(layerFeatures) {
          features = features.concat(layerFeatures);
          $scope.options.features = features;
          $scope.loading = false;
        },function(reason) {
          $scope.options.features = [];
          $scope.loading = false;
        });
      } else {
        $scope.loading = false;
      }
    };*/

    // Search by geometry using feature identify servioce
    $scope.searchByGeometry = function() {
      $scope.loading = true;
      $scope.queryType = 0;

      if ($scope.geometry) {
        var imgDisplay = $scope.map.getSize().concat([96]).join(',');
        var mapExtent = $scope.map.getView().calculateExtent(
            $scope.map.getSize()).join(',');
        var geom = $scope.geometry.getExtent().join(',');
        var lang = $translate.use();
        var features = [];
        angular.forEach(
            $scope.searchableLayers,
            function(layer) {
              gaQuery.getLayerIdentifyFeatures(
                  $scope,
                  layer.bodId,
                  {
                    geometry: geom,
                    geometryType: 'esriGeometryEnvelope',
                    mapExtent: mapExtent,
                    imageDisplay: imgDisplay,
                    tolerance: 0,
                    geometryFormat: 'geojson',
                    lang: lang,
                    timeInstant: getYear(layer.time)
                  }
              ).then(function(layerFeatures) {
                features = features.concat(layerFeatures);
                $scope.options.features = features;
                $scope.loading = false;
              },function(reason) {
                $scope.options.features = [];
                $scope.loading = false;
              });
            }
        );

      } else {
        $scope.loading = false;
      }
    };

    // Search by attributes using feature identify service
    $scope.searchByAttributes = function() {
      $scope.queryType = 1;
      $scope.loading = true;

      var features = [];
      var params = getParamsByLayer($scope.filters);
      if (params.length == 0) {
        $scope.options.features = [];
        $scope.loading = false;
        return;
      }
      var lang = $translate.use();
      angular.forEach(
          params,
          function(paramsByLayer) {
            paramsByLayer.params.geometryFormat = 'geojson';
            paramsByLayer.params.lang = lang;
            paramsByLayer.params.timeInstant = getYear(paramsByLayer.time);

            gaQuery.getLayerIdentifyFeatures(
                $scope,
                paramsByLayer.bodId,
                paramsByLayer.params
            ).then(function(layerFeatures) {
              features = features.concat(layerFeatures);
              $scope.options.features = features;
              $scope.loading = false;
            },function(reason) {
              $scope.options.features = [];
              $scope.loading = false;
            });
          }
      );
    };

    // Search by geometry with layer query service
    /*$scope.searchByGeometry = function() {
      $scope.loading = true;
      $scope.queryType = 0;
      if ($scope.geometry) {
        var where = 'ST_DWithin(the_geom, ST_MakeEnvelope(' +
            $scope.geometry.getExtent().join(',') + ', 21781), 0)';
        var features = [];
        angular.forEach(
            $scope.searchableLayers,
            function(layer) {
              gaQuery.getLayerFeatures(
                  $scope,
                  layer.bodId,
                  {
                    where: where,
                    time: getYear(layer.time)
                    //,geom: geojson.writeGeometry($scope.geometry)
                  }
              ).then(function(layerFeatures) {
                features = features.concat(layerFeatures);
                $scope.options.features = features;
                $scope.loading = false;
              },function(reason) {
                $scope.options.features = [];
                $scope.loading = false;
              });
            }
        );
      } else {
        $scope.loading = false;
      }
    };*/

    // Search by attribute with layer query service
    /*$scope.searchByAttributes = function() {
      $scope.queryType = 1;
      $scope.loading = true;

      var features = [];
      var params = getParamsByLayer($scope.filters);
      if (params.length == 0) {
        $scope.options.features = [];
        $scope.loading = false;
        return;
      }
      angular.forEach(
          params,
          function(paramsByLayer) {
            gaQuery.getLayerFeatures(
                $scope,
                paramsByLayer.bodId,
                paramsByLayer.params
            ).then(function(layerFeatures) {
              features = features.concat(layerFeatures);
              $scope.options.features = features;
              $scope.loading = false;
            },function(reason) {
              $scope.options.features = [];
              $scope.loading = false;
            });
          }
      );
    };*/

    // Launch a search according to the active tab
    $scope.search = function() {
      if ($scope.queryType == 0) {
        $scope.searchByGeometry();
      } else {
        $scope.searchByAttributes();
      }
    };

    // Watcher/listener
    $scope.layers = $scope.map.getLayers().getArray();
    $scope.layerFilter = gaLayerFilters.selectByRectangle;
    $scope.$watchCollection('layers | filter:layerFilter', function(layers) {
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

      $scope.search();
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

    $scope.$on('gaLayersChange', function(evt, labelsOnly) {
      if (labelsOnly) {
        // We refresh the labels here because the layer's label is not updated
        // correctly when we use the filter in ng-options
        angular.forEach($scope.queriesPredef, function(query) {
          query.label = $translate.instant(query.id);
        });
      }
    });
  });

  module.directive('gaQuery', function($translate, gaBrowserSniffer,
      gaLayers, gaQuery, gaStyleFactory) {
    var parser = new ol.format.GeoJSON();
    var dragBox, boxOverlay;
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
            boxFeature.setGeometry(null);
          });
          dragBox.on('boxend', function(evt) {
            scope.isActive = true;
            boxFeature.setGeometry(evt.target.getGeometry());
            scope.geometry = boxFeature.getGeometry();
            if (scope.searchableLayers.length == 0) {
              scope.$apply();
            } else {
              scope.searchByGeometry();
            }
          });
        }

        // Activate/Deactivate
        var showBox = function() {
          boxOverlay.setMap(scope.map);
        };
        var hideBox = function() {
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
            showBox();
          }
        };
        var deactivate = function() {
          hideBox();
        };

        // Display an input date or a text depending on the attribute
        scope.updateInputValue = function(idx, filter) {
          var input = element.find('.ga-inputs:eq(' + idx + ') input');
          var data = input.data('DateTimePicker');
          if (data) {
            data.destroy();
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
              showBox();
              scope.queryPredef = null;
              scope.applyQueryPredef(null);
            } else {
              hideBox();
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

