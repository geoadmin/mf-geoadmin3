goog.provide('ga_profilebt_directive');

goog.require('ga_geomutils_service');

(function() {

  var module = angular.module('ga_profilebt_directive', [
    'ga_geomutils_service'
  ]);

  module.directive('gaProfileBt', function($rootScope, gaGeomUtils) {
    return {
      restrict: 'A',
      templateUrl: 'components/profile/partials/profile-bt.html',
      scope: {
        feature: '=gaProfileBt'
      },
      link: function(scope, element, attrs) {

        scope.togglePopup = function(feature) {
          $rootScope.$broadcast('gaProfileActive', feature);
        };

        scope.isValid = function(feature) {
          var geom = feature.getGeometry();
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
          return !(geom instanceof ol.geom.Point ||
              geom instanceof ol.geom.MultiLineString ||
              geom instanceof ol.geom.MultiPolygon ||
              geom instanceof ol.geom.MultiPoint ||
              geom instanceof ol.geom.GeometryCollection);
        };
      }
    };
  });
})();
