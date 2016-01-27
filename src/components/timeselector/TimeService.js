goog.provide('ga_time_service');

goog.require('ga_permalink_service');

(function() {

  var module = angular.module('ga_time_service', [
    'ga_permalink_service'
  ]);

  /**
   * Time manager.
   * Manage the global time of the application.
   */
  module.provider('gaTime', function() {

    // Test if all visible and timeEnabled layers have the same time
    // property value.
    var hasLayersSameTime = function(olLayers) {
      if (olLayers.length == 0) {
        return false;
      }
      var year;
      for (var i = 0, ii = olLayers.length; i < ii; i++) {
        if (!olLayers[i].visible || !olLayers[i].timeEnabled ||
            !olLayers[i].time) {
          continue;
        }

        if (!year) {
          year = parseInt(olLayers[i].time.substr(0, 4));
        }

        if (year > new Date().getFullYear()) {
          return false;
        }

        if (year != parseInt(olLayers[i].time.substr(0, 4))) {
          return false;
        }
      }
      return year;
    };

    this.$get = function($rootScope, gaPermalink) {
      var propDeregKey = {};

      // Currently time is a number representing a year
      // When defined this value is apllied on all timeEnabled layers
      var time = parseFloat(gaPermalink.getParams().time);
      if (isNaN(time)) {
        time = undefined;
      }
      var Time = function() {

        // This property active the auto update status. The main goal of this
        // property is to deactivate the auto display of the timeslector, when
        // layers from permalink are not yet loaded.
        this.allowStatusUpdate = false;

        this.init = function(map) {
          var that = this;
          // Listen on layer's time property change
          map.getLayers().on('add', function(evt) {
            var olLayer = evt.element;
            if (!olLayer.preview && olLayer.timeEnabled) {
              ol.Observable.unByKey(propDeregKey[olLayer.id]);
              that.updateStatus(evt.target.getArray());
              propDeregKey[olLayer.id] = olLayer.on('propertychange',
                  function(evtProp) {
                if (evtProp.key == 'visible' || (evtProp.key == 'time' &&
                    angular.isDefined(evtProp.target.time) &&
                    parseInt(evtProp.target.time.substr(0, 4)) != time)) {
                  that.updateStatus(evt.target.getArray());
                }
              });
            }
          });
          map.getLayers().on('remove', function(evt) {
            var olLayer = evt.element;
            ol.Observable.unByKey(propDeregKey[olLayer.id]);
            if (!olLayer.preview && olLayer.timeEnabled) {
              that.updateStatus(evt.target.getArray());
            }
          });
        };

        this.updateStatus = function(olLayers) {
          if (this.allowStatusUpdate) {
            // When only one time enabled layer is displayed, we let the
            // permalink decide if we display the time selector or not, so we
            // deactivate the auto update.
            var count = 0;
            for (var i = 0, ii = olLayers.length; i < ii; i++) {
              if (olLayers[i].visible && olLayers[i].timeEnabled) {
                count++;
              }
            }
            if (count > 1) {
              // This function automatically set time value when all timeEnabled
              // layers have/don't have the same time property.
              var year = hasLayersSameTime(olLayers);
              this.set((year !== false) ? year : undefined);
            }
          }
        };

        this.get = function() {
          return time;
        };

        this.set = function(year) {
          if (year != time) {
            var oldTime = time;
            time = year;
            if (time === undefined) {
              gaPermalink.deleteParam('time');
            } else {
              gaPermalink.updateParams({time: time});
            }
            $rootScope.$broadcast('gaTimeChange', time, oldTime);
          }
        };
       };
       return new Time();
    };
  });
})();
