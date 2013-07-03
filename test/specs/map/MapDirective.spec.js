describe('ga_map_directive', function() {

  var map, element, scope;

  beforeEach(inject(function($rootScope, $compile) {
    map = new ol.Map({
      layers: []
    });
    $rootScope.map = map;
    $rootScope.options = {
      resolutions: [2, 1]
    };
    element = angular.element(
      '<div ga-map ga-map-map="map" ' +
          'ga-map-options="options"' +
      '</div>');
    $compile(element)($rootScope);
  }));

  it('gives the map a target', function() {
    expect(map.getTarget()).to.be(element[0]);
  });

});
