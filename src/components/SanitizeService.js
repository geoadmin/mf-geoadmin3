goog.provide('ga_sanitize_service');
(function() {

  var module = angular.module('ga_sanitize_service', []);

  module.provider('gaSanitize', function() {
    this.$get = function() {

      // https://regex101.com/r/81tipL/1/
      var attrRegex = /(\s+on\w*=("[^"]+"|'[^']+'))/img;
      // https://regex101.com/r/U5ccHi/4
      var tagRegex = /(<|&lt;)script\s*\S*[^(>|&gt;)]*?(>|&gt;)(.|\s)*?(<|&lt;)\/script(>|&gt;)/img;

      var Sanitize = function() {

        // Remove all js events and script tags.
        // We replace it with spaces
        this.html = function(str) {
          return str.replace(tagRegex, ' ').replace(attrRegex, ' ');
        };
      };
      return new Sanitize();
    };
  });
})();
