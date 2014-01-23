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
      var msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
      var ios = /(iPhone|iPad)/.test(ua);
      var iosChrome = /CriOS/.test(ua);
      var webkit = /WebKit/.test(ua);
      var mac = /Mac/.test(platform);
      var testSize = function(size) {
        var m = $window.matchMedia;
        return m && (m('(max-width: ' + size + 'px)').matches ||
            m('(max-height: ' + size + 'px)').matches);
      };
      var touchDevice = ('ontouchstart' in $window) ||
          ('onmsgesturechange' in $window);
      var mobile = touchDevice && testSize(768);
      var p = gaPermalink.getParams();
      mobile = (mobile && p.mobile != 'false') || p.mobile == 'true';

      //IE detection above only works up to IE10. Later IE do have
      //different UA set. We detect IE11 only here.
      //FIXME: to detect newer version of IE, adapt accordingly
      if (/Trident\/7.0/.test(ua) &&
          /rv:11.0/.test(ua)) {
        msie = 11;
      }

      if (msie == 10 ||
          msie == 11) {
        // IE10/IE11 don’t fire `input` event. Angular rely on it.
        // So let’s fire it on `change`.
        $('body').on('change', 'input[type=range]', function() {
          $(this).trigger('input');
        });
      }

      return {
        msie: msie,
        webkit: webkit,
        mac: mac,
        ios: ios,
        iosChrome: iosChrome,
        touchDevice: touchDevice,
        mobile: mobile,
        phone: mobile && testSize(480)
      };
    };

  });

})();
