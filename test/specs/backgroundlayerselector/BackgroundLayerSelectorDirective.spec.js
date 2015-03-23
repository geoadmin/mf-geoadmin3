describe('ga_backgroundlayerselector_directive', function() {

  var element, map, layer1, layer2;

  beforeEach(function() {

    map = new ol.Map({});

    layer1 = new ol.layer.Tile();

    layer2 = new ol.layer.Tile();

    module(function($provide) {
      $provide.value('gaLayers', {
        getLayer: function(id) {
          return {}; 
        },
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

      $rootScope.$broadcast('gaLayersChange', {labelsOnly: false});
      $rootScope.$digest();
    });

  });

  describe('initialization', function() {
    it('creates <select> with <option>\'s', function() {
      var select = element.find('select');
      select = select[0];
      expect(select).not.to.be(undefined);

      var options = $(select).find('option');
      expect(options.length).to.equal(3);

      expect($(options[0]).text()).to.equal('Foo');
      expect($(options[1]).text()).to.equal('Bar');
      expect($(options[2]).text()).to.equal('void_layer');
    });

    it('adds a layer to the map', function() {
      var layers = map.getLayers();
      var numLayers = layers.getLength();
      expect(numLayers).to.equal(1);
      expect(layers.item(0)).to.be(layer1);
    });
  });

  describe('select a bg layer', function() {
    it('changes the bg layer', function() {
      var select = element.find('select');
      $(select).val('1');
      $(select).trigger('change');
      var layers = map.getLayers();
      var numLayers = layers.getLength();
      expect(numLayers).to.equal(1);
      expect(layers.item(0)).to.be(layer2);
    });
  });

  describe('select the void layer', function() {
    it('removes the layer from the map', function() {
      var select = element.find('select');
      $(select).val('2');
      $(select).trigger('change');
      var layers = map.getLayers();
      var numLayers = layers.getLength();
      expect(numLayers).to.equal(0);
    });
  });

  describe('select a bg layer when void layer is selected', function() {
    it('does not remove layers in the map', function() {
      var select = element.find('select');
      var layers = map.getLayers();
      var numLayers;

      // add the void layer
      $(select).val('2');
      $(select).trigger('change');
      numLayers = layers.getLength();
      expect(numLayers).to.equal(0);

      // add an overlay
      layers.push(new ol.layer.Tile());
      numLayers = layers.getLength();
      expect(numLayers).to.equal(1);

      // select a bg layer
      $(select).val('1');
      $(select).trigger('change');
      numLayers = layers.getLength();
      expect(numLayers).to.equal(2);
    });
  });

});
