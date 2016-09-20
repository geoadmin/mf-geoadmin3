goog.provide('ga_profile_directive');

goog.require('ga_profile_service');
(function() {

  var module = angular.module('ga_profile_directive', [
    'ga_profile_service',
    'ga_map_service',
    'ga_styles_service'
  ]);

  module.directive('gaProfile', function($rootScope, $compile, $window,
      $translate, gaDebounce, gaProfile, gaMapUtils, gaStyleFactory) {
    return {
      restrict: 'A',
      templateUrl: 'components/profile/partials/profile.html',
      scope: {
        feature: '=gaProfile',
        map: '=gaProfileMap',
        layer: '=gaProfileLayer',
        options: '=gaProfileOptions'
      },
      link: function(scope, element, attrs) {
        var profile, deregisterKey;
        var options = scope.options;
        var tooltipEl = element.find('.ga-profile-tooltip');
        scope.coordinates = [0, 0];
        scope.unitX = '';

        var onCreate = function(newProfile) {
          profile = newProfile;
          var profileEl = angular.element(
              profile.element
          );
          $compile(profileEl)(scope);
          scope.unitX = profile.unitX;
          var previousProfileEl = element.find('.ga-profile-inner');
          if (previousProfileEl.length > 0) {
            previousProfileEl.replaceWith(profileEl);
          } else {
            element.append(profileEl);
          }
          var areaChartPath = $window.d3.select('.ga-profile-area');
          attachPathListeners(areaChartPath);
        };

        var update = function(feature) {
          gaProfile.update(profile, feature).then(function(prof) {
            scope.unitX = prof.unitX;
          });
        };
        var updateDebounced = gaDebounce.debounce(update, 1000, false,
            false);

        var updateSize = function(size) {
          profile.update(null, size);
        };
        var updateSizeDebounced = gaDebounce.debounce(updateSize, 133,
            false, false);

        $($window).on('resize', function() {
          if (profile) {
            updateSizeDebounced([
              element.width(),
              element.height()
            ]);
          }
        });

        // Create or update the profile
        var reload = function(feature) {
          if (!profile) {
             // we use applyAsync to wait the profile element to be
             // displayed
             scope.$applyAsync(function() {
               options.width = element.width();
               options.height = element.height();
               gaProfile.create(feature, options).then(onCreate);
             });
           } else {
             updateDebounced(feature);
           }
        };

        var useFeature = function(newFeature) {
          if (deregisterKey) {
            ol.Observable.unByKey(deregisterKey);
            deregisterKey = undefined;
          }
          if (newFeature) {
            deregisterKey = newFeature.on('change', function(evt) {
              reload(evt.target);
            });
            reload(newFeature);
          }
        };
        scope.$watch('feature', useFeature);


        var dereg = [
          $rootScope.$on('$translateChangeEnd', function() {
            if (angular.isDefined(profile)) {
              profile.updateLabels();
            }
          })
        ];
        scope.$on('destroy', function() {
          dereg.forEach(function(item) {
            item();
          });
        });

        scope.deleteSelectedFeature = function(layer, feature) {
          if (layer.getSource().getFeatures().length == 1 &&
            confirm($translate.instant('confirm_remove_all_features'))) {
            layer.getSource().clear();
          } else if (confirm($translate.instant(
              'confirm_remove_selected_features'))) {
            layer.getSource().removeFeature(feature);
          }
          scope.feature = undefined;
        };

        /**
         * Mouse events on profile stuff
         */
        function attachPathListeners(areaChartPath) {
          areaChartPath.on('mousemove', function() {
            var d3 = $window.d3;
            var path = d3.select(areaChartPath[0][0]);
            var pathEl = path.node();
            if (angular.isDefined(pathEl.getTotalLength)) {
              var mousePos = d3.mouse(areaChartPath[0][0]);
              var x = mousePos[0];

              var pos = this.getPointAtLength(x);
              var start = x;
              var end = pos.x;
              var accuracy = 5;
              //TODO use binary search instead
              for (var i = start; i > end; i += accuracy) {
                pos = this.getPointAtLength(i);
                if (pos.x >= x) {
                  break;
                }
              }

              // Get the coordinate value of x and y
              var xCoord = profile.domain.X.invert(x);
              var yCoord = profile.domain.Y.invert(pos.y);
              // Get the tooltip position
              var positionX = profile.domain.X(xCoord) +
                  options.margin.left;
              var positionY = profile.domain.Y(yCoord) +
                  options.margin.top;
              tooltipEl.css({
                left: positionX + 'px',
                top: positionY + 'px'
              });
              scope.$apply(function() {
                scope.coordinates = [xCoord, yCoord];
              });
              var coordsMap = profile.findMapCoordinates(xCoord);
              updateMapPosition(coordsMap);
            }
          });

          areaChartPath.on('mouseover', function(d) {
            var d3 = $window.d3;
            var path = d3.select(areaChartPath[0][0]);
            var pathEl = path.node();
            if (angular.isDefined(pathEl.getTotalLength)) {
              tooltipEl.css({ display: 'block' });
              var mousePos = d3.mouse(areaChartPath[0][0]);
              var x = mousePos[0];
              var xCoord = profile.domain.X.invert(x);
              var coordsMap = profile.findMapCoordinates(xCoord);
              activateMapPosition(coordsMap);
            }
          });

          areaChartPath.on('mouseout', function(d) {
            var d3 = $window.d3;
            var path = d3.select(areaChartPath[0][0]);
            var pathEl = path.node();
            if (angular.isDefined(pathEl.getTotalLength)) {
              tooltipEl.hide();
              deactivateMapPosition();
            }
          });

          // Update map stuff
          // Creates the additional overlay to display azimuth circle
          var pos = new ol.geom.Point([0, 0]);
          var overlay = gaMapUtils.getFeatureOverlay([new ol.Feature(pos)],
               gaStyleFactory.getStyle('redCircle'));

          var activateMapPosition = function(coords) {
            overlay.setMap(scope.map);
          };
          var updateMapPosition = function(coords) {
            pos.setCoordinates(coords);
          };
          var deactivateMapPosition = function(coords) {
            overlay.setMap(null);
          };
        };
      }
    };
  });
})();
