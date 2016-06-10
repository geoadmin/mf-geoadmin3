goog.provide('ga_timestamp_control_directive');

goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_timestamp_control_directive',
      ['ga_map_service']);

  module.directive('gaTimestampControl', function($rootScope, gaLayerFilters) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaTimestampControlMap'
      },
      templateUrl: 'components/timestampcontrol/partials/timestampcontrol.html',
      link: function(scope) {
        var time = '';
        scope.timestamp = time;
        $rootScope.$on('gaNewLayerTimestamp', function(e, timestamp) {
          scope.timestamp = timestamp;
          time = timestamp;
        });
        scope.layers = scope.map.getLayers().getArray();
        scope.selectedAndVisible = gaLayerFilters.selectedAndVisible;
        scope.realtime = gaLayerFilters.realtime;
        scope.$watchCollection(
            'layers | filter:selectedAndVisible | filter:realtime',
            function(layers) {
              if (layers.length > 0) {
                // Only one timestamp is displayed at a time.
                scope.timestamp = time;
              } else {
                time = scope.timestamp;
                scope.timestamp = '';
              }
        });
      }
    };
  });

})();
