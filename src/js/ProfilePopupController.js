goog.provide('ga_profilepopup_controller');

(function() {

  var module = angular.module('ga_profilepopup_controller', []);

  module.controller('GaProfilePopupController', function($scope) {

    $scope.options = {
      title: 'draw_popup_title_measure',
      position: 'fixed'
    };

    $scope.$on('gaProfileActive', function(evt, feature, layer, callback) {
      $scope.toggle = !!(feature);
      $scope.options.isReduced = false;
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
  });
})();
