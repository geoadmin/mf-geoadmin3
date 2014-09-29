describe('ga_contextpopup_directive', function() {
  var element, handlers = {}, viewport, map, originalEvt;
   
  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaBrowserSniffer', {
        msie: false,
        mobile: false,
        phone: false,
        events:{
          menu: 'contextmenu'
        }
      });

      $provide.value('gaNetworkStatus', {
        offline: true
      });
    });
    originalEvt = {originalEvent:{}}; 
    element = angular.element(
      '<div>' +
        '<div ga-context-popup ga-context-popup-map="map" ga-context-popup-options="options"></div>' +
        '<div id="map"></div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      map = new ol.Map({});
      $rootScope.map = map;
      $rootScope.options = {
        lv03tolv95Url: "//api.example.com/reframe/lv03tolv95",
        heightUrl: "//api.geo.admin.ch/height",
        qrcodeUrl: "//api.geo.admin.ch/qrcodegenerator"
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
    expect(tds.length).to.be(14);
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

    beforeEach(inject(function($injector) {
      map.getEventPixel = function(event) { return [25, 50]; };
      map.getEventCoordinate = function(event) { return [661473, 188192]; };
        
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', expectedHeightUrl).respond(
          {height: '1233'});
        $httpBackend.when('GET', expectedReframeUrl).respond(
          {coordinates: [2725984.4037894635, 1180787.4007025931]});

        $timeout = $injector.get('$timeout');
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('correctly handles map contextmenu events', function() {
      $httpBackend.expectGET(expectedHeightUrl);
      $httpBackend.expectGET(expectedReframeUrl);
      viewport.trigger($.Event("contextmenu", originalEvt));
      $httpBackend.flush();

      var tables = element.find('div.popover-content table');
      var tds = $(tables[0]).find('td');

      expect($(tds[1]).text()).to.be('661\'473.0, 188\'192.0');
      expect($(tds[3]).text()).to.be('2\'725\'984.40, 1\'180\'787.40');
      expect($(tds[11]).text()).to.be('1233 [m]');
    });

    describe('On device without contextmenu event', function() {
      var mapEvt;
      
      beforeEach(inject(function($rootScope, $compile, gaBrowserSniffer) {
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
        handlers.pointerdown(mapEvt);

        $timeout.flush();
        $httpBackend.flush();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('block');

        var tables = element.find('div.popover-content table');
        var tds = $(tables[0]).find('td');

        expect($(tds[1]).text()).to.be('661\'473.0, 188\'192.0');
        expect($(tds[3]).text()).to.be('2\'725\'984.40, 1\'180\'787.40');
        expect($(tds[11]).text()).to.be('1233 [m]');
      });

      it('touchend prevents handler from being called', function() {

        // Make sure there aren't any timouts left (this might
        // compenstate for a bug in angular.mock or angular in general)
        $timeout.flush();
        handlers.pointerdown(mapEvt);
        handlers.pointerup(mapEvt);
        $timeout.verifyNoPendingTasks();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('');
      });

      it('touchmove prevents handler from being called', function() {

        // Make sure there aren't any timouts left (this might
        // compenstate for a bug in angular.mock or angular in general)
        $timeout.flush();
        handlers.pointerdown(mapEvt);
        handlers.pointermove({
          pixel: [30, 60]
        });
        $timeout.verifyNoPendingTasks();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('');
      });
    });
  });
});
