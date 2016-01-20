goog.provide('ga_tilt3d_directive');

(function() {

  var module = angular.module('ga_tilt3d_directive', []);

  module.directive('gaTilt3d', function(gaBrowserSniffer) {
    return {
      restrict: 'A',
      templateUrl: 'components/tilt3d/partials/tilt3d.html',
      link: function(scope, element, attrs) {

        scope.supported = gaBrowserSniffer.webgl;

        // true is the selected background layer is not 3d compatible.
        scope.disabled = false;
        var unregBgChange = scope.$on('gaBgChange', function(evt, value) {
          scope.disabled = !!value.disable3d;
        });

        // if cesium initialisation failed, is3dActive becomes undefined
        scope.$watch('globals.is3dActive', function(val) {
          if (!angular.isDefined(val)) {
            scope.supported = false;
            unregBgChange();
          } else {
            element.toggleClass('ga-active', val);
          }
        });

        scope.tilt = function() {
          if (scope.supported) {
            if (!scope.disabled) {
              scope.globals.is3dActive = !scope.globals.is3dActive;
            } else {
              // FIXME: error message "selected background not compatible"
            }
          } else {
            // FIXME: error message "browser not supported"
          }
        };
      }
    };
  });
})();
