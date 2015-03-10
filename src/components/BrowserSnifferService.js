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
      //For IE, we are using angular approach
      //https://github.com/angular/angular.js/blob/e415e916e85040fe62c801092be698ab06c1d11c/src/Angular.js#L157
      var msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
      if (isNaN(msie)) {
        msie = +((/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]);
      }
      if (isNaN(msie)) {
        msie = false;
      }
      var ios = !msie && /(iPhone|iPad|iPod)/.test(ua);
      if (ios) {
        ios = +((/\((iPhone|iPad|iPod).+OS (\d{1,2})_/.exec(ua) || [])[2]);
      }
      var mac = !msie && /\(Mac/.test(ua);
      var webkit = !msie && /WebKit/.test(ua);
      var opera = !msie && /(OPiOS|OPR)\//.test(ua);
      var chrome = !msie && !opera && /(CriOS|Chrome)\//.test(ua);
      var safari = !msie && !opera && !chrome && /Safari/.test(ua);
      var iosChrome = ios && chrome;
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
          (('maxTouchPoints' in navigator) && navigator.maxTouchPoints > 1) ||
          (('msMaxTouchPoints' in navigator) && navigator.msMaxTouchPoints > 1);
      var mobile = touchDevice && testSize(768);
      var embed = /\/embed\.html$/.test($window.location.pathname);
      var p = gaPermalink.getParams();
      mobile = !embed && ((mobile && p.mobile != 'false') ||
          p.mobile == 'true');

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
        msie: msie, // false or ie version number
        webkit: webkit,
        mac: mac,
        safari: safari,
        ios: ios, // false or iOS version number
        iosChrome: iosChrome,
        touchDevice: touchDevice,
        mobile: mobile,
        phone: mobile && testSize(480),
        events: eventsKeys,
        embed: embed,
        isInFrame: ($window.location != $window.parent.location)
      };
    };

  });

})();
