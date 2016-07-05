goog.provide('ga_drawstylepopup_controller');

(function() {

  var module = angular.module('ga_drawstylepopup_controller', []);

  module.controller('GaDrawStylePopupController', function($scope) {

    $scope.options = {
      title: 'style'
    };

    $scope.$on('gaDrawStyleActive', function(evt, feature, pixel, callback) {
      $scope.toggle = !!(feature);
      $scope.options.isReduced = false;
      if (pixel) {
        $scope.options.x = pixel[0];
        $scope.options.y = pixel[1];
      }
      if (callback) {
        // Remove the feature correctly (without digest cycle error)
        var unreg = $scope.$watch('toggle', function(newValue, oldValue) {
          if (oldValue && !newValue) { //The popup is closing
            callback(feature);
            unreg();
          }
        });
      }
    });

    $scope.$on('gaProfileActive', function(evt, feature) {
      if (feature) {
        $scope.toggle = false;
        $scope.options.isReduced = false;
      }
    });
  });
})();
