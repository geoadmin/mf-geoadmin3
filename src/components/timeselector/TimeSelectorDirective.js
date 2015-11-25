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
      replace: true,
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

        // Enable the directive
        var enable = function() {
          if (scope.isDisable) {
            scope.isDisable = false;
          }
          scope.isActive = !!(gaTime.get());
        };

        // Disable the directive
        var disable = function() {
          scope.isDisable = true;
          scope.isActive = false;
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

        // Show the tooltip on mouse enter
        scope.onMouseEnter = function() {
          if (!gaBrowserSniffer.mobile) {
            elt.tooltip({
              placement: 'left',
              container: 'body',
              title: function() {
                return $translate.instant('time_bt_enabled_tooltip');
              }
            });
          }
        };

        // Hide the tooltip on mouse leave
        scope.onMouseLeave = function() {
          elt.tooltip('hide');
        };

        // Activate/deactivate automatically the time selector
        scope.$on('gaTimeChange', function(evt, time) {
          enable();
        });

        // If there is one or more timeEnabled layer we display the button
        scope.$watchCollection('layers | filter:layerFilter',
            function(olLayers) {
          if (olLayers.length == 0) {
            disable();
          } else {
            enable();
          }
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

          // Events to force the state of the component from another directive
          scope.$on('gaTimeSelectorToggle', function(evt, active) {
            scope.isActive = active;
          });

          // Activate/deactivate automatically the time selector
          scope.$on('gaTimeChange', function(evt, time) {
            scope.isActive = !!(time);
            if (angular.isDefined(time) && scope.currentYear != time) {
              scope.currentYear = time;
            }
          });

          // Update then magnetize the current year
          scope.$watchCollection('layers | filter:layerFilter',
              function(olLayers) {
            // We update the list of dates available then
            // we magnetize the current year value
            // to the closest available year if needed
            if (updateDatesAvailable(olLayers)) {
              scope.currentYear = magnetize(scope.currentYear,
                  scope.availableYears);
            }
            if (olLayers.length > 0 && scope.isActive) {
              elt.show();
            }
          });

          // Watch if 3d is active
          scope.$watch(function() {
            return scope.ol3d && scope.ol3d.getEnabled();
          }, function(active) {
            scope.is3dActive = active;
            elt.toggle(scope.isActive && !scope.is3dActive);
          });

          // Activate/deactivate the component
          scope.$watch('isActive', function(active) {
            scope.years = active ? scope.options.years : [];
            applyNewYear((active ? scope.currentYear : undefined));
            elt.toggle(active && !scope.is3dActive);
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
