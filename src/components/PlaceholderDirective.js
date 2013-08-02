(function() {
  goog.provide('ga_placeholder_directive');

  var module = angular.module('ga_placeholder_directive', []);

  /***
   *  The following functionality is a custom-based poly-fill
   *  placeholder for AngularJS
   *  ex:  <input id="weight" name="weight" type="number"
   *  default-text="lbs" min="50" max="500" required />
   *  For browsers which handle placeholder attribute
   *  the in-built placeholder functionality is used,
   *  otherwise the poly-fill is used
   */
  module.directive('placeholder',
    ['$timeout', function($timeout) {

    if ('placeholder' in document.createElement('input') &&
        'placeholder' in document.createElement('textarea')) {
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
