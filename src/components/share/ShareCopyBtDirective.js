goog.provide('ga_sharecopybt_directive');

(function() {

  var module = angular.module('ga_sharecopybt_directive', []);

  /**
   * This directive copy the content of an input defined by the parent
   * controller.
   */
  module.directive('gaShareCopyBt', function($window, $document, $timeout) {
    return {
      require: '^^gaShareCopyInputGroup',
      restrict: 'A',
      scope: {},
      templateUrl: 'components/share/partials/share-copy-bt.html',
      link: function(scope, element, attrs, parentCtrl) {
        var doc = $document[0];
        // Add copy button
        scope.isCopied = false;

        if (!doc.queryCommandSupported('copy')) {
          element.remove();
        }

        // Use clipboard API to copy URL in OS clipboard
        element.on('click', function() {
          parentCtrl.onBeforeCopy();
          var inputToCopy = parentCtrl.getInputToCopy();
          var t = doc.createTextNode(inputToCopy.val());
          var range = doc.createRange();
          doc.body.appendChild(t);
          range.selectNode(t);
          doc.getSelection().addRange(range);

          // Execute the copy command
          var res = doc.execCommand('copy');
          if (res) {
            scope.isCopied = true;
            scope.$digest();
            $timeout(function() {
              scope.isCopied = false;
            }, 5000);
          }

          // Remove the selections - NOTE: the two following lines
          // do the job for all three browsers
          doc.body.removeChild(t);
          doc.getSelection().removeAllRanges();
        });
      }
    };
  });
})();
