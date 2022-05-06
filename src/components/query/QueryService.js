goog.provide('ga_query_service');
(function() {

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

    // Create the placeholder and the title of the input
    var attrValuesToString = function(attr, limit) {
      var possibleValues = attr.values.join(', ');
      if (limit && possibleValues.length > limit) {
        return possibleValues.substring(0, limit).toLowerCase() + ' ...';
      }
      return possibleValues.toLowerCase() +
          ((attr.values.length >= 5) ? ' ...' : '');
    };

    this.$get = function($http, $log, $q, gaLang, $window,
        gaGlobalOptions) {
      var msUrl = gaGlobalOptions.apiUrl + '/rest/services/all/MapServer/';

      // List of predefined queries by layer
      var predefQueriesByLayer = {
        'ch.astra.unfaelle-personenschaeden_alle': [{
          id: 'astra_alle_lastyear_casualties',
          filters: [{
            attrName: 'accidentyear',
            operator: '=',
            value: '2015'
          }, {
            attrName: 'severitycategorycode',
            operator: 'ilike',
            value: 'UGT'
          }]
        }]
      };

      function Query() {

        this.getPredefQueries = function(bodId) {
          return predefQueriesByLayer[bodId];
        };

        // Use ESRI layer service
        this.getLayerAttributes = function(bodId) {
          var deferred = $q.defer();
          $http.get(msUrl + bodId, {
            params: {
              lang: gaLang.get()
            },
            cache: true
          }).then(function(response) {
            var data = response.data;
            // if the layer has already a list of attributes only update labels
            // we do this to avoid loosing reference in ng-repeat
            var attr = [];
            for (var i = 0, ii = data.fields.length; i < ii; i++) {
              var field = data.fields[i];

              // Set STRING as default field type.
              var type = attrInfos[field.type] || attrInfos.STRING;

              // Transform null value to 'null' string
              if (field.values && field.values[0] === null) {
                field.values[0] = 'null';
              }

              attr.push({
                name: field.name,
                label: field.alias,
                type: field.type,
                inputType: type.inputType,
                inputPlaceholder: attrValuesToString(field, 30),
                inputTitle: attrValuesToString(field),
                operators: type.operators,
                transformToLiteral: function(value) {
                  if (angular.isDefined(value) && this.inputType !== 'number' &&
                      this.inputType !== 'checkbox') {
                    if (this.inputType === 'text') {
                      return '\'%' + value + '%\'';
                    }
                    return '\'' + value + '\'';
                  }
                  return value;
                }
              });
            }
            deferred.resolve(attr);
          }, function(response) {
            $log.error('Request failed');
            $log.debug(response.config);
            deferred.reject(response.status);
          });
          return deferred.promise;
        };

        // Use custom attribute service
        this.getAttributeValues = function(bodId, attrName) {
          var deferred = $q.defer();
          $http.get(msUrl + bodId + '/attributes/' + attrName, {
            cache: true
          }).then(function(response) {
            var data = response.data;
            // Transform null value to 'null' string
            if (data.values && data.values[0] === null) {
              data.values[0] = 'null';
            }

            deferred.resolve(data.values);
          }, function(response) {
            $log.error('Request failed');
            $log.debug(response.config);
            deferred.reject(response.status);
          });
          return deferred.promise;
        };

      };
      var query = new Query();
      query.dpUrl = this.dpUrl; // DatePicker lib
      return query;
    };
  });
})();
