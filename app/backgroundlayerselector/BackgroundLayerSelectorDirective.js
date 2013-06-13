(function() {
  var backgroundLayerSelectorModule = angular.module('app.backgroundlayerselector');

  backgroundLayerSelectorModule.directive('appBackgroundLayerSelector',
      ['$parse', '$http', '$location',  function($parse, $http, $location) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        map: '=appBackgroundLayerSelectorMap',
        wmtsUrl: '=appBackgroundLayerSelectorWmtsUrl',
        wmtsLayers: '=appBackgroundLayerSelectorWmtsLayers'
      },
      template:
          '<select ng-model="currentLayer"' +
              'ng-options="l.value as l.label for l in wmtsLayers">' +
          '</select>',
      link: function(scope, element, attrs) {
        var map = $parse(attrs.appBackgroundLayerSelectorMap)(scope);
        var wmtsUrl = $parse(attrs.appBackgroundLayerSelectorWmtsUrl)(scope);
        var wmtsLayers = $parse(attrs.appBackgroundLayerSelectorWmtsLayers)(scope);

        var queryParams = $location.search();
        scope.currentLayer = (queryParams.bgLayer !== undefined) ?
            queryParams.bgLayer : wmtsLayers[0].value;

        var wmtsLayerObjects = [];
        var http = $http.get(wmtsUrl);
        http.success(function(data, status, header, config) {
          var parser = new ol.parser.ogc.WMTSCapabilities();
          var capabilities = parser.read(data);
          var i, ii = scope.wmtsLayers.length;
          var wmtsSourceOptions, wmtsSource, wmtsLayer;
          for (i = 0; i < ii; ++i) {
            wmtsSourceOptions = ol.source.WMTS.optionsFromCapabilities(
                capabilities, scope.wmtsLayers[i].value);
            wmtsSource = new ol.source.WMTS(wmtsSourceOptions);
            wmtsLayer = new ol.layer.TileLayer({source: wmtsSource});
            wmtsLayerObjects.push(wmtsLayer);
            if (scope.currentLayer === scope.wmtsLayers[i].value) {
              map.getLayers().setAt(0, wmtsLayer);
            }
          }
        });

        scope.$watch('currentLayer', function(newVal, oldVal) {
          if (oldVal !== newVal) {
            var i, ii = scope.wmtsLayers.length;
            for (i = 0; i < ii; ++i) {
              if (scope.wmtsLayers[i].value === newVal) {
                break;
              }
            }
            if (i < scope.wmtsLayers.length) {
              map.getLayers().setAt(0, wmtsLayerObjects[i]);
            }
          }
        });
      }
    };
  }]);
})();


