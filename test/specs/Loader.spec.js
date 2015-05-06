beforeEach(function() {

  // The ga module requires the gaGlobalOptions.version property to be
  // defined.
  module(function($provide) {
    var location = {
      host: 'map.admin.ch',
      hostname: 'map.geo.admin.ch', 
      href: 'http://map.geo.admin.ch/?lang=en&topic=ech&bgLayer=ch.swisstopo.pixelkarte-farbe&X=207277.79&Y=690852.63&zoom=1',
      origin: 'http://map.geo.admin.ch',
      pathname: '/',
      port: '',
      protocol: 'http:'
    };
    var version = '123456';
    var versionSlashed = version + '/';
    var apiUrl = '//api3.geo.admin.ch';
    var publicUrl = '//public.geo.admin.ch';
    var apacheBasePath = '/';
    var cacheAdd = '/' + version;
    var pathname = location.pathname.replace(/(index|mobile|embed)\.html$/g, '');
    $provide.constant('gaGlobalOptions', {
      version: '123456',
      mapUrl : location.origin + apacheBasePath,
      apiUrl : location.protocol + apiUrl,
      publicUrl: location.protocol + publicUrl,
      cachedApiUrl: location.protocol + apiUrl + cacheAdd,
      resourceUrl: location.origin + pathname + versionSlashed,
      ogcproxyUrl : location.protocol + apiUrl + '/ogcproxy?url=',
      whitelist: [
        'http://www.kmlvalidator.org/validate.htm',
        'https://' + location.host + '/**'
      ]
    });
  });

  module('ga');

  // Configure the $translate service in such a way that no
  // requests to translation files are performed.
  module(function($translateProvider) {
    $translateProvider.translations('en', {});
    $translateProvider.useLoader(undefined);
  });

  module(function(gaLayersProvider) {
    gaLayersProvider.wmtsGetTileUrlTemplate =
        'http://wmts.com/foo/{Layer}/default/{Time}/21781/' +
        '{TileMatrix}/{TileRow}/{TileCol}.{Format}';
    gaLayersProvider.layersConfigUrlTemplate =
        'http://example.com/{Topic}?lang={Lang}';
    gaLayersProvider.legendUrlTemplate =
        'http://legendservice.com/{Topic}/{Layer}?lang={Lang}';
  });

  module(function(gaExportKmlProvider, gaGlobalOptions) {
    gaExportKmlProvider.downloadKmlUrl =
        gaGlobalOptions.apiUrl + '/downloadkml';
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
        gaGlobalOptions.resourceUrl + 'lib/d3-3.3.1.min.js';
    gaProfileProvider.profileUrl =
        gaGlobalOptions.apiUrl + '/rest/services/profile.json';
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
