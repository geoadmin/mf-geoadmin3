(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
      ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;

      // default values:
      $scope.layout = data.layouts[0];
    });


    $scope.submit = function() {
      var spec = {
        layout: this.layout.name
      };
      var http = $http.post(this.capabilities.createURL, spec);
      http.success(function() {
        
      });
    };

  }]);

})();
