/* eslint-disable max-len */
describe('ga_main_controller', function() {

  describe('GaMainController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $window, $timeout, $httpBackend, $q,
      gaMapUtils, gaPermalink, gaGlobalOptions, gaBackground, gaTime, gaMapLoad, gaWindow;
    /* Keep for future tests
      $q, $document, $translate, gaBrowserSniffer, gaHistory, gaPermalinkFeaturesManager, gaPermalinkLayersManager,
      gaRealtimeLayersManager, gaNetworkStatus, gaLayers, gaTopic, gaOpaqueLayersManager, gaStorage, $document
    */
    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaMainController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var provideServices = function($provide) {
      $provide.value('gaLayers', {
        loadConfig: function() {
          return $q.when({});
        }
      });
      $provide.value('gaTopic', {
        get: function() {
          return {
            id: 'bafu'
          }
        },
        loadConfig: function() {
          return $q.when({
            topics: [{
              defaultBackground: 'foo.bg',
              selectedLayers: [],
              backgroundLayers: [
                'foo.bg',
                'bar.bg',
                'foo2.bg'
              ],
              activatedLayers: [],
              id: 'bafu'
            }]
          });
        }
      });
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaMapUtils = $injector.get('gaMapUtils');
      gaPermalink = $injector.get('gaPermalink');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      gaBackground = $injector.get('gaBackground');
      gaTime = $injector.get('gaTime');
      gaMapLoad = $injector.get('gaMapLoad');
      gaWindow = $injector.get('gaWindow');
      /* Keep for future tests
      $document = $injector.get('$document');
      $translate = $injector.get('$translate');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaHistory = $injector.get('gaHistory');
      gaPermalinkFeaturesManager = $injector.get('gaPermalinkFeaturesManager');
      gaPermalinkLayersManager = $injector.get('gaPermalinkLayersManager');
      gaRealtimeLayersManager = $injector.get('gaRealtimeLayersManager');
      gaNetworkStatus = $injector.get('gaNetworkStatus');
      gaLayers = $injector.get('gaLayers');
      gaTopic = $injector.get('gaTopic');
      gaStorage = $injector.get('gaStorage');
      gaOpaqueLayersManager = $injector.get('gaOpaqueLayersManager');
      */
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
        module(function($provide) {
          provideServices($provide);
        });
        inject(function($injector) {
          injectServices($injector);
        });
      });

      it('set scope values', function() {
        loadController();
        $timeout.flush();
        $rootScope.$digest();
        expect(scope.map).to.be.an(ol.Map);
        expect(scope.host.url).to.be($window.location.host);
        expect(scope.toMainHref).to.be(gaPermalink.getMainHref());
        expect(scope.deviceSwitcherHref).to.be(gaPermalink.getHref({mobile: 'true'}));
        var g = scope.globals;
        expect(g.dev3d).to.be(false);
        expect(g.searchFocused).to.be(true);
        expect(g.homescreen).to.be(false);
        expect(g.webkit).to.be(true);
        expect(g.ios).to.be(false);
        expect(g.animation).to.be(true);
        expect(g.offline).to.be(false);
        expect(g.desktop).to.be(true);
        expect(g.mobile).to.be(false);
        expect(g.embed).to.be(false);
        expect(g.pulldownShown).to.be(true);
        expect(g.catalogShown).to.be(false);
        expect(g.selectionShown).to.be(false);
        expect(g.feedbackPopupShown).to.be(false);
        expect(g.settingsShown).to.be(false);
        expect(g.isShareActive).to.be(false);
        expect(g.isDrawActive).to.be(false);
        expect(g.isFeatureTreeActive).to.be(false);
        expect(g.isPrintActive).to.be(false);
        expect(g.isSwipeActive).to.be(false);
        expect(g.is3dActive).to.be(false);
        expect(g.isFpsActive).to.be(false);
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

      describe('hide catalog panel on resize', function() {
        var stub, spy, g;

        beforeEach(function() {
          loadController();
          g = scope.globals;
          stub = sinon.stub(gaWindow, 'isHeight').withArgs('<=m');
          spy = sinon.spy(scope, '$applyAsync');
        });

        afterEach(function() {
          spy.resetHistory();
        });

        describe('when isHeight(\'<=m\') returns false', function() {

          beforeEach(function() {
            stub.returns(false);
          });

          it('does nothing', function() {
            expect(g.catalogShown).to.be(false);
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.catalogShown).to.be(false);
            expect(spy.callCount).to.be(0);

            g.catalogShown = true;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.catalogShown).to.be(true);
            expect(spy.callCount).to.be(0);
          });
        });

        describe('when isHeight(\'<=m\') returns true', function() {

          beforeEach(function() {
            stub.returns(true);
          });

          it('does nothing when catalogShown is false', function() {
            expect(g.catalogShown).to.be(false);
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.catalogShown).to.be(false);
            expect(spy.callCount).to.be(0);
          });

          it('hide catalog', function() {
            g.catalogShown = true;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.catalogShown).to.be(false);
            expect(spy.callCount).to.be(1);
          });
        });
      });

      describe('activate share panel on resize', function() {
        var stub, spy, g;

        beforeEach(function() {
          loadController();
          g = scope.globals;
          stub = sinon.stub(gaWindow, 'isWidth').withArgs('xs');
          spy = sinon.spy(scope, '$applyAsync');
        });

        afterEach(function() {
          spy.resetHistory();
        });

        describe('when isWidth(\'xs\') returns false', function() {

          beforeEach(function() {
            stub.returns(false);
          });

          it('does nothing', function() {
            expect(g.isShareActive).to.be(false);
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.isShareActive).to.be(false);
            expect(spy.callCount).to.be(0);
          });

          it('does nothing', function() {
            g.isShareActive = true;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.isShareActive).to.be(true);
            expect(spy.callCount).to.be(0);
          });
        });

        describe('when isWidth(\'xs\') returns true', function() {

          beforeEach(function() {
            stub.withArgs('xs').returns(true);
          });

          it('activate the share', function() {
            g.pulldownShown = true;
            g.isDrawActive = false;
            g.isShareActive = false;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.isShareActive).to.be(true);
            expect(spy.callCount).to.be(1);
          });
        });
      });

      describe('show/hide settings panel on resize', function() {
        var stub, spy, g;

        beforeEach(function() {
          loadController();
          g = scope.globals;
          stub = sinon.stub(gaWindow, 'isWidth');
          spy = sinon.spy(scope, '$applyAsync');
        });

        afterEach(function() {
          spy.resetHistory();
        });

        describe('when isWidth(\'<=m\') returns false', function() {

          beforeEach(function() {
            stub.withArgs('<=m').returns(false);
            stub.withArgs('>m').returns(true);
          });

          it('does nothing', function() {
            expect(g.settingsShown).to.be(false);
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.settingsShown).to.be(false);
            expect(spy.callCount).to.be(0);
          });

          it('hide the panel', function() {
            g.catalogShown = true;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.settingsShown).to.be(false);
            expect(spy.callCount).to.be(1);
          });
        });

        describe('when isWidth(\'<=m\') returns true', function() {

          beforeEach(function() {
            stub.withArgs('<=m').returns(true);
            stub.withArgs('>m').returns(false);
          });

          it('show the panel', function() {
            expect(g.settingsShown).to.be(false);
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.settingsShown).to.be(true);
            expect(spy.callCount).to.be(2);
          });

          it('does nothing', function() {
            g.settingsShown = true;
            $(window).trigger('resize');
            $rootScope.$digest();
            expect(g.settingsShown).to.be(true);
            expect(spy.callCount).to.be(1);
          });
        });
      });
    });
  });
});
