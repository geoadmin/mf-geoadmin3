describe('ga_backgroundlayerselector_directive', function() {

  var element, map, layer1, layer2;

  beforeEach(function() {

    var deferreds = new Array(3);

    module(function($provide) {
      $provide.value('gaLayers', {
        getOlLayerById: function(id) {
          var idx = id == 'foo' ? 0 : 1;
          return deferreds[idx].promise;
        },
        getBackgroundLayers: function() {
          return deferreds[2].promise;
        }
      });
    });

    inject(function($q) {
      var i;
      for (i = 0; i < deferreds.length; ++i) {
        deferreds[i]= $q.defer();
      }
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
              'ga-background-layer-selector-map="map">' +
          '</div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      $rootScope.map = map;
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

    inject(function($rootScope) {
      $rootScope.$apply(function() {
        deferreds[0].resolve(layer1);
        deferreds[1].resolve(layer2);
        deferreds[2].resolve([{
          id: 'foo', label: 'Foo'
        }, {
          id: 'bar', label: 'Bar'
        }]);
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
