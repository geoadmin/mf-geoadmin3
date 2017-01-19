describe('ga_contextpopup_directive', function() {
  var element, handlers = {}, viewport, map, originalEvt, $rootScope, gaReframe;

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaBrowserSniffer', {
        msie: false,
        mobile: false,
        phone: false,
        events: {
          menu: 'contextmenu'
        }
      });

      $provide.value('gaNetworkStatus', {
        offline: true
      });

      $provide.value('gaLang', {
        get: function() {
          return 'de';
        }
      });
    });
    originalEvt = {originalEvent: {}};
    element = angular.element(
      '<div>' +
        '<div ga-context-popup ga-context-popup-map="map" ga-context-popup-options="options"></div>' +
        '<div id="map"></div>' +
      '</div>');

    inject(function(_$rootScope_, _gaReframe_, $compile) {
      $rootScope = _$rootScope_;
      gaReframe = _gaReframe_;
      map = new ol.Map({});
      $rootScope.map = map;
      $rootScope.options = {
        heightUrl: '//api.geo.admin.ch/height',
        qrcodeUrl: '//api.geo.admin.ch/qrcodegenerator'
      };
      map.on = function(eventType, handler) {
        handlers[eventType] = handler;
      };
      viewport = $(map.getViewport());
      $compile(element)($rootScope);
      map.setTarget(element.find('#map')[0]);
      $rootScope.$digest();
    });
  });

  it('creates <table> and <td>\'s', function() {
    var tables = element.find('div.popover-content table');
    expect(tables.length).to.be(1);

    var tds = $(tables[0]).find('td');
    expect(tds.length).to.be(16);
  });

  describe('ga_contextpopup_directive handling of popupcontext', function() {
    var contextmenuEvent;
    var $httpBackend;
    var $timeout;

    var expectedHeightUrl = '//api.geo.admin.ch/height' +
        '?easting=661473&elevation_model=COMB' +
        '&northing=188192';
    var expectedReframeUrl = '//api.example.com/reframe/' +
        'lv03tolv95?easting=661473&northing=188192';
    var expectedw3wUrl = 'dummy.test.url.com/v2/reverse?coords=46.84203157398991,8.244528382656728&key=testkey&lang=de';

    beforeEach(inject(function($injector) {
      map.getEventPixel = function(event) { return [25, 50]; };
      map.getEventCoordinate = function(event) { return [661473, 188192]; };

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', expectedHeightUrl).respond(
        {height: '1233'});
      $httpBackend.when('GET', expectedReframeUrl).respond(
        {coordinates: [2725984.4037894635, 1180787.4007025931]});
      $httpBackend.when('GET', expectedw3wUrl).respond(
        {words: 'das.ist.test'});

      $timeout = $injector.get('$timeout');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('correctly handles map contextmenu events', function() {
      var spy = sinon.spy(gaReframe, 'get03To95');
      var evt = $.Event('contextmenu');
      evt.coordinate = [661473, 188192];
      evt.pixel = [25, 50];
      viewport.trigger(evt);
      $httpBackend.flush();

      var tables = element.find('div.popover-content table');
      var tds = $(tables[0]).find('td');

      expect(spy.callCount).to.eql(1);
      expect($(tds[0]).find('a').attr('href')).to.be('contextpopup_lv03_url');
      expect($(tds[2]).find('a').attr('href')).to.be('contextpopup_lv95_url');
      expect($(tds[1]).text()).to.be('661\'473.0, 188\'192.0');
      expect($(tds[3]).text()).to.be('2\'725\'984.40, 1\'180\'787.40');
      expect($(tds[13]).text()).to.be('das.ist.test');
      expect($(tds[15]).text()).to.be('1233 m');
    });

    describe('On device without contextmenu event', function() {
      var mapEvt;

      beforeEach(inject(function($compile, gaBrowserSniffer) {
        mapEvt = {
           stopPropagation: function() {},
           preventDefault: function() {},
           pixel: [25, 50],
           coordinate: [661473, 188192]
        };
        gaBrowserSniffer.touchDevice = true;
        gaBrowserSniffer.msie = false;
        gaBrowserSniffer.events.menu = undefined;

        $compile(element)($rootScope);
        map.setTarget(element.find('#map')[0]);
        $rootScope.$digest();
      }));

      it('correctly emulates contextmenu', function() {
        $httpBackend.expectGET(expectedHeightUrl);
        $httpBackend.expectGET(expectedReframeUrl);
        $httpBackend.expectGET(expectedw3wUrl);
        var spy = sinon.spy(gaReframe, 'get03To95');
        handlers.pointerdown(mapEvt);

        $timeout.flush();
        $httpBackend.flush();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('block');

        var tables = element.find('div.popover-content table');
        var tds = $(tables[0]).find('td');

        expect(spy.callCount).to.eql(1);
        expect($(tds[0]).find('a').attr('href')).to.be('contextpopup_lv03_url');
        expect($(tds[2]).find('a').attr('href')).to.be('contextpopup_lv95_url');
        expect($(tds[1]).text()).to.be('661\'473.0, 188\'192.0');
        expect($(tds[3]).text()).to.be('2\'725\'984.40, 1\'180\'787.40');
        expect($(tds[13]).text()).to.be('das.ist.test');
        expect($(tds[15]).text()).to.be('1233 m');
      });

      it('touchend prevents handler from being called', function() {

        // Make sure there aren't any timouts left (this might
        // compenstate for a bug in angular.mock or angular in general)
        var spy = sinon.spy(gaReframe, 'get03To95');
        $timeout.flush();
        handlers.pointerdown(mapEvt);
        handlers.pointerup(mapEvt);
        $timeout.verifyNoPendingTasks();

        var popover = element.find('.popover');
        expect(spy.callCount).to.eql(0);
        expect(popover.css('display')).to.be('');
      });

      it('touchmove prevents handler from being called', function() {

        // Make sure there aren't any timouts left (this might
        // compenstate for a bug in angular.mock or angular in general)
        var spy = sinon.spy(gaReframe, 'get03To95');
        $timeout.flush();
        handlers.pointerdown(mapEvt);
        handlers.pointermove({
          pixel: [30, 60]
        });
        $timeout.verifyNoPendingTasks();

        var popover = element.find('.popover');
        expect(spy.callCount).to.eql(0);
        expect(popover.css('display')).to.be('');
      });
    });
  });
});
