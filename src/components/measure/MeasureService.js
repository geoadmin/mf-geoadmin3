goog.provide('ga_measure_service');

goog.require('ga_geomutils_service');
goog.require('ga_measure_filter');

(function() {

  var module = angular.module('ga_measure_service', [
    'ga_measure_filter',
    'ga_geomutils_service'
  ]);

  module.provider('gaMeasure', function() {
    this.$get = function($document, measureFilter, gaMapUtils, gaGeomUtils) {
      var Measure = function() {

        // Transform 2111333 in 2'111'333
        this.formatCoordinates = function(coordinates, prec) {
          var raw = ol.coordinate.toStringXY(coordinates, prec || 0);
          if (coordinates && coordinates.length === 3) {
            raw += ', ' + coordinates[2].toFixed(1);
          }

          return raw.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };

        this.getLength = function(geom) {
          var lineString;
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
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
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
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
          geom = gaGeomUtils.multiGeomToSingleGeom(geom);
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
        this.createOverlay = function(cssClass, stopEvent) {
          var tooltipElement = $document[0].createElement('div');
          tooltipElement.className = cssClass || 'ga-draw-measure-static';
          var tooltip = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -7],
            positioning: 'bottom-center',
            insertFirst: false,
            stopEvent: angular.isDefined(stopEvent) ?
              stopEvent : true // for copy/paste
          });
          return tooltip;
        };

        this.updateOverlays = function(layer, feature) {
          var overlays = feature.get('overlays');
          var isDrawing = feature.get('isDrawing');

          if (!overlays) {
            return;
          }
          var currIdx = 0, geomLine;
          var geom = geomLine = feature.getGeometry();

          if (geom instanceof ol.geom.Polygon) {
            var pos, coords = geom.getCoordinates()[0];
            geomLine = new ol.geom.LineString(coords);

            if (geom.getArea()) {
              pos = geom.getInteriorPoint().getCoordinates();
            }

            // When drawing we show the area tooltip only when the user closes
            // the polygon.
            if (isDrawing) {
              var first = coords[0];
              var last = coords[coords.length - 2];

              if (first[0] !== last[0] || first[1] !== last[1]) {
                pos = undefined;
              }

              // We use the polygon coordinates without the last one.
              geomLine.setCoordinates(coords.slice(0, -1));
            }

            // We create the overlay
            var areaOverlay = overlays.item(currIdx) || this.createOverlay();
            areaOverlay.getElement().innerHTML = this.getAreaLabel(geom);
            areaOverlay.getElement().style.opacity = layer.getOpacity();
            areaOverlay.setPosition(pos);

            if (!overlays.item(currIdx)) {
              overlays.push(areaOverlay);
            }
            currIdx++;
          }

          if (geomLine instanceof ol.geom.LineString) {
            var label = '',
              delta = 1,
              length = geomLine.getLength();
            if (this.canShowAzimuthCircle(geomLine)) {
              label += this.getAzimuthLabel(geomLine) + ' / ';
            }
            var distOverlay = overlays.item(currIdx) || this.createOverlay();
            label += this.getLengthLabel(geomLine);
            distOverlay.getElement().innerHTML = label;
            distOverlay.getElement().style.opacity = layer.getOpacity();

            if (length) {
              distOverlay.setPosition(geomLine.getLastCoordinate());
            } else {
              distOverlay.setPosition(undefined);
            }

            if (!overlays.item(currIdx)) {
              overlays.push(distOverlay);
            }

            currIdx++;

            // Add intermediate tootlip only on line.
            if (length > 200000) {
              delta = 100000 / length;
            } else if (length > 20000) {
              delta = 10000 / length;
            } else if (length !== 0) {
              delta = 1000 / length;
            }
            for (var i = delta; i < 1; i += delta, currIdx++) {
              var t = overlays.item(currIdx) ||
                  this.createOverlay('ga-draw-measure-tmp', false);
              t.getElement().innerHTML = measureFilter(length * i);
              t.getElement().style.opacity = layer.getOpacity();
              t.setPosition(geomLine.getCoordinateAt(i));

              if (!overlays.item(currIdx)) {
                overlays.push(t);
              }
            }
            if (currIdx < overlays.getLength()) {
              for (var j = overlays.getLength() - 1; j >= currIdx; j--) {
                overlays.pop();
              }
            }
          }
        };
        // Add overlays with distance, azimuth and area, depending on the
        // feature's geometry
        this.addOverlays = function(map, layer, feature) {
          var geom = feature.getGeometry();
          if (geom instanceof ol.geom.Polygon ||
              geom instanceof ol.geom.LineString) {
            var overlays = feature.get('overlays');
            if (!overlays) {
              overlays = new ol.Collection();
              overlays.on('add', function(evt) {
                map.addOverlay(evt.element);
              });
              overlays.on('remove', function(evt) {
                map.removeOverlay(evt.element);
              });
              feature.set('overlays', overlays);
              feature.on('change', function(evt) {
                // If overlays is undefined that means the feature has been
                // removed from the layer.
                if (evt.target.get('overlays')) {
                  this.updateOverlays(layer, evt.target);
                }
              }.bind(this));
            }
            this.updateOverlays(layer, feature);
          }
        };
        // Remove the overlays attached to the feature
        this.removeOverlays = function(feature) {
          var overlays = feature.get('overlays');
          if (overlays instanceof ol.Collection) {
            overlays.clear();
          }
        };

        // Determine if the geometry can display azimuth circle or not
        this.canShowAzimuthCircle = function(geom) {
          if (geom instanceof ol.geom.LineString) {
            var coords = geom.getCoordinates();
            if (coords.length === 2 ||
                (coords.length === 3 && coords[1][0] === coords[2][0] &&
                coords[1][1] === coords[2][1])) {
              return true;
            }
          }
          return false;
        };

        // Add/remove overlays attached to a layer
        this.toggleLayerOverlays = function(map, olLayer, visible) {
          var features = olLayer.getSource().getFeatures();
          for (var i = 0; i < features.length; i++) {
            if (gaMapUtils.isMeasureFeature(features[i])) {
              if (visible) {
                this.addOverlays(map, olLayer, features[i]);
              } else {
                this.removeOverlays(features[i]);
              }
            }
          }
        };

        // Register events on map, layer and source to manage correctly the
        // display of overlays
        this.registerOverlaysEvents = function(map, layer) {
          if (!(layer instanceof ol.layer.Vector)) {
            return;
          }

          map.getLayers().on('remove', function(evt) {
            if (evt.element === layer) {
              this.toggleLayerOverlays(map, evt.element, false);
            }
          }.bind(this));
          map.getLayers().on('add', function(evt) {
            if (evt.element === layer) {
              this.toggleLayerOverlays(map, evt.element, true);
            }
          }.bind(this));

          layer.getSource().on('removefeature', function(evt) {
            this.removeOverlays(evt.feature);
            evt.feature.set('overlays', undefined);
          }.bind(this));

          if (!layer.displayInLayerManager) {
            return;
          }

          layer.on('change:visible', function(evt) {
            this.toggleLayerOverlays(map, evt.target, evt.target.getVisible());
          }.bind(this));

          layer.on('change:opacity', function(evt) {
            evt.target.getSource().getFeatures().forEach(function(feat) {
              if (gaMapUtils.isMeasureFeature(feat)) {
                var overlays = feat.get('overlays');
                if (overlays) {
                  overlays.forEach(function(item) {
                    item.getElement().style.opacity = layer.getOpacity();
                  });
                }
              }
            });
          });
        };
      };
      return new Measure();
    };
  });
})();
