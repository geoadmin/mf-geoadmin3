describe('ga_import_directive', function() {
  var elt, scope, parentScope, map, $httpBackend, $rootScope, $compile, $timeout, gaBrowserSniffer;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-import ga-import-map="map" ga-import-options="options"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    $timeout.flush();
    scope = elt.scope();
  };

  var provideServices = function($provide) {
    $provide.value('gaLayers', {});
    $provide.value('gaTopic', {});
    $provide.value('gaLang', {
      get: function() {
        return 'somelang';
      },
      getNoRm: function() {
        return 'somelang';
      }
    });
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
  };

  beforeEach(function() {

    module(function($provide) {
      provideServices($provide);
    });

    inject(function($injector) {
      injectServices($injector);
    });

    map = new ol.Map({});
    map.setSize([600, 300]);

    $rootScope.map = map;
    $rootScope.options = {
      defaultGetCapParams: 'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0',
      defaultWMSList: [
         'https://wms.geo.admin.ch/',
         'http://ogc.heig-vd.ch/mapserver/wms?',
         'http://www.wms.stadt-zuerich.ch/WMS-ZH-STZH-OGD/MapServer/WMSServer?',
         'http://wms.geo.gl.ch/?',
         'http://mapserver1.gr.ch/wms/admineinteilung?'
      ],
      handleFileContent: function() {}
    };
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $timeout.verifyNoPendingTasks();
  });

  it('creates html elements', function() {
    loadDirective();
    expect(elt.find('[ga-tabs]').length).to.be(1);
    expect(elt.find('[ga-tab][ga-tab-title]').length).to.be(2);
    expect(elt.find('[ga-tab] [ngeo-import-local]').length).to.be(1);
    expect(elt.find('[ga-tab] [ngeo-import-online]').length).to.be(1);
    expect(/ngIf: wmsGetCap/.test(elt[0].innerHTML)).to.be(true);
  });

  it('has good scope values', function() {
    loadDirective();
    expect(scope.map).to.be(map);
    expect(scope.options).to.be($rootScope.options);
    expect(scope.showLocal).to.be(true);
  });

  it('loads gaWmsGetCap component when needed', function() {
    loadDirective();
    scope.wmsGetCap = '<WMS_Capabilities version="1.3.0"></WMS_Capabilities>';
    $rootScope.$digest();
    $timeout.flush();
    expect(elt.find('[ngeo-wms-get-cap]').length).to.be(1);
  });

  it('hide first tab on ie9', function() {
    gaBrowserSniffer.msie = 9;
    loadDirective();
    expect(scope.showLocal).to.be(false);
    expect(/ngIf: ::showLocal/.test(elt[0].innerHTML)).to.be(true);
  });

  it('hide first tab on ie < 9', function() {
    gaBrowserSniffer.msie = 8;
    loadDirective();
    expect(scope.showLocal).to.be(false);
    expect(/ngIf: ::showLocal/.test(elt[0].innerHTML)).to.be(true);
  });
});
