goog.provide('ga_sharecopyinputgroup_directive');

(function() {

  var module = angular.module('ga_sharecopyinputgroup_directive', []);

  /**
   * This directive allows to execute a function just before the content of
   * ga-share-copy-input was copied and give to the ga-share-copy-bt the
   * reference to the input to copy.
   */
  module.directive('gaShareCopyInputGroup', function() {
    return {
      restrict: 'A',
      scope: {
        onBeforeCopy: '&gaShareOnBeforeCopy'
      },
      controller: function($scope) {

        this.onBeforeCopy = function(a) {
          if ($scope.onBeforeCopy) {
            return $scope.onBeforeCopy({input: $scope.inputToCopy});
          }
        };

        this.getInputToCopy = function() {
          return $scope.inputToCopy;
        };
      },
      link: function(scope, element) {
        scope.inputToCopy = element.find('[ga-share-copy-input]');
      }
    };
  });
})();
