goog.provide('ga_query_vector_button_directive');

(function() {
  var module = angular.module('ga_query_vector_button_directive', []);

  module.directive('gaQueryVectorButton', function($rootScope, $translate) {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvectorbutton.html',
      replace: true,
      scope: {},
      link: function(scope) {
        scope.active = false;
        var toogleText = function() {
          scope.btnText = scope.active ?
            $translate.instant('inspect_bg_off') :
            $translate.instant('inspect_bg_on');
        };
        toogleText();
        scope.toggleInspect = function() {
          scope.active = !scope.active;
          toogleText();
          $rootScope.$broadcast('gaToggleInspectMode', scope.active);
        };
      }
    };
  });
})();
