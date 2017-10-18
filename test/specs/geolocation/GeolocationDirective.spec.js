/* eslint-disable max-len */
describe('ga_geolocation_directive', function() {

  describe('gaGeolocation', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout, $window, map, ol3d;
    /* Keep for future tests
      gaBrowserSniffer, gaPermalink, gaThrottle, gaStyleFactory, gaMapUtils
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
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $window = $injector.get('$window');
      /* Keep for future tests
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaPermalink = $injector.get('gaPermalink');
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
      $timeout.verifyNoPendingTasks();
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
        expect(scope.tracking).to.be(false);
        expect(scope.getBtTitle).to.be.an(Function);
        expect(scope.map.getLayers().getLength()).to.be(0);
        expect(scope.getBtTitle()).to.be('geoloc_start_tracking');
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
