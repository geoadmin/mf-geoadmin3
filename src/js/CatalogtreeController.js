(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      function($scope, gaGlobalOptions) {
        
        $scope.options = {
          catalogUrlTemplate: gaGlobalOptions.cachedApiUrl +
            '/rest/services/{Topic}/CatalogServer'
        };

        $('#catalog').on('show.bs.collapse', function() {
          $scope.globals.catalogShown = true;
        });

        $('#catalog').on('hide.bs.collapse', function() {
          $scope.globals.catalogShown = false;
        });



      });

})();
