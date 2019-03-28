/* eslint-disable max-len */
describe('ga_map_directive', function() {
  var map, elt, scope, parentScope;
  var $httpBackend, $compile, $window, $q, $rootScope, $timeout, gaLayers, gaOffline, gaPermalink, gaStyleFactory, gaMapUtils;

  var loadDirective = function(map, ol3d) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    parentScope.ol3d = ol3d;
    var tpl = '<div ga-map ga-map-map="map" ga-map-ol3d="ol3d"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };
  var provideServices = function($provide) {
    $provide.value('gaLayers', {
      loadConfig: function() {
        return $q.when({})
      },
      getLayerTimestampFromYear: function() {},
      getOlLayerById: function() {}
    });
    $provide.value('gaTopic', {
      loadConfig: function() {
        return $q.when({})
      }
    });
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    gaLayers = $injector.get('gaLayers');
    gaOffline = $injector.get('gaOffline');
    gaPermalink = $injector.get('gaPermalink');
    gaStyleFactory = $injector.get('gaStyleFactory');
    gaMapUtils = $injector.get('gaMapUtils');

    /* Keep fo future tests
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    gaDebounce = $injector.get('gaDebounce');
    gaOffline = $injector.get('gaOffline');
    */
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
      module(function($provide) {
        provideServices($provide);
      });
      inject(function($injector) {
        injectServices($injector);
      });
    });

    it('gives the map a target', function() {
      loadDirective(map);
      expect(map.getTarget()).to.be(elt[0]);
      expect(map.getView().getCenter()).to.eql([0, 0]);
      expect(map.getView().getZoom()).to.be(1);
      expect(scope.map).to.be(map);
    });

    describe('using zoom from permalink params', function() {

      it('zooms to correct level', function() {
        var z = 14;
        sinon.stub(gaPermalink, 'getParams').returns({
          zoom: '' + z
        });
        loadDirective(map);
        expect(map.getView().getZoom()).to.be(z);
      });
    });

    describe('using E,N,X and Y from permalink params', function() {

      it('centers on E and N params', function() {
        var center = [10000, 25000];
        sinon.stub(gaPermalink, 'getParams').returns({
          E: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql(center);
      });

      it('centers on X and Y params', function() {
        var center = [10000, 25000];
        sinon.stub(gaPermalink, 'getParams').returns({
          X: center[1] + '',
          Y: center[0] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql(center);
      });

      it('gives prority to E and N over X and Y params', function() {
        var center = [10000, 25000];
        sinon.stub(gaPermalink, 'getParams').returns({
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
        sinon.stub(gaPermalink, 'getParams').returns({
          E: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([2424999.9999959273, 1349999.9998646392]);
      });

      it('transforms X and Y coords from lv03 to lv95 if necessary', function() {
        var center = [425000, 350000];
        sinon.stub(gaPermalink, 'getParams').returns({
          X: center[1] + '',
          Y: center[0] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([2424999.9999959273, 1349999.9998646392]);
      });

      it('does nothing if a coord is missing', function() {
        var center = [425000, 350000];
        sinon.stub(gaPermalink, 'getParams').returns({
          X: center[0] + '',
          N: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([0, 0]);
      });

      it('does nothing if not upper case', function() {
        var center = [425000, 350000];
        sinon.stub(gaPermalink, 'getParams').returns({
          e: center[0] + '',
          n: center[1] + ''
        });
        loadDirective(map);
        expect(map.getView().getCenter()).to.eql([0, 0]);
      });
    });

    describe('using crosshair from permalink param', function() {

      it('adds a feature with marker style on center of the map', function() {
        sinon.stub(gaPermalink, 'getParams').returns({
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
        sinon.stub(gaPermalink, 'getParams').returns({
          crosshair: 'foo'
        });
        var spy = sinon.spy(gaStyleFactory, 'getStyle');
        loadDirective(map);
        expect(spy.callCount).to.be(2);
        expect(spy.getCall(0).args[0]).to.be('foo');
        expect(spy.getCall(1).args[0]).to.be('marker');
      });

      it('deletes crosshair param from permlaink on next view\'s property change event', function() {
        sinon.stub(gaPermalink, 'getParams').returns({
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
        expect(spy.getCall(0).args[0]).to.be('elevation');
        expect(spy.getCall(1).args[0]).to.be('heading');
        expect(spy.getCall(2).args[0]).to.be('pitch');
        expect(spy.getCall(3).args[0]).to.be('E');
        expect(spy.getCall(4).args[0]).to.be('N');
        expect(spy.getCall(5).args[0]).to.be('X');
        expect(spy.getCall(6).args[0]).to.be('Y');
        expect(spy2.callCount).to.be(1);
        var arg = spy2.getCall(0).args[0];
        expect(arg.lon).to.equal('-19.91337');
        expect(arg.lat).to.equal('32.13440');
        expect(arg.zoom).to.be(10);
      });
    });

    describe('on time change', function() {
      var layer, layer2, layer3;

      beforeEach(function() {
        layer = new ol.layer.Tile({});
        layer.id = 'id';
        layer.timeEnabled = true;
        layer.visible = true;
        layer.time = 't0';

        // Simulate a WMTS with the special timestamp for all data
        layer2 = new ol.layer.Tile({});
        layer2.id = 'id2';
        layer2.timeEnabled = true;
        layer2.visible = true;
        layer2.time = '99991231';

        // Simulate a WMS with undefined timestamp for all data
        layer3 = new ol.layer.Tile({});
        layer3.id = 'id3';
        layer3.timeEnabled = true;
        layer3.visible = true;
        layer3.time = undefined;

        loadDirective(map);
      });

      it('refreshes one layer', function() {
        map.addLayer(layer);
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

      it('uses the last time used before activation on deactivation (3 layers)', function() {
        map.addLayer(layer);
        map.addLayer(layer2);
        map.addLayer(layer3);
        var stub = sinon.stub(gaLayers, 'getLayerTimestampFromYear');
        expect(layer.time).to.be('t0');
        expect(layer2.time).to.be('99991231'); // all data
        expect(layer3.time).to.be(); // all data

        // Activation of global time, every layer use this timestamp
        stub.returns('t1');
        $rootScope.$broadcast('gaTimeChange', 't1');
        expect(stub.callCount).to.be(3);
        expect(layer.time).to.be('t1');
        expect(layer2.time).to.be('t1');
        expect(layer3.time).to.be('t1');

        // Modification fo global time, only layer 1 uses this timestamp
        stub.resetHistory();
        stub.onCall(0).returns('t2');
        stub.onCall(1).returns(undefined);
        stub.onCall(2).returns(undefined);
        $rootScope.$broadcast('gaTimeChange', 't2', 't1');
        expect(stub.callCount).to.be(3);
        expect(layer.time).to.be('t2');
        expect(layer2.time).to.be();
        expect(layer3.time).to.be();

        // Deactivation of global time. It takes the last timestamp before the
        // global time activation.
        stub.resetHistory();
        stub.returns('dontuseit');
        $rootScope.$broadcast('gaTimeChange', null, 't2');
        expect(stub.callCount).to.be(3);
        expect(layer.time).to.be('t0');
        expect(layer2.time).to.be('99991231');
        expect(layer3.time).to.be();
      });
    });

    describe('on ol3d creation', function() {
      var ol3d, camera, enable;

      beforeEach(function() {
        enable = false;
        camera = {
          setView: angular.noop,
          moveEnd: {
            addEventListener: angular.noop
          }
        };
        ol3d = {
          getEnabled: function() {
            return enable;
          },
          setEnabled: function(en) {
            enable = en;
          },
          getCesiumScene: function() {
            return {
              camera: camera
            }
          }
        }
        loadDirective(map);
      });

      it('set the camera\'s view', function() {
        var camera = ol3d.getCesiumScene().camera;
        var spy = sinon.spy(camera, 'setView');
        scope.ol3d = ol3d;
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      it('set the camera\'s view with permalink params', function() {
        sinon.stub(gaPermalink, 'getParams').returns({
          lon: '7.7',
          lat: '47.8',
          elevation: '1000',
          heading: '300',
          pitch: '-41'
        });
        var camera = ol3d.getCesiumScene().camera;
        var spy = sinon.spy(camera, 'setView');
        scope.ol3d = ol3d;
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
        var args = spy.args[0][0];
        expect(args.destination).to.eql({
          x: 4254181.208288832,
          y: 575187.8662936201,
          z: 4702708.412924106
        });
        expect(args.orientation.heading).to.be(5.235987755982989);
        expect(args.orientation.pitch).to.be(-0.7155849933176751);
        expect(args.orientation.roll).to.be(0.0);
      });

      describe('when ol3d is enabled then disabled', function() {
        var layersConfig = {
          'ch.default': {
            bodId: 'dch.default'
          },
          'ch.default.3d': {
            default3d: true,
            config2d: 'ch.default'
          }
        };

        beforeEach(function() {
          scope.ol3d = ol3d;
        });

        it('hides/shows map\'s overlay', function() {
          var ov = new ol.Overlay({});
          ov.setPosition([2641750.0, 1224500.0]);
          map.addOverlay(ov);
          ol3d.setEnabled(true);
          $rootScope.$digest();
          expect(ov.getPosition()).to.be();
          expect(ov.get('realPosition')).to.eql([2641750, 1224500]);

          // Set real position on add event
          var ov2 = new ol.Overlay({});
          ov2.setPosition([2841750.0, 1824500.0]);
          map.addOverlay(ov2);
          expect(ov2.getPosition()).to.be();
          expect(ov2.get('realPosition')).to.eql([2841750, 1824500]);

          // Set real position if the overlay change its position
          ov.setPosition([26417504, 1224504]);
          expect(ov.getPosition()).to.be();
          expect(ov.get('realPosition')).to.eql([26417504, 1224504]);
          ov.setPosition();
          expect(ov.getPosition()).to.be();
          expect(ov.get('realPosition')).to.eql([26417504, 1224504]);

          // Set the position from realPosition when ol3d is disabled
          ol3d.setEnabled(false);
          $rootScope.$digest();
          expect(ov.getPosition()).to.eql([26417504, 1224504]);
          expect(ov.get('realPosition')).to.eql([26417504, 1224504]);
          expect(ov2.getPosition()).to.eql([2841750, 1824500]);
          expect(ov2.get('realPosition')).to.eql([2841750, 1824500]);

          // Test if the listener on add is well removed
          var ov3 = new ol.Overlay({});
          ov3.setPosition([2641750.0, 1224500.0]);
          map.addOverlay(ov3);
          expect(ov3.get('realPosition')).to.be();
        });

        it('shows/hides default layers for 3d', function() {
          var l = new ol.layer.Tile({});
          l.bodId = 'ch.default';
          sinon.stub(gaLayers, 'loadConfig').returns($q.when(layersConfig));
          sinon.stub(gaLayers, 'getOlLayerById').withArgs('ch.default').returns(l);
          ol3d.setEnabled(true);
          $rootScope.$digest();
          expect(map.getLayers().item(0)).to.be(l);

          ol3d.setEnabled(false);
          $rootScope.$digest();
          expect(map.getLayers().getLength()).to.be(0);
        });

        it('shows/hides default layers for 3d if the page is opening directly in 3d', function() {
          sinon.stub(gaPermalink, 'getParams').returns({
            lon: '7.7',
            lat: '47.8',
            elevation: '1000',
            heading: '300',
            pitch: '-41'
          });
          var l = new ol.layer.Tile({});
          l.bodId = 'ch.default';
          sinon.stub(gaLayers, 'loadConfig').returns($q.when(layersConfig));
          sinon.stub(gaLayers, 'getOlLayerById').withArgs('ch.default').returns(l);
          ol3d.setEnabled(true);
          $rootScope.$digest();
          expect(map.getLayers().item(0)).to.be(l);

          ol3d.setEnabled(false);
          $rootScope.$digest();
          expect(map.getLayers().getLength()).to.be(0);
        });

        it('shows/shows default layers for 3d if they are already on the map', function() {
          var l = new ol.layer.Tile({});
          l.bodId = 'ch.default';
          l.displayIn3d = true;
          map.addLayer(l);
          sinon.stub(gaLayers, 'loadConfig').returns($q.when(layersConfig));
          sinon.stub(gaLayers, 'getOlLayerById').withArgs('ch.default').returns(l);
          ol3d.setEnabled(true);
          $rootScope.$digest();
          expect(map.getLayers().item(0)).to.be(l);

          ol3d.setEnabled(false);
          $rootScope.$digest();
          expect(map.getLayers().item(0)).to.be(l);
        });

        it('show alert message for layer which are not available for 3d', function() {
          var l = new ol.layer.Tile({});
          l.displayIn3d = false;
          l.label = 'label';
          map.addLayer(l);
          var spy = sinon.stub($window, 'alert').withArgs('layer_cant_be_displayed_in_3d\nlabel');
          ol3d.setEnabled(true);
          $rootScope.$digest();
          expect(spy.callCount).to.be(1);
          $window.alert.restore();
        });
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
