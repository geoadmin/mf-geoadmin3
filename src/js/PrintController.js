(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
      ['$scope', 'gaGlobalOptions',
       function($scope, gaGlobalOptions) {
         $scope.options = {
           printPath:  gaGlobalOptions.baseUrlPath + '/print',
           baseUrlPath:  gaGlobalOptions.baseUrlPath,
           serviceUrl: gaGlobalOptions.serviceUrl
         };
  }]);
})();
