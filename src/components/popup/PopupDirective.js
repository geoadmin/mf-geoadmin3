goog.provide('ga_popup_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_print_service');
(function() {

  var module = angular.module('ga_popup_directive', [
    'ga_browsersniffer_service',
    'ga_print_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaPopup',
    function($rootScope, $translate, gaBrowserSniffer, gaPrintService) {
      var zIndex = 2000;
      var bringUpFront = function(el) {
        zIndex += 1;
        el.css('z-index', zIndex);
        $rootScope.$emit('gaPopupFocused', el);
      };
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          toggle: '=gaPopup',
          optionsFunc: '&gaPopupOptions' // Options from directive
        },
        templateUrl: 'components/popup/partials/popup.html',
        link: function(scope, element, attrs) {

          // Initialize the popup properties
          scope.toggle = scope.toggle || false;
          scope.isReduced = false;
          scope.options = scope.optionsFunc() || {title: ''};
          scope.titlePrint = $translate.instant('print');
          scope.titleHelp = $translate.instant('help_label');
          scope.titleReduce = $translate.instant('reduce_label');
          scope.titleClose = $translate.instant('close');

          // Per default hide the print function
          if (!angular.isDefined(scope.options.showPrint) ||
              gaBrowserSniffer.mobile) {
            scope.options.showPrint = false;
          }
          // Per default, no help button shown
          if (!angular.isDefined(scope.options.help) ||
              gaBrowserSniffer.mobile) {
            scope.options.help = false;
          }
          // Per default show the reduce function
          if (!angular.isDefined(scope.options.showReduce) ||
              gaBrowserSniffer.mobile) {
            scope.options.showReduce = true;
          }
          // Bring thre popup to front on click on it.
          element.find('.popover-content').click(function(evt) {
            if (!scope.isReduced && scope.toggle &&
                element.css('z-index') != zIndex) {
              bringUpFront(element);
            }
          });

          // Set default x and y values on non mobile device if not defined
          if (!gaBrowserSniffer.mobile && !scope.options.x &&
              !scope.options.y) {
            scope.options.x =
                $(document.body).width() / 2 - element.width() / 2;
            scope.options.y = 89; //89 is the default size of the header
          }

          if (!gaBrowserSniffer.mobile) {
            element.css({
              left: scope.options.x,
              top: scope.options.y
            });
          }

          // Add close popup function
          scope.close = function(evt) {
            if (evt) {
              evt.stopPropagation();
              evt.preventDefault();
            }
            scope.isReduced = false;
            scope.toggle = false;
          };

          scope.print = scope.options.print ||
              (function() {
                var contentEl = element.find('.ga-popup-content');
                gaPrintService.htmlPrintout(contentEl.clone().html());
              });

          scope.reduce = function(evt) {
            evt.stopPropagation();
            scope.isReduced = true;
          };

          // Expand only if necessary
          scope.controlDisplay = function(evt) {
            evt.stopPropagation();
            // Controls the popup order
            if (scope.toggle) {
              bringUpFront(element);
            }
            scope.isReduced = false;
          };

          // Watch the shown property
          scope.$watch(
            'toggle',
            function(newVal, oldVal) {
              // in some case newVal is equal to oldVal when it shouldn't,
              // so we make  a test if the popup is displayed or not
              if (newVal != oldVal ||
                (newVal != (element.css('display') == 'block'))) {

                if (scope.isReduced) {
                  scope.isReduced = false;
                  scope.toggle = true;
                  return;
                }

                element.toggle(newVal);

                if (!newVal) {
                  scope.isReduced = false;
                  onClose();
                } else if (newVal) {
                  bringUpFront(element);
                }
              }
            }
          );

          var header = element.find('.popover-title');
          scope.$watch('isReduced', function(newVal, oldVal) {
            if (newVal != oldVal) {
              element.toggleClass('ga-popup-reduced', scope.isReduced);
              // Deactivate draggable directive
              header.toggleClass('ga-draggable-zone', !scope.isReduced);

              // To keep a reference for the parent scope
              scope.options.isReduced = scope.isReduced;
            }
          });

          var deregister = [];
          deregister.push($rootScope.$on('$translateChangeEnd', function() {
            scope.titlePrint = $translate.instant('print');
            scope.titleHelp = $translate.instant('help_label');
            scope.titleReduce = $translate.instant('reduce_label');
            scope.titleClose = $translate.instant('close');
          }));

          // This scope can be destroyed manually by the gaPopupService
          // so we deregister event on rootScope when it's happening
          scope.$on('$destroy', function(evt, args) {
            for (var i = 0, ii = deregister.length; i < ii; i++) {
              deregister[i]();
            }
          });

          // Execute the custom close callback
          var onClose = function() {
            if (scope.options.close) {
              scope.options.close();
            }
          };

          $rootScope.$on('gaPopupFocused', function(evt, el) {
            var isFocused = (el == element);
            if (scope.hasFocus != isFocused) {
              scope.$broadcast('gaPopupFocusChange', isFocused);
              scope.hasFocus = isFocused;
            }
          });

          element.addClass('popover');
          element.css('display', 'none'); // hidden by default
        }
      };
    }
  );
})();
