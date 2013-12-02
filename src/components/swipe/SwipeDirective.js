(function() {
  goog.provide('ga_swipe_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_debounce_service');
  goog.require('ga_map_service');
  goog.require('ga_permalink_service');

  var module = angular.module('ga_swipe_directive', [
    'ga_browsersniffer_service',
    'ga_map_service',
    'ga_permalink_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaSwipeDirectiveController',
    function($scope, $translate, $sce, gaLayers, gaPermalink,
        gaBrowserSniffer) {

  });

  module.directive('gaSwipe',
    function($document, $translate, gaBrowserSniffer, gaPermalink, gaLayers) {
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
        controller: 'GaSwipeDirectiveController',
        link: function(scope, elt, attrs, controller) {
          var draggableElt = elt.find('[ga-draggable]');
          var arrowsElt = elt.find('.ga-swipe-arrows');
          var listenerKeys = [];
          var layerListenerKeys = [];

          // Drag swipe element callbacks
          var dragStart = function(evt) {
            arrowsElt.hide();
            $document.on('mousemove', drag);
            $document.on('mouseup', dragEnd);
          };
          var drag = function(evt) {
            scope.map.requestRenderFrame();
          };
          var dragEnd = function(evt) {
             arrowsElt.show();
             $document.unbind('mousemove', drag);
             $document.unbind('mouseup', dragEnd);
             scope.$apply(function() {
               scope.ratio = draggableElt.offset().left / scope.map.getSize()[0];
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

            // Unset the layer and remov its listeners
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
            elt.on('mousedown', dragStart);
            refreshComp();
          };


          // Deactive the swipe removing the events
          var deactivate = function() {
            scope.map.getLayers().unByKey(listenerKeys[0]);
            scope.map.getLayers().unByKey(listenerKeys[1]);
            refreshComp();
            gaPermalink.deleteParam('swipe');
          };

          var fromPermalink = false;
          // Initalize component with permlink paraneter
          if (!angular.isDefined(scope.isActive) &&
             angular.isDefined(gaPermalink.getParams().swipe)) {
            scope.ratio = parseFloat(gaPermalink.getParams().swipe);
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
            gaPermalink.updateParams({swipe: ratio.toFixed(2)});
          });

        }
      };
    }
  );
})();
