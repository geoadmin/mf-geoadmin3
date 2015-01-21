(function() {
  goog.provide('ga_timeselector_directive');

  goog.require('ga_debounce_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink_service');
  goog.require('ga_slider_directive');

  var module = angular.module('ga_timeselector_directive', [
    'ga_debounce_service',
    'ga_map_service',
    'ga_permalink_service',
    'ga_slider_directive',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
    function($scope, gaLayers, gaLayerFilters, gaPermalink, gaBrowserSniffer) {
      $scope.layers = $scope.map.getLayers().getArray();
      $scope.layerFilter = gaLayerFilters.timeEnabledLayersFilter;
      $scope.permalinkValue = parseFloat(gaPermalink.getParams().time);
      $scope.fromPermalink = !isNaN($scope.permalinkValue);
      $scope.isActive = $scope.fromPermalink;
    }
  );

  module.directive('gaTimeSelectorBt', function($rootScope, gaPermalink,
      $translate, gaBrowserSniffer) {
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

        // Enable the button if it is disable
        var enable = function() {
          if (scope.isDisable) {
            scope.isDisable = false;
          }
        };

        // Disable the button in any case
        var disable = function() {
          scope.isDisable = true;
          scope.isActive = false;
        };

        // Toggle the state of the component between active and enable
        scope.toggle = function(evt) {
          $rootScope.$broadcast('gaTimeSelectorToggle', !scope.isActive);

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

        // Events to force the state of the component from another directive
        scope.$on('gaTimeSelectorEnabled', enable);
        scope.$on('gaTimeSelectorDisabled', disable);
        scope.$on('gaTimeSelectorToggle', function(evt, active) {
          scope.isActive = active;
        });

        // If there is one or more timeEnabled layer we display the button
        scope.$watchCollection('layers | filter:layerFilter',
            function(olLayers) {
          if (olLayers.length == 0 && !scope.fromPermalink) {
            disable();
          } else {
            scope.fromPermalink = false;
            enable();
          }
        });
      }
    };
  });

  module.directive('gaTimeSelector',
    function($rootScope, $timeout, gaBrowserSniffer, gaDebounce,
        gaLayerFilters, gaLayers, gaPermalink) {

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

      // Update the layers with the new time parameter
      // @param {String} timeStr A year in string format.
      var updateLayers = function(olLayers, timeStr) {
        // If time is:
        // undefined : Remove the use a parameter time
        // a string  : Apply the year selected
        for (var i = 0, ii = olLayers.length; i < ii; i++) {
          var olLayer = olLayers[i];
          // We update only time enabled bod layers
          if (olLayer.bodId && olLayer.timeEnabled) {
            var layerTimeStr = gaLayers.getLayerTimestampFromYear(olLayer.bodId,
                timeStr);
            olLayer.time = layerTimeStr;
          }
        }
      };

      return {
        restrict: 'A',
        templateUrl: 'components/timeselector/partials/timeselector.html',
        scope: {
          map: '=gaTimeSelectorMap',
          options: '=gaTimeSelectorOptions'
        },
        controller: 'GaTimeSelectorDirectiveController',
        link: function(scope, elt, attrs, controller) {

          // Activate/deactivate manually the time selector
          scope.$on('gaTimeSelectorToggle', function(evt, active, year) {
            scope.isActive = active;
            if (year) {
              scope.currentYear = year;
            }
          });

          // Watchers
          scope.$watchCollection('layers | filter:layerFilter',
              function(olLayers) {
            // We update the list of dates available then
            // we magnetize the current year value
            // to the closest available year if needed
            if (updateDatesAvailable(olLayers)) {
              scope.currentYear = magnetize(scope.currentYear,
                  scope.availableYears);
            }
            if (olLayers.length == 0 && !scope.fromPermalink) {
              scope.isActive = false;
            } else {
              scope.fromPermalink = false;
            }
          });

          scope.$watch('isActive', function(active, old) {
            if (angular.isDefined(active)) {
              applyNewYear((active ? scope.currentYear : undefined));
              elt.toggle(active);
              if (scope.fromPermalink) {
                // HACK to fix:
                // https://github.com/geoadmin/mf-geoadmin3/issues/2054
                // The html is correct but value is not displayed
                $timeout(function() {
                  elt.find('select option[selected]').
                      attr('selected', 'selected');
                }, 0, false);
                scope.fromPermalink = false;
              }

            } else {
              elt.hide();
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
              updateLayers(scope.layers, newYear);
              if (newYear === undefined) {
                gaPermalink.deleteParam('time');
              } else {
                gaPermalink.updateParams({time: newYear});
              }
              $rootScope.$broadcast('gaTimeSelectorChange', newYear);
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
          scope.currentYear = (scope.fromPermalink) ? scope.permalinkValue :
              scope.options.maxYear;
          elt.hide();

        }
      };
    }
  );
})();
