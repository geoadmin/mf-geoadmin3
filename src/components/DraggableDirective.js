(function() {
  goog.provide('ga_draggable_directive');

  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_draggable_directive', [
    'ga_browsersniffer_service'
  ]);

  /**
   * Directive to make an HTML element draggable.
   *
   * Usage:
   *   <div ga-draggable=".header">
   *     <div class="header"></div>
   *     <div class="content"></div>
   *   </div>
   *
   * You can put a CSS selector in the value of the directive to specify
   * a draggable zone, otherwise the entire element is the draggable zone.
   *
   */
  module.directive('gaDraggable', function($document, gaBrowserSniffer) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = null, y = null;
      var eventKey = gaBrowserSniffer.events;
      var regex = /^(input|textarea|a|button)$/i;

      // Firefox doesn't like transition during drag
      element.addClass('ga-draggable');
      element.css({position: 'absolute'});

      var dragZone = (attr['gaDraggable'] != '') ?
          element.find(attr['gaDraggable']) :
          element;

      if (!dragZone || dragZone.length == 0) {
        dragZone = element;
      }

      dragZone.bind(eventKey.start, function(evt) {
        var elt = $(evt.target);

        x = element.prop('offsetLeft');
        y = element.prop('offsetTop');


        // block default interaction
        if (!regex.test(evt.target.nodeName)) {
          evt.preventDefault();
        }

        startX = getMouseEventX(evt) - x;
        startY = getMouseEventY(evt) - y;
        $document.bind(eventKey.move, drag);
        $document.bind(eventKey.end, dragend);
      });

      function drag(evt) {
        x = getMouseEventX(evt) - startX;
        y = getMouseEventY(evt) - startY;

        if (x < 0) {
          x = 0;
        } else if (x + element.width() > $(document.body).width()) {
          x = $(document.body).width() - element.width();
        }

        if (y < 0) {
          y = 0;
        } else if (y + element.height() > $(document.body).height()) {
          y = $(document.body).height() - element.height();
        }

        element.css({
          margin: 0,
          top: y + 'px',
          left: x + 'px'
        });

        // block default interaction
        if (!regex.test(evt.target.nodeName)) {
          evt.preventDefault();
        }
      }

      function dragend(evt) {
        $document.unbind(eventKey.move, drag);
        $document.unbind(eventKey.end, dragend);

        // block default interaction
        if (!regex.test(evt.target.nodeName)) {
          evt.preventDefault();
        }
      }



      /* Utils */

      // RE3: Get the X coordinate of a mouse or a touch event
      var getMouseEventX = function(event) {
        if (event.originalEvent) {
          event = event.originalEvent;
        }
        return event.clientX || event.touches[0].clientX;
      };

      // RE3: Get the Y coordinate of a mouse or touch event
      var getMouseEventY = function(event) {
        if (event.originalEvent) {
          event = event.originalEvent;
        }
        return event.clientY || event.touches[0].clientY;
      };

    }
  });
})();
