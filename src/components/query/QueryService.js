(function() {
  goog.provide('ga_query_service');

  var module = angular.module('ga_query_service', []);

  module.provider('gaQuery', function() {

    // SQL Alchemy types
    var attrInfos = {
      NUMERIC: {
        inputType: 'number',
        operators: ['=', '!=', '>', '<', '<=', '>=']
      },
      STRING: {
        inputType: 'text',
        operators: ['ilike', 'not ilike']
      },
      BOOLEAN: {
        inputType: 'checkbox',
        operators: ['=']
      },
      TIME: {
        inputType: 'time',
        operators: ['=', '!=', '>', '<', '<=', '>=']
      },
      DATE: {
        inputType: 'date',
        operators: ['=', '!=', '>', '<', '<=', '>=']
      },
      DATETIME: {
        inputType: 'datetime-local',
        operators: ['=', '!=', '>', '<', '<=', '>=']
      }
    };

    // Others numeric types
    attrInfos.BIGINTEGER = attrInfos.SMALLINTEGER = attrInfos.INTEGER =
        attrInfos.BIGINT = attrInfos.SMALLINT = attrInfos.INT =
        attrInfos.DOUBLE = attrInfos['DOUBLE PRECISION'] =
        attrInfos.FLOAT = attrInfos.DECIMAL = attrInfos.INTERVAL =
        attrInfos.NUMERIC;

    // Others string types
    attrInfos.TEXT = attrInfos.UNICODE = attrInfos.UNICODETEXT =
        attrInfos.ENUM = attrInfos.STRING;

    // Others dates types
    attrInfos.TIMESTAMP = attrInfos['TIMESTAMP WITHOUT TIME ZONE'] =
        attrInfos.DATE;

    // Parse bbox string
    var parseBoxString = function(stringBox2D) {
      var extent = stringBox2D.replace('BOX(', '')
        .replace(')', '').replace(',', ' ')
        .split(' ');
      return $.map(extent, parseFloat);
    };

    // Get parameters for a featureidentify request
    var getParams = function(layers, extent) {
      var ids = [], timeenabled = [], timestamps = [];
      layers.forEach(function(l) {
        var ts = '';
        if (l.time && l.time.substr(0, 4) != '9999') {
          ts = l.time.substr(0, 4);
        }
        ids.push(l.bodId);
        timeenabled.push(l.timeEnabled);
        timestamps.push(ts);
      });
      return {
        type: 'featureidentify',
        features: ids.join(','),
        timeEnabled: timeenabled.join(','),
        timeStamps: timestamps.join(','),
        bbox: extent.join(',')
      };
    };

    // Create the placeholder and the title of the input
    var attrValuesToString = function(attr, limit) {
      var possibleValues = attr.values.join(', ');
      if (limit && possibleValues.length > limit) {
        return possibleValues.substring(0, limit).toLowerCase() + ' ...';
      }
      return possibleValues.toLowerCase() +
          ((attr.values.length >= 5) ? ' ...' : '');
    };


    this.$get = function($http, $log, $q, $translate, $window, gaDebounce,
        gaGlobalOptions) {
      var searchUrl = gaGlobalOptions.apiUrl +
          '/rest/services/all/SearchServer';
      var msUrl = gaGlobalOptions.apiUrl + '/rest/services/all/MapServer/';
      var moment;
      // List of predefined queries by layer
      if (!moment) {
        moment = $window.moment;
      }
      var twoWeeksAgo = moment().subtract(2, 'weeks').
          format('YYYY-MM-DD');
      var predefQueriesByLayer = {
        'ch.bazl.luftfahrthindernis': [{
          id: 'obstacle_started_last_2_weeks',
          filters: [{
            attrName: 'startofconstruction',
            operator: '>=',
            value: twoWeeksAgo
          }, {
            attrName: 'state',
            operator: 'ilike',
            value: 'A'
          }]
        }, {
          id: 'obstacle_deleted_last_2_weeks',
          filters: [{
            layer: null,
            attrName: 'abortionaccomplished',
            operator: '>=',
            value: twoWeeksAgo
          }]
        }]
      };

      function Query() {

        this.getPredefQueries = function(bodId) {
           return predefQueriesByLayer[bodId];
        };

        // Use ESRI layer service
        this.getLayerAttributes = function(scope, layer) {
          var deferred = $q.defer();
          $http.get(msUrl + layer.bodId, {
            params: {
              lang: $translate.use()
            },
            cache: true
          }).success(function(data) {
            // if the layer has already a list of attributes only update labels
            // we do this to avoid loosing reference in ng-repeat
            var attr = [];
            for (var i = 0, ii = data.fields.length; i < ii; i++) {
              var field = data.fields[i];
              var label = field.alias;
              if (layer.attributes) {
                layer.attributes[i].label = label;
                continue;
              }

              // Set STRING as default field type.
              var type = attrInfos[field.type] || attrInfos.STRING;

              attr.push({
                name: field.name,
                label: label,
                type: field.type,
                inputType: type.inputType,
                inputPlaceholder: attrValuesToString(field, 30),
                inputTitle: attrValuesToString(field),
                operators: type.operators,
                transformToLiteral: function(value) {
                  if (value && this.inputType != 'number' &&
                      this.inputType != 'checkbox') {
                    if (this.inputType == 'text') {
                      return '\'%' + value + '%\'';
                    }
                    return '\'' + value + '\'';
                  }
                  return value;
                }
              });
            }

            if (!layer.attributes) {
              layer.attributes = attr;
            }
            deferred.resolve(layer.attributes);
          }).error(function(data, status, headers, config) {
            $log.error('Request failed');
            $log.debug(config);
            deferred.reject(status);
          });
          return deferred.promise;
        };

        // Use ESRI dentify service
        this.getLayerIdentifyFeatures = function(scope, bodId, params) {
          var deferred = $q.defer();
          params = params || {};
          params.layers = 'all:' + bodId;
          $http.get(msUrl + 'identify', {
            params: params,
            cache: true
          }).success(function(data) {
            deferred.resolve(data.results);
          }).error(function(data, status, headers, config) {
            $log.error('Request failed');
            $log.debug(config);
            deferred.reject(status);
          });
          return deferred.promise;
        };

        // Use ESRI query service
        this.getLayerFeatures = function(scope, bodId, params) {
          var deferred = $q.defer();
          $http.get(msUrl + bodId + '/query', {
            params: params,
            cache: true
          }).success(function(data) {
            deferred.resolve(data.results);
          }).error(function(data, status, headers, config) {
            $log.error('Request failed');
            $log.debug(config);
            deferred.reject(status);
          });
          return deferred.promise;
        };

        // Use custom attribute service
        this.getAttributeValues = function(scope, bodId, attrName, params) {
          var deferred = $q.defer();
          $http.get(msUrl + bodId + '/attributes/' + attrName, {
            cache: true
          }).success(function(data) {
            deferred.resolve(data.values);
          }).error(function(data, status, headers, config) {
            $log.error('Request failed');
            $log.debug(config);
            deferred.reject(status);
          });
          return deferred.promise;
        };

        // Use featureidentify service
        var canceler;
        var bboxDebounced = gaDebounce.debounce(function(scope, layers,
            extent) {
          if (canceler) {
            canceler.resolve();
          }
          var deferred = $q.defer();
          canceler = $q.defer();
          $http.get(searchUrl, {
            params: getParams(layers, extent),
            timeout: canceler.promise,
            cache: true
          }).success(function(data) {

            for (var i = 0; i < data.results.length; i++) {
              var result = data.results[i];
              // The feature search using sphinxsearch uses quadindex
              // to filter results based on their bounding boxes. This is
              // in order to make the search extremely fast even for a large
              // number of features. The downside is that we will have false
              // positives in the results (features which are outside of
              // the searched box). Here, we filter out those false
              // positives based on the bounding box of the feature. Note
              // that we could refine this by using the exact geometry in
              // the future
              if (result.attrs && result.attrs.geom_st_box2d) {
                var bbox = parseBoxString(result.attrs.geom_st_box2d);
                if (!ol.extent.intersects(extent, bbox)) {
                  data.results.splice(i, 1);
                  i--;
                }
              }
            }
            deferred.resolve(data.results);
          }).error(function(data, status, headers, config) {
            $log.error('Request failed');
            $log.debug(config);
            deferred.reject(status);
          });
          return deferred.promise;
        }, 200, false, false);
        this.getLayersFeaturesByBbox = bboxDebounced;
      };
      var query = new Query();
      query.momentUrl = this.momentUrl;
      query.dpUrl = this.dpUrl;
      return query;
    };
  });
})();

