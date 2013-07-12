describe('ga_contextmenu_directive', function() {

  var element;
  var handlers = {};

  beforeEach(function() {

    // load the template
    module('components/contextmenu/partials/contextmenu.html');

    element = angular.element(
      '<div ga-map ga-map-map="map" ga-map-options="options">' +
          '<div ga-context-menu></div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      var map = new ol.Map({});
      $rootScope.map = map;
      $rootScope.options = {};
      map.on = function(eventType, handler) {
        handlers[eventType] = handler;
      };
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

  });

  it('creates <table> and <td>\'s', function() {
    var tables = element.find('div.popover-content table');
    expect(tables.length).to.be(1);

    var tds = $(tables[0]).find('td');
    expect(tds.length).to.be(11);
  });

  describe('ga_contextmenu_directive handling of menucontext', function() {
    var contextmenuEvent;
    var $httpBackend;
    var $timeout;

    var expectedHeightUrl = 'http://api.geo.admin.ch/height' +
        '?cb=JSON_CALLBACK&easting=661473&elevation_model=COMB' +
        '&northing=188192';
    var expectedReframeUrl = 'http://tc-geodesy.bgdi.admin.ch/reframe/' +
        'lv03tolv95?cb=JSON_CALLBACK&easting=661473&northing=188192';

    beforeEach(inject(function($injector) {
      contextmenuEvent = {
        preventDefault: function() {},
        getPixel: function() { return [25, 50]; },
        getCoordinate: function() { return [661473, 188192]; }
      };

      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('JSONP', expectedHeightUrl).respond(
          {height: '1233'});
        $httpBackend.when('JSONP', expectedReframeUrl).respond(
          {coordinates: [2725984.4037894635, 1180787.4007025931]});

        $timeout = $injector.get('$timeout');
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('correctly handles map contextmenu events', function() {

      $httpBackend.expectJSONP(expectedHeightUrl);
      $httpBackend.expectJSONP(expectedReframeUrl);

      handlers.contextmenu(contextmenuEvent);

      $httpBackend.flush();

      var tables = element.find('div.popover-content table');
      var tds = $(tables[0]).find('td');

      expect($(tds[1]).text()).to.be('661473.0, 188192.0');
      expect($(tds[3]).text()).to.be('2725984.40, 1180787.40');
      expect($(tds[7]).text()).to.be('1233 [m]');
    });

    describe('On touch devices', function() {

      it('correctly emulates contextmenu', function() {
        $httpBackend.expectJSONP(expectedHeightUrl);
        $httpBackend.expectJSONP(expectedReframeUrl);

        handlers.touchstart(contextmenuEvent);

        $timeout.flush();
        $httpBackend.flush();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('block');

        var tables = element.find('div.popover-content table');
        var tds = $(tables[0]).find('td');

        expect($(tds[1]).text()).to.be('661473.0, 188192.0');
        expect($(tds[3]).text()).to.be('2725984.40, 1180787.40');
        expect($(tds[7]).text()).to.be('1233 [m]');
      });

      it('touchend prevents handler from being called', function() {

        handlers.touchstart(contextmenuEvent);
        handlers.touchend();

        $timeout.flush();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('');
      });

      it('touchmove prevents handler from being called', function() {

        handlers.touchstart(contextmenuEvent);
        handlers.touchmove({
          getPixel: function() {
            return [30, 60];
          }
        });

        $timeout.flush();

        var popover = element.find('.popover');
        expect(popover.css('display')).to.be('');
      });
    });

  });

});
