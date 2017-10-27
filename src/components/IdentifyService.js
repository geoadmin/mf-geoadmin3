goog.provide('ga_identify_service');

(function() {

  var module = angular.module('ga_identify_service', []);
  /**
   * Service representing the identify features service.
   * http://api3.geo.admin.ch/services/sdiservices.html#identify-features
   *
   */
  module.provider('gaIdentify', function() {

    // Params:
    //   - imageDisplay
    //   - mapExtent
    var getMapParams = function(olMap, dpi) {
      var mapSize = olMap.getSize();
      return {
        imageDisplay: mapSize.concat([dpi]).toString(),
        mapExtent: olMap.getView().calculateExtent(mapSize).toString(),
        sr: olMap.getView().getProjection().getCode().split(':')[1]
      };
    };

    // Params:
    //   - layers
    //   - timeInstant
    var getLayersParams = function(olLayers, gaTime) {
      var bodIds = [];
      var timeInstant = [];
      olLayers.forEach(function(item) {
        if (item.bodId) {
          bodIds.push(item.bodId);
          var ti = '';
          if (item.timeEnabled) {
            ti = gaTime.get() || gaTime.getYearFromTimestamp(item.time);
          }
          timeInstant.push(ti);
        }
      });
      return {
        layers: 'all:' + bodIds.toString(),
        timeInstant: timeInstant.toString() || undefined
      };
    };

    // Params:
    //   - geometry
    //   - geometryType
    //   - geometryFormat
    var getGeometryParams = function(olGeometry) {
      var geometry;
      var geometryType;
      if (olGeometry instanceof ol.geom.Point) {
        geometry = olGeometry.getCoordinates().toString();
        geometryType = 'esriGeometryPoint';
      } else if (olGeometry) {
        geometry = olGeometry.getExtent().toString();
        geometryType = 'esriGeometryEnvelope';
      }
      // TODO: manage esriGeometryPolyline and esriGeometryPolygon
      return {
        geometry: geometry,
        geometryType: geometryType,
        geometryFormat: 'geojson'
      };
    };

    this.$get = function($http, $q, gaGlobalOptions, gaLang, gaTime) {
      var DPI = 96;
      var url = gaGlobalOptions.apiUrl +
          '/rest/services/all/MapServer/identify';
      var reject = function(msg) {
        var defer = $q.defer();
        defer.reject(msg);
        return defer.promise;
      };

      var Identify = function() {
        this.get = function(olMap, olLayers, olGeometry, tolerance,
            returnGeometry, timeout, limit, order, offset, where) {
          if (!olMap || !olLayers) {
            return reject('Missing required parameters');
          }
          var mapParams = getMapParams(olMap, DPI);
          var layersParams = getLayersParams(olLayers, gaTime);
          var geometryParams = getGeometryParams(olGeometry);
          var othersParams = {
            tolerance: tolerance || 0,
            returnGeometry: !!returnGeometry,
            lang: gaLang.get()
          };
          if (limit) {
            othersParams.limit = limit;
          }
          if (order) {
            othersParams.order = order;
          }
          if (offset) {
            othersParams.offset = offset;
          }
          if (where) {
            othersParams.where = where;
          }
          var params = angular.extend(mapParams, layersParams, geometryParams,
              othersParams);
          var timeo = timeout || {}; // could be an integer or a canceler
          return $http.get(url, {
            timeout: timeo.promise || timeo,
            params: params,
            cache: true
          });
        };
      };
      return new Identify();
    };
  });
})();
