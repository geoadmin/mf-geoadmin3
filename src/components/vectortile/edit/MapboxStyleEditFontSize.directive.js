goog.provide('ga_mapbox_style_edit_font_size_directive');

(function() {

  var module = angular.module('ga_mapbox_style_edit_font_size_directive', []);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleEditFontSize', function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      templateUrl: 'components/edit/partials/fontsize.html',
      scope: {
        ngModel: '=',
        ngChange: '&'
      },
      link: function(scope, elt, attrs) {
        scope.step = parseFloat(attrs['gaSizeStep']) || 5;
        scope.min = parseFloat(attrs['gaSizeMin']) || 0;
        scope.max = parseFloat(attrs['gaSizeMax']) || 50;

        if (scope.ngModel && scope.ngModel.stops) {
          scope.ngModel = scope.ngModel.stops[0][1];
        }

        var defaultValue = scope.ngModel || scope.min;

        scope.$watch('ngModel', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.ngChange();
          }
        });

        scope.toGoodValue = function(c) {
          c = parseFloat(c);
          if (c < scope.min) {
            c = scope.min;
          } else if (c > scope.max) {
            c = scope.max;
          }
          if (isNaN(c)) {
            c = defaultValue;
          }
          scope.ngModel = c;
          return scope.ngModel;
        };

        scope.plus = function() {
          if (scope.ngModel < scope.max) {
            scope.ngModel += scope.step;
          }
        };

        scope.minus = function() {
          if (scope.ngModel > scope.min) {
            scope.ngModel -= scope.step;
          }
        };
      }
    };
  });
})();
