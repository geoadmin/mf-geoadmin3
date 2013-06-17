(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
      ['$scope', '$http', function($scope, $http) {

    var http = $http.get('info.json');  // FIXME
    http.success(function(data, status, header, config) {
      $scope.capabilities = data;

      // default values:
      $scope.layout = data.layouts[0];
      $scope.dpi = data.dpis[0];

      $scope.scale = data.scales[0];  // FIXME
    });

    $scope.submit = function() {
      // http://mapfish.org/doc/print/protocol.html#print-pdf
      var view = this.map.getView();
      var proj = view.getProjection();
      var spec = {
        layout: this.layout.name,
        srs: proj.getCode(),
        units: proj.getUnits(),
        layers: [{
        }],
        pages: [{
          center: view.getCenter(),
          scale: this.scale.value,
          dpi: this.dpi.value
        }]
      };
      // var http = $http.post(this.capabilities.createURL, spec);
      // http.success(function() {
      // });
    };

  }]);

})();
