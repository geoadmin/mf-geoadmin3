beforeEach(function() {

  // The ga module requires the gaGlobalOptions.version property to be
  // defined.
  module(function($provide) {
    $provide.constant('gaGlobalOptions', {
      version: '123456'
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
  });
});
