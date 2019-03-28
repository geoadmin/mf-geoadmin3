/* eslint-disable max-len */
describe('ga_timeselector_directive', function() {

  describe('gaTimeSelectorBt', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout, gaLayerFilters, map;
    // var gaTime;

    var loadDirective = function(map) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      var tpl = '<div ga-time-selector-bt ga-time-selector-bt-map="map"></div>'
      elt = $compile(tpl)(parentScope);
      $(document.body).append(elt);
      $rootScope.$digest();
      scope = elt.isolateScope();
      $timeout.flush();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {});
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      gaLayerFilters = $injector.get('gaLayerFilters');
      // gaTime = $injector.get('gaTime');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        injectServices($injector);
      });

      map = new ol.Map({
        view: new ol.View({
          center: [0, 0]
        })
      });
    });

    afterEach(function() {
      elt.remove();

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    it('verifies html elements', function() {
      loadDirective(map);
      expect(elt.find('.ga-btn').length).to.be(1);
      expect(elt.find('.fa').length).to.be(2);
    });

    it('set scope values', function() {
      loadDirective(map);
      expect(scope.map).to.be.an(ol.Map);
      expect(scope.isActive).to.be(false);
      expect(scope.layers).to.be(map.getLayers().getArray());
      expect(scope.layerFilter).to.be(gaLayerFilters.timeEnabled);
      expect(scope.toggle).to.be.an(Function);
    });

    it('#toggle()', function() {
      loadDirective(map);

      var evt = {
        preventDefault: function() {}
      };
      var spy = sinon.spy(evt, 'preventDefault');
      var spy2 = sinon.spy($rootScope, '$broadcast');
      scope.toggle();
      expect(spy.callCount).to.be(0);
      expect(spy2.callCount).to.be(1);
      expect(spy2.args[0][0]).to.be('gaTimeSelectorToggle');
      expect(scope.isActive).to.be(true);

      scope.toggle(evt);
      expect(spy.callCount).to.be(1);
      expect(spy2.callCount).to.be(2);
      expect(spy2.args[0][0]).to.be('gaTimeSelectorToggle');
      expect(scope.isActive).to.be(false);
    });

    it('updates status on gaTimeChange event', function() {
      loadDirective(map);
      scope.$broadcast('gaTimeChange');
      expect(elt.hasClass('ga-time-selector-enabled')).to.be(false);
      var l = new ol.layer.Tile({});
      l.timeEnabled = true;
      l.visible = true;
      scope.map.addLayer(l);
      $rootScope.$digest();
      scope.$broadcast('gaTimeChange');
      expect(elt.hasClass('ga-time-selector-enabled')).to.be(true);
    });

    it('watches map layers collection', function() {
      loadDirective(map);
      expect(scope.layers.length).to.be(0);

      var l = new ol.layer.Tile({});
      l.timeEnabled = true;
      l.visible = true;
      var l2 = new ol.layer.Tile({});
      scope.map.addLayer(l2);
      $rootScope.$digest();
      expect(scope.layers.length).to.be(1);
    });

    it('listens on keypress event to deactivate Enter key', function() {
      loadDirective(map);
      var clb = $._data(elt[0]).events.keypress[0].handler;
      expect(clb({charCode: 13})).to.be(false);
      expect(clb({keyCode: 13})).to.be(false);
      expect(clb({})).to.be();
    })
  });

  describe('gaTimeSelector', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout, gaTime, gaLayerFilters, map, ol3d, l;

    var loadDirective = function(map, ol3d, options) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.ol3d = ol3d;
      parentScope.options = options;
      var tpl = '<div ga-time-selector ga-time-selector-map="::map" ga-time-selector-ol3d="::ol3d" ga-time-selector-options="options"></div>'
      elt = $compile(tpl)(parentScope);
      $(document.body).append(elt);
      $rootScope.$digest();
      scope = elt.isolateScope();
      $timeout.flush();
    };

    var dfltOpt = {
      years: [{
        value: 1800,
        available: false,
        minor: false,
        major: false
      }, {
        value: 1850,
        available: false,
        minor: false,
        major: false
      }, {
        value: 1900,
        available: false,
        minor: false,
        major: false
      }, {
        value: 1950,
        available: false,
        minor: false,
        major: false
      }, {
        value: 2018,
        available: false,
        minor: false,
        major: false
      }],
      minYear: 1800,
      maxYear: 2018
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {});
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      gaLayerFilters = $injector.get('gaLayerFilters');
      gaTime = $injector.get('gaTime');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        injectServices($injector);
      });

      l = new ol.layer.Tile({});
      l.visible = true;
      l.timeEnabled = true;
      l.timestamps = ['2018', '19001231', '1850'];

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
      elt.remove();

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    it('verifies html elements', function() {
      loadDirective(map, ol3d, {years: [1800, 1900, 2018]});
      expect(elt.find('[ga-slider]').length).to.be(1);
      expect(elt.find('select[ng-model=currentYear]').length).to.be(1);
      expect(elt.find('button').length).to.be(2);
    });

    it('set scope values', function() {
      loadDirective(map, ol3d, dfltOpt);
      expect(scope.map).to.be(map);
      expect(scope.ol3d).to.be(ol3d);
      expect(scope.options).to.be(dfltOpt);
      expect(scope.isActive).to.be(false);
      expect(scope.is3dActive).to.be(false);
      expect(scope.layers).to.be(map.getLayers().getArray());
      expect(scope.layerFilter).to.be(gaLayerFilters.timeEnabled);
      expect(scope.years).to.eql([]);
      expect(scope.avalaibleYears).to.eql();
      expect(scope.currentYear).to.be(2018);

      expect(scope.play).to.be.an(Function);
      expect(scope.stop).to.be.an(Function);
    });

    it('set scope values (when gaTime value is set)', function() {
      map.addLayer(l);

      sinon.stub(gaTime, 'get').returns(1948);
      loadDirective(map, ol3d, dfltOpt);
      expect(scope.map).to.be(map);
      expect(scope.ol3d).to.be(ol3d);
      expect(scope.options).to.be(dfltOpt);
      expect(scope.isActive).to.be(true);
      expect(scope.is3dActive).to.be(false);
      expect(scope.layers).to.be(map.getLayers().getArray());
      expect(scope.layerFilter).to.be(gaLayerFilters.timeEnabled);
      expect(scope.years).to.eql([]);
      expect(scope.avalaibleYears).to.eql();
      expect(scope.currentYear).to.be(1900);
      expect(scope.play).to.be.an(Function);
      expect(scope.stop).to.be.an(Function);
    });

    it('#play/stop()', function() {
      map.addLayer(l);
      sinon.stub(gaTime, 'get').returns(1850);
      loadDirective(map, ol3d, dfltOpt);
      expect(scope.isPlaying).to.be(false);
      expect(scope.currentYear).to.be(1850);
      scope.play();
      expect(scope.isPlaying).to.be(true);
      expect(scope.currentYear).to.be(1900);
      $timeout.flush(1000);
      expect(scope.isPlaying).to.be(true);
      expect(scope.currentYear).to.be(2018);
      $timeout.flush(1000);
      expect(scope.isPlaying).to.be(true);
      expect(scope.currentYear).to.be(1850);
      scope.stop();
      expect(scope.isPlaying).to.be(false);
      expect(scope.currentYear).to.be(1850);
    });

    it('#play() stop automatically if the year doesn\'t change', function() {
      l.timestamps = ['1850'];
      map.addLayer(l);
      sinon.stub(gaTime, 'get').returns(1850);
      loadDirective(map, ol3d, dfltOpt);
      expect(scope.isPlaying).to.be(false);
      expect(scope.currentYear).to.be(1850);
      scope.play();
      expect(scope.isPlaying).to.be(false);
      expect(scope.currentYear).to.be(1850);
      $timeout.verifyNoPendingTasks();
    });

    it('listens on gaTimeSelectorToggle event (test also watcher on isActive)', function() {
      map.addLayer(l);
      loadDirective(map, ol3d, dfltOpt);
      expect(scope.isActive).to.be(true);
      expect(elt.css('display')).to.be('block');
      $rootScope.$broadcast('gaTimeSelectorToggle', false);
      expect(scope.isActive).to.be(false);
      $rootScope.$digest();
      expect(elt.css('display')).to.be('none');
      $rootScope.$broadcast('gaTimeSelectorToggle', true);
      expect(scope.isActive).to.be(true);
      $rootScope.$digest();
      expect(elt.css('display')).to.be('block');
    });

    it('listens on gaTimeChange', function() {
      map.addLayer(l);
      loadDirective(map, ol3d, dfltOpt);
      $rootScope.$broadcast('gaTimeChange', 1899);
      expect(scope.currentYear).to.be(1899);
    });
  });
});
