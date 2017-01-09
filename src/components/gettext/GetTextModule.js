goog.provide('gettext');

(function() {

  /**
   * This module is only use to provide translations to ngeo module.
   */
  var module = angular.module('gettext', []);

  module.constant('gettext', function(str) {
    return str;
  });

  module.provider('gettextCatalog', function() {
    this.$get = function($translate) {
      return {
        getString: function(str) {
          return $translate.instant(str);
        }
      };
    };
  });
})();
