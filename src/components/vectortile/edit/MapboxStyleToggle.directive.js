goog.provide('ga_mapbox_style_toggle_directive');

(function() {

  var module = angular.module('ga_mapbox_style_toggle_directive', []);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleToggle', function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      templateUrl: 'components/vectortile/edit/partials/edit-style-toggle.html',
      scope: {
        ngModel: '=',
        ngChange: '&',
        toggleOn: '=gaMapboxStyleToggleOn',
        toggleOff: '=gaMapboxStyleToggleOff',
        toggleOnLabel: '=gaMapboxStyleToggleOnLabel',
        toggleOffLabel: '=gaMapboxStyleToggleOffLabel'
      },
      link: function(scope, element, attrs) {
        scope.toggleOn = scope.toggleOn || true;
        scope.toggleOff = scope.toggleOff || false;
        scope.ngModel = scope.ngModel || false;

        scope.text = scope.ngModel === scope.toggleOn ?
          scope.toggleOnLabel :
          scope.toggleOffLabel;

        scope.$watch('ngModel', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.ngChange();
          }
        });

        scope.toggle = function() {
          var isToggleOn = scope.ngModel === scope.toggleOn;
          scope.ngModel = isToggleOn ?
            scope.toggleOff :
            scope.toggleOn;
          scope.text = isToggleOn ?
            scope.toggleOffLabel :
            scope.toggleOnLabel;
        };
      }
    };
  });
})();
