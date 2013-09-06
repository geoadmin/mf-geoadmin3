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
    function($timeout) {

    if ('placeholder' in document.createElement('input') &&
        'placeholder' in document.createElement('textarea')) {
      return {};
    }

    return {
      link: function(scope, elm, attrs) {
        if (attrs.type === 'password') {
          return;
        }

        var isPlaceHolderDisplayed;

        var displayPlaceholder = function(elt) {
            elt.val(elt.attr('placeholder'));
            elt.css('color', 'darkgray');
            isPlaceHolderDisplayed = true;
        };

        var hidePlaceholder = function(elt) {
            elt.val('');
            elt.css('color', 'inherit');
            isPlaceHolderDisplayed = false;
        };

        $timeout(function() {
          displayPlaceholder(elm);
          elm.focus(function(evt) {
            var elt = $(evt.target);
            if (isPlaceHolderDisplayed) {
              hidePlaceholder(elt);
            }
          }).blur(function(evt) {
            var elt = $(evt.target);
            if (elt.val() == '') {
              displayPlaceholder(elt);
            }
          });
        });

        attrs.$observe('placeholder', function() {
          if (isPlaceHolderDisplayed) {
            displayPlaceholder(elm);
          }
        });
      }
    };
  });
})();
