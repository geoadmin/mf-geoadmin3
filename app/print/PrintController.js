(function() {
  var printModule = angular.module('ga-print');

  printModule.controller('GaPrintController', ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;
    });

  }]);

})();
