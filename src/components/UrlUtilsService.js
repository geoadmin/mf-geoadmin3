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
        },
        remove: function(url, params, ignoreCase) {
          var parts = url.split('?');
          if (parts.length > 0) {
            var qs = '&' + parts[1];
            var flags = (ignoreCase) ? 'gi' : 'g';
            qs = qs.replace(
                new RegExp('&(' + params.join('|') + ')=[^&]*', flags), '');
            url = parts[0] + qs.replace(/^&/, '?');
          }
          return url;
        }
      };
    };
  });

})();
