goog.provide('ga_map_geolocation');



/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.control.DefaultsOptions=} opt_options Defaults options.
 */
ga_map_geolocation = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};
  var element;
  var self = this;

  if (ol.Geolocation.SUPPORTED) {
    element = goog.dom.createDom(goog.dom.TagName.A, {
      'class': 'geolocation',
      'href': '#geolocation'
    });

    goog.events.listen(element, [
      goog.events.EventType.CLICK,
      goog.events.EventType.TOUCHEND
    ], function(e) {
      e.preventDefault();
      var map = self.map_;
      var view = map.getView().getView2D();
      var dest = self.geolocation.getPosition();

      var source = view.getCenter();
      var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
          Math.pow(source[1] - dest[1], 2));
      var duration = Math.sqrt(500 + dist / view.getResolution() * 1000);
      var start = +new Date();
      var pan = ol.animation.pan({
                  duration: duration,
                  source: source,
                  start: start
      });
      var bounce = ol.animation.bounce({
        duration: duration,
        resolution: Math.max(view.getResolution(), dist / 1000),
        start: start
      });
      map.addPreRenderFunctions([pan, bounce]);
      view.setCenter(dest);
    });
  }
  goog.base(this, {
    element: element,
    map: options.map
  });
};
goog.inherits(ga_map_geolocation, ol.control.Control);


/** 
 * Overload setMap to use the view projection
 * @param {ol.Map} map Map.
 */
ga_map_geolocation.prototype.setMap = function(map) { 
    ol.control.Control.prototype.setMap.call(this, map);
    if (map) {
        this.geolocation = new ol.Geolocation({
          tracking: true
        });
        this.geolocation.bindTo('projection', map.getView());
    }
};
