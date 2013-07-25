(function() {
  goog.provide('ga_draggable_directive');

  var module = angular.module('ga_draggable_directive', []);

  module.directive('gaDraggable', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = null, y = null;

      // Firefox doesn't like transition during drag
      element.addClass('ga-draggable');
      element.css({position: 'absolute'});

      element.bind('mousedown', function(evt) {
        var elt = $(evt.target);

        if (x === null) {
          x = element.prop('offsetLeft');
        }

        if (y === null) {
          y = element.prop('offsetTop');
        }

        // preventDefault block user interaction with input field
        if (evt.target.nodeName !== 'INPUT') {
          evt.preventDefault();
        }

        startX = evt.clientX - x;
        startY = evt.clientY - y;
        $document.bind('mousemove', mousemove);
        $document.bind('mouseup', mouseup);
      });

      function mousemove(evt) {
        y = evt.clientY - startY;
        x = evt.clientX - startX;
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
