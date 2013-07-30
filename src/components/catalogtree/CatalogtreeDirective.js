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
              scope.previewLayer = previewLayer;
              scope.removePreviewLayer = removePreviewLayer;

              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };
      }]
  );

  function previewLayer() {
    if (this.map) {
      if (this.item.selectedOpen) {
        removeLayerFromMap(this.map, this.item.idBod);
      } else {
        addLayerToMap(this.gaLayers, this.map, this.item.idBod, false);
      }
    }
  };

  function removePreviewLayer() {
    this.switchLayer(false);
  };

 function switchLayer(doAlert) {
    if (this.map) {
      if (this.item.selectedOpen) {
        addLayerToMap(this.gaLayers, this.map, this.item.idBod, doAlert);
     } else {
        removeLayerFromMap(this.map, this.item.idBod);
      }
    }
  };

  function toggle(ev) {
    this.item.selectedOpen = !this.item.selectedOpen;
    ev.preventDefault();
  };

  function getLegend(ev, bodid) {
    alert(bodid);
    ev.preventDefault();
  };

  //static functions
  function getMapLayer(map, id) {
    var layer;
    map.getLayers().forEach(function(l) {
      if (l.get('layerId') == id) {
        layer = l;
      }
    });
    return layer;
  };

  function addLayerToMap(gaLayers, map, id, doAlert) {
    var layer = getMapLayer(map, id);
    if (!angular.isDefined(layer)) {
      gaLayers.getOlLayerById(id).then(function(olLayer) {
        if (olLayer) {
          map.getLayers().push(olLayer);
        } else if (doAlert) {
          //FIXME: better error handling
          var msg = 'The desired Layer is not defined by the gaLayers service ('
                    + id + ').';
          alert(msg);
        }
      });
    }
 };

  function removeLayerFromMap(map, id) {
    var layer = getMapLayer(map, id);
    if (angular.isDefined(layer)) {
      map.removeLayer(layer);
    }
  };

 
})();
