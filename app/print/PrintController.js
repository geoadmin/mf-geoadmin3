(function() {
  var printModule = angular.module('app.print');

  printModule.controller('PrintController', ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;
    });

  }]);

})();
