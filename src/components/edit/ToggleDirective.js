goog.provide('ga_toggle_directive');

(function() {

  var module = angular.module('ga_toggle_directive', []);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaToggle', function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      templateUrl: 'components/edit/partials/toggle.html',
      scope: {
        ngModel: '=',
        ngChange: '&',
        gaToggleOn: '=',
        gaToggleOff: '='
      },
      link: function(scope, element, attrs) {
        scope.gaToggleOn = scope.gaToggleOn || true;
        scope.gaToggleOff = scope.gaToggleOff || false;

        scope.$watch('ngModel', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.ngChange();
          }
        });

        scope.onClick = function() {
          scope.ngModel = (scope.ngModel === scope.gaToggleOn) ?
            scope.gaToggleOff :
            scope.gaToggleOn;
        }
      }
    };
  });
})();
