(function() {
  goog.provide('ga_catalogtree_controller');

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController',
      ['$scope', 'gaGlobalOptions', 
            function($scope, gaGlobalOptions) {
        
        var urlBase = gaGlobalOptions.serviceUrl + '/rest/services/';
        $scope.options = {};
        $scope.options.getUrlForTopic = function (topic) {
          return urlBase + topic + '/CatalogServer?';
        };

      }]);

})();
