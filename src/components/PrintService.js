(function() {
  goog.provide('ga_print_service');
  var module = angular.module('ga_print_service', []);

  var Print = function() {

    this.htmlPrintout = function(body, head) {
      var windowPrint = window.open('', '', 'height=400, width=600');
      windowPrint.document.write(buildHtml(body, head));
      windowPrint.document.close();
    };

    var buildHtml = function(body, head) {
      var html = '';
      html += '<html><head>';
      html += (typeof head == 'undefined') ? getStylesheetString() : head;
      html += '</head><body onload="window.print(); window.close();">';
      html += body;
      html += '</body></html>';
      return html;
    };

    var getStylesheetString = function(cssElements) {
      var html = '';
      var cssElement = $('link[href*="app.css"]');
      var cssLink = cssElement.attr('href');
      html += '<link href="' + cssLink + '" rel="stylesheet" type="text/css">';
      return html;
    };
  };

  module.provider('gaPrintService', function() {
    this.$get = function() {
      return new Print();
    };
  });
})();
