goog.provide('ga_import');

goog.require('ga_import_directive');
goog.require('ga_tabs');
goog.require('ga_file_service');
goog.require('ga_importdnd_directive');
goog.require('ga_importlocal_directive');
goog.require('ga_importonline_directive');
goog.require('ga_wmsgetcap_directive');
goog.require('ga_wmsgetcapitem_directive');
goog.require('ga_wmtsgetcap_directive');
goog.require('ga_wmtsgetcapitem_directive');

(function() {

  angular.module('ga_import', [
    'ga_import_directive',
    'ga_tabs',
    'ga_file_service',
    'ga_importdnd_directive',
    'ga_importlocal_directive',
    'ga_importonline_directive',
    'ga_wmsgetcap_directive',
    'ga_wmsgetcapitem_directive',
    'ga_wmtsgetcap_directive',
    'ga_wmtsgetcapitem_directive'
  ]);
})();
