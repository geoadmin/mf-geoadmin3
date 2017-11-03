goog.provide('ga_map');

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_kml_service');
goog.require('ga_layerfilters_service');
goog.require('ga_layers_service');
goog.require('ga_map_directive');
goog.require('ga_mapclick_service');
goog.require('ga_maputils_service');
goog.require('ga_opaquelayers_service');
goog.require('ga_permalinkfeatures_service');
goog.require('ga_permalinklayers_service');
goog.require('ga_previewfeatures_service');
goog.require('ga_previewlayers_service');
goog.require('ga_realtimelayers_service');
goog.require('ga_tilegrid_service');
goog.require('ga_wms_service');
goog.require('ga_wmts_service');

(function() {
  angular.module('ga_map', [
    'ga_kml_service',
    'ga_map_directive',
    'ga_definepropertiesforlayer_service',
    'ga_layerfilters_service',
    'ga_layers_service',
    'ga_tilegrid_service',
    'ga_maputils_service',
    'ga_mapclick_service',
    'ga_opaquelayers_service',
    'ga_permalinkfeatures_service',
    'ga_permalinklayers_service',
    'ga_previewlayers_service',
    'ga_realtimelayers_service',
    'ga_wms_service',
    'ga_wmts_service'
  ]);
})();
