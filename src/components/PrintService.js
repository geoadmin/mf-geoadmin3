(function() {
  goog.provide('ga_print_service');
  var module = angular.module('ga_print_service', []);

  module.provider('gaPrintService', function() {
    var windowPrint;

    var buildHtml = function(body, head) {
      var html = '';
      html += '<html><head>';
      html += head || '';
      html += getStylesheetString();
      html += '</head><body onload=\'window.opener.printOnLoad(window);\'>';
      html += body;
      html += '</body></html>';
      return html;
    };

    var getStylesheetString = function() {
      var cssLink = $('link[href*="app.css"]').attr('href');
      return '<link href="' + cssLink + '" rel="stylesheet" type="text/css">';
    };

    this.$get = function($window) {
      var Print = function() {
        this.htmlPrintout = function(body, head, onLoad) {
          $window.printOnLoad = onLoad || function(windowPrint) {
            windowPrint.print();
            windowPrint.close();
          };
          windowPrint = $window.open('', 'printout', 'height=400, width=600');
          windowPrint.document.write(buildHtml(body, head));
          windowPrint.document.close();
        };
      };
      return new Print();
    };
  });
})();
