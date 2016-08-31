goog.provide('ga_layermanager_directive');

goog.require('ga_attribution_service');
goog.require('ga_layermetadatapopup_service');
goog.require('ga_map_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_layermanager_directive', [
    'pascalprecht.translate',
    'ga_layermetadatapopup_service',
    'ga_map_service',
    'ga_attribution_service',
    'ga_urlutils_service'
  ]);

  /**
   * Filter to display a correct time label in all possible situations
   */
  module.filter('gaTimeLabel', function($translate) {
    var maxYear = (new Date()).getFullYear();
    return function(input, layer) {
      // input values possible: 1978, '1978', '19783112', '99993112', undefined
      // if layer is WMTS:
      //   if timeselector not active:
      //      '99993112' ==> $translate.instant('all');
      //   else :
      //      undefined ==> '-'
      //      '19783112' ==> '1978'
      // if layer is WMS or others:
      //   if timeselector not active:
      //      undefined ==> ''
      //   else
      //      1978  ==> '1978'
      if (!input) {
        return (layer.getSource() instanceof ol.source.WMTS) ? '-' :
            $translate.instant('time_all');
      }
      var yearNum = input;
      if (angular.isString(input)) {
        yearNum = parseInt(input.substring(0, 4));
      }
      return (yearNum <= maxYear) ? yearNum : $translate.instant('time_all');
    }
  });

  module.directive('gaLayermanager', function($compile, $timeout,
      $rootScope, $translate, $window, gaBrowserSniffer, gaLayerFilters,
      gaLayerMetadataPopup, gaLayers, gaAttribution, gaUrlUtils,
      gaMapUtils) {

    // Timestamps list template
    var tpl =
      '<div class="ga-layer-timestamps">' +
        '<div tabindex="1" ng-if="tmpLayer.type == \'wms\'" ' +
             'ng-class="{badge: !tmpLayer.time}" ' +
             'ng-click="setLayerTime(tmpLayer)" ' +
             'translate>time_all</div> ' +
        '<div tabindex="1" ng-repeat="i in tmpLayer.timestamps" ' +
             'ng-class="{badge: (tmpLayer.time == i)}" ' +
             'ng-click="setLayerTime(tmpLayer, i)">' +
          '{{i | gaTimeLabel:tmpLayer}}' +
        '</div>' +
      '</div>';

    // Create the popover
    var popover, content, container, callback;
    var win = $($window);
    var createPopover = function(target, element, scope) {

      // Lazy load
      if (!container) {
        container = element.parent();
        callback = function(evt) {
          destroyPopover(element);
        };
      }

      popover = $(target).popover({
        container: container,
        content: content,
        html: true,
        placement: 'auto right',
        title: $translate.instant('time_select_year') +
            '<button class="ga-icon ga-btn fa fa-remove"></button>',
        trigger: 'focus'
      }).popover('show');
      element.on('scroll', callback);
      win.on('resize', callback);
    };

    // Remove the popover
    var destroyPopover = function(element) {
      if (popover) {
        popover.popover('destroy');
        popover = undefined;
        element.off('scroll', callback);
        win.off('resize', callback);
      }
    };

    return {
      restrict: 'A',
      templateUrl: 'components/layermanager/partials/layermanager.html',
      scope: {
        map: '=gaLayermanagerMap'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        scope.mobile = gaBrowserSniffer.mobile;

        // Compile the time popover template
        content = $compile(tpl)(scope);

        // The ngRepeat collection is the map's array of layers. ngRepeat
        // uses $watchCollection internally. $watchCollection watches the
        // array, but does not shallow watch the array items! The array
        // items are OpenLayers layers, we don't want Angular to shallow
        // watch them.
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.selected;
        scope.$watchCollection('layers | filter:layerFilter', function(items) {
          scope.filteredLayers = (items) ? items.slice().reverse() : [];
          scope.enableDragAndDrop();
        });

        // Use to disable drag and drop if the user drops the layer at its
        // initial place.
        var dragging = false;
        var slip;
        var list;

        var slipReorderCallback = function(evt) {
          // The slip:reorder may be fired multiple times. If the dropped
          // already took place, we mustn't do anything.
          if (!dragging) {
            evt.preventDefault();
            return;
          }

          var delta = evt.detail.originalIndex - evt.detail.spliceIndex;
          var layer = scope.filteredLayers[evt.detail.originalIndex];

          if (delta !== 0) {
            evt.target.parentNode.insertBefore(
                evt.target, evt.detail.insertBefore);
            scope.moveLayer(evt, layer, delta);
            scope.disableDragAndDrop();
          }
        };

        var slipBeforeReorderCallback = function(evt) {
          if (evt.target.nodeName === 'BUTTON') {
            evt.preventDefault();
          }
        };

        var slipBeforeSwipeCallback = function(evt) {
          evt.preventDefault();
        };

        scope.disableDragAndDrop = function() {
          if (gaBrowserSniffer.msie && gaBrowserSniffer.msie < 10) {
            return;
          }
          dragging = false;
          if (slip) {
            slip.detach();
            list.removeEventListener('slip:reorder', slipReorderCallback);
            list.removeEventListener('slip:beforereorder',
                slipBeforeReorderCallback);
            list.removeEventListener('slip:beforeswipe',
                slipBeforeSwipeCallback);
          }
          // Force a $digest so the new order of the layers is correctly taken
          // into account.
          scope.$applyAsync();
        };

        scope.enableDragAndDrop = function() {
          if (gaBrowserSniffer.msie && gaBrowserSniffer.msie < 10) {
            return;
          }

          dragging = true;

          list = element.find('> ul').get(0);
          if (!slip) {
            slip = new Slip(list);
          } else {
            slip.attach(list);
          }

          list.addEventListener('slip:reorder', slipReorderCallback);
          list.addEventListener('slip:beforereorder',
              slipBeforeReorderCallback);
          list.addEventListener('slip:beforeswipe', slipBeforeSwipeCallback);
        };

        // On mobile we use a classic select box, on desktop a popover
        if (!scope.mobile) {
          // Simulate a select box with a popover
          scope.displayTimestamps = function(evt, layer) {
            if (popover && popover[0] === evt.target) {
              destroyPopover(element);
            } else {
              destroyPopover(element);
              scope.tmpLayer = layer;
              // We use timeout otherwise the popover is bad centered.
              $timeout(function() {
                createPopover(evt.target, element, scope);
              }, 100, false);
            }
            evt.preventDefault();
            evt.stopPropagation();
          };
        } else {
          scope.displayTimestamps = function() {};
        }

        scope.isDefaultValue = function(timestamp) {
          if (timestamp && timestamp.length) {
            return (timestamp.substring(0, 4) === '9999') ? 'ga-black' : '';
          }
          return (!timestamp || timestamp === 9999) ? 'ga-black' : '';
        };

        var dupId = 0;
        scope.duplicateLayer = function(evt, layer) {
          var dupLayer = gaLayers.getOlLayerById(layer.bodId);
          dupLayer.time = layer.time;
          dupLayer.id = layer.id + '_' + dupId++;
          var index = scope.layers.indexOf(layer);
          map.getLayers().insertAt(index, dupLayer);
          evt.preventDefault();
        };

        scope.moveLayer = function(evt, layer, delta) {
          var index = scope.layers.indexOf(layer);
          var layersCollection = map.getLayers();
          var insertIndex;
          // Find the next/previous layer with zIndex=0
          for (var i = index + delta; i < layersCollection.getLength() ||
              i >= 0; i += delta) {
            if (layersCollection.item(i).getZIndex() === 0) {
              insertIndex = i;
              break;
            }
          }
          layersCollection.removeAt(index);
          layersCollection.insertAt(insertIndex, layer);
          evt.preventDefault();
        };

        scope.removeLayer = function(layer) {
          map.removeLayer(layer);
        };

        scope.isBodLayer = function(layer) {
          return layer.bodId && !!gaLayers.getLayer(layer.bodId);
        };

        scope.hasMetadata = function(layer) {
          return scope.isBodLayer(layer) ||
              gaMapUtils.isExternalWmsLayer(layer);
        };

        scope.showWarning = function(layer) {
          var url = gaUrlUtils.isValid(layer.url) ?
              gaUrlUtils.getHostname(layer.url) : layer.url;
          $window.alert($translate.instant('external_data_warning')
              .replace('--URL--', url));
        };

        scope.displayLayerMetadata = function(evt, layer) {
          gaLayerMetadataPopup.toggle(layer);
          evt.preventDefault();
        };

        scope.setLayerTime = function(layer, time) {
          layer.time = time;
          destroyPopover(element);
        };

        scope.useRange = (!gaBrowserSniffer.mobile && (!gaBrowserSniffer.msie ||
            gaBrowserSniffer.msie > 9));

        if (!scope.useRange) {
          scope.opacityValues = [
            { key: '1' , value: '100%'},
            { key: '0.95' , value: '95%' }, { key: '0.9' , value: '90%' },
            { key: '0.85' , value: '85%' }, { key: '0.8' , value: '80%' },
            { key: '0.75' , value: '75%' }, { key: '0.7' , value: '70%' },
            { key: '0.65' , value: '65%' }, { key: '0.6' , value: '60%' },
            { key: '0.55' , value: '55%' }, { key: '0.5' , value: '50%' },
            { key: '0.45' , value: '45%' }, { key: '0.4' , value: '40%' },
            { key: '0.35' , value: '35%' }, { key: '0.3' , value: '30%' },
            { key: '0.25' , value: '25%' }, { key: '0.2' , value: '20%' },
            { key: '0.15' , value: '15%' }, { key: '0.1' , value: '10%' },
            { key: '0.05' , value: '5%' }, { key: '0' , value: '0%' }
          ];
        }

        // Toggle layer tools for small screen
        element.on('click', '.fa-gear', function() {
          var li = $(this).closest('li');
          li.toggleClass('ga-layer-folded');
          $(this).closest('ul').find('li').each(function(i, el) {
            if (el != li[0]) {
              $(el).addClass('ga-layer-folded');
            }
          });
        });

        if (!scope.mobile) {
          // Display the third party data tooltip
          element.tooltip({
            selector: '.fa-user',
            container: 'body',
            placement: 'right',
            title: function(elm) {
              return $translate.instant('external_data_tooltip');
            },
            template:
              '<div class="tooltip ga-red-tooltip">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner"></div>' +
              '</div>'
          });
        }

        // Change layers label when topic changes
        scope.$on('gaLayersTranslationChange', function(evt) {
          map.getLayers().forEach(function(olLayer) {
            if (scope.isBodLayer(olLayer)) {
              olLayer.label = gaLayers.getLayerProperty(olLayer.bodId, 'label');
            }
          });
        });
      }
    };
  });
})();

