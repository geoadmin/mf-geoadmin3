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

  /**
   * The directive below allows you to connect to a
   * boostrap collapsible element and observe state
   * changes. Use it like:
   * ga-collapsible-observe="variable"
   * When the state of the collapsible changes, the
   * 'variable' passed as parameter will be changed.
   * true if it's shown, false if it's hidden.
   *
   * It's a conveniencs directive that removes
   * the need to create a controller specifically for
   * a collapsible element
   *
   * Note: don't use this directive if you have a
   * ng-controller already on the same element. In
   * that case, you can use the standard
   * 'show.bs.collapse' and 'hide.bs.collapse' messages
   * of bootstrap on your elements
   */
  module.directive('gaCollapsibleObserve', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        shown: '=gaCollapsibleObserve'
      },
      link: function(scope, element, attrs) {

        scope.shown = !element.hasClass('collapse');

        element.on('show.bs.collapse', function() {
          $timeout(function() {
            scope.shown = true;
          });
        });

        element.on('hidden.bs.collapse', function() {
          $timeout(function() {
            scope.shown = false;
          });
        });
      }
    };
  });


})();
