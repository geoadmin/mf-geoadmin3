beforeEach(function() {
  module('ga');

  // Configure the $translate service in such a way that no
  // requests to translation files are performed.
  module(function ($translateProvider) {
    $translateProvider.translations('en', {});
    $translateProvider.useLoader(undefined);
  });

  module(function(gaLayersProvider) {
    gaLayersProvider.layersConfigUrlTemplate =
        'http://example.com/{Topic}?lang={Lang}';
  });
});
