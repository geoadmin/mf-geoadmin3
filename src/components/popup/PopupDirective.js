(function() {
  goog.provide('ga_popup_directive');
  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_popup_directive', [
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaPopup',
    function($rootScope, $translate, gaBrowserSniffer) {
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          toggle: '=gaPopup',
          optionsFunc: '&gaPopupOptions' // Options from directive
        },
        template:
          '<h4 class="popover-title ga-popup-title">' +
          '<span translate>{{options.title}}</span>' +
          '<button type="button" class="close" ng-click="close($event)">' +
          '&times;</button>' +
          '<i class="icon-print ga-popup-print" title="{{titlePrint}}" ' +
          'ng-if="options.showPrint" ng-click="print()"></i>' +
          '</h4>' +
          '<div class="popover-content ga-popup-content" ' +
          'ng-transclude>' +
          '</div>',

        link: function(scope, element, attrs) {

          // Get the popup options
          scope.options = scope.optionsFunc();
          scope.titlePrint = $translate('print_action');

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
              });

          scope.print = scope.options.print ||
              (function() {
                var cssLinks = angular.element.find('link');
                var contentEl = element.find('.ga-popup-content');
                var windowPrint = window.open('', '', 'height=400, width=600');
                windowPrint.document.write('<html><head>');
                for (var i = 0; i < cssLinks.length; i++) {
                  if (cssLinks[i].href) {
                    var href = cssLinks[i].href;
                    if (href.indexOf('app.css') !== -1) {
                      windowPrint.document.write('<link href="' + href +
                          '" rel="stylesheet" type="text/css" media="screen">');
                      windowPrint.document.write('<link href="' +
                          href.replace('app.css', 'print.css') +
                          '" rel="stylesheet" type="text/css" media="print">');
                    }
                  }
                }
                windowPrint.document.write('</head><body ' +
                    'onload="window.print(); window.close();">');
                windowPrint.document.write(contentEl.clone().html());
                windowPrint.document.write('</body></html>');
                windowPrint.document.close();
              });

          // Move the popup to the correct position
          element.addClass('popover ga-popup');
          if (!gaBrowserSniffer.mobile) {
            element.css({
              left: scope.options.x ||
                $(document.body).width() / 2 - element.width() / 2,
              top: scope.options.y || 150
            });
          }

          // Watch the shown property
          scope.$watch(
            'toggle',
            function(newVal, oldVal) {
              if (newVal != oldVal) {
                element.toggle(newVal);
              }
            }
          );

          $rootScope.$on('$translateChangeEnd', function() {
            scope.titlePrint = $translate('print_action');
          });
        }
      };
    }
  );
})();
