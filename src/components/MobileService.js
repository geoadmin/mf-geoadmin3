(function() {
  goog.provide('ga_mobile_service');

  var module = angular.module('ga_mobile_service', []);

  module.factory('gaMobile', function() {
      return (('ontouchstart' in window) || ('onmsgesturechange' in window))
        && (screen.width<=768);
  });

})();
