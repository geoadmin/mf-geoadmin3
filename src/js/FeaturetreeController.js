(function() {
  goog.provide('ga_featuretree_controller');

  var module = angular.module('ga_featuretree_controller', []);

  module.controller('GaFeaturetreeController',
      ['$scope', 'gaGlobalOptions',
      function($scope, gaGlobalOptions) {

        var baseUrl = gaGlobalOptions.serviceUrl + '/rest/services';

        $scope.options = {
          identifyUrlTemplate: baseUrl + '/{Topic}/MapServer/identify',
          active: false
        };

        $('#featuretree').on('show.bs.collapse', function() {
          $scope.$apply(function() {
            $scope.options.active = true;
          });
        });

        $('#featuretree').on('hide.bs.collapse', function() {
          $scope.$apply(function() {
            $scope.options.active = false;
          });
        });
      }
  ]);
})();
