(function() {
  goog.provide('ga_popup_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_print_service');

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
      };
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          toggle: '=gaPopup',
          optionsFunc: '&gaPopupOptions' // Options from directive
        },
        template:
          '<h4 class="popover-title ga-popup-title" ' +
              'ng-click="controlDisplay($event)">' +
            '<span translate>{{options.title}}</span>' +
            '<button ' +
               'class="ga-popup-close hidden-print" ' +
               'ng-click="close($event)">&times</button>' +
            '<button ' +
               'class="icon-minus ga-popup-reduce hidden-print" ' +
               'title="{{titleReduce}}" ' +
               'ng-if="options.showReduce" ' +
               'ng-click="reduce($event)"></button>' +
            '<button ' +
               'class="icon-print ga-popup-print hidden-print" ' +
               'title="{{titlePrint}}" ' +
               'ng-if="options.showPrint" ' +
               'ng-click="print()"></button>' +
            '<button ' +
               'class="ga-popup-help hidden-print" ' +
               'title="{{titleHelp}}" ' +
               'ng-if="options.help" ' +
               'ga-help="{{options.help}}"></button>' +
          '</h4>' +
          '<div class="popover-content ga-popup-content" ' +
               'ng-click="bringUpFront($event)" ' +
               'ng-transclude>' +
          '</div>',

        link: function(scope, element, attrs) {

          // Initialize the popup properties
          scope.toggle = scope.toggle || false;
          scope.isReduced = false;
          scope.options = scope.optionsFunc() || {title: ''};
          scope.titlePrint = $translate('print_action');
          scope.titleHelp = $translate('help_label');
          scope.titleReduce = $translate('reduce_label');

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

          scope.bringUpFront = function(evt) {
            evt.stopPropagation();
            if (!scope.isReduced && scope.toggle) {
              bringUpFront(element);
            }
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

          var header = element.find('h4');
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
            scope.titlePrint = $translate('print_action');
            scope.titleHelp = $translate('help_label');
            scope.titleReduce = $translate('reduce_label');
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

          element.addClass('popover');
          element.css('display', 'none'); // hidden by default
        }
      };
    }
  );
})();
