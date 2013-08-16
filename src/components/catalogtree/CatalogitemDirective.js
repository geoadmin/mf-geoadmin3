(function() {
  goog.provide('ga_catalogitem_directive');

  goog.require('ga_map_service');
  goog.require('ga_popup_service');

  //static functions
  function getMapLayer(map, id) {
    var layer;
    map.getLayers().forEach(function(l) {
      if (l.get('id') == id) {
        layer = l;
      }
    });
    return layer;
  };

  function addLayerToMap(scope, doAlert) {
    var layer = getMapLayer(scope.map, scope.item.idBod),
        olLayer;
    if (!angular.isDefined(layer)) {
      olLayer = scope.gaLayers.getOlLayerById(scope.item.idBod);
      if (olLayer) {
        scope.item.errorLoading = false;
        scope.map.getLayers().push(olLayer);
      } else {
        if (doAlert) {
          //FIXME: better error handling
          var msg = 'The desired Layer is not defined ' +
                    'by the gaLayers service (' + scope.item.idBod + ').';
          alert(msg);
        }
        scope.item.errorLoading = true;
        scope.item.selectedOpen = false;
      }
    }
 };

  function removeLayerFromMap(map, id) {
    var layer = getMapLayer(map, id);
    if (angular.isDefined(layer)) {
      map.removeLayer(layer);
    }
  };

  var module = angular.module('ga_catalogitem_directive', [
    'ga_map_service',
    'ga_popup_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogitem',
      ['$compile', 'gaLayers', 'gaPopup',
      function($compile, gaLayers, gaPopup) {
        return {
          restrict: 'A',
          templateUrl: 'components/catalogtree/partials/catalogitem.html',
          scope: {
            item: '=gaCatalogitemItem',
            map: '=gaCatalogitemMap'
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
        function previewLayer() {
          if (this.map) {
            if (!this.item.selectedOpen) {
              addLayerToMap(this, false);
            }
            this.item.preview = true;
          }
        };

        function removePreviewLayer() {
          if (!this.item.selectedOpen) {
            this.switchLayer(false);
          }
          this.item.preview = false;
        };

        function switchLayer(fromClick) {
          if (fromClick) {
            this.item.selectedOpen = !this.item.selectedOpen;
          }
          if (this.map) {
             if (this.item.selectedOpen) {
               addLayerToMap(this, fromClick);
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
          var scope = this;
          scope.gaLayers.getMetaDataOfLayer(bodid)
          .success(function(data) {
            gaPopup.create({
              title: 'metadata_window_title',
              content: data,
              x: 400,
              y: 200
            }).open(scope);
          })
          .error(function() {
            //FIXME: better error handling
            var msg = 'Could not retrieve information for ' + bodid;
            alert(msg);
          });
          ev.stopPropagation();
        };
      }]
  );
})();

