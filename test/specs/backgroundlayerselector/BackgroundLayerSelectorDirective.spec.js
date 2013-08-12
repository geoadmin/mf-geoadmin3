describe('ga_backgroundlayerselector_directive', function() {

  var element, map, layer1, layer2;

  beforeEach(function() {

    map = new ol.Map({});

    layer1 = new ol.layer.TileLayer({
      source: new ol.source.OSM()
    });

    layer2 = new ol.layer.TileLayer({
      source: new ol.source.OSM()
    });

    module(function($provide) {
      $provide.value('gaLayers', {
        getOlLayerById: function(id) {
          return id == 'foo' ? layer1 : layer2;
        },
        getBackgroundLayers: function() {
          return [{
            id: 'foo', label: 'Foo'
          }, {
            id: 'bar', label: 'Bar'
          }];
        }
      });
    });

    element = angular.element(
      '<div>' +
          '<div ga-background-layer-selector ' +
              'ga-background-layer-selector-map="map">' +
          '</div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      $rootScope.map = map;

      $compile(element)($rootScope);
      $rootScope.$digest();

      $rootScope.$broadcast('gaLayersChange');
      $rootScope.$digest();
    });

  });

  it('creates <select> with <option>\'s', function() {
    var select = element.find('select');
    select = select[0];
    expect(select).not.to.be(undefined);

    var options = $(select).find('option');
    expect(options.length).to.equal(3);

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
