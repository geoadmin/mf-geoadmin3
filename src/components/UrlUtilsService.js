(function() {
  goog.provide('ga_urlutils_service');

  var module = angular.module('ga_urlutils_service', []);

  module.provider('gaUrlUtils', function() {
    this.$get = function() {
      return {
        append: function(url, paramString) {
          if (paramString) {
            var parts = (url + ' ').split(/[?&]/);
            url += (parts.pop() === ' ' ? paramString :
                (parts.length > 0 ? '&' + paramString : '?' + paramString));
          }
          return url;
        }
      };
    };
  });

})();
