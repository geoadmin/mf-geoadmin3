describe('ga_backgroundlayerselector_directive', function() {

  var element, map, layer1, layer2;

  beforeEach(function() {

    var deferred;

    module(function($provide) {
      $provide.value('gaWmtsLoader', {
        load: function(url) {
          return deferred.promise;
        }
      });
    });

    inject(function($q) {
      deferred = $q.defer();
    });

    map = new ol.Map({});

    element = angular.element(
      '<div>' +
          '<div x-ga-background-layer-selector ' +
              'x-ga-background-layer-selector-map="map" ' +
              'x-ga-background-layer-selector-wmts-url="url" ' +
              'x-ga-background-layer-selector-wmts-layers="layers">' +
          '</div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      $rootScope.map = map;
      $rootScope.url = 'wmts.xml';
      $rootScope.layers = [
        {label: 'Foo', value: 'foo'},
        {label: 'Bar', value: 'bar'}
      ];
      $compile(element)($rootScope);
    });

    inject(function($rootScope) {
      $rootScope.$apply(function() {
        layer1 = new ol.layer.TileLayer({
          source: new ol.source.OSM()
        });
        layer2 = new ol.layer.TileLayer({
          source: new ol.source.OSM()
        });
        deferred.resolve([layer1, layer2]);
      });
    });

  });

  it('creates <select> with <option>\'s', function() {
    var select = element.find('select');
    select = select[0];
    expect(select).not.to.be(undefined);

    var options = $(select).find('option');
    expect(options.length).to.equal(2);

    expect($(options[0]).text()).to.equal('Foo');
    expect($(options[1]).text()).to.equal('Bar');
  });

  it('adds a layer to the map', function() {
    var layers = map.getLayers();
    var numLayers = layers.getLength();
    expect(numLayers).to.equal(1);
    expect(layers.getAt(0)).to.be(layer1);
  });

  it('changes the base layer on select', function() {
    var select = element.find('select');
    $(select).val('1');
    $(select).trigger('change');
    var layers = map.getLayers();
    var numLayers = layers.getLength();
    expect(numLayers).to.equal(1);
    expect(layers.getAt(0)).to.be(layer2);
  });

});
