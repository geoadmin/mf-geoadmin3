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

  module.directive('gaGeolocation', function($window, $translate,
      gaBrowserSniffer, gaPermalink, gaStyleFactory, gaThrottle, gaMapUtils) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaGeolocationMap',
        ol3d: '=gaGeolocationOl3d'
      },
      templateUrl: 'components/geolocation/partials/geolocation.html',
      link: function(scope, element, attrs) {
        var bt = element.find('button');
        if (!$window.navigator.geolocation) {
          bt.addClass('ga-btn-disabled');
          return;
        }
        var elts = $([bt[0], element[0]]);
        var naClass = 'ga-geolocation-northarrow';
        var errorMsgId;
        var unRegKey;
        var btnStatus = 0, maxNumStatus = 1;
        // This object defines if the user has dragged the map.
        var userTakesControl = false;
        var map = scope.map;
        var view = map.getView();
        var accuracyFeature = new ol.Feature({
          unselectable: true
        });
        var positionFeature = new ol.Feature({
          geometry: new ol.geom.Point([0, 0]),
          label: $translate.instant('geolocation')
        });
        var featuresOverlay = gaMapUtils.getFeatureOverlay(
            [accuracyFeature, positionFeature],
            gaStyleFactory.getStyleFunction('geolocation')
        );
        var promGyr, gyr = new $window.GyroNorm();
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
            unreg3dSwitch = register3dSwitch();

          } else {
            map.removeLayer(featuresOverlay);
          }
          geolocation.setTracking(tracking);
          if (promGyr) {
            promGyr.then(function() {
              if (!gyr) {
                return;
              }
              if (tracking) {
                gyr.start(onChangeHeading);
              } else {
                gyr.stop();
              }
            })
          }
        });

        // Animation
        // used to having a zoom animation when we click on the button,
        // but not when we are tracking the position.
        var first = true;
        var locate = function() {
          errorMsgId = undefined;
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
        var headingFromDeviceOrientation = function(hdg) {
          var orientation = $window.orientation;
          switch (orientation) {
          case -90:
          case 270:
            hdg = hdg - (Math.PI / 2);
            break;

          case 180:
            hdg = hdg + Math.PI;
            break;

          case 90:
            hdg = hdg + (Math.PI / 2);
            break;

          default:
            break;
          }
          return hdg;
        };

        // Update heading
        var headingUpdate = function(heading) {
          if (angular.isDefined(heading)) {

            // The icon rotate
            if (btnStatus === 1 ||
                (btnStatus === 2 && userTakesControl)) {
              updateHeadingFeature(heading);
              map.render();

            // The map rotate
            } else if (btnStatus === 2 && !userTakesControl) {
              map.getView().animate({
                rotation: -heading,
                duration: 350,
                easing: ol.easing.linear
              });
              updateHeadingFeature(heading);
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

        var updateHeadingFeature = function(rotation) {
          console.log(rotation);
          positionFeature.set('rotation', rotation || 0);
        };

        // Orientation control events
        var currHeading = 0;
        var headngUpdateWhenMapRotate = gaThrottle.throttle(headingUpdate, 300);
        var headngUpdateWhenIconRotate = gaThrottle.throttle(headingUpdate, 50);

        var onChangeHeading = function(evt) {
          var headingDeg = evt.do.alpha;

          // Get the heading clockwise
          headingDeg = 360 - headingDeg;

          // Get rotaton in radians
          var heading = headingDeg * Math.PI / 180;

          // Correct the heading depending on device orientation landscape or
          // portrait
          heading = headingFromDeviceOrientation(heading);

          // The icon rotate
          if (btnStatus === 1 || (btnStatus === 2 && userTakesControl)) {
            headngUpdateWhenIconRotate(heading);

          // The map rotate
          } else if (heading < currHeading - 0.001 ||
              currHeading + 0.001 < heading) {
            currHeading = heading;
            headngUpdateWhenMapRotate(heading);
          }
        };

        // Geolocation control events
        geolocation.on('change:position', function(evt) {
          bt.removeClass('ga-btn-disabled');
          locate();

          updatePositionFeature();
          updateAccuracyFeature();
        });

        geolocation.on('change:accuracy', function(evt) {
          updateAccuracyFeature();
        });

        geolocation.on('error', function(error) {
          scope.$applyAsync(function() {
            scope.tracking = false;
          });
          bt.addClass('ga-btn-disabled');
          elts.removeClass(naClass);
          var msgId;
          switch (error.code) {
          case error.PERMISSION_DENIED:
            msgId = 'geoloc_permission_denied';
            break;
          case error.POSITION_UNAVAILABLE:
            msgId = 'geoloc_pos_unavailable';
            break;
          case error.TIMEOUT:
            msgId = 'geoloc_time_out';
            break;
          case error.UNKNOWN_ERROR:
            msgId = 'geoloc_unknown';
            break;
          }
          $window.alert($translate.instant(msgId));
          errorMsgId = msgId;
        });

        // View events
        var updateUserTakesControl = function(evt) {
          userTakesControl = true;
        };
        map.on('pointerdrag', updateUserTakesControl);

        // Button events
        bt.on('click', function(e) {
          e.preventDefault();
          var tracking;

          // We deactivate unneeded event.
          if (unRegKey) {
            ol.Observable.unByKey(unRegKey);
          }

          // Go to the next button state (3 states)
          if (btnStatus < maxNumStatus) {
            btnStatus++;
          } else {
            btnStatus = 0;
          }

          // Apply the new state
          if (btnStatus === 0) {
            tracking = false;
            gaMapUtils.resetMapToNorth(map, scope.ol3d);
            elts.removeClass(naClass);
          } else if (btnStatus === 1) {
            tracking = true;
          } else if (btnStatus === 2) {
            tracking = true;
            elts.addClass(naClass);

            // Button is rotated according to map rotation
            unRegKey = view.on('change:rotation', function(evt) {
              var rotation = evt.target.getRotation() * 180 / Math.PI;
              var rotateString = 'rotate(' + rotation + 'deg)';
              bt.css({
                'transform': rotateString,
                '-ms-transform': rotateString,
                '-webkit-transform': rotateString
              });
              bt.toggleClass('ga-rotate-enabled', !(rotation === 0));
            });
          }

          // Trigger a digest cycle only if tracking value has changed
          if (tracking !== scope.tracking) {
            scope.$applyAsync(function() {
              scope.tracking = tracking;
            });
          }
        });

        scope.getBtTitle = function() {
          if (scope.tracking) {
            if (maxNumStatus === 2 && btnStatus === 1) {
              return 'geoloc_start_tracking_heading';
            }
            return 'geoloc_stop_tracking';
          }

          return errorMsgId || 'geoloc_start_tracking';
        };

        var init = function() {
          // Initialize state of the component
          scope.tracking = (gaPermalink.getParams().geolocation === 'true');
          // Always remove it from PL
          gaPermalink.deleteParam('geolocation');
          btnStatus = (scope.tracking) ? 1 : 0;
        }
        promGyr = gyr.init({
          orientationBase: $window.GyroNorm.WORLD
        }).then(function() {
          if (gyr.isAvailable($window.GyroNorm.DEVICE_ORIENTATION)) {
            maxNumStatus = 2
          } else {
            gyr = undefined
          }
          init();
        }, init);
      }
    };
  });
})();
