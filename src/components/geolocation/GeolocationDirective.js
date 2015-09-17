goog.provide('ga_geolocation_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_permalink');
goog.require('ga_styles_service');
goog.require('ga_throttle_service');
(function() {

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
        map: '=gaGeolocationMap',
        ol3d: '=gaGeolocationOl3d'
      },
      templateUrl: 'components/geolocation/partials/geolocation.html',
      link: function(scope, element, attrs) {

        if (!('geolocation' in $window.navigator)) {
          element.addClass('ga-geolocation-error');
          return;
        }

        var unRegKey;
        // This object defines if the user has dragged the map.
        var userTakesControl = false;
        var map = scope.map;
        var view = map.getView();
        var accuracyFeature = new ol.Feature();
        var positionFeature = new ol.Feature(new ol.geom.Point([0, 0]));
        var featuresOverlay = gaMapUtils.getFeatureOverlay(
          [accuracyFeature, positionFeature],
          gaStyleFactory.getStyleFunction('geolocation')
        );
        var deviceOrientation = new ol.DeviceOrientation();
        var geolocation = new ol.Geolocation({
          projection: view.getProjection(),
          trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
          }
        });

        // Listen 2d/3d switch mode.
        var unreg3dSwitch;
        var register3dSwitch = function() {
          return scope.$watch(function() {
              return scope.ol3d && scope.ol3d.getEnabled();
          }, function(active) {
            userTakesControl = false;
            locate();
          });
        };

        // Scope watchers
        scope.$watch('tracking', function(tracking) {
          if (unreg3dSwitch) {
            unreg3dSwitch();
            unreg3dSwitch = undefined;
          }
          if (tracking) {
            userTakesControl = false;
            map.addLayer(featuresOverlay);
            gaPermalink.updateParams({
              geolocation: tracking.toString()
            });
            unreg3dSwitch = register3dSwitch();
          } else {
            map.removeLayer(featuresOverlay);
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
          var dest = geolocation.getPosition();
          if (dest) {
            if (first) {
              first = false;
              gaMapUtils.flyTo(map, scope.ol3d, dest,
                  ol.extent.buffer(dest.concat(dest),
                  geolocation.getAccuracy()));
            } else if (!userTakesControl) {
              gaMapUtils.panTo(map, scope.ol3d, dest);
            }
          }
        };

        // Get heading depending on devices
        var headingFromDevices = function() {
          var hdg;
          if (gaBrowserSniffer.mobile && gaBrowserSniffer.ios) {
            hdg = deviceOrientation.getHeading();
          } else if (gaBrowserSniffer.mobile && !gaBrowserSniffer.ios) {
            hdg = -deviceOrientation.getHeading();
          }
          return hdg;
        };

        // Update heading
        var headingUpdate = function() {
          var heading = headingFromDevices();
          if (angular.isDefined(heading)) {

            // The icon rotate
            if (btnStatus == 1 ||
                (btnStatus == 2 && userTakesControl)) {
              updateHeadingFeature();
              map.render();

            // The map rotate
            } else if (btnStatus == 2 && !userTakesControl) {
              heading = -heading;
              var currRotation = view.getRotation();
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
            }
          }
        };

        var getCoords3d = function() {
          var coords = geolocation.getPosition();
          if (geolocation.getAltitude()) {
            coords = coords.concat(geolocation.getAltitude());
            featuresOverlay.set('altitudeMode', undefined);
          } else {
            featuresOverlay.set('altitudeMode', 'clampToGround');
          }
          return coords;
        };

        var updatePositionFeature = function() {
          if (geolocation.getPosition()) {
            positionFeature.getGeometry().setCoordinates(getCoords3d());
          }
        };

        var updateAccuracyFeature = function() {
          if (geolocation.getPosition() && geolocation.getAccuracy()) {
            accuracyFeature.setGeometry(new ol.geom.Circle(
                getCoords3d(), geolocation.getAccuracy()));
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
              (btnStatus == 2 && userTakesControl)) {
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
          userTakesControl = true;
        };
        map.on('pointerdrag', updateUserTakesControl);


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
            gaMapUtils.resetMapToNorth(map, scope.ol3d);
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
