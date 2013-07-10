(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_map',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      ['gaPermalink', 'gaLayers',
       function(gaPermalink, gaLayers) {
         return {
           restrict: 'A',
           replace: true,
           scope: {
             map: '=gaBackgroundLayerSelectorMap',
             options: '=gaBackgroundLayerSelectorOptions'
           },
           template:
               '<select ng-model="currentLayer" ' +
                   'ng-options="l.value as l.label for l in ' +
                       'options.wmtsLayers">' +
               '</select>',
           link: function(scope, element, attrs) {
             var map = scope.map;
             var wmtsLayers = scope.options.wmtsLayers;

             var queryParams = gaPermalink.getParams();
             scope.currentLayer = (queryParams.bgLayer !== undefined) ?
                 queryParams.bgLayer : wmtsLayers[0].value;

             function setCurrentLayer(layerId) {
               gaLayers.getLayerById(layerId).then(function(layer) {
                 map.getLayers().setAt(0, layer);
                 gaPermalink.updateParams({bgLayer: layerId});
               });
             }

             scope.$watch('currentLayer', function(newVal, oldVal) {
               if (oldVal !== newVal) {
                 setCurrentLayer(newVal);
               }
             });

             setCurrentLayer(scope.currentLayer);
           }
         };
       }]);
})();
