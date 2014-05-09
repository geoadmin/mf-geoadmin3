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
          'ng-click="expand()">' +
          '<span translate>{{options.title}}</span>' +
          '<i class="ga-popup-close hidden-print"' +
          ' ng-click="close($event)">&times</i>' +
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

          // Get the popup options
          scope.options = scope.optionsFunc();
          scope.titlePrint = $translate('print_action');
          scope.titleHelp = $translate('help_label');
          scope.titleReduce = $translate('reduce_label');
          scope.titleExpand = $translate('expand_label');
          scope.isReduced = false;

          if (!scope.options) {
            scope.options = {
              title: ''
            };
          }

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


          // Move the popup to its original position, only used on desktop
          scope.moveToOriginalPosition = function() {
            element.css({
              left: scope.options.x ||
                $(document.body).width() / 2 - element.width() / 2,
              top: scope.options.y || 89 //89 is the default size of the header
            });
          };

          // Add close popup function
          scope.close = scope.options.close ||
              (function(event) {
                if (event) {
                  event.stopPropagation();
                  event.preventDefault();
                }
                if (angular.isDefined(scope.toggle)) {
                  scope.toggle = false;
                } else {
                  element.hide();
                }
                scope.isReduced = false;
              });

          scope.print = scope.options.print ||
              (function() {
                var contentEl = element.find('.ga-popup-content');
                gaPrintService.htmlPrintout(contentEl.clone().html());
              });

          scope.reduce = scope.options.reduce ||
              (function(evt) {
                evt.stopPropagation();
                scope.isReduced = true;
              });

          // Expand only if necessary
          scope.expand = scope.options.expand ||
              (function() {
                scope.isReduced = false;
              });

          element.addClass('popover');


          // Move the popup to the correct position
          if (!gaBrowserSniffer.mobile) {
            scope.moveToOriginalPosition();
          }

          // Watch the shown property
          scope.$watch(
            'toggle',
            function(newVal, oldVal) {
              if (newVal != oldVal) {
                element.toggle(newVal);
                scope.moveToOriginalPosition();
                if (!newVal) {
                  scope.isReduced = false;
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

          $rootScope.$on('$translateChangeEnd', function() {
            scope.titlePrint = $translate('print_action');
          });
        }
      };
    }
  );
})();
