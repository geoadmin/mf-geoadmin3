(function() {
  goog.provide('ga_draggable_directive');

  var module = angular.module('ga_draggable_directive', []);

  module.directive('gaDraggable', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = null, y = null;

      // Firefoy doesn't like transition during drag
      element.addClass('ga-draggable');

      element.bind('mousedown', function(evt) {
        var elt = $(evt.target);

        if (!x) {
          x = elt.offset().left;// + elt.width() / 2;
        }

        if (!y) {
          y = elt.offset().top;// + elt.height() / 2;
        }

        // preventDefault block user interaction with input field
        if (evt.target.nodeName !== 'INPUT') {
          evt.preventDefault();
        }

        startX = evt.screenX - x;// elt.offset().left;
        startY = evt.screenY - y;// elt.offset().top;
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
