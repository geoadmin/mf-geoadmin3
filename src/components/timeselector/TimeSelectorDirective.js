(function() {
  goog.provide('ga_timeselector_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_debounce_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink_service');
  goog.require('ga_slider_directive');

  var module = angular.module('ga_timeselector_directive', [
    'ga_browsersniffer_service',
    'ga_debounce_service',
    'ga_map_service',
    'ga_permalink_service',
    'ga_slider_directive',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
    function($scope, $translate, $sce, gaLayers, gaPermalink,
        gaBrowserSniffer) {

      // Initialize variables
      $scope.stateClass = $scope.isActive ? '' : 'inactive';
      $scope.minYear = 1844;
      $scope.maxYear = (new Date()).getFullYear() + 1;
      $scope.currentYear = -1; // User selected year
      $scope.years = []; //List of all possible years 1845 -> current year
      $scope.availableYears = []; // List of available years

      // Format the text of the current year (only used by slider)
      $scope.formatYear = function(value) {
        if (parseInt(value) >= $scope.maxYear) {
          value = (gaBrowserSniffer.mobile) ?
              $translate('last_available_year') : '';
        }
        if (value === 'slider_last_title') {
          value = $translate('last_available_year');
        }
        return $sce.trustAsHtml('' + value);
      };

      // Fill the years array. This array will be used to configure the
      // display of the slider (minor and major divisions ...)
      for (var i = $scope.maxYear; i >= $scope.minYear; i--) {
        var year = {
          label: $scope.formatYear(i),
          value: i,
          available: false,
          minor: false,
          major: false
        };

        // Defines if the current year should be displayed as a major
        // or a minor subdivison
        if ((i % 50) === 0) {
          year.major = true;

        } else if ((i % 10) === 0) {
          year.minor = true;
        }

        $scope.years.push(year);
      }

      // Toggle the state of the component
      $scope.toggle = function() {
        $scope.isActive = !$scope.isActive;
      };

      /**
       * Update the list of years available
       */
      $scope.updateDatesAvailable = function() {
        var magnetizeCurrentYear = true;
        $scope.availableYears = [];
        for (var i = 0, length = $scope.years.length; i < length; i++) {
          var year = $scope.years[i];
          year.available = false;
          $scope.map.getLayers().forEach(function(olLayer, opt) {
            if (year.available) {
              return;
            }
            var timestamps = getLayerTimestamps(olLayer);
            if (timestamps) {
              for (var i = 0, length = timestamps.length; i < length; i++) {
                if (year.value === $scope.maxYear ||
                    year.value === yearFromString(timestamps[i])) {
                  year.available = true;
                  $scope.availableYears.push(year);
                  if (year.value === $scope.currentYear) {
                    magnetizeCurrentYear = false;
                  }
                  break;
                }
              }
            }
          });
        }
        return magnetizeCurrentYear;
      };

      // Set the currentYear to the closest available year
      $scope.magnetize = function() {
        var minGap = null;
        for (var i = 0, length = $scope.availableYears.length; i < length;
            i++) {
          var elt = $scope.availableYears[i];
          var gap = elt.value - $scope.currentYear;
          minGap = (!minGap || (Math.abs(gap) < Math.abs(minGap))) ?
              gap : minGap;
        }

        if (minGap) {
          $scope.currentYear += minGap;
        }
      };

      /**
       * Update the layers with the new time parameter
       * @param {String} timeStr A year in string format.
       */
      $scope.updateLayers = function(timeStr) {
        // If time is:
        // undefined : Remove the use a parameter time
        // null      : Apply the last available year
        // a string  : Apply the year selected

        $scope.map.getLayers().forEach(function(olLayer, opt) {
          var timestamps = getLayerTimestamps(olLayer);
          if (timestamps) {
            var layerTimeStr = timeStr;
            var src = olLayer.getSource();
            if (src instanceof ol.source.WMTS) {
              if (!angular.isDefined(timeStr) || timeStr === null) {
                layerTimeStr = timestamps[0];
              } else {
                for (var i = 0, ii = timestamps.length; i < ii; i++) {
                  var timestamp = yearFromString(timestamps[i]);
                  if (timestamp === parseInt(timeStr)) {
                    layerTimeStr = timestamps[i];
                    break;
                  }
                }
              }
              src.updateDimensions({'Time' : layerTimeStr});

            } else if (src instanceof ol.source.ImageWMS ||
                src instanceof ol.source.TileWMS) {
              if (!angular.isDefined(timeStr)) {
                layerTimeStr = '';
              } else if (timeStr === null) {
                layerTimeStr = timestamps[0];
              }
              src.updateParams({'TIME' : layerTimeStr});
            }
          }
        });
      };

      /** Utils **/
      var yearFromString = function(timestamp) {
        return parseInt(timestamp.substr(0, 4));
      };

      var getLayerTimestamps = function(olLayer) {
        var id = olLayer.get('bodId');
        var timestamps;
        if (id && gaLayers.getLayer(id) &&
            gaLayers.getLayerProperty(id, 'timeEnabled')) {
          timestamps = gaLayers.getLayerProperty(id, 'timestamps');
        }
        return timestamps;
      };
    }
  );

  module.directive('gaTimeSelectorBt', function($rootScope, gaPermalink) {
    return {
      restrict: 'A',
      template: '<a href="#" class="time-selector-bt" ng-click="toggle()"' +
          ' ng-class="stateClass"></a>',
      link: function(scope, elt, attrs) {
        scope.isDisable = true;

        $rootScope.$on('gaTimeSelectorEnabled', function() {
          if (scope.isDisable) {
            scope.stateClass = 'enabled';
            scope.isDisable = false;

            // When isActive is undefined that means it's the first time
            // the button is enabled.
            // Force activation of the TimeSelector if a time parameter is
            // defined in the permalink
            if (!angular.isDefined(scope.isActive) &&
               angular.isDefined(gaPermalink.getParams().time)) {
              scope.toggle();
            }
          }
        });

        $rootScope.$on('gaTimeSelectorDisabled', function() {
          scope.stateClass = '';
          scope.isDisable = true;
          scope.isActive = false;
        });

        // Toggle the state of the component
        scope.toggle = function() {
          if (!scope.isDisable) {
            scope.isActive = !scope.isActive;
            scope.stateClass = scope.isActive ? 'active' : 'enabled';
            $rootScope.$broadcast('gaTimeSelectorToggle', scope.isActive);
          }
        };
      }
    };
  });

  module.directive('gaTimeSelector',
    function($rootScope, gaBrowserSniffer, gaPermalink, gaLayers, gaDebounce) {
      return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
          return 'components/timeselector/partials/timeselector.' +
              ((gaBrowserSniffer.mobile) ? 'select.html' : 'html');
        },
        scope: {
          map: '=gaTimeSelectorMap',
          options: '=gaTimeSelectorOptions'
        },
        controller: 'GaTimeSelectorDirectiveController',
        link: function(scope, elt, attrs, controller) {

          // Add css mobile class
          if (gaBrowserSniffer.mobile) {
            elt.addClass('mobile');
          }

          /**
           * Update list of available years then hide/show the HTML
           * element if the list is empty or not
           */
          var refreshComp = function(collectionEvent) {
            var olLayers = collectionEvent.target;
            // If there is only timeEnabled layers on the map we enable the
            // TimeSelector button else we disabled it
            var enabled = false;
            for (var i = 0, length = olLayers.getLength(); i < length; i++) {

              // if there is one no- bod layer we disable the time selector
              var id = olLayers.getAt(i).get('bodId');
              if (!id) {
                enabled = false;
                break;
              }

              // if there is one no-timeEnabled layer we disable the
              // timeselector
              enabled = gaLayers.getLayerProperty(id, 'timeEnabled');
              if (!gaLayers.getLayerProperty(id, 'background') && !enabled) {
                break;
              }
            }


            // if the time selector is active, the slider is already initialized
            // and there is dates available, we magnetize the current date value
            // to the closest available date if needed
            if (scope.isActive && scope.currentYear !== -1 &&
                scope.updateDatesAvailable()) {
              scope.magnetize();
            }

            // we force the state of the time selector
            if (!enabled) {
              scope.isActive = false;
              $rootScope.$broadcast('gaTimeSelectorDisabled');
            } else {
              $rootScope.$broadcast('gaTimeSelectorEnabled');
            }

          };
          scope.map.getLayers().on('add', refreshComp);
          scope.map.getLayers().on('remove', refreshComp);

          // Active/deactive manually the time selector
          $rootScope.$on('gaTimeSelectorToggle', function(event, active) {
            scope.isActive = active;
          });

          // Watchers
          scope.$watch('isActive', function(active) {
            if (angular.isDefined(active)) {
              scope.stateClass = (active) ? 'active' : '';
              if (active) {
                // Set default value on the first display
                if (scope.currentYear === -1) {
                  var permalinkValue = parseFloat(gaPermalink.getParams().time);
                  scope.currentYear = !isNaN(permalinkValue) ?
                      permalinkValue : scope.maxYear;
                }

                // If the currentYear has not changed we force the refresh of
                // layers
                if (scope.updateDatesAvailable()) {
                  scope.magnetize();
                } else {
                  applyNewYear(scope.currentYear);
                }

              } else {
                // Here we don't set currentYear as undefined to keep the last
                // value selected by the user.
                applyNewYear((active ? scope.currentYear : undefined));
              }
            }
          });
          scope.$watch('currentYear', function(year) {
            if (scope.isActive) {
              applyNewYearDebounced(year);
            }
          });

          /** Utils **/

          /**
           * Apply the year selected
           */
          var applyNewYear = function(year) {
            var newYear = transformYearToTimeStr(year);

            // Only valid values are allowed: undefined, null or
            // minYear <= newYear <= maxYear
            if ((!newYear ||
               (scope.minYear <= newYear && newYear <= scope.maxYear))) {
              scope.updateLayers(newYear);
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

          /**
           * Tranform a year given by the select box or the slider component
           * into a time parameter usable by layers
           */
          var transformYearToTimeStr = function(year) {
            // The select box returns an object
            if (year && typeof year === 'object') {
              year = '' + year.value;
            }
            if (year && parseInt(year) >= scope.maxYear) {
              year = null;
            }
            return year;
          };
        }
      };
    }
  );
})();
