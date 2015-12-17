goog.provide('ga_timeselector_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_debounce_service');
goog.require('ga_map_service');
goog.require('ga_slider_directive');
goog.require('ga_time_service');

(function() {

  var module = angular.module('ga_timeselector_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_map_service',
    'ga_slider_directive',
    'ga_time_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
    function($scope, gaLayerFilters) {
      $scope.layers = $scope.map.getLayers().getArray();
      $scope.layerFilter = gaLayerFilters.timeEnabledLayersFilter;
      $scope.isActive = false;
    }
  );

  module.directive('gaTimeSelectorBt', function($rootScope, $translate,
      gaBrowserSniffer, gaTime) {
    return {
      restrict: 'A',
      templateUrl: 'components/timeselector/partials/timeselector-bt.html',
      scope: {
        map: '=gaTimeSelectorBtMap'
      },
      controller: 'GaTimeSelectorDirectiveController',
      link: function(scope, elt, attrs, controller) {

        // Deactivate user form submission with Enter key
        elt.keypress(function(evt) {
          var charCode = evt.charCode || evt.keyCode;
          if (charCode == 13) { //Enter key's keycode
            return false;
          }
        });

        // Update the status of the directive
        var timeEnabledLayers = [];
        var updateStatus = function() {
          if (timeEnabledLayers.length == 0) {
            scope.isActive = false;
          } else {
            scope.isActive = !!(gaTime.get());
          }
          elt.toggleClass('ga-time-selector-enabled',
              (timeEnabledLayers.length != 0));
        };

        // Toggle the state of the component between active and enable
        scope.toggle = function(evt) {
          scope.isActive = !scope.isActive;
          $rootScope.$broadcast('gaTimeSelectorToggle', scope.isActive);

          // Avoid the add of # at the end of the url
          if (evt) {
            evt.preventDefault();
          }
        };

        // Show/hide tooltip on desktop
        if (!gaBrowserSniffer.mobile) {
          elt.mouseenter(function() {
            elt.tooltip({
              placement: 'left',
              container: 'body',
              title: function() {
                return $translate.instant('time_bt_enabled_tooltip');
              }
            });
          }).mouseleave = function() {
            elt.tooltip('hide');
          };
        }

        // Activate/deactivate automatically the time selector
        scope.$on('gaTimeChange', updateStatus);

        // If there is one or more timeEnabled layer we display the button
        scope.$watchCollection('layers | filter:layerFilter', function(layers) {
          timeEnabledLayers = layers;
          updateStatus();
        });
      }
    };
  });

  module.directive('gaTimeSelector',
    function(gaDebounce, gaLayers, gaTime) {

      // Magnetize a year to the closest available year
      var magnetize = function(currentYear, availableYears) {
        var minGap = null;
        for (var i = 0, length = availableYears.length; i < length;
            i++) {
          var elt = availableYears[i];
          var gap = elt.value - currentYear;
          minGap = (!minGap || (Math.abs(gap) < Math.abs(minGap))) ?
              gap : minGap;
        }
        if (minGap) {
          currentYear += minGap;
        }
        return currentYear;
      };

      return {
        restrict: 'A',
        templateUrl: 'components/timeselector/partials/timeselector.html',
        scope: {
          map: '=gaTimeSelectorMap',
          ol3d: '=gaTimeSelectorOl3d',
          options: '=gaTimeSelectorOptions'
        },
        controller: 'GaTimeSelectorDirectiveController',
        link: function(scope, elt, attrs, controller) {
          scope.years = [];

          // Update the status of the directive
          var timeEnabledLayers = [];
          var updateStatus = function() {
            if (timeEnabledLayers.length == 0) {
              scope.isActive = false;
              return;
            }
            scope.isActive = !!(gaTime.get());
          };

          // Events to force the state of the component from another directive
          scope.$on('gaTimeSelectorToggle', function(evt, active) {
            scope.isActive = active;
          });

          // Activate/deactivate automatically the time selector
          scope.$on('gaTimeChange', function(evt, time) {
            if (angular.isDefined(time) && scope.currentYear != time) {
              scope.currentYear = time;
            }
            updateStatus();
          });

          // Update then magnetize the current year
          scope.$watchCollection('layers | filter:layerFilter',
              function(olLayers) {
            timeEnabledLayers = olLayers;
            // We update the list of dates available then
            // we magnetize the current year value
            // to the closest available year if needed
            if (updateDatesAvailable(olLayers)) {
              scope.currentYear = magnetize(scope.currentYear,
                  scope.availableYears);
            }
            updateStatus();
          });

          // Watch if 3d is active
          scope.$watch(function() {
            return scope.ol3d && scope.ol3d.getEnabled();
          }, function(active) {
            scope.is3dActive = active;
            elt.toggle(scope.isActive && !scope.is3dActive);
          });

          // Activate/deactivate the component
          scope.$watch('isActive', function(active, old) {
            // On the first call old and active are false both but we don't want
            // to apply the year
            if (active !== old) {
              scope.years = active ? scope.options.years : [];
              applyNewYear((active ? scope.currentYear : undefined));
              elt.toggle(active && !scope.is3dActive);
            }
          });

          // currentYear is always an integer
          scope.$watch('currentYear', function(year) {
            if (scope.isActive) {
              applyNewYearDebounced(year);
            }
          });

          /** Utils **/

          //Apply the year selected
          var applyNewYear = function(year) {
            var newYear = (year) ? '' + year : year;

            // Only valid values are allowed: undefined, null or
            // minYear <= newYear <= maxYear
            if ((!newYear || (scope.options.minYear <= newYear &&
                newYear <= scope.options.maxYear))) {
              gaTime.set(newYear);
            }
          };
          var applyNewYearDebounced = gaDebounce.debounce(applyNewYear, 200,
              false);

          // Update the list of years available
          scope.availableYears = [];
          var updateDatesAvailable = function(olLayers) {
            var magnetizeCurrentYear = true;
            scope.availableYears = [];
            for (var i = 0, length = scope.options.years.length; i < length;
                i++) {
              var year = scope.options.years[i];
              year.available = false;
              olLayers.forEach(function(olLayer, opt) {
                if (year.available || !olLayer.bodId) {
                  return;
                }
                var timestamps = gaLayers.getLayerProperty(olLayer.bodId,
                    'timestamps') || [];
                for (var i = 0, length = timestamps.length; i < length; i++) {
                  if (year.value === parseInt(timestamps[i].substr(0, 4))) {
                    year.available = true;
                    scope.availableYears.push(year);
                    if (year.value === scope.currentYear) {
                      magnetizeCurrentYear = false;
                    }
                    break;
                  }
                }
              });
            }
            return magnetizeCurrentYear;
          };

          // Initialize the state of the component
          scope.currentYear = gaTime.get() || scope.options.maxYear;
          if (gaTime.get()) {
            scope.isActive = true;
          }
        }
      };
    }
  );
})();
