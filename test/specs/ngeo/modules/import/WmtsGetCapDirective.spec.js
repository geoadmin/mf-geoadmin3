describe('ngeo.wmtsGetCapDirective', function() {
    var elt, scope, parentScope, map, $rootScope, $compile, $translate, gaWmts, $window, $httpBackend;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ngeo-wmts-get-cap="getCap" ngeo-wmts-get-cap-map="map" ngeo-wmts-get-cap-options="options"></div>';
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
      $translate = $injector.get('$translate');
      $window = $injector.get('$window');
      gaWmts = $injector.get('gaWmts');
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
      expect(elt.find('[ngeo-wmts-get-cap-item]').length).to.be(2);
      expect(elt.find('.fa-sort-by-alphabet').length).to.be(1);
      expect(elt.find('.ngeo-add').length).to.be(1);
    });

    it('has good scope values', function() {
      expect(scope.map).to.be(map);
      expect(scope.layers.length).to.be(2);
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
      expect(scope.userMsg).to.be('Parsing failed');
    });
  });
});
