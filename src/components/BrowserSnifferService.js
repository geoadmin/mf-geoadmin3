(function() {
  goog.provide('ga_browsersniffer_service');

  goog.require('ga_permalink');

  var module = angular.module('ga_browsersniffer_service', [
    'ga_permalink'
  ]);

  module.provider('gaBrowserSniffer', function() {
    // holds major version number for IE or NaN for real browsers
    this.$get = function($window, gaPermalink) {
      var ua = $window.navigator.userAgent;
      var platform = $window.navigator.platform;
      //For IE, we are using angular approach
      //https://github.com/angular/angular.js/blob/e415e916e85040fe62c801092be698ab06c1d11c/src/Angular.js#L157
      var msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
      if (isNaN(msie)) {
        msie = +((/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]);
      }
      var ios = /(iPhone|iPad)/.test(ua);
      var iosChrome = /CriOS/.test(ua);
      var webkit = /WebKit/.test(ua);
      var mac = /Mac/.test(platform);
      var chrome = /Chrome/.test(ua);
      var safari = !chrome && /Safari/.test(ua);
      var testSize = function(size) {
        var m = $window.matchMedia;
        return m && (m('(max-width: ' + size + 'px)').matches ||
            m('(max-height: ' + size + 'px)').matches);
      };
      var useTouchEvents = ('ontouchstart' in $window);
      var usePointerEvents = ('PointerEvent' in $window);
      var useMSPointerEvents = !('PointerEvent' in $window) &&
          ('MSPointerEvent' in $window);
      var navigator = $window.navigator;
      var touchDevice = useTouchEvents ||
          (('maxTouchPoints' in navigator) && navigator.maxTouchPoints > 0) ||
          (('msMaxTouchPoints' in navigator) && navigator.msMaxTouchPoints > 0);
      var mobile = touchDevice && testSize(768);
      var p = gaPermalink.getParams();
      mobile = (mobile && p.mobile != 'false') || p.mobile == 'true';

      if (msie > 9) {
        // IE10/IE11 don’t fire `input` event. Angular rely on it.
        // So let’s fire it on `change`.
        $('body').on('change', 'input[type=range]', function() {
          $(this).trigger('input');
        });
      }

      var events = {
        mouse: {
          start: 'mousedown',
          move: 'mousemove',
          end: 'mouseup',
          over: 'mouseover',
          out: 'mouseout',
          menu: 'contextmenu'
        },
        touch: {
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend'
        },
        msPointer: {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp',
          over: 'MSPointerOver',
          out: 'MSPointerOut',
          menu: 'contextmenu'
        },
        pointer: {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup',
          over: 'pointerover',
          out: 'pointerout',
          menu: 'contextmenu'
        }
      };

      var eventsKeys = events.mouse;
      if (usePointerEvents) {
        eventsKeys = events.pointer;
      } else if (useMSPointerEvents) {
        eventsKeys = events.msPointer;
      } else if (useTouchEvents) {
        eventsKeys = events.touch;
      }

      return {
        msie: msie,
        webkit: webkit,
        mac: mac,
        safari: safari,
        ios: ios,
        iosChrome: iosChrome,
        touchDevice: touchDevice,
        mobile: mobile,
        phone: mobile && testSize(480),
        events: eventsKeys,
        isInFrame: ($window.location != $window.parent.location)
      };
    };

  });

})();
