describe('ga_backgroundselector_directive', function() {

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
          '<div ga-background-selector ' +
              'ga-background-selector-map="map">' +
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
});
