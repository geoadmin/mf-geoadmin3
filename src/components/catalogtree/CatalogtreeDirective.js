(function() {
  goog.provide('ga_catalogtree_directive');

  goog.require('ga_map_service');

  var module = angular.module('ga_catalogtree_directive', [
    'ga_map_service'
  ]);

  /**
   * See examples on how it can be used
   */

  module.directive('gaCatalogtree',
      ['$compile', 'gaLayers', function($compile, gaLayers) {
        return {
          restrict: 'A',
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            val: '=',
            map: '=gaCatalogtreeMap'
          },
          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }
              scope.gaLayers = gaLayers;
              scope.getLegend = getLegend;
              scope.toggle = toggle;
              scope.switchLayer = switchLayer;

              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };
      }]
  );

  function switchLayer() {
    var id = this.val.idBod,
        map = this.map;
    if (map) {
      if (this.val.selectedOpen) {
        this.gaLayers.getOlLayerById(id).then(function(layer) {
          if (layer) {
            map.getLayers().push(layer);
          } else {
            //FIXME: better error handling
            alert('Layer is not defined by the servie');
          }
        });
      } else {
        map.getLayers().forEach(function(l) {
          if (l.get('layerId') == id) {
            map.removeLayer(l);
          }
        });
      }
    }
  }

  function toggle(ev) {
    this.val.selectedOpen = !this.val.selectedOpen;
    ev.preventDefault();
    ev.stopPropagation();
  };

  function getLegend(ev, bodid) {
    alert(bodid);
    ev.preventDefault();
    ev.stopPropagation();
  };
})();
