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

          // Drag callbacks
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
          var refreshComp = function(collectionEvent) {
            var olLayers = collectionEvent.target;
            if (olLayers.getLength < 2) {
              elt.hide();
              return;
            }
            elt.show();
          };


          // Active the swipe adding events.
          var activate = function() {
            if (scope.map.getLayers().getLength() < 2) {
              alert($translate('not_enough_layer_for_swipe'));
              scope.isActive = false;
              return;
            }
            var olLayers = scope.map.getLayers();
            scope.layer = olLayers.getAt(olLayers.getLength() - 1);
            listenerKeys = [
              olLayers.on('add', refreshComp),
              olLayers.on('remove', refreshComp),
              scope.layer.on('precompose', handlePreCompose),
              scope.layer.on('postcompose', handlePostCompose)
            ];

            elt.on('mousedown', dragStart);
            elt.show();
            scope.map.requestRenderFrame();
          };


          // Deactive the swipe removing the events
          var deactivate = function() {
            elt.hide();
            scope.map.getLayers().unByKey(listenerKeys[0]);
            scope.map.getLayers().unByKey(listenerKeys[1]);
            if (scope.layer) {
              scope.layer.unByKey(listenerKeys[2]);
              scope.layer.unByKey(listenerKeys[3]);
            }
            scope.layer = null;
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });
        }
      };
    }
  );
})();
