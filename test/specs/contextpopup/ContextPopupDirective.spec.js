/* eslint-disable max-len */
describe('ga_contextpopup_directive', function() {
  var elt, scope, parentScope, handlers = {}, map, $rootScope, $compile, $httpBackend, $timeout, gaWhat3Words, $q, gaPermalink, gaHeight;
  var expectedHeightUrl = 'http://api3.geo.admin.ch/rest/services/height?easting=2661473&elevation_model=COMB&northing=1188192&sr=2056';
  var expectedReframeUrl = '//api.example.com/reframe/lv95tolv03?easting=2661473&northing=1188192';
  var expectedw3wUrl = 'dummy.test.url.com/v2/reverse?coords=46.84203157398991,8.244528382656728&key=testkey&lang=de';
  var contextPermalink = 'http://test.com?N=1188192&E=2661473';
  var crosshairPermalink = 'http://test.com?crosshair=marker&N=1188192&E=2661473';
  var mapEvt = {
    stopPropagation: function() {},
    preventDefault: function() {},
    pixel: [25, 50],
    coordinate: [2661473, 1188192]
  };
  var mapEvt2 = {
    stopPropagation: function() {},
    preventDefault: function() {},
    pixel: [30, 60],
    coordinate: [2661673, 1198192],
    dragging: true // simulate move event
  };
  var mouseEvt = $.extend({type: 'mousedown'}, mapEvt);
  var mouseEvt2 = $.extend({type: 'mouseup'}, mapEvt2);
  var touchEvt = $.extend({type: 'touchstart'}, mapEvt);
  var touchEvt2 = $.extend({type: 'touchend'}, mapEvt2);

  var loadDirective = function(isActive) {
    parentScope = $rootScope.$new();
    parentScope.isActive = angular.isDefined(isActive) ? isActive : true;
    var tpl = '<div ga-context-popup ga-context-popup-map="map" ' +
                   'ga-context-popup-options="options" ' +
                   'ga-context-popup-active="isActive"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  var provideServices = function($provide) {
    // block loading of layersConfig
    $provide.value('gaLayers', {});

    $provide.value('gaBrowserSniffer', {
      msie: false,
      mobile: false,
      phone: false
    });

    $provide.value('gaNetworkStatus', {
      check: angular.noop,
      offline: true
    });

    $provide.value('gaLang', {
      get: function() {
        return 'de';
      }
    });

    $provide.value('gaPermalink', {
      getHref: function(p) {
        if (p.crosshair) {
          return crosshairPermalink;
        }
        return contextPermalink;
      }
    });
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    gaPermalink = $injector.get('gaPermalink');
    gaWhat3Words = $injector.get('gaWhat3Words');
    gaHeight = $injector.get('gaHeight');
  };

  beforeEach(function() {

    module(function($provide) {
      provideServices($provide);
    });

    inject(function($injector) {
      injectServices($injector);
    });

    $(document.body).append('<div id="map"></div>');
    map = new ol.Map({
      target: 'map',
      view: new ol.View({
        projection: ol.proj.get('EPSG:2056')
      })
    });
    map.on = function(eventType, handler) {
      handlers[eventType] = handler;
    };
    map.getEventPixel = function(event) { return [25, 50]; };
    map.getEventCoordinate = function(event) { return [661473, 188192]; };

    $rootScope.map = map;
    $rootScope.options = {
      qrcodeUrl: '//api.geo.admin.ch/qrcodegenerator'
    };

    $httpBackend.when('GET', expectedHeightUrl).respond({height: '1233'});
    $httpBackend.when('GET', expectedReframeUrl).respond({coordinates: [725984.4037894635, 180787.4007025931]});
    $httpBackend.when('GET', expectedw3wUrl).respond({words: 'das.ist.test'});
  });

  afterEach(function() {
    $('#map').remove();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    try {
      $timeout.verifyNoPendingTasks();
    } catch (e) {
      $timeout.flush();
    }
  });

  describe('on all browser', function() {
    beforeEach(inject(function($injector) {
      loadDirective();
      $timeout.flush();
    }));

    it('creates <table> and <td>\'s', function() {
      var tables = elt.find('div.popover-content table');
      var tds = $(tables[0]).find('td');
      expect(tables.length).to.be(1);
      expect(tds.length).to.be(16);
    });

    it('displays information on contextmenu events', function() {
      var spy2 = sinon.spy(gaWhat3Words, 'getWords');
      var spy3 = sinon.spy(gaHeight, 'get');
      var evt = $.Event('contextmenu');
      evt.coordinate = [2661473, 1188192];
      evt.pixel = [25, 50];
      handlers.pointerdown(touchEvt);
      $(map.getViewport()).trigger(evt);
      $httpBackend.flush();
      $timeout.flush();

      expect(spy2.callCount).to.eql(1);
      expect(spy3.callCount).to.eql(1);

      var tables = elt.find('div.popover-content table');
      var tds = $(tables[0]).find('td');
      expect($(tds[0]).find('a').attr('href')).to.be('contextpopup_lv95_url');
      expect($(tds[1]).find('a').attr('href')).to.be(contextPermalink);
      expect($(tds[1]).text()).to.be('2\'661\'473.0, 1\'188\'192.0');
      expect($(tds[2]).find('a').attr('href')).to.be('contextpopup_lv03_url');
      expect($(tds[3]).text()).to.be('661\'473.00, 188\'192.00');
      expect($(tds[5]).text()).to.be('46.84203, 8.24453');
      expect($(tds[9]).text()).to.be('442\'396, 5\'187\'887 (zone 32T)');
      expect($(tds[11]).text()).to.be('32TMS 42396 87887 ');
      expect($(tds[13]).text()).to.be('das.ist.test');
      expect($(tds[15]).text()).to.be('1233 m');
      expect($(tds[17]).find('a').attr('href')).to.be(crosshairPermalink);
    });

    it('reopens popup on 2nd contextmenu event', function() {
      var spy2 = sinon.spy(gaWhat3Words, 'getWords');
      var spy3 = sinon.spy(scope, 'hidePopover');
      var evt = $.Event('contextmenu');
      evt.coordinate = [2661473, 1188192];
      evt.pixel = [25, 50];
      $(map.getViewport()).trigger(evt);
      $httpBackend.flush();
      $timeout.flush();

      expect(spy2.callCount).to.eql(1);
      expect(spy3.callCount).to.eql(0);

      evt = $.Event('contextmenu');
      evt.coordinate = [2661473, 1188192];
      evt.pixel = [25, 50];
      $(map.getViewport()).trigger(evt);
      $httpBackend.flush();
      $timeout.flush();

      expect(spy2.callCount).to.eql(2);
      expect(spy3.callCount).to.eql(1);
    });

    it('displays informations on long touch press', function() {
      var spy2 = sinon.spy(gaWhat3Words, 'getWords');
      var spyStop = sinon.spy(touchEvt, 'stopPropagation');
      var spyPrev = sinon.spy(touchEvt, 'preventDefault');
      handlers.pointerdown(touchEvt);
      $timeout.flush();
      $httpBackend.flush();
      $timeout.flush();

      expect(elt.css('display')).to.be('block');

      expect(spy2.callCount).to.eql(1);
      expect(spyStop.callCount).to.eql(1);
      expect(spyPrev.callCount).to.eql(1);

      var tables = elt.find('div.popover-content table');
      var tds = $(tables[0]).find('td');
      expect($(tds[0]).find('a').attr('href')).to.be('contextpopup_lv95_url');
      expect($(tds[1]).find('a').attr('href')).to.be(contextPermalink);
      expect($(tds[1]).text()).to.be('2\'661\'473.0, 1\'188\'192.0');
      expect($(tds[2]).find('a').attr('href')).to.be('contextpopup_lv03_url');
      expect($(tds[3]).text()).to.be('661\'473.00, 188\'192.00');
      expect($(tds[5]).text()).to.be('46.84203, 8.24453');
      expect($(tds[9]).text()).to.be('442\'396, 5\'187\'887 (zone 32T)');
      expect($(tds[11]).text()).to.be('32TMS 42396 87887 ');
      expect($(tds[13]).text()).to.be('das.ist.test');
      expect($(tds[15]).text()).to.be('1233 m');
      expect($(tds[17]).find('a').attr('href')).to.be(crosshairPermalink);
    });

    it('doesn\'t display informations on long touch press if ctrlKey is pressed', function() {
      var ctrlEvt = $.extend({ctrlKey: true}, touchEvt);
      handlers.pointerdown(ctrlEvt);
      $timeout.flush();
      expect(elt.css('display')).to.be('none');
    });

    it('doesn\'t display informations on long mouse press', function() {
      handlers.pointerdown(mouseEvt);
      expect(elt.css('display')).to.be('none');
    });

    it('doesn\'t display information if pointerup event happens before 300ms', function() {

      // Touch
      handlers.pointerdown(touchEvt);
      handlers.pointerup(touchEvt);
      $timeout.verifyNoPendingTasks();
      $rootScope.$digest();
      expect(elt.css('display')).to.be('none');

      // Mouse
      handlers.pointerdown(mouseEvt);
      handlers.pointerup(mouseEvt);
      $timeout.verifyNoPendingTasks();
      $rootScope.$digest();
      expect(elt.css('display')).to.be('none');
    });

    it('doesn\'t display information if pointermove event happens before 300ms', function() {

      // Touch
      handlers.pointerdown(touchEvt);
      handlers.pointermove(touchEvt2);
      $timeout.verifyNoPendingTasks();
      $rootScope.$digest();

      expect(elt.css('display')).to.be('none');

      // Mouse
      handlers.pointerdown(mouseEvt);
      handlers.pointermove(mouseEvt2);
      $timeout.verifyNoPendingTasks();
      $rootScope.$digest();

      expect(elt.css('display')).to.be('none');
    });

    it('updates w3w text on $translateChangeEnd event', function() {
      var spy = sinon.stub(gaWhat3Words, 'getWords').returns($q.when('das.ist.test'));
      var evt = $.Event('contextmenu');
      evt.coordinate = [2661473, 1188192];
      evt.pixel = [25, 50];
      $(map.getViewport()).trigger(evt);
      $httpBackend.flush();
      $timeout.flush();
      expect(spy.callCount).to.eql(1);

      $rootScope.$broadcast('$translateChangeEnd');
      $rootScope.$digest();
      $timeout.flush();
      expect(spy.callCount).to.eql(2);
    });

    it('updates permalinks on gaPermalinkChange event', function() {
      var evt = $.Event('contextmenu');
      evt.coordinate = [2661473, 1188192];
      evt.pixel = [25, 50];
      $(map.getViewport()).trigger(evt);
      $httpBackend.flush();
      $rootScope.$digest();
      $timeout.flush();
      var spy = sinon.spy(gaPermalink, 'getHref');
      scope.$broadcast('gaPermalinkChange');
      expect(spy.callCount).to.eql(2);
    });
  });

  describe('when isActive = false', function() {

    beforeEach(inject(function($injector) {
      loadDirective(false);
      $timeout.flush();
    }));

    it('doesn\'t display informations on events', function() {
      var spy2 = sinon.spy(gaWhat3Words, 'getWords');
      var evt = $.Event('contextmenu');
      evt.coordinate = [661473, 188192];
      evt.pixel = [25, 50];
      handlers.pointerdown(touchEvt);
      $(map.getViewport()).trigger(evt);
      expect(spy2.callCount).to.eql(0);
      $timeout.verifyNoPendingTasks();
      $rootScope.$digest();
    });
  });
});
