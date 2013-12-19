(function() {
  goog.provide('ga_collapsible_directive');

  var module = angular.module('ga_collapsible_directive', []);

  /**
   * Manipulates a bootstrap collapsible element with Javascript
   * All other bootstrap collapse attributes remain the same (target,
   * href, collapse and in classes, etc)
   * Use as attribute of the bootstrap collapsible element by adding:
   * 'ga-collapsible-trigger="'messageType'".
   * You can then trigger a collapse event by broadcasting
   * 'messageType' event with paremeter 'show', 'hide' or 'toggle':
   * $rootScope.$broadcast('messageType', 'show');
   */
  module.directive('gaCollapsibleTrigger', function() {
    return {
      restrict: 'A',
      scope: {
        messageType: '=gaCollapsibleTrigger'
      },
      link: function(scope, element) {
        scope.$on(scope.messageType, function(event, action) {
          // It's not possible to directly show or hide a collapsible,
          // but we can only toggle the state by emulating a user click.
          // To assure the showCatalog state is applied correctly, we have
          // to check he current state of the collapsible by looking
          // for the collapsed class, because the user can change this
          // at will at any time.
          if (action === 'toggle' ||
              (action === 'hide' && !element.hasClass('collapsed')) ||
              (action === 'show' && element.hasClass('collapsed'))) {
            element.trigger('click');
          }
        });
      }
    };
  });
})();
