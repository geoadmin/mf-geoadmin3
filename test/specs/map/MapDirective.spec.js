describe('ga_map_directive', function() {
  var map, elt, scope, parentScope;
  var $httpBackend, $compile, $window, $q, $rootScope, gaBrowserSniffer, gaLayers, gaOffline;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-map ga-map-map="map" ga-map-options="options"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  describe('in all pages', function() {
    var layer;
    var expectedUrl = 'https://example.com/all?lang=en';
    var dfltLayersConfig = {
      foo: {
        type: 'wmts',
        timeEnabled: true,
        timestamps: ['t0', 't1', 't2']
      }
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
        $provide.value('gaLang', {
          get: function() {
            return 'en';
          },
          getNoRm: function() {
            return 'en';
          }
        });
      });

      inject(function($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $httpBackend = $injector.get('$httpBackend');
        gaLayers = $injector.get('gaLayers');
        gaOffline = $injector.get('gaOffline');
       });

      map = new ol.Map({
        layers: []
      });

      $rootScope.map = map;
      $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
      loadDirective();
      $httpBackend.flush();
      layer = gaLayers.getOlLayerById('foo');
      map.addLayer(layer);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('gives the map a target', function() {
      expect(map.getTarget()).to.be(elt[0]);
    });

    it('refreshes layers when network status change', function() {
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

    it('refreshes layers when global time change', function() {
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

      $rootScope.map = map;
      loadDirective();
    });

    it('updates size of map on window load', function() {
      var spy = sinon.spy(map, 'updateSize');
      $($window).trigger('DOMContentLoaded');
      expect(spy.callCount).to.be(1);
    });
  });
});
