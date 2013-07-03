describe('ga_contextmenu_directive', function() {

  var element;
  var contextmenuHandler;

  beforeEach(function() {

    // load the template
    module('src/contextmenu/partials/menu.html');

    element = angular.element(
      '<div ga-map ga-map-map="map" ga-map-options="options">' +
          '<div ga-context-menu></div>' +
      '</div>');

    inject(function($rootScope, $compile) {
      var map = new ol.Map({});
      $rootScope.map = map;
      $rootScope.options = {};
      map.on = function(eventType, handler) {
        contextmenuHandler = handler;
      };
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

  });

  it('creates <table> and <td>\'s', function() {
    var tables = element.find('div.popover-content table');
    expect(tables.length).to.be(1);

    var tds = $(tables[0]).find('td');
    expect(tds.length).to.be(8);
  });

  describe('ga_contextmenu_directive handling of menucontext', function() {
    var $httpBackend;

    var expectedHeightUrl = 'http://api.geo.admin.ch/height' +
        '?cb=JSON_CALLBACK&easting=661473&elevation_model=COMB' +
        '&northing=188192';
    var expectedReframeUrl = 'http://tc-geodesy.bgdi.admin.ch/reframe/' +
        'lv03tolv95?cb=JSON_CALLBACK&easting=661473&northing=188192';

    beforeEach(inject(function($injector) {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('JSONP', expectedHeightUrl).respond(
          {height: '1233'});
        $httpBackend.when('JSONP', expectedReframeUrl).respond(
          {coordinates: [2725984.4037894635, 1180787.4007025931]});
      });
    }));

    it('correctly handles map contextmenu events', function() {

      var evt = {
        preventDefault: function() {},
        getPixel: function() { return [25, 50]; },
        getCoordinate: function() { return [661473, 188192]; }
      };

      $httpBackend.expectJSONP(expectedHeightUrl);
      $httpBackend.expectJSONP(expectedReframeUrl);

      contextmenuHandler(evt);

      $httpBackend.flush();

      var tables = element.find('div.popover-content table');
      var tds = $(tables[0]).find('td');

      expect($(tds[1]).text()).to.be('661473, 188192');
      expect($(tds[3]).text()).to.be('2725984.40, 1180787.40');
      expect($(tds[7]).text()).to.be('1233 [m]');
    });

  });

});
