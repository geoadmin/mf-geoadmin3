/* eslint-disable max-len */
describe('ga_tooltip_directive', function() {
  var map, elt, scope, parentScope;
  var $httpBackend, $compile, $timeout, $rootScope, gaMapClick;
  /* Keep this for future tests
    $q, $translate, $sce, gaPopup,
    gaLayers, gaBrowserSniffer, gaMapClick, gaDebounce, gaPreviewFeatures,
    gaMapUtils, gaTime, gaTopic, gaIdentify, gaGlobalOptions,
    gaPermalink, gaIFrameCom, gaUrlUtils, gaLang, gaSanitize, gaEvent,
    gaWindow;
  */

  var loadDirective = function(map, ol3d, options, active) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    parentScope.ol3d = ol3d;
    parentScope.options = options;
    parentScope.active = active;
    var tpl = '<div ga-tooltip ga-tooltip-map="map" ga-tooltip-ol3d="ol3d" ga-tooltip-options="options" ga-tooltip-active="active"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  describe('in all pages', function() {

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaLayers', {});
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
        $httpBackend = $injector.get('$httpBackend');
        $compile = $injector.get('$compile');
        $timeout = $injector.get('$timeout');
        $rootScope = $injector.get('$rootScope');
        gaMapClick = $injector.get('gaMapClick');
        /* Keep this for future tests
        $q = $injector.get('$q');
        $translate = $injector.get('$translate');
        $sce = $injector.get('$sce');
        gaPopup = $injector.get('gaPopup');
        gaLayers = $injector.get('gaLayers');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaDebounce = $injector.get('gaDebounce');
        gaPreviewFeatures = $injector.get('gaPreviewFeatures');
        gaMapUtils = $injector.get('gaMapUtils');
        gaTime = $injector.get('gaTime');
        gaTopic = $injector.get('gaTopic');
        gaIdentify = $injector.get('gaIdentify');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaPermalink = $injector.get('gaPermalink');
        gaIFrameCom = $injector.get('gaIFrameCom');
        gaUrlUtils = $injector.get('gaUrlUtils');
        gaLang = $injector.get('gaLang');
        gaSanitize = $injector.get('gaSanitize');
        gaEvent = $injector.get('gaEvent');
        gaWindow = $injector.get('gaWindow'); */
      });

      map = new ol.Map({
        layers: []
      });

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

    describe('when no scope\'s property are defined', function() {

      beforeEach(function() {
        loadDirective();
      });

      it('stays deactivated if no map provided', function() {
        expect(scope.map).to.be(undefined);
        expect(scope.ol3d).to.be(undefined);
        expect(scope.options).to.be(undefined);
        expect(scope.isActive).to.be(undefined);
        parentScope.active = true;
        $rootScope.$digest();
        expect(scope.isActive).to.be(false);
        expect(parentScope.active).to.be(false);
      });
    });

    describe('when a map is defined', function() {

      it('watches isActive property change', function() {
        loadDirective(map);
        expect(scope.map).to.be(map);
        expect(scope.ol3d).to.be(undefined);
        expect(scope.options).to.be(undefined);
        expect(scope.isActive).to.be(undefined);
        parentScope.active = true;
        $rootScope.$digest();
        expect(scope.isActive).to.be(true);
        parentScope.active = false;
        $rootScope.$digest();
        expect(scope.isActive).to.be(false);
      });

      it('registers/unregisters map events when the component is activated/deactivated', function() {
        var spy = sinon.spy(gaMapClick, 'listen').withArgs(map);
        var spy2 = sinon.spy(map, 'on').withArgs('pointermove');
        loadDirective(map, undefined, undefined, true);

        var unRegisterMapClick = spy.returnValues[0];
        expect(spy.callCount).to.be(1);
        expect(spy.args[0][1]).to.be.a(Function);
        expect(unRegisterMapClick).to.be.a(Function);
        expect(spy2.callCount).to.be(1);
        expect(spy2.args[0][1]).to.be.a(Function);
        expect(spy2.returnValues[0]).to.be.an(Object);

        var spy3 = sinon.spy(ol.Observable, 'unByKey');
        parentScope.active = false;
        $rootScope.$digest();
        expect(spy3.callCount).to.be(3);
        expect(spy3.args[2][0]).to.be(spy2.returnValues[0]);
      });

      it('listens $translateChangeEnd event', function() {
        var spy = sinon.spy($rootScope, '$on');
        loadDirective(map, undefined, undefined, true);
        expect(spy.args[0][0]).to.be('$translateChangeEnd');
      });
    });
  });
});
