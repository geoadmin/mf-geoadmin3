goog.provide('ga_import_directive');

(function() {

  var module = angular.module('ga_import_directive', []);

  module.directive('gaImport', function(gaBrowserSniffer) {

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import.html',
      link: function(scope) {
        scope.showLocal = !gaBrowserSniffer.msie || gaBrowserSniffer.msie > 9;
      }
    };
  });
})();

