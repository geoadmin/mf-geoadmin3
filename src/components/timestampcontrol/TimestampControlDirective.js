(function() {
  goog.provide('ga_timestamp_control_directive');

  var module = angular.module('ga_timestamp_control_directive', []);

  module.directive('gaTimestampControl', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaTimestampControlMap'
      },
      templateUrl: 'components/timestampcontrol/partials/timestampcontrol.html',
      link: function(scope) {
        scope.timestamp = '';
        $rootScope.$on('gaNewLayerTimestamp', function(e, timestamp) {
          scope.timestamp = timestamp;
        });
      }
    };
  });

})();
