(function() {
  goog.provide('ga_swipe_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_permalink_service');

  var module = angular.module('ga_swipe_directive', [
    'ga_browsersniffer_service',
    'ga_permalink_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaSwipe',
    function($document, $translate, gaBrowserSniffer, gaPermalink) {
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
          var draggableElt = elt.find('[ga-draggable]');
          var arrowsElt = elt.find('.ga-swipe-arrows');
          var layerLabelElt = elt.find('.ga-swipe-layer-label');
          var listenerKeys = [];
          var layerListenerKeys = [];
          var isDragging = false;
          var events = {
            mouse: {
              start: 'mousedown',
              move: 'mousemove',
              end: 'mouseup'
            },
            touch: {
              start: 'touchstart',
              move: 'touchmove',
              end: 'touchend'
            }
          };

          var eventKey = events.mouse;
          if (!gaBrowserSniffer.msie && gaBrowserSniffer.touchDevice) {
            eventKey = events.touch;
          }

          // Hide laye label on mouse over/out events
          elt.mouseover(function(evt) {
             if (!isDragging) {
              layerLabelElt.show();
            }
          }).mouseout(function(evt) {
            if (!isDragging) {
              layerLabelElt.hide();
            }
          });

          // Drag swipe element callbacks
          var dragStart = function(evt) {
            isDragging = true;
            arrowsElt.hide();
            $document.on(eventKey.move, drag);
            $document.on(eventKey.end, dragEnd);
          };
          var drag = function(evt) {
            scope.map.requestRenderFrame();
          };
          var dragEnd = function(evt) {
            isDragging = false;
             arrowsElt.show();
             $document.unbind(eventKey.move, drag);
             $document.unbind(eventKey.end, dragEnd);
             scope.$apply(function() {
               scope.ratio = draggableElt.offset().left /
                   scope.map.getSize()[0];
             });
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
          var refreshComp = function() {

            // Unset the layer and remove its listeners
            if (scope.layer) {
              scope.layer.unByKey(layerListenerKeys[0]);
              scope.layer.unByKey(layerListenerKeys[1]);
              scope.layer = null;
              scope.map.requestRenderFrame();
            }

            var olLayers = scope.map.getLayers();
            if (!scope.isActive || olLayers.getLength() < 2) {
              elt.hide();
              return;
            }

            // Set the layer if the component is active and if there is 2 or
            // more layers on the map.
            scope.layer = olLayers.getAt(olLayers.getLength() - 1);
            layerListenerKeys = [
              scope.layer.on('precompose', handlePreCompose),
              scope.layer.on('postcompose', handlePostCompose)
            ];
            elt.show();
            scope.map.requestRenderFrame();
          };


          // Active the swipe adding events.
          var activate = function() {
            var olLayers = scope.map.getLayers();
            listenerKeys = [
              olLayers.on('add', refreshComp),
              olLayers.on('remove', refreshComp)
            ];
            elt.on(eventKey.start, dragStart);
            refreshComp();
          };


          // Deactive the swipe removing the events
          var deactivate = function() {
            scope.map.getLayers().unByKey(listenerKeys[0]);
            scope.map.getLayers().unByKey(listenerKeys[1]);
            refreshComp();
            gaPermalink.deleteParam('swipe_ratio');
          };

          var fromPermalink = false;
          // Initalize component with permlink paraneter
          if (!angular.isDefined(scope.isActive) &&
             angular.isDefined(gaPermalink.getParams().swipe_ratio)) {
            scope.ratio = parseFloat(gaPermalink.getParams().swipe_ratio);
            draggableElt.css({left: scope.map.getSize()[0] * scope.ratio});
            fromPermalink = true;
            scope.isActive = true;
            activate();
          }

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              if (!fromPermalink && scope.map.getLayers().getLength() < 2) {
                alert($translate('not_enough_layer_for_swipe'));
              }
              activate();
              fromPermalink = false;
            } else {
              deactivate();
            }
          });
          scope.$watch('ratio', function(ratio) {
            gaPermalink.updateParams({swipe_ratio: ratio.toFixed(2)});
          });

        }
      };
    }
  );
})();
