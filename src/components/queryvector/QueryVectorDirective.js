goog.provide('ga_query_vector_directive');

(function() {
  var module = angular.module('ga_query_vector_directive', []);

  module.directive('gaQueryVector', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvector.html',
      replace: true,
      scope: {
        map: '=gaQueryVectorMap',
        options: '=gaQueryVectorOptions'
      },
      link: function(scope, element, attrs) {
        console.log(scope);
      }
    }
  });
})();