goog.provide('ga_mapbox_toggle_directive');

(function() {

  var module = angular.module('ga_mapbox_toggle_directive', []);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleToggle', function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      templateUrl: 'components/vectortile/edit/partials/toggle.html',
      scope: {
        ngModel: '=',
        ngChange: '&',
        gaToggleOn: '=',
        gaToggleOff: '=',
        gaToggleOnLabel: '=',
        gaToggleOffLabel: '='
      },
      link: function(scope, element, attrs) {
        scope.gaToggleOn = scope.gaToggleOn || true;
        scope.gaToggleOff = scope.gaToggleOff || false;
        scope.ngModel = scope.ngModel || false;

        scope.text = scope.ngModel === scope.gaToggleOn ?
          scope.gaToggleOnLabel :
          scope.gaToggleOffLabel;

        scope.$watch('ngModel', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.ngChange();
          }
        });

        scope.toggle = function() {
          var isToggleOn = scope.ngModel === scope.gaToggleOn;
          scope.ngModel = isToggleOn ?
            scope.gaToggleOff :
            scope.gaToggleOn;
          scope.text = isToggleOn ?
            scope.gaToggleOffLabel :
            scope.gaToggleOnLabel;
        };
      }
    };
  });
})();
