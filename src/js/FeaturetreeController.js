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

        $('#featuretree').on('show', function() {
          //console.log('This is never called!');
          $scope.options.active = true;
        });

        $('#featuretree').on('hide', function() {
          //console.log('This is never called!');
          $scope.options.active = true;
        });
        /*
        $('#featuretree-link').on('click', function() {
          //console.log('This is called');
        });
        */
      }
  ]);
})();
