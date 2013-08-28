(function() {
  goog.provide('ga_timeselector_directive');

  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_timeselector_directive', [
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
      ['$scope', '$log', '$translate', 'gaBrowserSniffer',
        function($scope, $log, $translate, gaBrowserSniffer,
            gaPopup) {
          $scope.minYear = 1845;
          $scope.maxYear = (new Date()).getFullYear();
          $scope.currentYear2 = 2001;
          $scope.years = []; //List of all possible years 1845 -> current year
          $scope.availableYears = []; // List of available years
          $scope.currentYear = $scope.maxYear; // User selected year

          for (var i = $scope.maxYear; i >= $scope.minYear; i--) {
            var year = {
              value: i,
              available: false
            };
            $scope.years.push(year);
          }

          $scope.stateClass = 'inactive';
          $scope.isActive = false;
          $scope.toggle = function() {
            $scope.isActive = !$scope.isActive;
          };

          $scope.onChangeYear = function() {
            updateLayers(($scope.currentYear) ?
                $scope.currentYear.value :
                null);
          };

          $scope.$watch('isActive', function(active) {
            $scope.stateClass = (active) ? 'inactive' : '';
            updateLayers((active) ? $scope.currentYear : undefined);
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
                //var closest = _getClosestTimestamp(parseInt(timeStr),
                //    olLayer.get('timestamps'));

                $log.log('Update ' + olLayer.getSource() +
                 ' layer (' + olLayer.get('id') + ') with time = ' + timeStr);
               /* if (layer.type === 'wmts') {
                  if (!anguler.isDefined(timeStr) && timeStr === null) {
                    timeStr = timestamps[0];
                  }
                  olLayer.getSource().updateParams({'Time' : timeStr});

                } else if (layer.type === 'wms' || layer.type === 'wmst') {
                  if (!angular.isDefined(timeStr)) {
                    timeStr = "";
                  } else if (timeStr === null) {
                    timeStr = timestamps[0]
                  }
                  olLayer.getSource().updateParams({'TIME' : timeStr});
                }*/
              }
            });
          };


          /** Utils **/
          var _yearFromString = function(timestamp) {
            return parseInt(timestamp.substr(0, 4));
          };
        }
      ]
  );

  module.directive('gaTimeSelector',
      ['$log', '$translate', 'gaBrowserSniffer',
        function($log, $translate, gaBrowserSniffer) {
          return {
            restrict: 'A',
            templateUrl: 'components/timeselector/partials/timeselector.html',
            scope: {
              map: '=gaTimeSelectorMap',
              options: '=gaTimeSelectorOptions'
            },
            controller: 'GaTimeSelectorDirectiveController',
            link: function(scope, elt, attrs, controller) {

              // Update list of available years and hide/show the HTML
              // element if the list is empty or not
              var refreshElt = function(obj) {
                scope.updateDatesAvailable();
                if (scope.availableYears.length == 0) {
                  elt.hide();
                } else {
                  elt.show();
                }
              };

              scope.map.getLayers().on('add', refreshElt);
              scope.map.getLayers().on('remove', refreshElt);

            }
          };
        }
      ]
  );
})();
