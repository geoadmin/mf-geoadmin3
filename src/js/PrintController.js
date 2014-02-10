(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
    function($scope, gaGlobalOptions) {
      $scope.options = {
        printPath:  gaGlobalOptions.mapUrl + '/print',
        mapUrl:  gaGlobalOptions.mapUrl,
        apiUrl: gaGlobalOptions.apiUrl,
        heightMargin: $('#header').height(),
        widthMargin: $('#pulldown').width()
      };
      $('#print').on('show.bs.collapse', function() {
        $scope.$apply(function() {
          $scope.options.active = true;
        });
      });

      $('#print').on('hide.bs.collapse', function() {
        $scope.$apply(function() {
          $scope.options.active = false;
        });
      });
  });
})();
