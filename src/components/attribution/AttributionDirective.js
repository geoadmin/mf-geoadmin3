goog.provide('ga_attribution_directive');
(function() {

  var module = angular.module('ga_attribution_directive', []);

  module.directive('gaAttribution', function($translate, $window,
      gaBrowserSniffer) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaAttributionMap'
      },
      link: function(scope, element, attrs) {
        var control = new ol.control.Attribution({
          label: '',
          target: element[0],
          tipLabel: ''
        });
        scope.map.addControl(control);

        element.on('click', '.ga-warning-tooltip', function(evt) {
          $window.alert($translate.instant('external_data_warning')
                        .replace('--URL--', $(evt.target).text()));
        });

        if (!gaBrowserSniffer.mobile) {
          // Display third party data tooltip
          element.tooltip({
            selector: '.ga-warning-tooltip',
            title: function() {
              return $translate.instant('external_data_tooltip');
            },
            template: '<div class="tooltip ga-red-tooltip" role="tooltip">' +
                '<div class="tooltip-arrow"></div><div class="tooltip-inner">' +
                '</div></div>'
          });
        }
      }
    };
  });

})();
