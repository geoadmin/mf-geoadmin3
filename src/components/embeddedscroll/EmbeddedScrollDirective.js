goog.provide('ga_embedded_scroll_directive');

(function() {
  var module = angular.module('ga_embedded_scroll_directive', []);

  // top level directive (on body or html) that will hook listener for mouse
  // and touch events. It will trigger another directive (bellow) to show
  // an overlay with hints for embedded maps (as we limit interaction with
  // embedded maps, à la GoogleMaps)
  // see : https://developers.google.com/maps/documentation/embed/guide
  module.directive('gaEmbeddedScrollEventHandler',
      function($rootScope, $translate, $timeout, $window) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var datetimeLastAction = null;
            var hideAfterAWhileIfSameDatetime = function(datetime) {
              // check after 2.5 sec if no other action occured, hide overlay
              $timeout(function() {
                if (!datetimeLastAction || datetimeLastAction === datetime) {
                  datetimeLastAction = null;
                  $rootScope.$emit('gaHideEmbeddedOverlay')
                }
              }, 2500);
            };
            // handling mouse zoom event
            document.body.addEventListener('wheel', function(event) {
              if (!event.ctrlKey) {
                datetimeLastAction = $window.moment();
                $rootScope.$emit('gaShowEmbeddedOverlay',
                    $translate.instant('embedded_scroll_hint'));
                hideAfterAWhileIfSameDatetime(datetimeLastAction);
              }
            }, {
              passive: true,
              // capturing before the event goes down the DOM
              capture: true
            });
            // when bubbling the ctrl+wheel event, we don't want the webpage
            // embedding our map to be resized so we need to stop the event
            // at the iframe level
            document.body.addEventListener('wheel', function(event) {
              if (event.ctrlKey) {
                datetimeLastAction = null;
                $rootScope.$emit('gaHideEmbeddedOverlay');
                event.preventDefault();
                event.stopPropagation();
                return false;
              }
            }, false);
            // handling touch event (mobile devices)
            document.body.addEventListener('touchstart', function(touchEvent) {
              // if one finger gesture, show overlay
              if (touchEvent.touches.length <= 1) {
                datetimeLastAction = $window.moment();
                $rootScope.$emit('gaShowEmbeddedOverlay',
                    $translate.instant('embedded_touch_hint'));
                hideAfterAWhileIfSameDatetime(datetimeLastAction);
              } else {
                $rootScope.$emit('gaHideEmbeddedOverlay');
                // preventing two fingers zoom gesture to be transmitted
                // to embedding parent so that the webpage isn't zoomed
                touchEvent.preventDefault();
                return false;
              }
            });
          }
        };
      });

  // Simple directive with a on/off piece of HTML that will hint the user
  // as to how to interact with the embedded map
  module.directive('gaEmbeddedScrollOverlay', function($rootScope) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl:
        'components/embeddedscroll/partials/embedded-scroll-overlay.html',
      link: function(scope, element, attrs) {
        $rootScope.$on('gaShowEmbeddedOverlay', function(event, hintMessage) {
          if (hintMessage) {
            scope.$apply(function() {
              scope.hintMessage = hintMessage;
            })
          }
        });
        $rootScope.$on('gaHideEmbeddedOverlay', function(event) {
          scope.$apply(function() {
            scope.hintMessage = null;
          });
        })
      }
    };
  });
})();
