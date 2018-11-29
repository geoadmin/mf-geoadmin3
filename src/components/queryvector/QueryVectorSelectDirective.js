goog.provide('ga_query_vector_select_directive');

(function() {
  var module = angular.module('ga_query_vector_select_directive', []);

  module.directive('gaQueryVectorSelect', function($rootScope) {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvectorselect.html',
      replace: true,
      transclude: true,
      scope: {
        isEditActive: '=gaQueryVectorSelectIsEditActive'
      },
      link: function(scope) {
        scope.options = [
          { value: false, label: 'hidden' },
          { value: true, label: 'displayed' }
        ];
        var deactivate = function() {
          scope.selected = scope.options[0];
        };
        deactivate();

        scope.$watch('selected', function(newVal) {
          $rootScope.$broadcast('gaToggleInspectMode', newVal.value);
        });
        scope.$watch('isEditActive', function(newVal) {
          if (scope.selected.value && !newVal) {
            deactivate();
          }
        });
        scope.$on('gaBgChange', function(evt, bg) {
          if (bg.disableEdit) {
            deactivate();
          }
        });
      }
    };
  });
})();
