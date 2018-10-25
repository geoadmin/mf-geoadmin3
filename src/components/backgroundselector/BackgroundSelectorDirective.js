goog.provide('ga_backgroundselector_directive');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_event_service');

(function() {
  var module = angular.module('ga_backgroundselector_directive', [
    'ga_background_service',
    'ga_event_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaBackgroundSelector', function(
      $window,
      $translate,
      $rootScope,
      gaBackground,
      gaEvent,
      gaBrowserSniffer
  ) {
    return {
      restrict: 'A',
      templateUrl:
        'components/backgroundselector/partials/backgroundselector.html',
      scope: {
        map: '=gaBackgroundSelectorMap',
        ol3d: '=gaBackgroundSelectorOl3d',
        globals: '=gaBackgroundSelectorGlobals'
      },
      link: function(scope, elt, attrs) {
        scope.isBackgroundSelectorClosed = true;
        scope.backgroundLayers = [];
        scope.styleUrl = false;
        scope.mobile = gaBrowserSniffer.mobile;

        scope.$watch('currentLayer', function(newVal, oldVal) {
          if (oldVal !== newVal) {
            gaBackground.set(scope.map, newVal);
          }
        });

        scope.activateBackgroundLayer = function(bgLayer) {
          if (scope.currentLayer !== bgLayer) {
            var ol3dEnabled = scope.ol3d && scope.ol3d.getEnabled();
            if (!(bgLayer.disable3d && ol3dEnabled)) {
              scope.currentLayer = bgLayer;
              scope.styleUrl = !!scope.currentLayer.styleUrl;
            }
          }
          scope.toggleMenu();
        };

        scope.toggleMenu = function() {
          elt.toggleClass('ga-open');
        };

        scope.activeEdit = function(bg) {
          $rootScope.$broadcast('gaActiveEdit', bg.olLayer);
        };

        scope.getClass = function(layer) {
          if (layer) {
            var selected =
              scope.currentLayer && layer.id === scope.currentLayer.id;
            var splitLayer = layer.id.split('.');
            return (
              (selected ? 'ga-bg-highlight ' : '') +
              'ga-' +
              splitLayer[splitLayer.length - 2] +
              ' ' +
              (layer.disable3d ? 'ga-disable3d' : '')
            );
          }
        };

        // Get the first background with the loadConfig promise: this
        // directive may not be listening to the first broadcast.
        gaBackground.loadConfig().then(function() {
          scope.backgroundLayers = gaBackground.getBackgrounds();
          scope.currentLayer = gaBackground.get();
          scope.styleUrl = !!scope.currentLayer.styleUrl;
        });
        scope.$on('gaBgChange', function(evt, newBg) {
          if (!scope.currentLayer || newBg.id !== scope.currentLayer.id) {
            scope.currentLayer = newBg;
          }
        });

        var showWarning = function(layer) {
          var url =
            layer && layer.styleUrl ?
              layer.styleUrl :
              scope.currentLayer.styleUrl;
          $window.alert(
              $translate.instant(
                  'external_data_warning').replace('--URL--', url)
          );
        };

        scope.showWarning = function(layer) {
          if (scope.mobile) return
          showWarning(layer);
        };

        if (!scope.mobile) {
          var tooltipOptions = {
            trigger: 'manual',
            selector: '.fa-user',
            container: 'body',
            placement: 'top',
            title: function() {
              return $translate.instant('external_data_tooltip');
            },
            template:
              '<div class="tooltip ga-red-tooltip">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner"></div>' +
              '</div>'
          };
          gaEvent.onMouseOverOut(elt, function(evt) {
            var link = $(evt.target);
            if (!link.data('bs.tooltip')) {
              link.tooltip(tooltipOptions);
            }
            link.tooltip('show');
          }, function(evt) {
            $(evt.target).tooltip('hide');
          }, tooltipOptions.selector);
        }

        // alert message only on long press on mobile
        if (scope.mobile) {
          elt.parent().find('button').on('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showWarning();
          });
        }

        elt.find('.ga-bg-layer-bt').on('click', scope.toggleMenu);
      }
    };
  });
})();
