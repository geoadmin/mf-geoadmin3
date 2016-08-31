goog.provide('ga_profilebt_directive');

(function() {

  var module = angular.module('ga_profilebt_directive', []);

  module.directive('gaProfileBt', function($rootScope) {
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
