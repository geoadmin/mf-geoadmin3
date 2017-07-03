describe('ga_main_controller', function() {

  describe('GaMainController', function() {

    var scope, parentScope, $compile, $rootScope, $window, $q, $document, $timeout, $httpBackend,
        $translate, gaBrowserSniffer, gaHistory, gaPermalinkFeaturesManager, gaPermalinkLayersManager,
        gaMapUtils, gaRealtimeLayersManager, gaNetworkStatus, gaPermalink, gaStorage,
        gaGlobalOptions, gaBackground, gaTime, gaLayers, gaTopic, gaOpaqueLayersManager,
        gaMapLoad, gaWindow;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaMainController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $document = $injector.get('$document');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      $translate = $injector.get('$translate');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaMapUtils = $injector.get('gaMapUtils');
      gaHistory = $injector.get('gaHistory');
      gaPermalinkFeaturesManager = $injector.get('gaPermalinkFeaturesManager');
      gaPermalinkLayersManager = $injector.get('gaPermalinkLayersManager');
      gaRealtimeLayersManager = $injector.get('gaRealtimeLayersManager');
      gaNetworkStatus = $injector.get('gaNetworkStatus');
      gaPermalink = $injector.get('gaPermalink');
      gaStorage = $injector.get('gaStorage');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      gaBackground = $injector.get('gaBackground');
      gaTime = $injector.get('gaTime');
      gaLayers = $injector.get('gaLayers');
      gaTopic = $injector.get('gaTopic');
      gaOpaqueLayersManager = $injector.get('gaOpaqueLayersManager');
      gaMapLoad = $injector.get('gaMapLoad');
      gaWindow = $injector.get('gaWindow');
    };

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on modern browser', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
      });

      it('set scope values', function() {
        loadController();
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.host.url).to.be($window.location.host);
        expect(scope.toMainHref).to.be(gaPermalink.getMainHref());
        expect(scope.deviceSwitcherHref).to.be(gaPermalink.getHref({mobile: false}));
        var g = scope.globals;
        expect(g.dev3d).to.be(false);
        expect(g.pegman).to.be(false);
        expect(g.searchFocused).to.be(false);
        expect(g.homescreen).to.be(false);
        expect(g.tablet).to.be(true);
        expect(g.phone).to.be(false);
        expect(g.webkit).to.be(true);
        expect(g.ios).to.be(false);
        expect(g.animation).to.be(true);
        expect(g.offline).to.be(false);
        expect(g.embed).to.be(false);
        expect(g.pulldownShown).to.be(false);
        expect(g.printShown).to.be(false);
        expect(g.catalogShown).to.be(false);
        expect(g.selectionShown).to.be(false);
        expect(g.feedbackPopupShown).to.be(false);
        expect(g.isShareActive).to.be(false);
        expect(g.isDrawActive).to.be(false);
        expect(g.isFeatureTreeActive).to.be(false);
        expect(g.isSwipeActive).to.be(false);
        expect(g.is3dActive).to.be(false);
        expect(g.hostIsProd).to.be(undefined);
      });

      it('initializes gaMapLoad if debug=true', function() {
        var stub = sinon.stub(gaPermalink, 'getParams').returns({debug: 'true'});
        var spy = sinon.spy(gaMapLoad, 'init');
        loadController();
        $timeout.flush();
        expect(spy.callCount).to.be(1);
        expect(spy.getCall(0).args[0]).to.be(scope);
        stub.restore();
      });

      it('initializes some services', function() {
        var spies = [
          sinon.spy(gaTime, 'init'),
          sinon.spy(gaBackground, 'init')
          //sinon.spy(gaPermalinkLayersManager),
          //sinon.spy(gaPermalinkFeaturesManager),
          //sinon.spy(gaRealtimeLayersManager)
        ];

        //var spyOp = sinon.spy(gaOpaqueLayersManager).withArgs(scope);
        loadController();
        //expect(spyOp.callCount).to.be(1);
        spies.forEach(function(spy, idx) {
          expect(spy.callCount).to.be(1);
          expect(spy.getCall(0).args[0]).to.be(scope.map);
        });
      });
    });
  });
});

