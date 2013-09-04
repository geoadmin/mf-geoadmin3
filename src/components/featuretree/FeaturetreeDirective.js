(function() {
  goog.provide('ga_featuretree_directive');

  var module = angular.module('ga_featuretree_directive', [
  ]);

  module.directive('gaFeaturetree',
      [
      function() {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            options: '=gaFeaturetreeOptions',
            map: '=gaFeaturetreeMap'
          },
          link: function(scope, element, attrs) {
          }
        };

      }]
  );
})();

