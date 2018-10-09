goog.provide('geoadmin');

goog.require('ga_attribution');
goog.require('ga_backgroundselector');
goog.require('ga_catalogtree');
goog.require('ga_catalogtree_controller');
goog.require('ga_cesium');
goog.require('ga_collapsible_directive');
goog.require('ga_contextpopup');
goog.require('ga_contextpopup_controller');
goog.require('ga_controls3d');
goog.require('ga_draggable_directive');
goog.require('ga_draw');
goog.require('ga_draw_controller');
goog.require('ga_drawstyle_controller');
goog.require('ga_drawstylepopup_controller');
goog.require('ga_featuretree');
goog.require('ga_featuretree_controller');
goog.require('ga_feedback');
goog.require('ga_feedback_controller');
goog.require('ga_fullscreen');
goog.require('ga_geolocation');
goog.require('ga_help');
goog.require('ga_height_service');
goog.require('ga_identify_service');
goog.require('ga_import');
goog.require('ga_import_controller');
goog.require('ga_layermanager');
goog.require('ga_main_controller');
goog.require('ga_map');
goog.require('ga_measure');
goog.require('ga_modal_directive');
goog.require('ga_mouseposition');
goog.require('ga_mouseposition_controller');
goog.require('ga_offline');
goog.require('ga_placeholder_directive');
goog.require('ga_popup');
goog.require('ga_print');
goog.require('ga_print_controller');
goog.require('ga_profile');
goog.require('ga_profile_controller');
goog.require('ga_profilepopup_controller');
goog.require('ga_query');
goog.require('ga_rotate');
goog.require('ga_scaleline');
goog.require('ga_search');
goog.require('ga_search_controller');
goog.require('ga_seo');
goog.require('ga_seo_controller');
goog.require('ga_share');
goog.require('ga_share_controller');
goog.require('ga_shop');
goog.require('ga_stylesfromliterals_service');
goog.require('ga_swipe');
goog.require('ga_tabs');
goog.require('ga_tilt3d');
goog.require('ga_timeselector');
goog.require('ga_timeselector_controller');
goog.require('ga_timestamp_control');
goog.require('ga_tooltip');
goog.require('ga_tooltip_controller');
goog.require('ga_topic');
goog.require('ga_translation');
goog.require('ga_translation_controller');
goog.require('ga_waitcursor_service');
(function() {

  var module = angular.module('geoadmin', [
    'ga_controls3d',
    'ga_attribution',
    'ga_catalogtree',
    'ga_contextpopup',
    'ga_import',
    'ga_help',
    'ga_map',
    'ga_mouseposition',
    'ga_offline',
    'ga_popup',
    'ga_share',
    'ga_scaleline',
    'ga_search',
    'ga_topic',
    'ga_timeselector',
    'ga_timestamp_control',
    'ga_backgroundselector',
    'ga_translation',
    'ga_feedback',
    'ga_layermanager',
    'ga_tooltip',
    'ga_swipe',
    'ga_featuretree',
    'ga_measure',
    'ga_profile',
    'ga_fullscreen',
    'ga_waitcursor_service',
    'ga_stylesfromliterals_service',
    'ga_seo',
    'ga_draw',
    'ga_query',
    'ga_print',
    'ga_shop',
    'ga_tabs',
    'ga_tilt3d',
    'ga_modal_directive',
    'ga_draggable_directive',
    'ga_placeholder_directive',
    'ga_collapsible_directive',
    'ga_slider_directive',
    'ga_geolocation',
    'ga_rotate',
    'ga_identify_service',
    'ga_height_service',
    'ga_import_controller',
    'ga_main_controller',
    'ga_catalogtree_controller',
    'ga_mouseposition_controller',
    'ga_share_controller',
    'ga_print_controller',
    'ga_profile_controller',
    'ga_profilepopup_controller',
    'ga_translation_controller',
    'ga_feedback_controller',
    'ga_contextpopup_controller',
    'ga_search_controller',
    'ga_seo_controller',
    'ga_timeselector_controller',
    'ga_tooltip_controller',
    'ga_featuretree_controller',
    'ga_draw_controller',
    'ga_drawstyle_controller',
    'ga_drawstylepopup_controller'
  ]);

  module.config(function($translateProvider, gaGlobalOptions) {
    $translateProvider.useStaticFilesLoader({
      prefix: gaGlobalOptions.resourceUrl + 'locales/',
      suffix: '.json'
    });
    $translateProvider.cloakClassName('ng-cloak');
    // TODO: Use $sanitize instead in the future
    // see http://angular-translate.github.io/docs/#/guide/19_security
    $translateProvider.useSanitizeValueStrategy(null);
  });

  module.config(function(gaLayersProvider, gaGlobalOptions) {

    var dflt = ['0', '1', '2', '3', '4'];
    var hundred = ['100', '101', '102', '103', '104'];

    ol.proj.proj4.register(window.proj4);

    // Domains
    gaLayersProvider.wmsSubdomains = dflt;
    gaLayersProvider.wmtsSubdomains = hundred;
    gaLayersProvider.vectorTilesSubdomains =
        gaGlobalOptions.staging !== 'dev' ? hundred : dflt;

    // Map services urls
    gaLayersProvider.wmsUrl = gaGlobalOptions.wmsUrl;
    gaLayersProvider.wmtsUrl = gaGlobalOptions.wmtsUrl +
        '/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{x}/{y}.{Format}';
    gaLayersProvider.wmtsLV03Url = gaGlobalOptions.wmtsUrl +
        '/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.{Format}';
    gaLayersProvider.terrainUrl = gaGlobalOptions.terrainUrl +
        '/1.0.0/{Layer}/';
    gaLayersProvider.vectorTilesUrl = gaGlobalOptions.vectorTilesUrl +
        '/{Layer}/{Time}/';

    // Api services urls
    if (gaGlobalOptions.apiOverwrite) {
      gaLayersProvider.layersConfigUrl = gaGlobalOptions.apiUrl +
          '/rest/services/all/MapServer/layersConfig?lang={Lang}';
    } else {
      gaLayersProvider.layersConfigUrl = gaGlobalOptions.resourceUrl +
          'layersConfig.{Lang}.json';
    }
    gaLayersProvider.legendUrl = gaGlobalOptions.apiUrl +
        '/rest/services/all/MapServer/{Layer}/legend?lang={Lang}';
  });

  module.config(function(gaTopicProvider, gaGlobalOptions) {
    if (gaGlobalOptions.apiOverwrite) {
      gaTopicProvider.topicsUrl = gaGlobalOptions.apiUrl + '/rest/services';
    } else {
      gaTopicProvider.topicsUrl = gaGlobalOptions.resourceUrl + 'services';
    }
  });

  module.config(function(gaExportKmlProvider, gaGlobalOptions) {
    gaExportKmlProvider.downloadKmlUrl = gaGlobalOptions.apiUrl +
        '/downloadkml';
  });

  module.config(function(gaFileStorageProvider, gaGlobalOptions) {
    gaFileStorageProvider.fileStorageUrl = gaGlobalOptions.apiUrl + '/files';
    gaFileStorageProvider.publicUrl = gaGlobalOptions.publicUrl;
  });

  module.config(function(gaPreviewFeaturesProvider, gaGlobalOptions) {
    gaPreviewFeaturesProvider.url = gaGlobalOptions.cachedApiUrl +
        '/rest/services/all/MapServer/';
  });

  module.config(function(gaProfileProvider, gaGlobalOptions) {
    gaProfileProvider.d3libUrl = gaGlobalOptions.resourceUrl +
        'lib/d3.min.js';
    gaProfileProvider.profileUrl = gaGlobalOptions.altiUrl +
        '/rest/services/profile.json';
  });

  module.config(function(gaUrlUtilsProvider, gaGlobalOptions) {
    gaUrlUtilsProvider.shortenUrl = gaGlobalOptions.apiUrl +
        '/shorten.json';
  });

  module.config(function(gaQueryProvider, gaGlobalOptions) {
    gaQueryProvider.dpUrl = gaGlobalOptions.resourceUrl +
        'lib/bootstrap-datetimepicker.min.js';
  });

  module.config(function($sceDelegateProvider, gaGlobalOptions) {
    var whitelist = $sceDelegateProvider.resourceUrlWhitelist();
    whitelist = whitelist.concat(gaGlobalOptions.whitelist);
    $sceDelegateProvider.resourceUrlWhitelist(whitelist);
  });

  module.config(function($compileProvider, gaGlobalOptions) {
    $compileProvider.aHrefSanitizationWhitelist(gaGlobalOptions.hrefRegexp);
  });
})();
