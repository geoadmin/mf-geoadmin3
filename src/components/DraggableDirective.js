(function() {
  goog.provide('ga_draggable_directive');

  var module = angular.module('ga_draggable_directive', []);

  module.directive('gaDraggable', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = null, y = null;

      // Firefox doesn't like transition during drag
      element.addClass('ga-draggable');

      element.bind('mousedown', function(evt) {
        var elt = $(evt.target);

        if (x === null) {
          x = elt.offset().left;
        }

        if (y === null) {
          y = elt.offset().top;
        }

        // preventDefault block user interaction with input field
        if (evt.target.nodeName !== 'INPUT') {
          evt.preventDefault();
        }

        startX = evt.screenX - x;
        startY = evt.screenY - y;
        $document.bind('mousemove', mousemove);
        $document.bind('mouseup', mouseup);
      });

      function mousemove(evt) {
        y = evt.screenY - startY;
        x = evt.screenX - startX;
        element.css({
          margin: 0,
          top: y + 'px',
          left: x + 'px'
        });
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mousemove);
      }
    }
  });
})();
