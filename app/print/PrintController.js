(function() {
  goog.provide('ga-print-controller');

  var module = angular.module('ga-print-controller', []);

  module.controller('GaPrintController',
     ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;
    });

  }]);

})();
