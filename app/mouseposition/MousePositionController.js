(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', []);

  module.controller('GaMousePositionController',
      ['$scope', function($scope) {

    var mapProjection = $scope.map.getView().getProjection();

    $scope.mousePositionProjections = [
      {value: 'EPSG:21781', label: 'CH1903 / LV03'},
      //{value: 'EPSG:2056', label: 'CH1903+ / LV95'},
      {value: 'EPSG:4326', label: 'WGS 84'}
    ];
    $scope.mousePositionProjection = $scope.mousePositionProjections[0].value;

    var transform = ol.proj.getTransform(mapProjection,
        ol.proj.get($scope.mousePositionProjection));

    $scope.$watch('mousePositionProjection', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        transform = ol.proj.getTransform(mapProjection, ol.proj.get(newVal));
      }
    });

    $scope.map.on(['mousemove', 'mouseout'], function(event) {
      // FIXME Here we call $apply on each mousemove, which does not sound
      // good at all. We should either throttle the updates, or make an
      // exception and directly update the DOM ourselves.
      $scope.$apply(function() {
        $scope.mousePositionValue = event.type === 'mouseout' ?
            undefined : transform(event.getCoordinate());
      });
    });

  }]);

})();
