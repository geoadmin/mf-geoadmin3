/* eslint-disable max-len */
describe('ga_map_directive', function() {
  var map, elt, parentScope;
  var $httpBackend, $compile, $window, $q, $rootScope, gaLayers, gaOffline;

  var loadDirective = function(map) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    var tpl = '<div ga-map ga-map-map="map" ga-map-options="options"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    gaLayers = $injector.get('gaLayers');
    gaOffline = $injector.get('gaOffline');
    gaPermalink = $injector.get('gaPermalink');
    gaStyleFactory = $injector.get('gaStyleFactory');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    gaDebounce = $injector.get('gaDebounce');
    gaOffline = $injector.get('gaOffline');
    gaMapUtils = $injector.get('gaMapUtils');
  };

  beforeEach(function() {
    map = new ol.Map({
      layers: [],
      view: new ol.View({
        projection: ol.proj.get('EPSG:2056'),
        center: [0, 0],
        zoom: 1
      })
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('in all pages', function() {

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
    });

    it('gives the map a target', function() {
      loadDirective(map);
      expect(map.getTarget()).to.be(elt[0]);
      expect(map.getView().getCenter()).to.eql([0, 0]);
      expect(map.getView().getZoom()).to.be(1);
    });

    describe('using zoom from permalink params', function() {

      it('zooms to correct level', function() {
        var z = 14;
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          zoom: '14'
        });
        loadDirective(map);
        expect(map.getView().getZoom()).to.be(14);
      });
    });

    describe('using E,N,X and Y from permalink params', function() {

      it('centers on E and N params', function() {
        var center = [10000, 25000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          E: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql(center);
      });

      it('centers on X and Y params', function() {
        var center = [10000, 25000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          X: center[1] + '',
          Y: center[0] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql(center);
      });

      it('gives prority to E and N over X and Y params', function() {
        var center = [10000, 25000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          E: center[0] + '',
          N: center[1] + '',
          X: (center[1] + 2000) + '',
          Y: (center[0] + 3000) + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql(center);
      });

      it('transforms E and N coords from lv03 to lv95 if necessary', function() {
        var center = [425000, 350000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          E: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([2424999.9999959273, 1349999.9998646392]);
      });

      it('transforms X and Y coords from lv03 to lv95 if necessary', function() {
        var center = [425000, 350000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          X: center[1] + '',
          Y: center[0] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([2424999.9999959273, 1349999.9998646392]);
      });

      it('does nothing if a coord is missing', function() {
        var center = [425000, 350000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          X: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([0, 0]);
      });

      it('does nothing if not upper case', function() {
        var center = [425000, 350000];
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          e: center[0] + '',
          n: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([0, 0]);
      });
    });

    describe('using crosshair from permalink param', function() {

      it('adds a feature with marker style on center of the map', function() {
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          crosshair: 'marker'
        });
        var spy = sinon.spy(gaStyleFactory, 'getStyle');
        var spy2 = sinon.spy(gaMapUtils, 'getFeatureOverlay');
        loadDirective(map);
        expect(spy.callCount).to.be(1);
        expect(spy.getCall(0).args[0]).to.be('marker');
        expect(map.getLayers().getLength()).to.be(1);
        var l = map.getLayers().item(0);
        expect(l.getSource().getFeatures().length).to.be(1);
        var f = l.getSource().getFeatures()[0];
        expect(f.get('label')).to.be('link_bowl_crosshair');
        expect(f.getGeometry().getCoordinates()).to.eql(map.getView().getCenter());
        expect(spy2.callCount).to.be(1);
        expect(spy2.getCall(0).args[0][0]).to.be(f);
      });

      it('fallbacks on marker style if the style doesn\'t exist', function() {
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          crosshair: 'foo'
        });
        var spy = sinon.spy(gaStyleFactory, 'getStyle');
        loadDirective(map);
        expect(spy.callCount).to.be(2);
        expect(spy.getCall(0).args[0]).to.be('foo');
        expect(spy.getCall(1).args[0]).to.be('marker');
      });

      it('deletes crosshair param from permlaink on next view\'s property change event', function() {
        var stub = sinon.stub(gaPermalink, 'getParams').returns({
          crosshair: 'marker'
        });
        var spy = sinon.spy(gaPermalink, 'deleteParam');
        loadDirective(map);
        map.getView().setCenter([800, 900]);
        expect(spy.callCount).to.be(1);
        expect(spy.getCall(0).args[0]).to.be('crosshair');
      });
    });

    describe('on network status change', function() {

      beforeEach(function() {
        loadDirective(map);
      });

      it('refreshes layers', function() {
        var spy = sinon.spy(gaOffline, 'refreshLayers');
        var spyShow = sinon.spy(gaOffline, 'showExtent');
        var spyHide = sinon.spy(gaOffline, 'hideExtent');
        $rootScope.$broadcast('gaNetworkStatusChange', true);
        expect(spy.callCount).to.be(1);
        expect(spyShow.callCount).to.be(1);
        expect(spyHide.callCount).to.be(0);
        $rootScope.$broadcast('gaNetworkStatusChange', false);
        expect(spy.callCount).to.be(2);
        expect(spyShow.callCount).to.be(1);
        expect(spyHide.callCount).to.be(1);
      });
    });

    describe('on view\'s property change', function() {

      it('updates permalink', function() {
        loadDirective(map);
        $timeout.flush();
        var spy = sinon.spy(gaPermalink, 'deleteParam');
        var spy2 = sinon.spy(gaPermalink, 'updateParams');
        map.getView().setCenter([800, 900]);
        map.getView().setZoom(10);
        $timeout.flush();
        expect(spy.callCount).to.be(7);
        expect(spy.getCall(0).args[0]).to.be('lon');
        expect(spy.getCall(1).args[0]).to.be('lat');
        expect(spy.getCall(2).args[0]).to.be('elevation');
        expect(spy.getCall(3).args[0]).to.be('heading');
        expect(spy.getCall(4).args[0]).to.be('pitch');
        expect(spy.getCall(5).args[0]).to.be('X');
        expect(spy.getCall(6).args[0]).to.be('Y');
        expect(spy2.callCount).to.be(1);
        var arg = spy2.getCall(0).args[0];
        expect(arg.E).to.be('800.00');
        expect(arg.N).to.be('900.00');
        expect(arg.zoom).to.be(10);
      });
    });

    describe('on time change', function() {
      var layer;

      beforeEach(function() {
        layer = new ol.layer.Layer({});
        layer.timeEnabled = true;
        layer.visible = true;
        layer.time = 't0';
        map.addLayer(layer);
        loadDirective(map);
      });

      it('refreshes layers', function() {
        var stub = sinon.stub(gaLayers, 'getLayerTimestampFromYear');
        expect(layer.time).to.be('t0');

        // Activation of global time
        stub.returns('t1');
        $rootScope.$broadcast('gaTimeChange', 't1');
        expect(stub.callCount).to.be(1);
        expect(layer.time).to.be('t1');

        // Modification fo global time
        stub.returns('t2');
        $rootScope.$broadcast('gaTimeChange', 't2', 't1');
        expect(stub.callCount).to.be(2);
        expect(layer.time).to.be('t2');

        // Deactivation of global time. It takes the last timestamp before the
        // global time activation.
        stub.returns('t3');
        $rootScope.$broadcast('gaTimeChange', null, 't2');
        expect(stub.callCount).to.be(3);
        expect(layer.time).to.be('t0');
      });
    });
  });

  describe('in embed page', function() {

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {});
        $provide.value('gaLang', {});
        $provide.value('gaLayers', {
          loadConfig: function() {
            return $q.when({
              'foo': {}
            });
          }
        });
        $provide.value('gaBrowserSniffer', {
          embed: true
        });
      });

      inject(function($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        $window = $injector.get('$window');
      });

      map = new ol.Map({
        layers: []
      });

      loadDirective(map);
    });

    it('updates size of map on window load', function() {
      var spy = sinon.spy(map, 'updateSize');
      $($window).trigger('DOMContentLoaded');
      expect(spy.callCount).to.be(1);
    });
  });
});
