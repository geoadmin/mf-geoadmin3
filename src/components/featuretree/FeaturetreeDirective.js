(function() {
  goog.provide('ga_featuretree_directive');

  var module = angular.module('ga_featuretree_directive', [
  ]);

  module.directive('gaFeaturetree',
      ['$timeout',
      function($timeout) {

        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/featuretree/partials/featuretree.html',
          scope: {
            options: '=gaFeaturetreeOptions',
            map: '=gaFeaturetreeMap'
          },
          link: function(scope, element, attrs) {
            var map = scope.map;
            var view = map.getView();
            scope.tree = {};

            var updateTree = function() {
              var extent = view.calculateExtent(map.getSize());

            };

            // Update the tree based on map changes. We use a timeout in
            // order to not trigger angular digest cycles and too many
            // updates. We don't use the permalink here because we want
            // to separate these concerns.
            var timeoutPromise = null;
            var triggerChange = function() {
              if (timeoutPromise !== null) {
                $timeout.cancel(timeoutPromise);
              }
              timeoutPromise = $timeout(function() {
                updateTree();
                timeoutPromise = null;
              }, 500);
            };

            view.on('change', triggerChange);
          }
        };

      }]
  );
})();

