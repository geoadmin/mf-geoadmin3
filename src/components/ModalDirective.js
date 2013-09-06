(function() {
  goog.provide('ga_modal_directive');

  var module = angular.module('ga_modal_directive', []);

  // stolen from Angular
  // https://github.com/angular/angular.js/blob/master/src/Angular.js
  function toBoolean(value) {
    if (value && value.length !== 0) {
      var v = (value + '').toLowerCase();
      value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' ||
        v == 'n' || v == '[]');
    } else {
      value = false;
    }
    return value;
  }

  /**
   * Directive to show Bootstrap modals.
   *
   * Usage:
   *   <div class="modal" ga-modal-show="show"></div>
   *
   * If the expression passed to ga-model-show is assignable the directive
   * will case the corresponding setter with true/false when the modal is
   * shown/hidden.
   *
   * This directive doesn't have its own isolated scope, and it effectively
   * writes to its parent's scope when the modal is shown or hidden.
   */
  module.directive('gaModalShow', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.gaModalShow, function(newVal, oldVal) {
          if (newVal != oldVal) {
            var method = toBoolean(newVal + '') ? 'show' : 'hide';
            element.modal(method);
          }
        });
        var setter = $parse(attrs.gaModalShow).assign;
        if (setter) {
          element.on('hide.bs.modal show.bs.modal', function(e) {
            setter(scope, e.type == 'show' ? true : false);
          });
        }
      }
    };
  });

})();
