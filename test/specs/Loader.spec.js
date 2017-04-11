beforeEach(function() {
  ngeo.baseModuleTemplateUrl = 'ngeo/src/modules';

  // The ga module requires the gaGlobalOptions.version property to be
  // defined
  module(function($provide) {
    var version = '123456';
    var versionSlashed = version + '/';
    var apiUrl = '//api3.geo.admin.ch';
    var publicUrl = '//public.geo.admin.ch';
    var printUrl = '//print.geo.admin.ch';
    var mapproxyUrl = '//wmts{s}.geo.admin.ch';
    var shopUrl = '//shop.bgdi.ch';
    var wmsUrl = '//wms.geo.admin.ch';
    var apacheBasePath = '/';
    var cacheAdd = '/' + version;
    var pathname = location.pathname.replace(/(context|index|mobile|embed)\.html$/g, '');


    $provide.constant('gaGlobalOptions', {
      dev3d: false,
      buildMode: 'prod',
      version: '123456',
      pegman: false,
      mapUrl: location.origin + apacheBasePath,
      apiUrl: location.protocol + apiUrl,
      printUrl: location.protocol + printUrl,
      mapproxyUrl: location.protocol + mapproxyUrl,
      shopUrl: location.protocol + shopUrl,
      publicUrl: location.protocol + publicUrl,
      publicUrlRegexp: /^https?:\/\/public\..*\.(bgdi|admin)\.ch\/.*/,
      adminUrlRegexp: /^(ftp|http|https):\/\/(.*(\.bgdi|\.geo\.admin)\.ch)/,
      cachedApiUrl: location.protocol + apiUrl + cacheAdd,
      cachedPrintUrl: location.protocol + printUrl + cacheAdd,
      resourceUrl: location.origin + pathname + versionSlashed,
      ogcproxyUrl: location.protocol + apiUrl + '/ogcproxy?url=',
      wmsUrl: location.protocol + wmsUrl,
      w3wUrl: 'dummy.test.url.com',
      lv03tolv95Url: '//api.example.com/reframe/lv03tolv95',
      lv95tolv03Url: '//api.example.com/reframe/lv95tolv03',
      w3wApiKey: 'testkey',
      whitelist: [
        'https://' + window.location.host + '/**'
      ],
      defaultTopicId: 'sometopic',
      translationFallbackCode: 'somelang',
      defaultExtent: [420000, 30000, 900000, 350000],
      defaultResolution: 500.0,
      defaultLod: 7,
      resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
          2.5, 2.0, 1.0, 0.5, 0.25, 0.1],
      lods: [6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 16, 17, 18, 18],
      defaultEpsg: 'EPSG:21781',
      defaultEpsgExtent: [420000, 30000, 900000, 350000],
      defaultElevationModel: 'COMB',
      defaultTerrain: 'ch.dummy.terrain.3d',
      languages: ['de', 'fr', 'it', 'en', 'rm', 'somelang']
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
    gaLayersProvider.dfltWmsSubdomains = ['', '0', '1', '2', '3', '4'];
    gaLayersProvider.dfltWmtsNativeSubdomains = ['5', '6', '7', '8', '9'];
    gaLayersProvider.dfltWmtsMapProxySubdomains = ['20', '21', '22', '23', '24'];
    gaLayersProvider.dfltVectorTilesSubdomains = ['100', '101', '102', '103', '104'];
    gaLayersProvider.wmsUrlTemplate = '//wms{s}.geo.admin.ch/';
    gaLayersProvider.wmtsGetTileUrlTemplate = '//wmts{s}.geo.admin.ch/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.{Format}';

    gaLayersProvider.wmtsMapProxyGetTileUrlTemplate = gaGlobalOptions.mapproxyUrl +
        '/1.0.0/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{x}/{y}.{Format}';
    gaLayersProvider.terrainTileUrlTemplate = '//3d.geo.admin.ch/1.0.0/{Layer}/default/{Time}/4326';
    gaLayersProvider.vectorTilesUrlTemplate = '//vectortiles{s}.geo.admin.ch/{Layer}/{Time}/';
    gaLayersProvider.layersConfigUrlTemplate = 'https://example.com/all?lang={Lang}';
    gaLayersProvider.legendUrlTemplate = 'https://legendservice.com/all/{Layer}?lang={Lang}';
    gaLayersProvider.imageryMetadataUrl = '//3d.geo.admin.ch/imagery/';
  });

  module(function(gaTopicProvider, gaGlobalOptions) {
    gaTopicProvider.topicsUrl = gaGlobalOptions.resourceUrl + 'services';
  });

  module(function(gaExportKmlProvider, gaGlobalOptions) {
    gaExportKmlProvider.downloadKmlUrl = gaGlobalOptions.apiUrl + '/downloadkml';
  });

  module(function(gaFileStorageProvider, gaGlobalOptions) {
    gaFileStorageProvider.fileStorageUrl = gaGlobalOptions.apiUrl + '/files';
    gaFileStorageProvider.publicUrl = gaGlobalOptions.publicUrl;
  });

  module(function(gaPreviewFeaturesProvider, gaGlobalOptions) {
    gaPreviewFeaturesProvider.url =
        gaGlobalOptions.cachedApiUrl + '/rest/services/all/MapServer/';
  });

  module(function(gaProfileProvider, gaGlobalOptions) {
    gaProfileProvider.d3libUrl =
        gaGlobalOptions.resourceUrl + 'lib/d3.min.js';
    gaProfileProvider.profileUrl =
        gaGlobalOptions.apiUrl + '/rest/services/profile.json';
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
});
