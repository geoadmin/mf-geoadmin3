goog.provide('ga_map_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_debounce_service');
goog.require('ga_offline_service');
goog.require('ga_permalink');
goog.require('ga_styles_service');
(function() {

  var module = angular.module('ga_map_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_offline_service',
    'ga_permalink',
    'ga_styles_service'
  ]);

  module.directive('gaCesiumInspector', function(gaPermalink) {
    return {
      restrict: 'A',
      scope: {
        ol3d: '=gaCesiumInspectorOl3d'
      },
      link: function(scope, element, attrs) {
        if (!angular.isDefined(gaPermalink.getParams().debug)) {
          element[0].style['display'] = 'none';
          return;
        }
        var inspector;
        scope.$watch('::ol3d', function(ol3d) {
          if (ol3d && !inspector) {
            var scene = ol3d.getCesiumScene();
            inspector = new Cesium.CesiumInspector(element[0], scene);
            scene.postRender.addEventListener(function() {
              inspector.viewModel.update();
            });
          }
        });
      }
    };
  });

  module.directive('gaMap', function($window, $timeout, gaPermalink,
      gaStyleFactory, gaBrowserSniffer, gaLayers, gaDebounce, gaOffline,
      gaMapUtils) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaMapMap',
        ol3d: '=gaMapOl3d'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        var view = map.getView();

        // set view states based on URL query string
        var queryParams = gaPermalink.getParams();
        if (queryParams.Y !== undefined && queryParams.X !== undefined) {
          var easting = parseFloat(queryParams.Y.replace(/,/g, '.'));
          var northing = parseFloat(queryParams.X.replace(/,/g, '.'));
          if (isFinite(easting) && isFinite(northing)) {
            var position = [easting, northing];
            if (ol.extent.containsCoordinate(
                [2420000, 1030000, 2900000, 1350000], position)) {
              position = ol.proj.transform([easting, northing],
                'EPSG:2056', 'EPSG:21781');
            }
            view.setCenter(position);
          }
        }
        if (queryParams.zoom !== undefined && isFinite(queryParams.zoom)) {
          view.setZoom(+queryParams.zoom);
        }

        if (queryParams.crosshair !== undefined) {
          var crosshair = new ol.Feature({
            label: 'link_bowl_crosshair',
            geometry: new ol.geom.Point(view.getCenter())
          });
          var style = gaStyleFactory.getStyle(queryParams.crosshair);
          if (!style) {
            style = gaStyleFactory.getStyle('marker');
          }
          map.addLayer(gaMapUtils.getFeatureOverlay([crosshair], style));
          var unregister = view.on('propertychange', function() {
            gaPermalink.deleteParam('crosshair');
            ol.Observable.unByKey(unregister);
          });
        }

        // Update permalink based on view states.
        var updatePermalink = function() {
          // only update the permalink in 2d mode
          if (!scope.ol3d || !scope.ol3d.getEnabled()) {
            // remove 3d params
            gaPermalink.deleteParam('lon');
            gaPermalink.deleteParam('lat');
            gaPermalink.deleteParam('elevation');
            gaPermalink.deleteParam('heading');
            gaPermalink.deleteParam('pitch');
            var center = view.getCenter();
            var zoom = view.getZoom();
            // when the directive is instantiated the view may not
            // be defined yet.
            if (center && zoom !== undefined) {
              var x = center[1].toFixed(2);
              var y = center[0].toFixed(2);
              gaPermalink.updateParams({X: x, Y: y, zoom: zoom});
            }
          }
        };
        view.on('propertychange', gaDebounce.debounce(updatePermalink, 1000,
            false));

        map.setTarget(element[0]);

        scope.$watch('::ol3d', function(ol3d) {
          if (ol3d) {
            var camera = ol3d.getCesiumScene().camera;
            var params = gaPermalink.getParams();

            // initial location based on query params
            var position, heading, pitch;
            if (isFinite(params.lon) && isFinite(params.lat) &&
                isFinite(params.elevation)) {
              var lon = parseFloat(params.lon);
              var lat = parseFloat(params.lat);
              var elevation = parseFloat(params.elevation);
              position = Cesium.Cartesian3.fromDegrees(lon, lat, elevation);
            }
            if (isFinite(params.heading)) {
              heading = Cesium.Math.toRadians(parseFloat(params.heading));
            }
            if (isFinite(params.pitch)) {
              pitch = Cesium.Math.toRadians(parseFloat(params.pitch));
            }
            camera.setView({
              destination: position,
              orientation: {
                heading: heading,
                pitch: pitch,
                roll: 0.0
              }
            });

            // update permalink
            camera.moveEnd.addEventListener(gaDebounce.debounce(function() {
              // remove 2d params
              gaPermalink.deleteParam('X');
              gaPermalink.deleteParam('Y');
              gaPermalink.deleteParam('zoom');

              var position = camera.positionCartographic;
              gaPermalink.updateParams({
                lon: Cesium.Math.toDegrees(position.longitude).toFixed(5),
                lat: Cesium.Math.toDegrees(position.latitude).toFixed(5),
                elevation: position.height.toFixed(0),
                heading: Cesium.Math.toDegrees(camera.heading).toFixed(3),
                pitch: Cesium.Math.toDegrees(camera.pitch).toFixed(3)
              });
            }, 1000, false));

            var dereg = [];
            var setRealPosition = function(itemOrEvt) {
              var item = (itemOrEvt instanceof ol.Overlay) ? itemOrEvt :
                  itemOrEvt.element;
              item.set('realPosition', item.getPosition());
              item.setPosition();
              dereg.push(item.on('change:position', function(evt) {
                var val = evt.target.getPosition();
                if (val) {
                  item.set('realPosition', val);
                  item.setPosition();
                }
              }));
            };

            // Watch when 3d is enabled to show/hide overlays
            scope.$watch(function() {
              return ol3d.getEnabled();
            }, function(active) {
              if (active) {
                // Hide the overlays
                map.getOverlays().forEach(setRealPosition);
                dereg.push(map.getOverlays().on('add', setRealPosition));
              } else {
                // Show the overlays
                dereg.forEach(function(key) {
                   ol.Observable.unByKey(key);
                });
                dereg = [];
                map.getOverlays().forEach(function(item) {
                  if (!item.getPosition()) {
                    item.setPosition(item.get('realPosition'));
                  }
                });
              }
            });
          }
        });

        // Often when we use embed map the size of the map is fixed, so we
        // don't need to resize the map for printing (use case: print an
        // embed map in a tooltip.
        if (!gaBrowserSniffer.embed) {
          // IE + Firefox
          // We can't call a map.updateSize() for these browsers(because
          // it's applied after the printing) so we resize
          // the map keeping the ratio currently display.
          if ('onbeforeprint' in $window) {
            $window.onbeforeprint = function() {
              var size = map.getSize();
              element.css({
                width: '650px',
                height: (650 * size[1] / size[0]) + 'px'
              });
              map.updateSize();
            };
            $window.onafterprint = function() {
              element.css({width: '100%', height: '100%'});
            };
          }

          // Chrome + Safari
          // These events are called twice on Chrome
          if ($window.matchMedia) {
            $window.matchMedia('print').addListener(function(mql) {
              if (mql.matches) { // onbeforeprint
                map.updateSize();
              } else { // onafterprint
                // We use a timeout to be sure the map is resize after
                // printing
                $timeout(function() {map.updateSize();}, 500);
              }
            });
          }
        } else {
          // #3722: On mobile we need to update size of the map on iframe load.
          $($window).on('DOMContentLoaded', function() {
            map.updateSize();
          });
        }

        scope.$on('gaNetworkStatusChange', function(evt, offline) {
          gaOffline.refreshLayers(map.getLayers().getArray(), offline);
          if (offline) {
            gaOffline.showExtent(map);
          } else {
            gaOffline.hideExtent();
          }
        });

        var savedTimeStr = {};
        scope.$on('gaTimeChange', function(evt, time, oldTime) {
          var switchTimeActive = (!oldTime && time);
          var switchTimeDeactive = (oldTime && !time);
          var olLayers = scope.map.getLayers().getArray();
          var singleModif = false;

          // Detection the time change has been triggered by a layer's
          // 'propertychange' event.
          // (ex: using layermanager)
          if (switchTimeDeactive) {
            for (var i = 0, ii = olLayers.length; i < ii; i++) {
              var olLayer = olLayers[i];
              // We update only time enabled bod layers
              if (olLayer.bodId && olLayer.timeEnabled &&
                  angular.isDefined(olLayer.time) &&
                  olLayer.time.substr(0, 4) != oldTime) {
                singleModif = true;
                break;
              }
            }
          }

          // In case the time change event has been triggered by a layer's
          // 'propertychange' event, we do nothing more.
          // (ex: using the layer manager)
          if (singleModif) {
            savedTimeStr = {};
            return;
          }

          // In case the user has done a global modification.
          // (ex: using the time selector toggle)
          for (var i = 0, ii = olLayers.length; i < ii; i++) {
            var olLayer = olLayers[i];

            // We update only time enabled bod layers and external WMTS layers.
            var supportTimeSelector = olLayer.bodId ||
                gaMapUtils.isExternalWmtsLayer(olLayer.id);
            if (supportTimeSelector &&
                olLayer.timeEnabled &&
                olLayer.visible) {
              var layerTimeStr =
                  gaLayers.getLayerTimestampFromYear(olLayer, time);
              if (switchTimeActive) {
                // We save the current value after a global activation.
                // (ex: using the time selector toggle)
                savedTimeStr[olLayer.id] = olLayer.time;
              } else if (switchTimeDeactive && savedTimeStr[olLayer.id]) {
                // We apply the saved values after a global deactivation.
                // (ex: using the time selector toggle)
                layerTimeStr = savedTimeStr[olLayer.id];
                savedTimeStr[olLayer.id] = undefined;
              }
              olLayer.time = layerTimeStr;
            }
          }
        });
      }
    };
  });
})();

