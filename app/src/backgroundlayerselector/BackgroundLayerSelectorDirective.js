(function() {
  goog.provide('ga_backgroundlayerselector_directive');

  goog.require('ga_backgroundlayerselector_service');
  goog.require('ga_permalink');

  var module = angular.module('ga_backgroundlayerselector_directive', [
    'ga_backgroundlayerselector_service',
    'ga_permalink'
  ]);

  module.directive('gaBackgroundLayerSelector',
      ['gaPermalink', 'gaWmtsLoader',
       function(gaPermalink, gaWmtsLoader) {
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
             var wmtsUrl = scope.options.wmtsUrl;
             var wmtsLayers = scope.options.wmtsLayers;

             var queryParams = gaPermalink.getParams();
             scope.currentLayer = (queryParams.bgLayer !== undefined) ?
                 queryParams.bgLayer : wmtsLayers[0].value;

             var wmtsLayerObjects = [];
             var setCurrentLayer = function(layerName) {
               var i, ii = wmtsLayers.length;
               for (i = 0; i < ii; ++i) {
                 if (wmtsLayers[i].value === layerName) {
                   break;
                 }
               }
               if (i < wmtsLayers.length) {
                 map.getLayers().setAt(0, wmtsLayerObjects[i]);
                 gaPermalink.updateParams({bgLayer: layerName});
               }
             };

             gaWmtsLoader.load(wmtsUrl, wmtsLayers).then(
                 function success(wmtsLayers) {
                   wmtsLayerObjects = wmtsLayers;
                   setCurrentLayer(scope.currentLayer);
                 }, function error() {
                   // FIXME decide what to know with abnormal situations.
                 });

             scope.$watch('currentLayer', function(newVal, oldVal) {
               if (oldVal !== newVal) {
                 setCurrentLayer(newVal);
               }
             });
           }
         };
       }]);
})();
