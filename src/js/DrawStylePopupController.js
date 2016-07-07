goog.provide('ga_drawstylepopup_controller');

(function() {

  var module = angular.module('ga_drawstylepopup_controller', []);

  module.controller('GaDrawStylePopupController', function($scope) {
    var lastFeature, deregister = [];
    $scope.options = {
      title: 'draw_popup_title_feature'
    };

    var off = function() {
      deregister.forEach(function(item) {
        if (angular.isFunction(item)) {
          item();
        } else {
          ol.Observable.unByKey(item);
        }
      });
      deregister = [];
    };

    $scope.$on('gaDrawStyleActive', function(evt, feature, layer, pixel,
        onClose) {
      $scope.toggle = !!(feature);
      // If the selected feature has changed, we force the popup to unreduce
      if (lastFeature != feature) {
        $scope.options.isReduced = false;
      }
      lastFeature = feature;
      if (pixel) {
        $scope.options.x = pixel[0];
        $scope.options.y = pixel[1];
      }
      if (onClose) {
        off();
        // Unselect the feature correctly (without digest cycle error)
        deregister.push($scope.$watch('toggle', function(newValue, oldValue) {
          if (oldValue && !newValue) { //The popup is closing
            onClose(feature);
            off();
          }
        }));
      }
    });

    $scope.$on('destroy', function() {
      off();
    });

    $scope.$on('gaProfileActive', function(evt, feature) {
      if (feature) {
        $scope.toggle = false;
        $scope.options.isReduced = false;
      }
    });
  });
})();
