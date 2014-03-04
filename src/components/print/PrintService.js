(function() {
  goog.provide('ga_print_service');
  var module = angular.module('ga_print_service', []);

  var Print = function() {

    this.htmlPrintout = function(body) {
      var cssLinks = angular.element.find('link');
      var windowPrint = window.open('', '', 'height=400, width=600');
      windowPrint.document.write('<html><head>');
      for (var i = 0; i < cssLinks.length; i++) {
        if (cssLinks[i].href) {
          var href = cssLinks[i].href;
          if (href.indexOf('app.css') !== -1) {
            windowPrint.document.write('<link href="' + href +
              '" rel="stylesheet" type="text/css" media="screen">');
            windowPrint.document.write('<link href="' +
              href.replace('app.css', 'print.css') +
              '" rel="stylesheet" type="text/css" media="print">');
          }
        }
      }
      windowPrint.document.write('</head><body ' +
        'onload="window.print(); window.close();">');
        windowPrint.document.write(body);
        windowPrint.document.write('</body></html>');
        windowPrint.document.close();
    };
  };

  module.service('gaPrintService', [Print]);
})();
