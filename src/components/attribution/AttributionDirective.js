goog.provide('ga_attribution_directive');

goog.require('ga_attribution_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_debounce_service');
goog.require('ga_map_service');

(function() {

  var module = angular.module('ga_attribution_directive', [
    'ga_attribution_service',
    'ga_browsersniffer_service',
    'ga_map_service',
    'ga_debounce_service'
  ]);

  module.directive('gaAttribution', function($translate, $window,
      gaBrowserSniffer, gaLayerFilters, gaAttribution, $rootScope,
      gaDebounce) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaAttributionMap',
        ol3d: '=gaAttributionOl3d'
      },
      link: function(scope, element, attrs) {

        element.on('click', '.ga-warning-tooltip', function(evt) {
          $window.alert($translate.instant('external_data_warning').
              replace('--URL--', $(evt.target).text()));
        });

        if (!gaBrowserSniffer.mobile) {
          // Display third party data tooltip
          element.tooltip({
            selector: '.ga-warning-tooltip',
            title: function() {
              return $translate.instant('external_data_tooltip');
            },
            template: '<div class="tooltip ga-red-tooltip" role="tooltip">' +
                '<div class="tooltip-arrow"></div><div class="tooltip-inner">' +
                '</div></div>'
          });
        }
        var update = function(element, layers) {
          var attrs = {}, list = [], is3dActive = scope.is3dActive();
          if (is3dActive) {
            var tmp = [scope.ol3d.getCesiumScene().terrainProvider];
            Array.prototype.push.apply(tmp, layers);
            layers = tmp;
          }
          layers.forEach(function(layer) {
            var key = gaAttribution.getTextFromLayer(layer, is3dActive);
            if (!attrs[key]) {
              var attrib = gaAttribution.getHtmlFromLayer(layer, is3dActive);
              if (attrib) {
                attrs[key] = attrib;
                list.push(attrs[key]);
              }
            }
          });
          var text = list.join(', ');
          element.html(text ? $translate.instant('copyright_data') + text :
              '');
        };
        var updateDebounced = gaDebounce.debounce(update, 133, false);

        // Watch layers with an attribution from 2d map
        var layersFiltered;
        scope.layers = scope.map.getLayers().getArray();
        scope.layerFilter = function(layer) {
          return (layer.background || layer.preview ||
            layer.displayInLayerManager) && layer.visible;
        };

        scope.$watchCollection('layers | filter:layerFilter', function(layers) {
          layersFiltered = layers;
          updateDebounced(element, layers);
        });

        $rootScope.$on('gaLayersTranslationChange', function() {
          updateDebounced(element, layersFiltered);
        });

        // Watch layers with attribution from 3d globe
        scope.is3dActive = function() {
          return scope.ol3d && scope.ol3d.getEnabled();
        };
        scope.$watch('::ol3d', function(val) {
          if (val) {
            // Listen when the app switch between 2d/3d
            scope.$watch(function() {
              return scope.ol3d.getEnabled();
            }, function() {
              updateDebounced(element, layersFiltered);
            });
          }
        });
      }
    };
  });
})();
