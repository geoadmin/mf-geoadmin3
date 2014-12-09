(function() {
  goog.provide('ga_print_service');
  var module = angular.module('ga_print_service', []);

  module.provider('gaPrintService', function() {
    this.$get = function($window) {
      var Print = function() {

        this.htmlPrintout = function(body, head, onLoad) {
          var windowPrint = $window.open('', '', 'height=400, width=600');
          windowPrint.document.write(buildHtml(body, head, onLoad));
          windowPrint.document.close();
        };

        var buildHtml = function(body, head, onLoad) {
          window.printOnLoad = onLoad;
          var html = '';
          html += '<html><head>';
          html += head || getStylesheetString();
          html += '</head><body onload=\'window.opener.printOnLoad(window);' +
              'window.print(); window.close();\'>';
          html += body;
          html += '</body></html>';
          return html;
        };

        var getStylesheetString = function(cssElements) {
          var html = '';
          var cssElement = $('link[href*="app.css"]');
          var cssLink = cssElement.attr('href');
          html += '<link href="' + cssLink + '" rel="stylesheet"' +
              ' type="text/css">';
          return html;
        };
      };
      return new Print();
    };
  });
})();
