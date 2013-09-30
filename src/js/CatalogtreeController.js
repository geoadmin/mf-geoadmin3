(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      function($scope, gaGlobalOptions) {
        
        $scope.options = {
          catalogUrlTemplate: gaGlobalOptions.baseUrlPath +
              '/rest/services/{Topic}/CatalogServer'
        };

      });

})();
