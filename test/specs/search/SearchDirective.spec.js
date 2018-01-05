/* eslint-disable max-len */
describe('ga_search_directive', function() {

  describe('gaSearch', function() {
    var elt, scope, parentScope, $compile, $q, $rootScope, map, ol3d, $timeout, $httpBackend, gaW3W, gaMarkerOverlay, gaMapUtils;

    var loadDirective = function(map, ol3d, options, focus) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.ol3d = ol3d;
      parentScope.options = options;
      parentScope.focus = !!focus;
      var tpl = '<div ga-search ga-search-map="map" ga-search-options="options" ga-search-focused="focus" ga-search-ol3d="ol3d"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {
        get: function() {
          return {
            id: 'foo'
          };
        },
        loadConfig: function() {
          return $q.when({});
        }
      });
      $provide.value('gaLang', {
        get: function() {
          return 'en';
        }
      });
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaW3W = $injector.get('gaWhat3Words');
      gaMapUtils = $injector.get('gaMapUtils');
      gaMarkerOverlay = $injector.get('gaMarkerOverlay');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

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

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on modern browsers', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
      });

      it('verifies html elements', function() {
        loadDirective(map);
        expect(elt.find('input').length).to.be(1);
        expect(scope.query).to.be(undefined);
        expect(elt.find('[ga-search-locations]').length).to.be(0);
        expect(elt.find('[ga-search-features]').length).to.be(0);
        expect(elt.find('[ga-search-layers]').length).to.be(0);
        $timeout.flush();
      });

      it('set scope values', function() {
        var opt = {
          featureUrl: 'blabla'
        };
        loadDirective(map, ol3d, opt, true);
        $timeout.flush();
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.ol3d).to.be.an(Object);
        expect(scope.options).to.be(opt);
        expect(scope.searchFocused).to.be(true);
        expect(scope.input.length).to.be(1);
        expect(scope.keydown).to.be.a(Function);
        expect(scope.restat).to.be.a(Object);
        expect(scope.childoptions.featureUrl).to.be('blabla');
        expect(scope.childoptions.valueSelected).to.be.a(Function);
        expect(scope.query).to.be('');
        expect(scope.childoptions.searchUrl).to.be('');
        expect(scope.childoptions.query).to.be('');
        expect(scope.clearInput).to.be.a(Function);
        expect(scope.preClear).to.be.a(Function);
        expect(scope.lostFocus).to.be.a(Function);
        expect(scope.onFocus).to.be.a(Function);
        expect(scope.childoptions.searchUrl).to.be('');
        expect(scope.childoptions.query).to.be('');
      });

      it('set childOptions values for a simple text search', function() {
        var opt = {
          searchUrl: 'search'
        };
        loadDirective(map, ol3d, opt, true);
        $timeout.flush();
        scope.query = 'search';
        $rootScope.$digest();
        expect(scope.childoptions.query).to.be('search');
        expect(scope.childoptions.searchUrl).to.be('search?searchText=search&lang=en');
      });

      it('launches a w3w search', function(done) {
        var defer = $q.defer();
        var opt = {
          searchUrl: 'search'
        };
        var stub = sinon.stub(gaW3W, 'getCoordinate').withArgs('search.search.search').returns(defer.promise);

        var newPos = [5120696.576490585, 1006021.0627551338];
        var spy = sinon.spy(gaMapUtils, 'moveTo').withArgs(map, ol3d, 8, newPos);
        var spy2 = sinon.spy(gaMarkerOverlay, 'add').withArgs(map, newPos, true);
        var spy3 = sinon.spy(gaW3W, 'cancel');
        loadDirective(map, ol3d, opt, true);
        $timeout.flush();
        scope.query = 'search.search.search';
        $rootScope.$digest();
        expect(stub.callCount).to.be(1);
        expect(spy3.callCount).to.be(2);
        defer.promise.then(function() {
          expect(spy.callCount).to.be(1);
          expect(spy2.callCount).to.be(1);
          done();
        });
        defer.resolve({
          data: {
            geometry: {
              lng: 46,
              lat: 9
            }
          }
        });
        $timeout.flush();
      });
    });
  });
});
