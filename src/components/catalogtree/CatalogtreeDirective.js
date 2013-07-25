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
            val: '='
          },
          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }
              scope.gaLayers = gaLayers;
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
    //FIXME jeg: this is the get the map. This should be passed
    //into the directive directly. But I was not able to because of
    //scope issues...therefore, I cheat for the moment.
    var par = this.$parent,
        id = this.val.idBod,
        map;
    while (par && !map) {
      map = par.map;
      par = par.$parent;
    }
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
          //FIXME: tileSource.layer.id does not exist anymore (ol does not
          //preserve custom elements), so we have to hack to get the
          //right layer. this approach is not bullet-proof
          var tileSource = l.getTileSource();
          var tileUrl = tileSource.tileUrlFunction(new ol.TileCoord(16, 1, -5),
              tileSource.projection_);
          if (tileUrl.indexOf(id) !== -1) {
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
