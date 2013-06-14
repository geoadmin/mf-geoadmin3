(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
     ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;
    });

  }]);

})();
