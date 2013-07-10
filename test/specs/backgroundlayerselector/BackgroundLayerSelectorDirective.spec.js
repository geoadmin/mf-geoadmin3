describe('ga_backgroundlayerselector_directive', function() {

  var element, map, layer1, layer2;

  beforeEach(function() {

    var deferred1, deferred2;

    module(function($provide) {
      $provide.value('gaLayers', {
        getLayerById: function(id) {
          var d = id == 'foo' ? deferred1 : deferred2;
          return d.promise;
        }
      });
    });

    inject(function($q) {
      deferred1 = $q.defer();
      deferred2 = $q.defer();
    });

    map = new ol.Map({});

    layer1 = new ol.layer.TileLayer({
      source: new ol.source.OSM()
    });
    layer2 = new ol.layer.TileLayer({
      source: new ol.source.OSM()
    });

    element = angular.element(
      '<div>' +
          '<div ga-background-layer-selector ' +
              'ga-background-layer-selector-map="map" ' +
              'ga-background-layer-selector-options="options">' +
          '</div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      $rootScope.map = map;
      $rootScope.options = {
        wmtsLayers: [
          {label: 'Foo', value: 'foo'},
          {label: 'Bar', value: 'bar'}
        ]
      };
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

    inject(function($rootScope) {
      $rootScope.$apply(function() {
        deferred1.resolve(layer1);
        deferred2.resolve(layer2);
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
