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

      if (msie == 10) {
        // IE10 doesn’t fire `input` event. Angular rely on it.
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
