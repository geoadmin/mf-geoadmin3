(function() {
  goog.provide('ga_popup_directive');

  var module = angular.module('ga_popup_directive', [
    'pascalprecht.translate'
  ]);


  module.directive('gaPopup',
      ['$compile',
        function($compile) {
          return {
            restrict: 'A',
            link: function(scope, element, attrs) {


              if (!scope.popup) {
                scope.popup = {
                  title: 'No title',
                  content: '<span>{{no_content | translate}}</span>'
                };
              }

              if (attrs.gaPopupTitle) {
                scope.popup.title = attrs.gaPopupTitle;
              }

              var elt = angular.element(
                '<div class="popover ga-popup" ' +
                    'ga-draggable=".ga-popup-title">' +
                  '<h4 class="popover-title ga-popup-title">' +
                    '<span translate>{{popup.title | translate}}</span>' +
                    '<button type="button" class="close" ng-click="close()">' +
                    'x</button>' +
                  '</h4>' +
                  '<div class="popover-content ga-popup-content"></div>' +
                '</div>');


              // Wrap the element with the popup
              var parent = element.parent();
              parent.append(elt);
              $compile(elt)(scope);
              elt.find('.ga-popup-content').append(element);

              // Move the popup to the correct position
              elt.css({

                left: ((scope.popup.x) ?
                  scope.popup.x :
                  parent.width() / 2 - elt.width() / 2),

                top: ((scope.popup.y) ?
                  scope.popup.y :
                   150)
              });

              if (angular.isDefined(attrs.gaPopup)) {
                scope.$watch(attrs.gaPopup, function(newVal, oldVal) {

                  if (!angular.isDefined(newVal)) {
                    elt.hide();
                  }

                  if (newVal != oldVal) {
                    elt.toggle();
                  }
                });
              }

              if (scope.popup && scope.popup.close) {
                scope.close = scope.popup.close;

              } else {
                scope.close = function() {
                  elt.toggle();
                };
              }

            }
          };
        }]);
})();


