(function() {
  goog.provide('ga_catalogcollapsible_directive');

  var module = angular.module('ga_catalogcollapsible_directive', []);

  /**
   * Manipulates a bootstrap collapsible element with Javascript
   * To be used in place of bootstraps data-toggle attribute
   * All other bootstrap collapse attributes remain the same (target,
   * href, collapse and in classes, etc)
   *
   */
  module.directive('gaCatalogcollapsible', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.$on('gaCatalogState', function(event, state) {
          if ((state !== false && element.hasClass('collapsed')) ||
              (state === false && !element.hasClass('collapsed'))) {
            element.trigger('click');
          }
        });
      }
    };
  });
})();
