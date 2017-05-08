describe('ga_attribution_directive', function() {
  var elt, scope, parentScope, $compile, $rootScope, $window, gaBrowserSniffer, gaAttribution, gaDebounce, map, $timeout;

  var loadDirective = function(map, ol3d) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    parentScope.ol3d = ol3d;
    var tpl = '<div ga-attribution ga-attribution-map="map" ga-attribution-ol3d="ol3d"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    gaAttribution = $injector.get('gaAttribution');
    gaDebounce = $injector.get('gaDebounce');
  };

  beforeEach(function() {
    map = new ol.Map({});
    ol3d = {
      enabled: false,
      getEnabled: function() {
        return this.enabled;
      },
      getCesiumScene: function() {
        return {
          terrainProvider: {}
        };
      }
    };
  });


  describe('on desktop', function() {
    // Valid layers
    var layerBg = new ol.layer.Layer({});
    layerBg.background = true;
    layerBg.visible = true;

    var layerPrev = new ol.layer.Layer({});
    layerPrev.preview = true;
    layerPrev.visible = true;

    var layerMngr = new ol.layer.Layer({});
    layerMngr.displayInLayerManager = true;
    layerMngr.visible = true;

    // Valid layers but hidden
    var layerBg2 = new ol.layer.Layer({});
    layerBg2.background = true;
    layerBg2.visible = false;

    var layerPrev2 = new ol.layer.Layer({});
    layerPrev2.preview = true;
    layerPrev2.visible = false;

    var layerMngr2 = new ol.layer.Layer({});
    layerMngr2.displayInLayerManager = true;
    layerMngr2.visible = false;

    // Unvalid layer
    var layerUnvalid = new ol.layer.Layer({});
    layerBg.visible = true;

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
      gaBrowserSniffer.mobile = false;
    });

    it('verifies html elements', function() {
      loadDirective(map);
      expect(elt.html()).to.be('');
      expect(elt.data('bs.tooltip')).to.be.an(Object);
    });

    it('set scope values', function() {
      loadDirective(map);

      expect(scope.layers).to.be.an(Array);
      expect(scope.layerFilter).to.be.a(Function);
      expect(scope.is3dActive).to.be.a(Function);
    });

    it('set scope values', function() {
      loadDirective(map);

      expect(scope.layers).to.be.an(Array);
      expect(scope.layerFilter).to.be.a(Function);
      expect(scope.is3dActive).to.be.a(Function);
    });

    [layerBg, layerPrev, layerMngr].forEach(function(layer) {
      it('updates content when a good layer is added', function() {
        loadDirective(map);
        sinon.stub(gaAttribution, 'getTextFromLayer').returns('foo');
        sinon.stub(gaAttribution, 'getHtmlFromLayer').returns('<p>bar</p>');
        map.addLayer(layer);
        $timeout.flush();
        expect(elt.html()).to.be('copyright_data<p>bar</p>');
      });
    });

    [layerBg2, layerPrev2, layerMngr2, layerUnvalid].forEach(function(layer) {
      it('updates content when a good layer is added', function() {
        loadDirective(map);
        map.addLayer(layer);
        $timeout.flush();
        expect(elt.html()).to.be('');
      });
    });

    it('updates content on language change', function() {
      loadDirective(map);
      sinon.stub(gaAttribution, 'getTextFromLayer').returns('foo');
      var stub = sinon.stub(gaAttribution, 'getHtmlFromLayer').returns('<p>bar</p>');
      map.addLayer(layerBg);
      $timeout.flush();
      expect(elt.html()).to.be('copyright_data<p>bar</p>');
      stub.returns('<p>barde</p>');
      $rootScope.$broadcast('gaLayersTranslationChange');
      $timeout.flush();
      expect(elt.html()).to.be('copyright_data<p>barde</p>');
    });

    it('updates content on 3d status change', function() {
      loadDirective(map);
      sinon.stub(gaAttribution, 'getTextFromLayer').returns('foo');
      var stub = sinon.stub(gaAttribution, 'getHtmlFromLayer').returns('<p>bar</p>');
      map.addLayer(layerBg);
      $timeout.flush();

      // The first time the 3d is loaded
      stub.returns('<p>bar3dloaded</p>');
      parentScope.ol3d = ol3d;
      $rootScope.$digest();
      $timeout.flush();
      expect(elt.html()).to.be('copyright_data<p>bar3dloaded</p>');

      // The first time the 3d is enabled
      stub.returns('<p>bar3denabled</p>');
      parentScope.ol3d.enabled = true;
      $rootScope.$digest();
      $timeout.flush();
      expect(elt.html()).to.be('copyright_data<p>bar3denabled</p>');
      $timeout.verifyNoPendingTasks();
    });
  });

  describe('on mobile', function() {

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
      gaBrowserSniffer.mobile = true;
    });

    it('doesn\'t load tooltips', function() {
      loadDirective(map);
      expect(elt.data('bs.tooltip')).to.be(undefined);
    });
  });
});
