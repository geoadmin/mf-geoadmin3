goog.provide('ga_measure_service');

goog.require('ga_measure_filter');

(function() {

  var module = angular.module('ga_measure_service', [
    'ga_measure_filter'
  ]);

  module.provider('gaMeasure', function() {
    this.$get = function($document, measureFilter, gaMapUtils) {
      var Measure = function() {

        this.getLength = function(geom) {
          var lineString;
          if (geom instanceof ol.geom.LineString) {
            lineString = geom;
          } else if (geom instanceof ol.geom.LinearRing) {
            lineString = new ol.geom.LineString(geom.getCoordinates());
          } else if (geom instanceof ol.geom.Polygon) {
            lineString = new ol.geom.LineString(
                geom.getLinearRing(0).getCoordinates());
          } else if (geom instanceof ol.geom.Circle) {
            return 2 * Math.PI * geom.getRadius();
          }
          if (lineString) {
            return lineString.getLength();
          } else {
            return 0;
          }
        };

        this.getArea = function(geom, calculateLineStringArea) {
          if (calculateLineStringArea && geom instanceof ol.geom.LineString) {
            return Math.abs(new ol.geom.Polygon([geom.getCoordinates()]).
                getArea());
          } else if (geom instanceof ol.geom.LinearRing ||
              geom instanceof ol.geom.Polygon) {
            return Math.abs(geom.getArea());
          } else if (geom instanceof ol.geom.Circle) {
            return Math.PI * Math.pow(geom.getRadius(), 2);
          }
          return 0;
        };

        this.getAzimuth = function(geom) {
          if (!(geom instanceof ol.geom.Polygon) &&
              !(geom instanceof ol.geom.LineString) &&
              !(geom instanceof ol.geom.LinearRing)) {
            return 0;
          }
          var pt1, pt2, coords = geom.getCoordinates();
          if (geom instanceof ol.geom.Polygon) {
            coords = coords[0];
          }
          pt1 = coords[0];
          pt2 = coords[1];

          if (!pt1 || !pt2) {
            return 0;
          }
          var x = pt2[0] - pt1[0];
          var y = pt2[1] - pt1[1];
          var rad = Math.acos(y / Math.sqrt(x * x + y * y));
          var factor = x > 0 ? 1 : -1;
          return (360 + (factor * rad * 180 / Math.PI)) % 360;
        };

        this.getLengthLabel = function(geom) {
          return measureFilter(this.getLength(geom));
        };

        this.getAreaLabel = function(geom, calculateLineStringArea) {
          return measureFilter(this.getArea(geom, calculateLineStringArea),
              'area');
        };

        this.getAzimuthLabel = function(geom) {
          return measureFilter(this.getAzimuth(geom), 'angle');
        };

        // Creates a new measure tooltip with a nice arrow
        this.createOverlay = function() {
          var tooltipElement = $document[0].createElement('div');
          tooltipElement.className = 'ga-draw-measure-static';
          var tooltip = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -7],
            positioning: 'bottom-center',
            stopEvent: true // for copy/paste
          });
          return tooltip;
        };
        this.updateOverlays = function(feature) {
          var overlays = feature.get('overlays');
          if (overlays) {
            var geom = feature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
              var areaOverlay = overlays[0];
              areaOverlay.getElement().innerHTML = this.getAreaLabel(geom);
              areaOverlay.setPosition(geom.getInteriorPoint().getCoordinates());
              geom = new ol.geom.LineString(geom.getCoordinates()[0]);
            }
            if (geom instanceof ol.geom.LineString) {
              var label = '';
              if (this.canShowAzimuthCircle(feature.getGeometry())) {
                label += this.getAzimuthLabel(feature.getGeometry()) + ' / ';
              }
              var distOverlay = overlays[1] || overlays[0];
              label += this.getLengthLabel(geom);
              distOverlay.getElement().innerHTML = label;
              distOverlay.setPosition(geom.getLastCoordinate());
            }
          }
        };
        // Add overlays with distance, azimuth and area, depending on the
        // feature's geometry
        this.addOverlays = function(map, layer, feature) {
          var overlays = [], geom = feature.getGeometry();
          if (geom instanceof ol.geom.Polygon) {
            var areaOverlay = this.createOverlay();
            areaOverlay.getElement().style.opacity = layer.getOpacity();
            map.addOverlay(areaOverlay);
            overlays.push(areaOverlay);
            geom = new ol.geom.LineString(geom.getCoordinates()[0]);
          }
          if (geom instanceof ol.geom.LineString) {
            var distOverlay = this.createOverlay();
            distOverlay.getElement().style.opacity = layer.getOpacity();
            map.addOverlay(distOverlay);
            overlays.push(distOverlay);
          }
          if (overlays.length) {
            feature.set('overlays', overlays);
            this.updateOverlays(feature);
            feature.on('change', function(evt) {
              this.updateOverlays(evt.target);
            }, this);
          }
        };
        // Remove the overlays attached to the feature
        this.removeOverlays = function(feature) {
          var overlays = feature.get('overlays');
          while (overlays && overlays.length) {
            var overlay = overlays.pop();
            overlay.getMap().removeOverlay(overlay);
          }
          feature.set('overlays', undefined);
        };

        // Determine if the geometry can display azimuth circle or not
        this.canShowAzimuthCircle = function(geom) {
          if (geom instanceof ol.geom.LineString) {
            var coords = geom.getCoordinates();
            if (coords.length == 2 ||
                (coords.length == 3 && coords[1][0] == coords[2][0] &&
                coords[1][1] == coords[2][1])) {
              return true;
            }
          }
          return false;
        };

        // Register events on map, layer and source to manage correctly the
        // display of overlays
        this.registerOverlaysEvents = function(map, layer) {
          map.getLayers().on('remove', function(evt) {
            if (evt.element === layer) {
              var features = evt.element.getSource().getFeatures();
              for (var i = 0; i < features.length; i++) {
                this.removeOverlays(features[i]);
              }
            }
          }, this);
          layer.getSource().on('removefeature', function(evt) {
            this.removeOverlays(evt.feature);
          }, this);
          if (layer.displayInLayerManager) {
            layer.on('change:visible', function(evt) {
              var visible = evt.target.getVisible();
              var features = evt.target.getSource().getFeatures();
              for (var i = 0; i < features.length; i++) {
                if (gaMapUtils.isMeasureFeature(features[i])) {
                  if (visible) {
                    this.addOverlays(map, evt.target, features[i]);
                  } else {
                    this.removeOverlays(features[i]);
                  }
                }
              }
            }, this);
            layer.on('change:opacity', function(evt) {
              var visible = evt.target.getVisible();
              var features = evt.target.getSource().getFeatures();
              for (var i = 0; i < features.length; i++) {
                if (gaMapUtils.isMeasureFeature(features[i])) {
                  var overlays = features[i].get('overlays') || [];
                  for (var j = 0; j < overlays.length; j++) {
                    overlays[j].getElement().style.opacity = layer.getOpacity();
                  }
                }
              }
            });
          }
        };
      };
      return new Measure();
    };
  });
})();
