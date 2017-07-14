describe('ga_search_directive', function() {

  describe('gaSearch', function() {
    var elt, scope, parentScope, $compile, $rootScope, $window, map, ol3d, $timeout, $httpBackend;

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
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
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
        expect(elt.find('[ga-search-locations]').length).to.be(1);
        expect(elt.find('[ga-search-features]').length).to.be(1);
        expect(elt.find('[ga-search-layers]').length).to.be(1);
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
      });
    });
  });
});
