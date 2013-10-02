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
      var msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
      var ios = /(iPhone|iPad)/.test(ua);
      var iosChrome = /CriOS/.test(ua);
      var testSize = function(size) {
        var m = $window.matchMedia;
        return m && m('(max-width: ' + size + 'px)').matches;
      };
      var mobile =
        (('ontouchstart' in $window) || ('onmsgesturechange' in $window)) &&
        (testSize(768));
      var p = gaPermalink.getParams(),
          mobile = (mobile && p.mobile != 'false') || p.mobile == 'true';

      return {
        msie: msie,
        ios: ios,
        iosChrome: iosChrome,
        mobile: mobile,
        phone: mobile && testSize(480)
      };
    };

  });

})();
