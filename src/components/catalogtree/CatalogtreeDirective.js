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
            item: '=gaCatalogtreeItem',
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
    var item = this.item,
        map = this.map;
    if (map) {
      if (item.selectedOpen) {
        this.gaLayers.getOlLayerById(item.idBod).then(function(layer) {
          if (layer) {
            map.getLayers().push(layer);
          } else {
            //FIXME: better error handling
            alert('The chosen Layer is not defined by the gaLayers service.');
          }
        });
      } else {
        map.getLayers().forEach(function(l) {
          if (l.get('layerId') == item.idBod) {
            map.removeLayer(l);
          }
        });
      }
    }
  }

  function toggle(ev) {
    this.item.selectedOpen = !this.item.selectedOpen;
    ev.preventDefault();
//    ev.stopPropagation();
  };

  function getLegend(ev, bodid) {
    alert(bodid);
    ev.preventDefault();
//    ev.stopPropagation();
  };
})();
