goog.provide('ga_popup_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_print_service');
goog.require('ga_window_service');
(function() {

  var module = angular.module('ga_popup_directive', [
    'ga_browsersniffer_service',
    'ga_print_service',
    'pascalprecht.translate',
    'ga_window_service'
  ]);

  module.directive('gaPopup',
    function($rootScope, $translate, $window, gaBrowserSniffer, gaPrint,
        gaWindow) {
      var zIndex;
      var screenLimit = 'xs';

      var bringUpFront = function(el) {
        // We get the initial z-index css.
        var currZIndex = parseInt(el.css('z-index'));
        if (!zIndex) {
          zIndex = 2500; // same as in popup.less
          zIndex++;
        }
        if (!currZIndex || zIndex > currZIndex) {
          el.css('z-index', ++zIndex);
        }
        $rootScope.$emit('gaPopupFocused', el);
      };

      var isScreenBiggerThanS = function() {
        return gaWindow.isWidth('>s') && gaWindow.isHeight('>s');
      };

      var updatePosition = function(scope, element, pixel) {
        if (isScreenBiggerThanS() && scope.options.x && scope.options.y) {
          pixel = pixel || [];
          element.css({
            left: pixel[0] || scope.options.x,
            top: pixel[1] || scope.options.y,
            transform: 'translate3d(0, 0, 0)'
          });
        }
      };

      return {
        restrict: 'A',
        transclude: true,
        scope: {
          toggle: '=gaPopup',
          map: '=gaPopupMap',
          optionsFunc: '&gaPopupOptions' // Options from directive
        },
        templateUrl: 'components/popup/partials/popup.html',
        link: function(scope, element, attrs) {
          var header = element.find('.popover-title');

          // Init css
          element.addClass('popover');

          // Init some utilities variables.
          var className = element[0].className;
          if (/ga-popup-tablet/.test(className)) {
            screenLimit = 's';
          }
          if (/ga-popup-mobile/.test(className)) {
            screenLimit = 'xs';
          }

          // Initialize the popup properties
          scope.toggle = scope.toggle || false;
          scope.options = scope.optionsFunc() || {title: ''};
          scope.options.isReduced = false;

          // Per default hide the print function
          if (!angular.isDefined(scope.options.showPrint)) {
            scope.options.showPrint = false;
          }
          // Per default, no help button shown
          if (!angular.isDefined(scope.options.help)) {
            scope.options.help = false;
          }
          // Per default show the reduce function
          if (!angular.isDefined(scope.options.showReduce)) {
            scope.options.showReduce = true;
          }
          // Bring the popup to front on click on it.
          element.find('.popover-content').click(function(evt) {
            if (!scope.options.isReduced && scope.toggle) {
              bringUpFront(element);
            }
          });

          // Set default x and y values on non mobile device if not defined
          if (isScreenBiggerThanS() && !scope.options.position) {
            if (angular.isFunction(scope.options.x)) {
              scope.options.x = scope.options.x(element);
            }
            if (angular.isFunction(scope.options.y)) {
              scope.options.y = scope.options.y(element);
            }
            scope.options.x = scope.options.x ||
                $(document.body).width() / 2 - element.width() / 2;
            scope.options.y = scope.options.y || 89; //89 size of the header
          }

          // if a map is apecified that mean the popup must attached to a
          // coordinate and moved on pan.
          var oldCoord, deregOl = [];
          if (scope.map) {
            deregOl.push(scope.map.on('postrender', function() {
              if (oldCoord && scope.options.x && scope.options.y) {
                var pixel = scope.map.getPixelFromCoordinate(oldCoord);
                var x = (pixel[0] - scope.options.x) + 'px';
                var y = (pixel[1] - scope.options.y) + 'px';
                element.css({
                  transform: 'translate3d(' + x + ', ' + y + ', 0)',
                  '-ms-transform': 'translateX(' + x + ') translateY(' + y + ')'
                });
              }
            }));
          }
          // Add close popup function
          scope.close = function(evt) {
            if (evt) {
              evt.stopPropagation();
              evt.preventDefault();
            }
            scope.options.isReduced = false;
            scope.toggle = false;
          };

          scope.print = scope.options.print || (function() {
            var contentEl = element.find('.ga-popup-content');
            gaPrint.htmlPrintout(contentEl.clone().html());
          });

          scope.reduce = function(evt) {
            evt.stopPropagation();
            scope.options.isReduced = true;
          };

          // Expand only if necessary
          scope.controlDisplay = function(evt) {
            evt.stopPropagation();
            // Controls the popup order
            if (scope.toggle) {
              bringUpFront(element);
            }
            scope.options.isReduced = false;
          };

          // Watch the shown property
          scope.$watch('toggle', function(newVal, oldVal) {
            // in some case newVal is equal to oldVal when it shouldn't,
            // so we make  a test if the popup is displayed or not
            if (newVal != oldVal ||
              (newVal != (element.css('display') == 'block'))) {

              if (scope.options.isReduced) {
                scope.options.isReduced = false;
                scope.toggle = true;
                return;
              }

              updatePosition(scope, element);
              element.toggle(newVal);

              if (!newVal) {
                scope.options.isReduced = false;
                if (scope.options.close) {
                  scope.options.close();
                }
              } else if (newVal) {
                bringUpFront(element);
              }
            }
          });

          scope.$watch('options.isReduced', function(newVal, oldVal) {
            if (newVal != oldVal) {
              element.toggleClass('ga-popup-reduced', scope.options.isReduced);
              // Deactivate draggable directive
              if (element.attr('ga-draggable')) {
                header.toggleClass('ga-draggable-zone',
                    !scope.options.isReduced);
              }
            }
          });

          scope.$watchGroup([
            'options.x',
            'options.y'
          ], function(newValues, oldValues, scope) {
            if (scope.map && newValues[0] && newValues[1]) {
              oldCoord = scope.map.getCoordinateFromPixel(newValues);
            }
            updatePosition(scope, element);
          });

          scope.$on('gaPopupFocused', function(evt, el) {
            var isFocused = (el == element);
            if (scope.hasFocus != isFocused) {
              scope.$broadcast('gaPopupFocusChange', isFocused);
              scope.hasFocus = isFocused;
            }
          });

          var moveOnWindow = function() {
            if (scope.options.isReduced) {
              return;
            }
            if (gaWindow.isWidth('>' + screenLimit)) {
              var winWidth = win.width();
              var winHeight = win.height();
              var popupWidth = element.outerWidth();
              var popupHeight = element.outerHeight();
              var offset = element.offset();
              var x = offset.left;
              var y = offset.top;
              if (x + popupWidth > winWidth) {
                x = winWidth - popupWidth;
              }
              if (y + popupHeight > winHeight) {
                y = winHeight - popupHeight;
                if (y < 0) {
                  y = 0;
                }
              }
              element.css({
                width: popupWidth + 'px',
                top: y + 'px',
                left: x + 'px'
              });
            }
          };

          var win;
          if (!scope.options.position && !scope.map) {
            // If the position is not defined we try to keep the entire popup
            // inside the window.
            // Adjust element's position and keep fixed width
            // when window is resized (except for small screens)
            win = $($window).on('resize', moveOnWindow);
          }
          if (scope.options.container) {
            $(scope.options.container).append(element);
          }

          // This scope can be destroyed manually by the gaPopupService
          // so we deregister event on rootScope/window/map when it's happening
          scope.$on('$destroy', function() {
            if (win) {
              win.off('resize', moveOnWindow);
            }
            deregOl.forEach(function(deregFunc) {
              deregFunc();
            });
          });

        }
      };
    }
  );
})();
