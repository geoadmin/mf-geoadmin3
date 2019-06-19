import gaEventService from '../EventService.js';

goog.provide('ga_searchitem_directive');

var gaSearchItemDirective = angular.module('ga_searchitem_directive', [
  'ga_event_service'
]);

gaSearchItemDirective.directive('gaSearchItem', function(gaEvent) {
  return {
    restrict: 'A',
    require: '^gaSearch',
    templateUrl: 'components/search/partials/searchitem.html',
    link: function(scope, element, attrs) {
      gaEvent.onMouseEnterLeave(element, function(evt) {
        scope.preview(scope.res);
      }, scope.out);

      element.on('keydown', function(evt) {
        scope.$apply(function() {
          scope.keydown(evt, scope.res);
        });
      });
      element.on('focus', function(evt) {
        scope.preview(scope.res);
      });
      element.on('blur', function(evt) {
        scope.out();
      });
      element.on('click', function(evt) {
        scope.$apply(function() {
          scope.click(scope.res);
        });
      });
    }
  };
});

export default gaSearchItemDirective;
