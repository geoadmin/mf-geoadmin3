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
          $scope.years = [];
          $scope.availableYears = [];

          for (var i = (new Date()).getFullYear(); i >= $scope.minYear; i--) {
            var year = {
              value: i,
              selected: false
            };
            $scope.years.push(year);
          }

          $scope.stateClass = 'activate';
          $scope.isActive = false;
          $scope.toggle = function() {
            $scope.isActive = !$scope.isActive;
          };

          $scope.onChangeYear = function() {
            $scope.updateTime(($scope.currentYear) ? $scope.currentYear.value :
                null);
          };

          $scope.updateTime = function(time) {
             updateLayers(time);
          };

          $scope.$watch('isActive', function(active) {
            $scope.stateClass = (active) ? 'inactive' : '';
            $scope.updateTime((active) ? $scope.currentYear : undefined);
          });


          /**
           * Update the list of years available
           */
          $scope.updateDatesAvailable = function() {
            $scope.availableYears = [];
            for (var i = 0, length = $scope.years.length; i < length; i++) {
              var year = $scope.years[i];
              year.selected = false;

              $scope.map.getLayers().forEach(function(olLayer, opt) {
                if (year.selected) {
                  return;
                }
                var timestamps = olLayer.get('timestamps');
                if (timestamps) {
                  for (var i = 0, length = timestamps.length; i < length; i++) {
                    if (year.value === _yearFromString(timestamps[i])) {
                      year.selected = true;
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
            // undefined : Remove the use a parameter time for all layers
            // null      : Set the last available date for each layers
            // a string  : The year selected
            
            $scope.map.getLayers().forEach(function(olLayer, opt) {
              var timestamps = olLayer.get('timestamps');
              if  {timestamps) {
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
                  //olLayer.getSource().updateParams({'TIME' : timeStr});
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
              
              // Update list of available years and display/hide the HTML
              // element if the list is empty or not
              var refreshElt = function(obj) {               
                scope.updateDatesAvailable();

                if (scope.availableYears.length == 0) {
                  elt.hide();
                } else {
                  elt.show();
                }
              }
                
              scope.map.getLayers().on('add', refreshElt);
              scope.map.getLayers().on('remove', refreshElt);

            }
          };
        }
      ]
  );
})();
