/* eslint-disable max-len */
describe('ga_wmtsgetcap_directive', function() {
  var elt, scope, parentScope, map, $rootScope, $compile, $window;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-wmts-get-cap="getCap" ga-wmts-get-cap-map="map" ga-wmts-get-cap-options="options"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  var wmtsBasic;

  before(function(done) {
    $.get('base/test/data/wmts-basic.xml', function(response) {
      wmtsBasic = response;
      done();
    });
  });

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {
        get: function() {
          return 'somelang';
        },
        getNoRm: function() {
          return 'somelang';
        }
      });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $window = $injector.get('$window');
    });

    map = new ol.Map({});
    map.setSize([600, 300]);
  });

  describe('loads a correct WMTS GetCapabilities', function() {

    beforeEach(function() {
      $rootScope.map = map;
      $rootScope.getCap = wmtsBasic;
      $rootScope.options = {};
      loadDirective();
    });

    it('creates html elements', function() {
      expect(elt.find('[ga-wmts-get-cap-item]').length).to.be(5);
      expect(elt.find('.fa-sort-by-alphabet').length).to.be(1);
      expect(elt.find('.ga-add').length).to.be(1);
    });

    it('has good scope values', function() {
      expect(scope.map).to.be(map);
      expect(scope.layers.length).to.be(5);
      expect(scope.limitations).to.be(undefined);
      expect(scope.userMsg).to.be(undefined);
      expect(scope.options.layerSelected).to.be(null);
      expect(scope.options.layerHovered).to.be(null);
      expect(scope.addLayerSelected).to.be.a(Function);
      expect(scope.getAbstract).to.be.a(Function);
    });
  });

  describe('loads a invalid WMTS GetCapabilities', function() {
    var spy;

    beforeEach(function() {
      spy = sinon.stub($window.console, 'error');
      $rootScope.map = map;
      $rootScope.options = {};
      $rootScope.getCap = 'fdgdfgdf';
      loadDirective();
    });

    afterEach(function() {
      spy.restore();
    });

    it('displays a parse error message', function() {
      expect(spy.callCount).to.be(1);
      expect(scope.userMsg).to.be('parsing_failed');
    });
  });
});
