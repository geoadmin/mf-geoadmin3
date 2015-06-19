describe('ga_backgroundselector_directive', function() {

  var element, map, layer1, layer2, $rootScope, $compile;

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
        getBackgroundLayers: function () {
          return [
            {id: 'ch.swisstopo.swissimage', label: 'bg_luftbild'},
            {id: 'ch.swisstopo.pixelkarte-farbe', label: 'bg_pixel_color'},
            {id: 'ch.swisstopo.pixelkarte-grau', label: 'bg_pixel_grey'}
          ];
        }
      });
      $provide.value('gaTopic', {
        get: function() {
          return {
            id: 'sometopic',
            langs: [{
              value: 'somelang',
              label: 'somelang'
            }]
          };
        }
      });
    });

    inject(function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $rootScope.map = map;
    });

    element = angular.element(
      '<div>' +
          '<div ga-background-selector ' +
              'ga-background-selector-map="map">' +
          '</div>' +
      '</div>');
    $compile(element)($rootScope);
    $rootScope.$digest();

    $rootScope.$broadcast('gaTopicChange');
    $rootScope.$digest();
  });

  describe('initialization', function() {
    it('creates a toggle div', function() {
      var divToggle = element.find('.ga-bg-layer-bt');
      var div = divToggle[0];
      expect(div).not.to.be(undefined);
    });

    it('creates 4 layer bgselectors div', function() {
      var divsBg = element.find('.ga-bg-layer');
      expect(divsBg.length).to.equal(4);
    });
  });

  describe('toggle activation', function() {
    it('shows and hides bgselectors div', function() {
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(false);
      
      element.find('.ga-bg-layer-bt').click();
      $rootScope.$digest();
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(true);

      element.find('.ga-bg-layer-bt').click();
      $rootScope.$digest();
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);

      element.find('.ga-bg-layer-bt').click();
      $rootScope.$digest();
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(true);

      element.find('.ga-swissimage').click();
      $rootScope.$digest();
      expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);
    });
  });
});
