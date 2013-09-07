(function() {
  goog.provide('ga_browsersniffer_service');

  goog.require('ga_permalink');

  var module = angular.module('ga_browsersniffer_service', [
    'ga_permalink'
  ]);

  module.provider('gaBrowserSniffer', function() {
    var msie =
      +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
    var testSize = function(size) {
      var m = window.matchMedia;
      return m && m('(max-width: ' + size + 'px)').matches;
    };
    var mobile =
      (('ontouchstart' in window) || ('onmsgesturechange' in window)) &&
      (testSize(768));

    // holds major version number for IE or NaN for real browsers
    this.$get = function(gaPermalink) {

      var p = gaPermalink.getParams();

      var Sniffer = function() {
        this.msie = msie;
        this.mobile = (mobile && p.mobile != 'false') || p.mobile == 'true';
        this.phone = this.mobile && testSize(480);
      };

      return new Sniffer();
    };

  });

})();
