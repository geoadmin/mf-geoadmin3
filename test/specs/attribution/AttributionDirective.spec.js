describe('ga_attribution_directive', function() {

  var element, map, layer1;

  beforeEach(function() {

    map = new ol.Map({});

    layer1 = new ol.layer.TileLayer({
      source: new ol.source.OSM({
        attributions: [
          ol.source.OSM.DATA_ATTRIBUTION
       ]})
    });

    element = angular.element(
      '<div id="map"></div>' +
      '<div ga-attribution ga-attribution-map="map"></div>');

    inject(function($rootScope, $compile) {
      map.addLayer(layer1);
      $rootScope.map = map;

      $compile(element)($rootScope);
      map.setTarget(element.find('#map')[0]);
      $rootScope.$digest();
    });

  });

  describe('initialization', function() {
    it('creates empty <ul>', function() {
      var ul = element.find('ul');
      expect(ul.length).to.be(1);
      expect(ul[0].innerHTML).to.be('');
    });
  });

  describe('add layer', function() {
    it('fills the attribution', function() {
      map.addLayer(layer1);
      var ul = element.find('ul');
      expect(ul[0].innerHTML).to.contain('OpenStreetMap');
    });
  });


});
