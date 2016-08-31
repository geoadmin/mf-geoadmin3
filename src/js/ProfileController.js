goog.provide('ga_profile_controller');

goog.require('ga_browsersniffer_service');
goog.require('ga_print_service');

(function() {

  var module = angular.module('ga_profile_controller', [
    'ga_browsersniffer_service',
    'ga_print_service'
  ]);

  module.controller('GaProfileController', function($scope, $timeout,
     gaBrowserSniffer, gaGlobalOptions, gaPrintService) {

   $scope.options = {
      xLabel: 'profile_x_label',
      yLabel: 'profile_y_label',
      margin: {
         top: 6,
         right: 20,
         bottom: 45,
         left: 60
      },
      elevationModel: gaGlobalOptions.defaultElevationModel
    };

    // Allow to print dynamic profile from feature's popup
    // TODO: Verify f it's working, currently print profile is deactivated.
    $scope.print = function() {
      var contentEl = $('#profile-popup .ga-popup-content');
      var onLoad = function(printWindow) {
        var profile = $(printWindow.document).find('[ga-profile]');
        // HACK IE, for some obscure reason an A4 page in IE is not
        // 600 pixels width so calculation of the scale is not optimal.
        var b = (gaBrowserSniffer.msie) ? 1000 : 600;
        // Same IE mistery here, a js error occurs using jQuery width()
        // function.
        var a = parseInt(profile.find('svg').attr('width'), 10);
        var scale = b / a;
        profile.css({
          position: 'absolute',
          left: (-(a - a * scale) / 2) + 'px',
          top: '200px',
          transform: 'scale(' + scale + ')'
        });
        printWindow.print();
      };
      $timeout(function() {
        gaPrintService.htmlPrintout(contentEl.clone().html(), undefined,
            onLoad);
      }, 0, false);
    };

    $scope.$on('gaProfileActive', function(evt, feature, layer) {
      $scope.feature = feature;
      $scope.layer = layer;
    });
  });
})();

