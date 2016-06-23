goog.provide('ga_sharecopybt_directive');

goog.require('ga_browsersniffer_service');

(function() {

  var module = angular.module('ga_sharecopybt_directive', [
    'ga_browsersniffer_service'
  ]);

  /**
   * This directive copy the content of an input defined by the parent
   * controller.
   */
  module.directive('gaShareCopyBt', function($document, $timeout,
      gaBrowserSniffer) {
    return {
      require: '^^gaShareCopyInputGroup',
      restrict: 'A',
      scope: {},
      templateUrl: 'components/share/partials/share-copy-bt.html',
      link: function(scope, element, attrs, parentCtrl) {
        // Add copy button
        scope.isCopied = false;
        var isCopyAllow = ((gaBrowserSniffer.msie >= 11) ||
            (gaBrowserSniffer.chrome >= 43));
        if (!isCopyAllow) {
          element.remove();
        }
        // Use clipboard API to copy URL in OS clipboard
        element.on('click', function() {
          parentCtrl.onBeforeCopy();
          var inputToCopy = parentCtrl.getInputToCopy();
          inputToCopy[0].setSelectionRange(0, 9999);

          // Execute the copy command
          var res = $document[0].execCommand('copy');
          if (res) {
            scope.isCopied = true;
            scope.$digest();
            $timeout(function() {
              scope.isCopied = false;
            }, 5000);
          }

          // Remove the selections - NOTE: the two following lines
          // do the job for all three browsers
          $document[0].getSelection().removeAllRanges();
          $document[0].getSelection().addRange($document[0]
              .createRange());
        });
      }
    };
  });
})();
