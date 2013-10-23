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
        scope.$on('gaCatalogState', function(event, showCatalog) {
          // It's not possible to directly show or hide a collapsible,
          // but we can only toggle the state by emulating a user click.
          // To assure the showCatalog state is aplied correclt, we have
          // to check he current state of the collapsible by looking
          // for the collapsed class, because the user can change this
          // at will at any time.
          if ((showCatalog !== false && element.hasClass('collapsed')) ||
              (showCatalog === false && !element.hasClass('collapsed'))) {
            element.trigger('click');
          }
        });
      }
    };
  });
})();
