/* eslint-disable max-len */
describe('ga_geolocation_directive', function() {

  describe('gaGeolocation', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout, $window, $q, map, ol3d;
    var gaPermalink;
    /* Keep for future tests
      gaBrowserSniffer, gaThrottle, gaStyleFactory, gaMapUtils
    */

    var loadDirective = function(map, ol3d) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.ol3d = ol3d;
      var tpl = '<div ga-geolocation ga-geolocation-map="map" ga-geolocation-ol3d="ol3d"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
      $timeout.flush();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $window = $injector.get('$window');
      gaPermalink = $injector.get('gaPermalink');
      /* Keep for future tests
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaThrottle = $injector.get('gaThrottle');
      gaStyleFactory = $injector.get('gaStyleFactory');
      gaMapUtils = $injector.get('gaMapUtils');
      gaThrottle = $injector.get('gaThrottle');
      */
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      map = new ol.Map({
        view: new ol.View({
          center: [0, 0]
        })
      });
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

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on browser supporting geolocation', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        $window.navigator.geolocation = true;
      });

      it('verifies html elements', function() {
        loadDirective(map, ol3d);
        expect(elt.find('.ga-btn').length).to.be(1);
        expect(elt.find('.fa').length).to.be(4);
      });

      it('set scope values', function() {
        loadDirective(map);
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.tracking).to.be();
        expect(scope.getBtTitle).to.be.an(Function);
        expect(scope.map.getLayers().getLength()).to.be(0);
        expect(scope.getBtTitle()).to.be('geoloc_start_tracking');
      });

      it('set scope values after gyronorm is inialized', function() {
        var stub = sinon.stub(window.GyroNorm.prototype, 'init').returns($q.when());
        var stub1 = sinon.stub(window.GyroNorm.prototype, 'isAvailable').returns(true);
        loadDirective(map);
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.tracking).to.be(false);
        stub.restore();
        stub1.restore();
      });

      it('set scope values after gyronorm fails to inialize', function() {
        var stub = sinon.stub(window.GyroNorm.prototype, 'init').returns($q.when());
        var stub1 = sinon.stub(window.GyroNorm.prototype, 'isAvailable').returns(true);
        loadDirective(map);
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.tracking).to.be(false);
        stub.restore();
        stub1.restore();
      });

      it('uses/deletes permalink values after gyronorm is inialized', function() {
        var spy = sinon.spy(gaPermalink, 'deleteParam').withArgs('geolocation');
        var stub = sinon.stub(gaPermalink, 'getParams').returns({geolocation: 'true'});
        var stub1 = sinon.stub(window.GyroNorm.prototype, 'init').returns($q.when());
        var stub2 = sinon.stub(window.GyroNorm.prototype, 'isAvailable').returns(true);
        loadDirective(map);
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.tracking).to.be(true);
        expect(spy.callCount).to.be(1);
        stub.restore();
        stub1.restore();
        stub2.restore();
      });

      it('activates/deactivates tracking when button is clicked', function() {
        loadDirective(map);
        var bt = elt.find('button').click();
        $rootScope.$digest();
        expect(scope.tracking).to.be(true);
        expect(scope.map.getLayers().getLength()).to.be(1);
        expect(scope.map.getLayers().item(0).getSource().getFeatures().length).to.be(2);
        expect(scope.getBtTitle()).to.be('geoloc_stop_tracking');

        bt.click();
        $rootScope.$digest();
        expect(scope.tracking).to.be(false);
        expect(scope.map.getLayers().getLength()).to.be(0);
        expect(scope.getBtTitle()).to.be('geoloc_start_tracking');
      });
    });
  });
});
