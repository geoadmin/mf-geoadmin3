/* eslint-disable max-len */
describe('ga_query_vector_directive', function() {
  var $rootScope,
    $compile,
    el,
    map,
    parentScope,
    scope;

  var loadDirective = function(map) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    var tpl =
      '<div ga-query-vector ' +
      'ga-query-vector-map="map"' +
      '</div>';
    el = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = el.isolateScope();
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
    expect(scope.flatFeatures.length).to.equal(0);
    scope.flatFeatures = [
      [['prop1', 'val1'], ['prop2', 'val2']],
      [['anotherprop1', 'anotherval1']]
    ];
    $rootScope.$digest();
    expect($(map.getViewport()).find('div.ol-overlay-container').css('display')).to.equal('none');
    var overlay = map.getOverlays().getArray()[0];
    expect(overlay).to.be.an(ol.Overlay);
    var tables = el.find('table');
    expect(tables.length).to.equal(2);
    expect($(tables[0]).hasClass('ga-query-vector-item-separator')).to.be(true);
    expect($(tables[1]).hasClass('ga-query-vector-item-separator')).to.be(false);
  });
});
