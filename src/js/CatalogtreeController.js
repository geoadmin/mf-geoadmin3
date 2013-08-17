(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', 'gaGlobalOptions', 
            function($scope, gaGlobalOptions) {
        
        $scope.options = {
          catalogUrlTemplate: gaGlobalOptions.serviceUrl +
              '/rest/services/{Topic}/CatalogServer'
        };

      }]);

})();
