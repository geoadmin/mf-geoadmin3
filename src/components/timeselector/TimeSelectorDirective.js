(function() {
  goog.provide('ga_timeselector_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_timeselector_directive', [
    'ga_browsersniffer_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
    function($scope, $log, $translate, $sce, gaBrowserSniffer,
        gaLayers) {

      // Initialize variables
      $scope.isActive = false;
      $scope.stateClass = 'inactive';
      $scope.minYear = 1845;
      $scope.maxYear = (new Date()).getFullYear() + 1;
      $scope.currentYear = -1; // User selected year
      $scope.years = []; //List of all possible years 1845 -> current year
      $scope.availableYears = []; // List of available years

      // Fill the years array. This array will be used to configure the
      // display of the slider (minor and major divisions ...)
      for (var i = $scope.maxYear; i >= $scope.minYear; i--) {
        var year = {
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

      // Format the text of the current year (only used by slider)
      $scope.formatYear = function(value) {
        if (parseInt(value) >= $scope.maxYear) {
          value = $translate('last_available_year');
        }
        return $sce.trustAsHtml('' + value);
      };

      // Watchers
      $scope.$watch('isActive', function(active) {
        $scope.stateClass = (active) ? '' : 'inactive';
        updateLayers((active) ?
            transformYearToTimeStr($scope.currentYear) :
            undefined);
      });

      $scope.$watch('currentYear', function(year) {
        if ($scope.isActive) {
          updateLayers(transformYearToTimeStr(year));
        }
      });

      /**
       * Update the list of years available
       */
      $scope.updateDatesAvailable = function() {
        $scope.availableYears = [];
        for (var i = 0, length = $scope.years.length; i < length; i++) {
          var year = $scope.years[i];
          year.available = false;
          $scope.map.getLayers().forEach(function(olLayer, opt) {
            if (year.available) {
              return;
            }
            var timestamps = olLayer.get('timestamps');
            if (timestamps) {
              for (var i = 0, length = timestamps.length; i < length; i++) {
                if (year.value === _yearFromString(timestamps[i])) {
                  year.available = true;
                  $scope.availableYears.push(year);
                  break;
                }
              }
            }
          });
        }
      };

      /**
       * Tranform a year given by the select box or the slider component
       * into a time parameter usable by layers
       */
      var transformYearToTimeStr = function(year) {
        // The select box returns an object
        if (year && typeof year === 'object') {
          year = '' + year.value;
        }
        if (year && parseInt(year) >= $scope.maxYear) {
          year = null;
        }
        return year;
      };

      /**
       * Update the layers with the new time parameter
       * @param {String} timeStr A year in string format.
       */
      var updateLayers = function(timeStr) {
        // If time is:
        // undefined : Remove the use a parameter time
        // null      : Apply the last available year
        // a string  : Apply the year selected

        $scope.map.getLayers().forEach(function(olLayer, opt) {
          var timestamps = olLayer.get('timestamps');

          if (timestamps) {
            $log.log('Update ' + olLayer.getSource() +
             ' layer (' + olLayer.get('id') + ') with time = ' + timeStr);
            var layerTimeStr = timeStr;
            var src = olLayer.getSource();
            if (src instanceof ol.source.WMTS) {
              if (!angular.isDefined(timeStr) || timeStr === null) {
                layerTimeStr = timestamps[0];
              } else {
                layerTimeStr = timeStr + '1231';
              }
              src.updateDimensions({'Time' : layerTimeStr});

            } else if (src instanceof ol.source.SingleImageWMS ||
                src instanceof ol.source.TiledWMS) {
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
      var _yearFromString = function(timestamp) {
        return parseInt(timestamp.substr(0, 4));
      };
    }
  );

  module.directive('gaTimeSelector',
    function($log, $translate, gaBrowserSniffer) {
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

          // Update list of available years and hide/show the HTML
          // element if the list is empty or not
          var refreshComp = function(obj) {
            scope.updateDatesAvailable();
            if (scope.availableYears.length == 0) {
              scope.isActive = false;
              elt.hide();
            } else {
              elt.show();
              // Set default value on the first display
              if (scope.currentYear === -1) {
                scope.currentYear = scope.maxYear;
              }
            }
          };

          scope.map.getLayers().on('add', refreshComp);
          scope.map.getLayers().on('remove', refreshComp);
        }
      };
    }
  );
})();
