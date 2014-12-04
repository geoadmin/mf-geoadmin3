(function() {
  goog.provide('ga_timeselector_controller');

  var module = angular.module('ga_timeselector_controller', []);

  module.controller('GaTimeSelectorController', function($scope, $sce) {
    // Initialize variables
    $scope.options = {
      minYear: 1844,
      maxYear: (new Date()).getFullYear(),
      currentYear: -1, // User selected year
      years: [] //List of all possible years 1845 -> current year
    };

    // Fill the years array. This array will be used to configure the
    // display of the slider (minor and major divisions ...)
    for (var i = $scope.options.maxYear; i >= $scope.options.minYear; i--) {
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
      $scope.options.years.push(year);
    }
});
})();

