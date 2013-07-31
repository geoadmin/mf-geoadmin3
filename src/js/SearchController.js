(function() {
  goog.provide('ga_search_controller');

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      ['$scope', 'gaGlobalOptions',
        function($scope, gaGlobalOptions) {

         $scope.options = {
           serviceUrl: gaGlobalOptions.serviceUrl + '/rest/services/' +
           'geoadmin/SearchServer?searchText=%QUERY' //FIXME topic
         };

       }]);

})();
