goog.provide('ga_mapclick_service');

goog.require('ga_event_service');

(function() {

  var module = angular.module('ga_mapclick_service', [
    'ga_event_service'
  ]);

  /**
   * This service is to be used to register a "click" listener
   * on a OpenLayer map.
   *
   * Notes:
   * - all desktop browsers except IE>=10, we add an ol3
   *   "singleclick" event on the map.
   * - IE>=10 on desktop and  browsers on touch devices, we simulate the
   *   "click" behavior to avoid conflict with long touch event.
   */
  module.provider('gaMapClick', function() {
    this.$get = function(gaEvent) {
      return {
        listen: function(map, onClick) {
          var touchstartTime = 0;
          var callback = function(evt) {
            // if a draw or a select interaction is active, do
            // nothing.
            var cancel = false;
            var arr = map.getInteractions().getArray();
            arr.slice().reverse().forEach(function(item) {
              if (!cancel && (item instanceof ol.interaction.Select ||
                  item instanceof ol.interaction.Draw) && item.getActive()) {
                cancel = true;
              }
            });
            if (!cancel) {
              onClick(evt);
            }
          };

          var deregKeys = [
            map.on('singleclick', function(evt) {
              if (gaEvent.isMouse(evt) ||
                  ((new Date()).getTime() - touchstartTime < 400)) {
                callback(evt);
              }
            }),
            map.on('pointerdown', function(evt) {
              if (gaEvent.isMouse(evt)) {
                return;
              }
              touchstartTime = (new Date()).getTime();
            })
          ];

          return function() {
            ol.Observable.unByKey(deregKeys);
          };
        }
      };
    };
  });
})();
