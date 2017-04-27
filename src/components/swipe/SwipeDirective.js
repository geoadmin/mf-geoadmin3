goog.provide('ga_swipe_directive');

goog.require('ga_debounce_service');
goog.require('ga_map_service');
(function() {

  var module = angular.module('ga_swipe_directive', [
    'ga_debounce_service',
    'ga_map_service'
  ]);

  module.directive('gaSwipe',
    function($window, $document, $translate, gaBrowserSniffer, gaPermalink,
        gaDebounce, gaLayerFilters) {

      // Move swipe element on resize.
      // We use a debounce function because map.render() is
      // already called by the map itself on each resize so we want to
      // trigger only a map.render() when the user has
      // finished to resize.
      var requestRenderFrame = function(map, layer) {
        if (layer) {
          map.render();
        }
      };
      var requestRenderFrameDebounced = gaDebounce.debounce(
          requestRenderFrame, 200, false, false);

      // Manage permalink parameter
      var updatePermalink = function(ratio) {
        if (ratio) {
          gaPermalink.updateParams({swipe_ratio: ratio.toFixed(2)});
        } else {
          gaPermalink.deleteParam('swipe_ratio');
        }
      };
      var updatePermalinkDebounced = gaDebounce.debounce(
          updatePermalink, 1000, false);

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
          // Use only layers in layer manager
          scope.layerFilter = gaLayerFilters.selectedAndVisible;
          var draggableElt = elt.find('[ga-draggable]');
          var arrowsElt = elt.find('.ga-swipe-arrows');
          var layerLabelElt = elt.find('.ga-swipe-layer-label');
          var layerListenerKeys = [], unMapChangeSize;
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
            scope.ratio = calculateRatio();
            scope.map.render();
          };
          var dragEnd = function(evt) {
            isDragging = false;
            arrowsElt.show();
            $document.unbind(eventKey.move, drag);
            $document.unbind(eventKey.end, dragEnd);
            layerLabelElt.hide();
            updatePermalinkDebounced(scope.ratio);
          };

          // Compose events
          var handlePreCompose = function(evt) {
            var ctx = evt.context;
            var width = ctx.canvas.width * scope.ratio;
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width, ctx.canvas.height);
            ctx.clip();
          };

          var handlePostCompose = function(evt) {
            evt.context.restore();
          };

          var calculateRatio = function() {
            return (draggableElt.offset().left + draggableElt.width() / 2) /
                scope.map.getSize()[0];
          };

          var calculateOffsetLeft = function() {
            return scope.ratio * scope.map.getSize()[0] -
                draggableElt.width() / 2;
          };

          // Display swipe or not depends on the number of layers currently on
          // the map.
          var refreshComp = function(olLayers) {

            // Unset the layer and remove its listeners
            if (scope.layer) {
              if (scope.layer instanceof ol.layer.Group) {
                scope.layer.getLayers().forEach(function(olLayer, idx, arr) {
                  var i = idx * 2;
                  ol.Observable.unByKey(layerListenerKeys[i]);
                  ol.Observable.unByKey(layerListenerKeys[i + 1]);
                });

              } else {
                for (var i = 0, ii = layerListenerKeys.length; i < ii; i++) {
                  ol.Observable.unByKey(layerListenerKeys[i]);
                }
              }
              layerListenerKeys = [];
              scope.layer = null;
              scope.map.render();
            }

            if (!scope.isActive || olLayers.length == 0) {
              elt.hide();
              updatePermalink();
              return;
            }

            // Set the new layer
            scope.layer = olLayers[olLayers.length - 1];

            // ol.layer.Group doesn't trigger XXXcompose events so we handle
            // events on each sublayers.
            // see bug: https://github.com/openlayers/openlayers/issues/1362
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
            updatePermalink(scope.ratio);
            scope.map.render();
          };

          // Active the swipe adding events.
          var activate = function() {
            scope.ratio = scope.ratio || 0.5;
            updatePermalink(scope.ratio);
            draggableElt.css({left: calculateOffsetLeft()});

            // Register events
            layersDeregisterFn = scope.$watchCollection(
                'layers | filter:layerFilter', refreshComp);
            unMapChangeSize = scope.map.on('change:size', function(evt) {
              draggableElt.css({left: calculateOffsetLeft()});
              requestRenderFrameDebounced(scope.map, scope.layer);
            });
            elt.on(eventKey.start, dragStart);
          };


          // Deactive the swipe removing the events
          var deactivate = function() {
            refreshComp();

            // Unregister events
            elt.off(eventKey.start, dragStart);
            if (layersDeregisterFn) {
              layersDeregisterFn();
            }
            ol.Observable.unByKey(unMapChangeSize);
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              if (!fromPermalink && scope.layers.length < 2) {
                alert($translate.instant('not_enough_layer_for_swipe'));
              }
              activate();
              fromPermalink = false;
            } else {
              deactivate();
            }
          });

          // Initalize component with permalink parameter
          var fromPermalink = false,
              swipeRatioParam = parseFloat(gaPermalink.getParams().swipe_ratio);
          if ($window.isFinite(swipeRatioParam) && swipeRatioParam <= 1 &&
              swipeRatioParam >= 0) {
            scope.ratio = swipeRatioParam;
            fromPermalink = true;
            scope.isActive = true;
          }
        }
      };
    }
  );
})();
