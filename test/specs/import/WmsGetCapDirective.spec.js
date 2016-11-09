describe.only('ga_wmsgetcap_directive', function() {
  var elt, scope, parentScope, map, $rootScope, $compile, $translate, gaWms, $window, $httpBackend;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-wms-get-cap="getCap" ga-wms-get-cap-map="map"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  var wmsBasic;

  before(function(done) {
    $.get('base/test/data/wms-basic.xml', function(response) {
      wmsBasic = response;
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
      gaWms = $injector.get('gaWms');
    });

    map = new ol.Map({});
    map.setSize([600, 300]);
  });

  describe('loads a correct WMS GetCapabilities', function() {

    beforeEach(function() {
      $rootScope.map = map;
      $rootScope.getCap = wmsBasic;
      loadDirective();
    });

    it('creates html elements', function() {
      expect(elt.find('[ga-wms-get-cap-item]').length).to.be(800);
      expect(elt.find('.fa-zoom-in').length).to.be(800);
      expect(elt.find('.fa-plus:not(.ng-hide)').length).to.be(105);
      expect(elt.find('.fa-sort-by-alphabet').length).to.be(1);
      expect(elt.find('.ga-add').length).to.be(1);
      expect(elt.find('.ga-message').length).to.be(1);
    });

    it('has good scope values', function() {
      expect(scope.map).to.be(map);
      expect(scope.layers.length).to.be(377);
      expect(scope.limitations).to.be('wms_max_size_allowed 3850 * 3850');
      expect(scope.userMsg).to.be(undefined);
      expect(scope.options.layerSelected).to.be(null);
      expect(scope.options.layerHovered).to.be(null);
      expect(scope.addLayerSelected).to.be.a(Function);
      expect(scope.getAbstract).to.be.a(Function);
    });
  });

  describe('loads a invalid WMS GetCapabilities', function() {
    var spy;

    beforeEach(function() {
      spy = sinon.spy($window.console, 'error');
      $rootScope.map = map;
      $rootScope.getCap = 'fdgdfgdf';
      loadDirective();
    });

    it('displays a parse error mesage', function() {
      expect(spy.callCount).to.be(1);
      expect(scope.userMsg).to.be('parse_failed');
    });
  });

  describe('loads a WMS GetCapabilities with invalid layers', function() {

  });
});
