(function() {
  goog.provide('ga_featuretree_controller');

  var module = angular.module('ga_featuretree_controller', [
  ]);

  module.controller('GaFeaturetreeController',
      ['$scope', 'gaGlobalOptions',
      function($scope, gaGlobalOptions) {

        $scope.options = {
          searchUrlTemplate: gaGlobalOptions.mapUrl + '/rest/services/{Topic}/SearchServer',
          htmlUrlTemplate: gaGlobalOptions.cachedMapUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup',
          active: false
        };

        $scope.$on('gaTriggerFeatureTreeActivation', function() {
          if (!$scope.globals.isFeatureTreeActive) {
            $scope.globals.isFeatureTreeActive = true;
          }
        });


        $scope.$watch('globals.isFeatureTreeActive', function(newval, oldval) {
          if (angular.isDefined(newval)) {
            $scope.options.active = newval;
          }
        });
      }
  ]);
})();
