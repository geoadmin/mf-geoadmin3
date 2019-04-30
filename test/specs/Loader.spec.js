/* eslint-disable max-len */
beforeEach(function() {

  // The ga module requires the gaGlobalOptions.version property to be
  // defined
  module(function($provide) {
    var version = '123456';
    var versionSlashed = version + '/';
    var apiUrl = '//api3.geo.admin.ch';
    var configUrl = '//map.geo.admin.ch';
    var altiUrl = '//api3.geo.admin.ch';
    var publicUrl = '//public.geo.admin.ch';
    var printUrl = '//print.geo.admin.ch';
    var proxyUrl = '//proxy.geo.admin.ch';
    var shopUrl = '//shop.bgdi.ch';
    var wmsUrl = '//wms.geo.admin.ch';
    var wmtsUrl = '//tod{s}.bgdi.ch';
    var terrainUrl = '//terrain100.geo.admin.ch';
    var vectorTilesUrl = '//vectortiles{s}.geo.admin.ch';
    var apacheBasePath = '/';
    var cacheAdd = '/' + version;
    var pathname = location.pathname.replace(/(context|index|mobile|embed)\.html$/g, '');

    $provide.constant('gaGlobalOptions', {
      dev3d: false,
      buildMode: 'prod',
      version: '123456',
      pegman: false,
      mapUrl: location.origin + apacheBasePath,

      // Map services urls
      wmsUrl: location.protocol + wmsUrl,
      wmtsUrl: location.protocol + wmtsUrl,
      terrainUrl: location.protocol + terrainUrl,
      vectorTilesUrl: location.protocol + vectorTilesUrl,

      // Api services urls
      apiUrl: location.protocol + apiUrl,
      configUrl: location.protocol + configUrl,
      altiUrl: location.protocol + altiUrl,
      printUrl: location.protocol + printUrl,
      shopUrl: location.protocol + shopUrl,
      publicUrl: location.protocol + publicUrl,
      publicUrlRegexp: /^https?:\/\/public\..*\.(bgdi|admin)\.ch\/.*/,
      adminUrlRegexp: /^(ftp|http|https):\/\/(.*(\.bgdi|\.geo\.admin)\.ch)/,
      cachedApiUrl: location.protocol + apiUrl + cacheAdd,
      cachedPrintUrl: location.protocol + printUrl + cacheAdd,
      resourceUrl: location.origin + pathname + versionSlashed,
      proxyUrl: location.protocol + proxyUrl + '/',
      imageryMetadataUrl: '//3d.geo.admin.ch/imagery',
      w3wUrl: 'dummy.test.url.com',
      lv03tolv95Url: '//api.example.com/reframe/lv03tolv95',
      lv95tolv03Url: '//api.example.com/reframe/lv95tolv03',
      w3wApiKey: 'testkey',
      whitelist: [
        'https://' + window.location.host + '/**',
        'https://www.googleapis.com/**'
      ],

      // App state values
      defaultTopicId: 'sometopic',
      translationFallbackCode: 'somelang',
      languages: ['de', 'fr', 'it', 'en', 'rm', 'somelang'],

      // Map state values
      defaultExtent: [420000, 30000, 900000, 350000],
      swissExtent: [558147.7958306982, 5677741.814085617, 1277662.36597472, 6152731.529704217],
      defaultResolution: 500.0,
      defaultEpsg: 'EPSG:2056',
      defaultEpsgExtent: [2420000, 1030000, 2900000, 1350000],
      defaultElevationModel: 'COMB',
      defaultTerrain: 'ch.dummy.terrain.3d',
      defaultLod: 7,
      resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
        2.5, 2.0, 1.0, 0.5, 0.25, 0.1],
      lods: [6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 16, 17, 18, 18],
      tileGridOrigin: [2420000, 1350000],
      tileGridResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500,
        2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100,
        50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1],
      tileGridWmtsDfltMinRes: 0.5,

      // Offline parameters
      offlineMinZoom: 4,
      offlineMinZoomNonbglayer: 4,
      offlineMaxZoom: 8,
      offlineZOffset: 14
    });
  });

  module('geoadmin');

  // Configure the $translate service in such a way that no
  // requests to translation files are performed.
  module(function($translateProvider) {
    $translateProvider.translations('en', {});
    $translateProvider.useLoader(undefined);
  });

  module(function(gaLayersProvider, gaGlobalOptions) {
    gaLayersProvider.wmsSubdomains = ['', '0', '1', '2', '3', '4'];
    gaLayersProvider.wmtsSubdomains = ['5', '6', '7', '8', '9'];
    gaLayersProvider.vectorTilesSubdomains = ['100', '101', '102', '103', '104'];
    gaLayersProvider.wmsUrl = '//wms{s}.geo.admin.ch/';
    gaLayersProvider.wmtsUrl = '//wmts{s}.geo.admin.ch/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{x}/{y}.{Format}'
    gaLayersProvider.wmtsLV03Url = '//wmts{s}.geo.admin.ch/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.{Format}';
    gaLayersProvider.terrainUrl = '//3d.geo.admin.ch/1.0.0/{Layer}/default/{Time}/4326';
    gaLayersProvider.vectorTilesUrl = '//vectortiles{s}.geo.admin.ch/{Layer}/{Time}/';
    gaLayersProvider.layersConfigUrl = 'https://example.com/all?lang={Lang}';
    gaLayersProvider.legendUrl = 'https://legendservice.com/all/{Layer}?lang={Lang}';
  });

  module(function(gaTopicProvider, gaGlobalOptions) {
    gaTopicProvider.topicsUrl = gaGlobalOptions.resourceUrl + 'services';
  });

  module(function(gaExportKmlProvider, gaGlobalOptions) {
    gaExportKmlProvider.downloadKmlUrl = gaGlobalOptions.apiUrl + '/downloadkml';
  });

  module(function(gaExportMapboxStyleProvider, gaGlobalOptions) {
    gaExportMapboxStyleProvider.downloadUrl = gaGlobalOptions.apiUrl + '/downloadkml';
  });

  module(function(gaPreviewFeaturesProvider, gaGlobalOptions) {
    gaPreviewFeaturesProvider.url =
        gaGlobalOptions.cachedApiUrl + '/rest/services/all/MapServer/';
  });

  module(function(gaProfileProvider, gaGlobalOptions) {
    gaProfileProvider.d3libUrl = gaGlobalOptions.resourceUrl + 'lib/d3.min.js';
    gaProfileProvider.profileUrl = gaGlobalOptions.altiUrl + '/rest/services/profile.json';
  });

  module(function(gaUrlUtilsProvider, gaGlobalOptions) {
    gaUrlUtilsProvider.shortenUrl =
        gaGlobalOptions.apiUrl + '/shorten.json';
  });

  module(function(gaQueryProvider, gaGlobalOptions) {
    gaQueryProvider.dpUrl = gaGlobalOptions.resourceUrl +
        'lib/bootstrap-datetimepicker.min.js';
  });

  module(function($sceDelegateProvider, gaGlobalOptions) {
    var whitelist = $sceDelegateProvider.resourceUrlWhitelist();
    whitelist = whitelist.concat(gaGlobalOptions.whitelist);
    $sceDelegateProvider.resourceUrlWhitelist(whitelist);
  });

  // Void display of "Possibly unhandled rejection:" message
  module(function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  });
});
