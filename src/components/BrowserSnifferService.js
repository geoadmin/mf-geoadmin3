(function() {
  goog.provide('ga_browsersniffer_service');

  var module = angular.module('ga_browsersniffer_service', []);

  module.provider('gaBrowserSniffer', function() {
    var msie =
        +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

    var mobile =
        (('ontouchstart' in window) || ('onmsgesturechange' in window)) &&
        (screen.width <= 768);

    // holds major version number for IE or NaN for real browsers
    this.$get = function() {

      var Sniffer = function() {
          this.msie = msie;
          this.mobile = mobile;
      };

      return new Sniffer();
    };
  });

})();
