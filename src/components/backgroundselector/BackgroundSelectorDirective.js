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
        isEditActive: '=gaBackgroundSelectorIsEditActive'
      },
      link: function(scope, elt) {
        scope.isBackgroundSelectorClosed = true;
        scope.backgroundLayers = [];
        scope.mobile = gaBrowserSniffer.mobile;
        scope.activeEditLayerId = '';

        scope.$watch('currentLayer', function(newVal, oldVal) {
          if (oldVal !== newVal) {
            gaBackground.set(scope.map, newVal);
          }
        });

        var activateBackgroundLayer = function(bgLayer) {
          if (scope.currentLayer !== bgLayer) {
            var ol3dEnabled = scope.ol3d && scope.ol3d.getEnabled();
            if (!(bgLayer.disable3d && ol3dEnabled)) {
              scope.currentLayer = bgLayer;
              scope.activeEditLayerId =
                  !bgLayer.disableEdit && scope.isEditActive ? bgLayer.id : '';
            }
          }
        };

        scope.activateBackgroundLayer = function(bgLayer) {
          activateBackgroundLayer(bgLayer);
          scope.toggleMenu();
        };

        scope.toggleMenu = function() {
          elt.toggleClass('ga-open');
        };

        scope.toggleEdit = function(bg) {
          $rootScope.$broadcast('gaToggleEdit', bg.olLayer);
        };

        scope.toggleEditSmallScreen = function(bg) {
          scope.activateBackgroundLayer(bg);
          scope.toggleEdit(bg);
        };

        scope.$watch('isEditActive', function(newVal) {
          scope.activeEditLayerId = newVal ? scope.currentLayer.id : '';
        });

        scope.getClass = function(layer) {
          if (layer) {
            var selected =
              scope.currentLayer && layer.id === scope.currentLayer.id;
            var splitLayer = layer.id.split('.');
            var layerClass = splitLayer[splitLayer.length - 1] === 'vt' ?
              splitLayer[splitLayer.length - 2] :
              splitLayer[splitLayer.length - 1];
            return (
              (selected ? 'ga-bg-highlight ' : '') +
              'ga-' + layerClass +
              (layer.disable3d ? ' ga-disable3d' : '')
            );
          }
        };

        // Get the first background with the loadConfig promise: this
        // directive may not be listening to the first broadcast.
        gaBackground.loadConfig().then(function() {
          scope.backgroundLayers = gaBackground.getBackgrounds();
          scope.currentLayer = gaBackground.get();

          // alert message only on long press on mobile
          if (scope.mobile) {
            scope.$applyAsync(function() {
              elt.find('.fa-user').on('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showWarning(scope.currentLayer);
              });
            });
          }
        });

        scope.$on('gaBgChange', function(evt, newBg) {
          if (!scope.currentLayer || newBg.id !== scope.currentLayer.id) {
            scope.currentLayer = newBg;
          }
        });

        var showWarning = function(layer) {
          if (layer && layer.olLayer) {
            var url = layer.olLayer.externalStyleUrl ||
                layer.olLayer.styles[0].url;
            $window.alert($translate.instant('external_data_warning').
                replace('--URL--', url)
            );
          }
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

        elt.find('.ga-bg-layer-bt').on('click', scope.toggleMenu);
      }
    };
  });
})();
