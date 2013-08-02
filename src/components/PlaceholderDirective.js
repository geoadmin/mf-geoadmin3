(function() {
  goog.provide('ga_placeholder_directive');

  var module = angular.module('ga_placeholder_directive', [
    'ga_browsersniffer_service'
  ]);

  /***
   *  The following functionality is a custom-based poly-fill
   *  placeholder for AngularJS
   *  ex:  <input id="weight" name="weight" type="number"
   *  default-text="lbs" min="50" max="500" required />
   *  For browsers lower than IE 10 the in-built placeholder
   *  functionality is used, otherwise the poly-fill is used
   */
  module.directive('placeholder',
    ['$timeout', 'gaBrowserSniffer', function($timeout, gaBrowserSniffer) {

    if (isNaN(gaBrowserSniffer.msie) || gaBrowserSniffer.msie >= 10) {
      return {};
    }

    return {
      link: function(scope, elm, attrs) {
        if (attrs.type === 'password') {
          return;
        }
        $timeout(function() {
          $(elm).val(attrs.placeholder).focus(function(evt) {
            var elt = $(evt.target);
            if (elt.val() == elt.attr('placeholder')) {
              elt.val('');
            }
          }).blur(function(evt) {
            var elt = $(evt.target);
            if (elt.val() == '') {
              elt.val(elt.attr('placeholder'));
            }
          });
        });
      }
    };
  }]);
})();
