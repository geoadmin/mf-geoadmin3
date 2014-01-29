(function() {
  goog.provide('ga_swipe_directive');

  goog.require('ga_debounce_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_swipe_directive', [
    'ga_debounce_service',
    'ga_map_service'
  ]);

  module.directive('gaSwipe',
    function($document, $translate, gaBrowserSniffer, gaPermalink,
        gaDebounce, gaLayerFilters) {
      return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
          return 'components/swipe/partials/swipe.html';
        },
        scope: {
          map: '=gaSwipeMap',
          options: '=gaSwipeOptions',
          isActive: '=gaSwipeActive'
        },
        link: function(scope, elt, attrs, controller) {
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.permanentLayersFilter;
          var draggableElt = elt.find('[ga-draggable]');
          var arrowsElt = elt.find('.ga-swipe-arrows');
          var layerLabelElt = elt.find('.ga-swipe-layer-label');
          var layerListenerKeys = [];
          var layersDeregisterFn = null;
          var isDragging = false;
          var eventKey = gaBrowserSniffer.events;

          if (eventKey.over) {
            // Hide laye label on mouse over/out events
            elt.on(eventKey.over, function(evt) {
               if (!isDragging) {
                layerLabelElt.show();
              }
            }).on(eventKey.out, function(evt) {
              if (!isDragging) {
                layerLabelElt.hide();
              }
            });
          }

          // Drag swipe element callbacks
          var dragStart = function(evt) {
            isDragging = true;
            arrowsElt.hide();
            $document.on(eventKey.move, drag);
            $document.on(eventKey.end, dragEnd);
            layerLabelElt.show();
          };
          var drag = function(evt) {
            scope.map.requestRenderFrame();
          };
          var dragEnd = function(evt) {
            isDragging = false;
            arrowsElt.show();
            $document.unbind(eventKey.move, drag);
            $document.unbind(eventKey.end, dragEnd);
            scope.ratio = draggableElt.offset().left / scope.map.getSize()[0];
            layerLabelElt.hide();
          };

          // Compose events
          var handlePreCompose = function(evt) {
            var ctx = evt.getContext();
            var width = draggableElt.offset().left + draggableElt.width() / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width, ctx.canvas.height);
            ctx.clip();
          };

          var handlePostCompose = function(evt) {
            evt.getContext().restore();
          };

          // Display swipe or not depends on the number of layers currently on
          // the map.
          var refreshComp = function(olLayers) {

            // Unset the layer and remove its listeners
            if (scope.layer) {
              if (scope.layer instanceof ol.layer.Group) {
                scope.layer.getLayers().forEach(function(olLayer, idx, arr) {
                  var i = idx * 2;
                  olLayer.unByKey(layerListenerKeys[i]);
                  olLayer.unByKey(layerListenerKeys[i + 1]);
                });

              } else {
                for (var i = 0, ii = layerListenerKeys.length; i < ii; i++) {
                  scope.layer.unByKey(layerListenerKeys[i]);
                }
              }
              layerListenerKeys = [];
              scope.layer = null;
              scope.map.requestRenderFrame();
            }

            if (!scope.isActive || olLayers.length < 2) {
              elt.hide();
              return;
            }

            // Set the new layer
            scope.layer = olLayers[olLayers.length - 1];

            // ol.layer.Group doesn't trigger XXXcompose events so we handle
            // events on each sublayers.
            // see bug: https://github.com/openlayers/ol3/issues/1362
            if (scope.layer instanceof ol.layer.Group) {
              scope.layer.getLayers().forEach(function(olLayer, idx, arr) {
                layerListenerKeys = layerListenerKeys.concat([
                  olLayer.on('precompose', handlePreCompose),
                  olLayer.on('postcompose', handlePostCompose)
                ]);
              });
            } else {
              layerListenerKeys = [
                scope.layer.on('precompose', handlePreCompose),
                scope.layer.on('postcompose', handlePostCompose)
              ];
            }
            elt.show();
            scope.map.requestRenderFrame();
          };

          // Active the swipe adding events.
          var activate = function() {
            scope.ratio = scope.ratio || 0.5;
            updatePermalink(scope.ratio);
            layersDeregisterFn = scope.$watchCollection(
                'layers | filter:layerFilter', refreshComp);
            elt.on(eventKey.start, dragStart);
          };


          // Deactive the swipe removing the events
          var deactivate = function() {
            refreshComp();
            elt.unbind(eventKey.start, dragStart);
            if (layersDeregisterFn) {
              layersDeregisterFn();
            }
            updatePermalink();
          };

          // Boolean determining if the swipe is activated from the permalink
          // parameter
          var fromPermalink = false;

          // Initalize component with permalink paraneter
          if (!angular.isDefined(scope.isActive) &&
             angular.isDefined(gaPermalink.getParams().swipe_ratio)) {
            scope.ratio = parseFloat(gaPermalink.getParams().swipe_ratio);
            draggableElt.css({left: scope.map.getSize()[0] * scope.ratio});
            fromPermalink = true;
            scope.isActive = true;
          }

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              if (!fromPermalink && scope.layers.length < 2) {
                alert($translate('not_enough_layer_for_swipe'));
              }
              activate();
              fromPermalink = false;
            } else {
              deactivate();
            }
          });
          scope.$watch('ratio', function(ratio) {
            updatePermalink(ratio);
          });

          // Move swipe element on resize.
          // We use a debounce function because map.requestRenderFrame() is
          // already called by the map itself on each resize so we want to
          // trigger only a map.requestRenderFrame() when the user has
          // finished to resize.
          var requestRenderFrame = function() {
            if (scope.layer) {
              scope.map.requestRenderFrame();
            }
          };
          var requestRenderFrameDebounced = gaDebounce.debounce(
              requestRenderFrame, 200, false);
          scope.map.on('change:size', function(evt) {
            draggableElt.css({left: scope.map.getSize()[0] * scope.ratio});
            requestRenderFrameDebounced();
          });


          // Manage permalink parameter
          var updatePermalink = function(ratio) {
            if (ratio) {
              gaPermalink.updateParams({swipe_ratio: ratio.toFixed(2)});
            } else {
              gaPermalink.deleteParam('swipe_ratio');
            }
          };
        }
      };
    }
  );
})();
