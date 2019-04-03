goog.provide('ga_mapbox_style_color_picker_directive');

(function() {

  var module = angular.module('ga_mapbox_style_color_picker_directive', []);

  /**
   * This directive adds an interface where you can pick a color
   * (e.g. to modify a glStyle.)
   */
  module.directive('gaMapboxStyleColorPicker', function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      templateUrl: 'components/vectortile/edit/partials/color-picker.html',
      scope: {
        ngModel: '=',
        ngChange: '&'
      },
      link: function(scope, element, attrs) {

        var setCurrentValue = function(newValue) {
          if (!scope.currentValue) {
            var foundColor = false;
            for (var i = 0; i < scope.colors.length; i++) {
              var c = scope.colors[i];
              if (c.value === newValue) {
                foundColor = true
                break;
              }
            }
            if (!foundColor) {
              scope.currentValue = newValue;
            }
          }
        }

        scope.$watch('ngModel', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            setCurrentValue(newValue);
            scope.ngChange();
          }
        });

        scope.toHexString = function(c) {
          if (!/#/.test(c)) {
            return $window.tinycolor(c).toHexString();
          }
          return c;
        };

        var colorInput = $('<input type="color" value="!" />')[0];
        scope.useInputColorSelector = (colorInput.type === 'color' &&
            colorInput.value !== '!');

        scope.colors = [
          { value: 'lightgray', label: 'light_gray' },
          { value: '#acc864', label: 'light_green' },
          { value: '#3a8841', label: 'green' },
          { value: '#40b5bc', label: 'light_blue' },
          { value: '#0000ff', label: 'blue' },
          { value: '#ffff99', label: 'light_yellow' },
          { value: '#ffca00', label: 'yellow' },
          { value: '#f28500', label: 'orange' },
          { value: '#dc0f0f', label: 'red' },
          { value: '#80379c', label: 'purple' },
          { value: 'black', label: 'black' },
          { value: 'white', label: 'white' }
        ];
        setCurrentValue(scope.ngModel);
      }
    };
  });
})();
