goog.provide('ga_query_vector_select_directive');

(function() {
  var module = angular.module('ga_query_vector_select_directive', []);

  module.directive('gaQueryVectorSelect', function($rootScope) {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvectorselect.html',
      replace: true,
      scope: { disabled: '=gaQueryVectorSelectDisabled' },
      link: function(scope) {
        scope.options = [
          { value: false, label: 'hide' },
          { value: true, label: 'show' }
        ];
        scope.selected = scope.options[0];
        scope.$watch('selected', function(newVal) {
          $rootScope.$broadcast('gaToggleInspectMode', newVal.value);
        });
        scope.$on('gaBgChange', function(evt, bg) {
          if (bg.disableEdit) {
            scope.selected = scope.options[0];
          }
        });
      }
    };
  });
})();
