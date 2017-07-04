goog.provide('ga_browsersniffer_service');

goog.require('ga_permalink');
(function() {

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
        msie = +((/edge\/(\d+)\./.exec(ua.toLowerCase()) || [])[1]);
      }
      if (isNaN(msie)) {
        msie = false;
      }
      var ios = !msie && /(iPhone|iPad|iPod)/.test(ua);
      if (ios) {
        ios = +((/\((iPhone|iPad|iPod).+OS (\d{1,2})_/.exec(ua) || [])[2]);
      }
      var webkit = !msie && /WebKit/.test(ua);
      var opera = !msie && /(OPiOS|OPR)\//.test(ua);
      var chrome = !msie && !opera && /(CriOS|Chrome)\//.test(ua);
      var iosChrome = ios && chrome;
      var safari = !msie && !opera && !chrome && /Safari/.test(ua);
      var mobile = /\/mobile\.html$/.test($window.location.pathname);
      var embed = /\/embed\.html$/.test($window.location.pathname);

      if (msie > 9) {
        // IE10/IE11 don’t fire `input` event. Angular rely on it.
        // So let’s fire it on `change`.
        $('body').on('change', 'input[type=range]', function() {
          $(this).trigger('input');
        });
      }

      // Detect which events to use for draggable directive (swipe, popup).
      var events = {
        touch: {
          start: 'touchstart mousedown',
          move: 'touchmove mousemove',
          end: 'touchend mouseup',
          over: 'mouseover',
          out: 'mouseout'
        },
        msPointer: {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp',
          over: 'MSPointerOver',
          out: 'MSPointerOut'
        },
        pointer: {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup',
          over: 'pointerover',
          out: 'pointerout'
        }
      };

      var eventsKeys = events.touch;
      if ('PointerEvent' in $window) {
        eventsKeys = events.pointer;
      } else if ('MSPointerEvent' in $window) {
        eventsKeys = events.msPointer;
      }

      // Detect Blob support
      var isBlobSupported = false;
      try {
        isBlobSupported = !!new Blob;
      } catch (e) {
      }

      // Detect http2 support
      var h2 = false;
      // Firefox
      // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/nextHopProtocol
      if (!msie && /Firefox/.test(ua) && $window.performance &&
          $window.performance.getEntriesByType) {
        var perf = $window.performance.getEntriesByType('resource');
        if (perf[0] && perf[0].nextHopProtocol == 'h2') {
          h2 = true;
        }
      // Chrome
      // http://stackoverflow.com/questions/36041204/detect-connection-protocol-http-2-spdy-from-javascript
      } else if (chrome && $window.chrome && $window.chrome.loadTimes) {
        if ($window.chrome.loadTimes().connectionInfo == 'h2') {
          h2 = true;
        }
      // Generic
      // http://stackoverflow.com/questions/36041204/detect-connection-protocol-http-2-spdy-from-javascript
      } else if ($window.performance && $window.performance.timing) {
        if ($window.performance.timing.nextHopProtocol == 'h2') {
          h2 = true;
        }
      }

      return {
        msie: msie, // false or ie version number
        webkit: webkit,
        safari: safari,
        chrome: chrome,
        ios: ios, // false or iOS version number
        iosChrome: iosChrome,
        mobile: mobile,
        events: eventsKeys,
        embed: embed,
        isInFrame: ($window.location != $window.parent.location),
        webgl: !(typeof WebGLRenderingContext === 'undefined'),
        animation: (!msie || msie > 9),
        blob: isBlobSupported,
        h2: h2
      };
    };
  });
})();
