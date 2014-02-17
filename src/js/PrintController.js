(function() {
  goog.provide('ga_print_controller');

  var module = angular.module('ga_print_controller', []);

  module.controller('GaPrintController',
    function($scope, gaGlobalOptions) {
      $scope.options = {
        printPath:  gaGlobalOptions.baseUrlPath + '/print',
        baseUrlPath:  gaGlobalOptions.baseUrlPath,
        serviceUrl: gaGlobalOptions.serviceUrl,
        crossUrl: location.origin + location.pathname +
            gaGlobalOptions.version + 'img/cross.png',
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
