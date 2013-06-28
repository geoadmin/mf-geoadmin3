describe('ga_map_directive', function() {

  var map, element, scope;

  beforeEach(inject(function($rootScope, $compile) {
    map = $rootScope.map = new ol.Map({
      layers: []
    });
    element = angular.element(
      '<div x-ga-map="map"' +
          'x-ga-resolutions="resolutions"' +
      '</div>');
    $compile(element)($rootScope);
  }));

  it('gives the map a target', function() {
    expect(map.getTarget()).to.be(element[0]);
  });

});
