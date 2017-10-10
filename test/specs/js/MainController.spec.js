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
        expect(scope.deviceSwitcherHref).to.be(gaPermalink.getHref({mobile: 'true'}));
        var g = scope.globals;
        expect(g.dev3d).to.be(false);
        expect(g.pegman).to.be(false);
        expect(g.searchFocused).to.be(true);
        expect(g.homescreen).to.be(false);
        expect(g.webkit).to.be(true);
        expect(g.ios).to.be(false);
        expect(g.animation).to.be(true);
        expect(g.offline).to.be(false);
        expect(g.embed).to.be(false);
        expect(g.pulldownShown).to.be(true);
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

      it('set map properties', function() {
        var spy = sinon.spy(ol, 'Map');
        var spy2 = sinon.spy(ol.control, 'defaults');
        var spy3 = sinon.spy(ol.interaction, 'defaults');
        loadController();
        expect(scope.map).to.be.an(ol.Map);
        var map = scope.map;
        expect(map.getView()).to.be.an(ol.View);
        expect(map.getControls().getLength()).to.be(1);
        expect(map.getInteractions().getLength()).to.be(9);
        expect(spy.callCount).to.be(1);
        expect(spy.args[0][0].moveTolerance).to.be(5);
        expect(spy.args[0][0].renderer).to.be('canvas');
        expect(spy.args[0][0].logo).to.be(false);
        expect(spy2.callCount).to.be(1);
        expect(spy2.args[0][0].attribution).to.be(false);
        expect(spy2.args[0][0].rotate).to.be(false);
        expect(spy3.callCount).to.be(1);
        expect(spy3.args[0][0].altShiftDragRotate).to.be(true);
        expect(spy3.args[0][0].touchRotate).to.be(false);
        expect(spy3.args[0][0].keyboard).to.be(false);
      });

      it('set view properties', function() {
        loadController();
        expect(scope.map).to.be.an(ol.Map);
        var view = scope.map.getView();
        expect(view.getProjection().getCode()).to.be(gaGlobalOptions.defaultEpsg);
        expect(view.constrainCenter([0, 0])).to.eql([420000, 30000]);
        expect(view.getResolution()).to.be(gaMapUtils.defaultResolution);
        expect(view.getResolutions()).to.be(gaMapUtils.viewResolutions);
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
          // sinon.spy(gaPermalinkLayersManager),
          // sinon.spy(gaPermalinkFeaturesManager),
          // sinon.spy(gaRealtimeLayersManager)
        ];

        // var spyOp = sinon.spy(gaOpaqueLayersManager).withArgs(scope);
        loadController();
        // expect(spyOp.callCount).to.be(1);
        spies.forEach(function(spy, idx) {
          expect(spy.callCount).to.be(1);
          expect(spy.getCall(0).args[0]).to.be(scope.map);
        });
      });
    });
  });
});
