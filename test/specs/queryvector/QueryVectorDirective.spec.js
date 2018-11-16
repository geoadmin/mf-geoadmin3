/* eslint-disable max-len */
describe('ga_query_vector_directive', function() {
  var $rootScope,
    $compile,
    el,
    map,
    scope;

  var loadDirective = function(map) {
    scope = $rootScope.$new();
    scope.map = map;
    var tpl =
      '<div ga-query-vector ' +
      'ga-query-vector-map="map"' +
      '</div>';
    el = $compile(tpl)(scope);
    $rootScope.$digest();
  };

  var createMap = function() {
    var mp = new ol.Map({});
    mp.setSize([600, 300]);
    mp.getView().fit([-20000000, -20000000, 20000000, 20000000]);
    return mp;
  };

  var injectServices = function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  };

  beforeEach(function() {
    inject(function($injector) {
      injectServices($injector);
    });
    map = createMap();
  });

  it('creates the query vector directive and adds an overlay to the map', function() {
    loadDirective(map);
    expect($(map.getViewport()).find('div.ol-overlay-container').css('display')).to.equal('none');
    var overlay = map.getOverlays().getArray()[0];
    expect(overlay).to.be.an(ol.Overlay);
  });
});
