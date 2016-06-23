goog.provide('ga_sharecopyinput_directive');

goog.require('ga_browsersniffer_service');

(function() {

  var module = angular.module('ga_sharecopyinput_directive', [
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  /**
   * This directive adds an help tooltip to copy the input content with the
   * keyboard.
   */
  module.directive('gaShareCopyInput', function(gaBrowserSniffer, $translate) {
    return {
      require: '^^gaShareCopyInputGroup',
      restrict: 'A',
      scope: {
        onFocus: '&gaShareOnFocus'
      },
      link: function(scope, element, attrs, parentCtrl) {
        if (!gaBrowserSniffer.mobile) {
          element.attr('readonly', 'readonly').tooltip({
            placement: attrs.gaTooltipPlacement || 'bottom',
            trigger: 'focus',
            title: function() {
              return $translate.instant('share_link_tooltip');
            }
          }).on('focus', function() {
            parentCtrl.onBeforeCopy();
            this.setSelectionRange(0, 9999);
          });
        }
      }
    };
  });
})();
