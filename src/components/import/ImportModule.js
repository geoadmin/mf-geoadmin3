goog.provide('ga_import');

goog.require('ga_import_directive');
goog.require('ga_importdnd_directive');
goog.require('ga_importlocal_directive');
goog.require('ga_importonline_directive');
goog.require('ga_tabs');
goog.require('ga_wmsgetcap_directive');
goog.require('ga_wmsgetcapitem_directive');

(function() {

  angular.module('ga_import', [
    'ga_import_directive',
    'ga_importdnd_directive',
    'ga_importlocal_directive',
    'ga_importonline_directive',
    'ga_tabs',
    'ga_wmsgetcap_directive',
    'ga_wmsgetcapitem_directive'
  ]);
})();
