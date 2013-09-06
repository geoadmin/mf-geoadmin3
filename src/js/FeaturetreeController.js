(function() {
  goog.provide('ga_featuretree_controller');

  goog.require('ga_permalink_service');

  // FIXME: permalinkg service is only used for testing
  var module = angular.module('ga_featuretree_controller', [
    'ga_permalink_service'
  ]);

  module.controller('GaFeaturetreeController',
      ['$scope', 'gaGlobalOptions', 'gaPermalink',
      function($scope, gaGlobalOptions, gaPermalink) {
        var fs = 'sphinx',
            params = gaPermalink.getParams();
        if (params && params['fs']) {
          fs = params['fs'];
        }

        var baseUrl = gaGlobalOptions.serviceUrl + '/rest/services';

        $scope.options = {
          // Taps database
          identifyUrlTemplate: baseUrl + '/{Topic}/MapServer/identify',
          // Taps sphinx searhc
          searchUrlTemplate: baseUrl + '/{Topic}/SearchServer',
          // choose the search you want to use (only one possible right now...)
          // FIXME: Could make that configurable through permalink parameter
          featureSearch: fs, //'sphinx' or 'db'
          htmlUrlTemplate: baseUrl + '/{Topic}/MapServer/{Layer}/{Feature}/htmlpopup',
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
