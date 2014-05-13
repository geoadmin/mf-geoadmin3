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
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          toggle: '=gaPopup',
          optionsFunc: '&gaPopupOptions' // Options from directive
        },
        template:
          '<h4 class="popover-title ga-popup-title" ' +
              'ng-click="expand($event)">' +
            '<span translate>{{options.title}}</span>' +
            '<i class="ga-popup-close hidden-print" ' +
               'ng-click="close($event)">&times</i>' +
            '<i class="icon-minus ga-popup-reduce hidden-print" ' +
               'title="{{titleReduce}}" ' +
               'ng-if="options.showReduce" ng-click="reduce($event)"></i>' +
            '<i class="icon-print ga-popup-print hidden-print" ' +
               'title="{{titlePrint}}" ' +
               'ng-if="options.showPrint" ng-click="print()"></i>' +
            '<span title="{{titleHelp}}" ng-if="options.help" ' +
                  'ga-help="{{options.help}}"></span>' +
          '</h4>' +
          '<div class="popover-content ga-popup-content" ' +
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


          // Add close popup function
          scope.close = function(evt) {
            if (evt) {
              evt.stopPropagation();
              evt.preventDefault();
            }
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
          scope.expand = function(evt) {
            evt.stopPropagation();
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
                if (!gaBrowserSniffer.mobile && newVal) {
                  moveToOriginalPosition();
                }

                element.toggle(newVal);

                if (!newVal) {
                  scope.isReduced = false;
                  onClose();
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

          /* Utils  */
          // Move the popup to its original position, only used on desktop
          var moveToOriginalPosition = function() {
            element.css({
              left: scope.options.x ||
                $(document.body).width() / 2 - element.width() / 2,
              top: scope.options.y || 89 //89 is the default size of the header
            });
          };

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
