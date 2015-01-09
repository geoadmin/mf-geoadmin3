(function() {
  goog.provide('ga_geolocation_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_permalink');
  goog.require('ga_styles_service');
  goog.require('ga_throttle_service');

  var module = angular.module('ga_geolocation_directive', [
    'ga_browsersniffer_service',
    'ga_permalink',
    'ga_styles_service',
    'ga_throttle_service'
  ]);

  module.directive('gaGeolocation', function($parse, $window,
      gaBrowserSniffer, gaPermalink, gaStyleFactory, gaThrottle, gaMapUtils) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        map: '=gaGeolocationMap'
      },
      templateUrl: 'components/geolocation/partials/geolocation.html',
      link: function(scope, element, attrs) {

        if (!('geolocation' in $window.navigator)) {
          element.addClass('ga-geolocation-error');
          return;
        }

        var unRegKey;
        // This object with boolean properties defines either:
        // geolocation: if the user has moved the map itself after the
        // first change of position.
        // rotation: if the user has touched-rotated the map on btn state 2
        var userTakesControl = {geolocation: false, rotation: false};
        // Defines if the heading of the map is being rendered
        var mapHeadingRendering = false;
        // Defines if the geolocation control is zooming
        var geolocationZooming = false;
        var map = scope.map;
        var view = map.getView();
        var accuracyFeature = new ol.Feature();
        var positionFeature = new ol.Feature(new ol.geom.Point([0, 0]));
        var featuresOverlay = new ol.FeatureOverlay({
          features: [accuracyFeature, positionFeature],
          style: gaStyleFactory.getStyleFunction('geolocation')
        });
        var deviceOrientation = new ol.DeviceOrientation();
        var geolocation = new ol.Geolocation({
          projection: view.getProjection(),
          trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
          }
        });

        // Scope watchers
        scope.$watch('tracking', function(tracking) {
         if (tracking) {
            userTakesControl.geolocation = false;
            userTakesControl.rotation = false;
            featuresOverlay.setMap(map);
            gaPermalink.updateParams({
              geolocation: tracking.toString()
            });
          } else {
            featuresOverlay.setMap(null);
            gaPermalink.deleteParam('geolocation');
          }
          geolocation.setTracking(tracking);
          deviceOrientation.setTracking(tracking);
        });

        // Animation
        // used to having a zoom animation when we click on the button,
        // but not when we are tracking the position.
        var first = true;
        var currentAccuracy = 0;
        var locate = function() {
          geolocationZooming = true;
          var dest = geolocation.getPosition();
          if (dest) {
            var source = view.getCenter();
            var dist = Math.sqrt(Math.pow(source[0] - dest[0], 2),
                Math.pow(source[1] - dest[1], 2));
            var duration = Math.min(
                Math.sqrt(300 + dist / view.getResolution() * 1000), 3000
            );
            var start = +new Date();
            var pan = ol.animation.pan({
              duration: duration,
              source: source,
              start: start
            });
            var bounce;
            if (first) {
              first = false;
              var currentAccuracy = geolocation.getAccuracy();
              var extent = [
                dest[0] - currentAccuracy,
                dest[1] - currentAccuracy,
                dest[0] + currentAccuracy,
                dest[1] + currentAccuracy
              ];
              var size = map.getSize();
              var resolution = Math.max(
                (extent[2] - extent[0]) / size[0],
                (extent[3] - extent[1]) / size[1]);
              resolution = Math.max(view.constrainResolution(resolution, 0, 0),
                2.5);
              bounce = ol.animation.bounce({
                duration: duration,
                resolution: Math.max(view.getResolution(), dist / 1000,
                    // needed to don't have up an down and up again in zoom
                    resolution * 1.2),
                start: start
              });
              var zoom = ol.animation.zoom({
                resolution: view.getResolution(),
                duration: duration,
                start: start
              });
              map.beforeRender(pan, zoom, bounce);
              view.setCenter(dest);
              view.setResolution(resolution);
            } else if (!userTakesControl.geolocation) {
              map.beforeRender(pan);
              view.setCenter(dest);
            }
          }
          geolocationZooming = false;
        };

        // Get heading depending on devices
        var headingFromDevices = function() {
          if (gaBrowserSniffer.mobile && gaBrowserSniffer.ios) {
            var hdg = deviceOrientation.getHeading();
          } else if (gaBrowserSniffer.mobile && !gaBrowserSniffer.ios) {
            var hdg = -deviceOrientation.getHeading();
          }
          return hdg;
        };

        // Update heading
        var headingUpdate = function() {
          var heading = headingFromDevices();
          if (angular.isDefined(heading)) {

            // The icon rotate
            if (btnStatus == 1 ||
                (btnStatus == 2 && userTakesControl.rotation)) {
              updateHeadingFeature();
              map.render();

            // The map rotate
            } else if (btnStatus == 2 && !userTakesControl.rotation) {
              mapHeadingRendering = true;
              var currRotation = view.getRotation();
              var heading = -heading;
              var diff = heading - currRotation;

              if (diff > Math.PI) {
                heading -= 2 * Math.PI;
              } else if (diff < -Math.PI) {
                currRotation -= 2 * Math.PI;
              }

              map.beforeRender(ol.animation.rotate({
                rotation: currRotation,
                duration: 350,
                easing: ol.easing.linear
              }));
              map.getView().setRotation(heading);
              updateHeadingFeature(0);
              mapHeadingRendering = false;
            }
          }
        };

        var updatePositionFeature = function() {
          if (geolocation.getPosition()) {
            positionFeature.getGeometry().setCoordinates(
               geolocation.getPosition());
          }
        };

        var updateAccuracyFeature = function() {
          if (geolocation.getPosition() && geolocation.getAccuracy()) {
            accuracyFeature.setGeometry(new ol.geom.Circle(
                geolocation.getPosition(), geolocation.getAccuracy()));
          }
        };

        var updateHeadingFeature = function(forceRotation) {
          var rotation = forceRotation || headingFromDevices();
          if (angular.isDefined(rotation)) {
            positionFeature.set('rotation', rotation);
          }
        };


        // Orientation control events
        var currHeading = 0;
        var headngUpdateWhenMapRotate = gaThrottle.throttle(headingUpdate, 300);
        var headngUpdateWhenIconRotate = gaThrottle.throttle(headingUpdate, 50);

        deviceOrientation.on('change:heading', function(event) {
          var heading = headingFromDevices();

          // The icon rotate
          if (btnStatus == 1 ||
              (btnStatus == 2 && userTakesControl.rotation)) {
            headngUpdateWhenIconRotate();

          // The map rotate
          } else if (heading < currHeading - 0.001 ||
              currHeading + 0.001 < heading) {
            currHeading = heading;
            headngUpdateWhenMapRotate();
          }
        });


        // Geolocation control events
        geolocation.on('change:position', function(evt) {
          element.removeClass('ga-geolocation-error');
          locate();
          updatePositionFeature();
          updateAccuracyFeature();
          updateHeadingFeature();
        });

        geolocation.on('change:accuracy', function(evt) {
          updateAccuracyFeature();
        });

        geolocation.on('error', function() {
          scope.$apply(function() {
            scope.tracking = false;
          });
          element.addClass('ga-geolocation-error');
        });

        // View events
        var updateUserTakesControl = function(evt) {
          if (evt.key == 'rotation') {
            userTakesControl.rotation = !mapHeadingRendering;
          } else {
            userTakesControl.geolocation = !geolocationZooming;
          }
        };
        view.on(['change:center', 'change:resolution', 'change:rotation'],
            updateUserTakesControl);


        // Button events
        element.bind('click', function(e) {
          e.preventDefault();
          var tracking;

          // We deactivate unneeded event.
          if (unRegKey) {
            ol.Observable.unByKey(unRegKey);
          }

          // Go to the next button state (3 states)
          var delta = (gaBrowserSniffer.mobile) ? 0 : 1;
          if (btnStatus < maxNumStatus - delta) {
            btnStatus++;
          } else {
            btnStatus = 0;
          }

          // Apply the new state
          if (btnStatus == 0) {
            tracking = false;
            gaMapUtils.resetMapToNorth(map);
            element.removeClass('ga-geolocation-northarrow');
          } else if (btnStatus == 1) {
            tracking = true;
          } else if (btnStatus == 2) {
            tracking = true;
            element.addClass('ga-geolocation-northarrow');

            // Button is rotated according to map rotation
            unRegKey = view.on('change:rotation', function(evt) {
              var rotation = evt.target.getRotation() * 180 / Math.PI;
              var rotateString = 'rotate(' + rotation + 'deg)';
              element.css({
                'transform': rotateString,
                '-ms-transform': rotateString,
                '-webkit-transform': rotateString
              }).toggleClass('ga-rotate-enabled', !(rotation == 0));
            });
          }

          // Trigger a digest cycle only if tracking value has changed
          if (tracking != scope.tracking) {
            scope.$apply(function() {
              scope.tracking = tracking;
            });
          }
        });

        // Initialize state of the component
        scope.tracking = (gaPermalink.getParams().geolocation == 'true');
        var btnStatus = (scope.tracking) ? 1 : 0;
        var maxNumStatus = (ol.has.DEVICE_ORIENTATION) ? 2 : 1;
      }
    };
  });
})();
