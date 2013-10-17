(function() {
  goog.provide('ga_collapsable_directive');

  var module = angular.module('ga_collapsable_directive', []);

  /**
   * Manipulates a bootstrap collapsible element with Javascript
   * To be used in place of bootstraps data-toggle attribute
   * All other bootstrap collapse attributes remain the same (target,
   * href, collapse and in classes, etc)
   *
   */
  module.directive('gaCollapsable', function($document, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        //console.log(attr);
        //console.log(scope[attr.gaCollapsable]());
        if (scope[attr.gaCollapsable]()) {
          element.trigger('click');
        }
      }
    };
  });
})();
