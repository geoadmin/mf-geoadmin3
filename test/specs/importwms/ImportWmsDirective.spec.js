describe('ga_importwms__directive', function() {
  var element, map, controller;
   
  beforeEach(inject(function($injector, $rootScope, $compile, $translate, gaGlobalOptions) {
    map = new ol.Map({});
    map.setSize([600,300]);
    map.getView().getView2D().fitExtent([-20000000, -20000000, 20000000, 20000000], map.getSize()); 
    
    element = angular.element(
      '<div>' +
        '<div ga-import-wms ga-import-wms-map="map" ' +
             'ga-import-wms-options="options">' +
        '</div>' +
      '</div>');
    $rootScope.map = map;
    $rootScope.options = {
      proxyUrl: 'http://admin.ch/ogcproxy?url=',
      defaultGetCapParams: 'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0',
      defaultWMSList: [
         'http://wms.geo.admin.ch/',
         'http://ogc.heig-vd.ch/mapserver/wms?',
         'http://www.wms.stadt-zuerich.ch/WMS-ZH-STZH-OGD/MapServer/WMSServer?',
         'http://geo.gl.ch/wms/Public?',
         'http://mapserver1.gr.ch/wms/admineinteilung?'
      ] 
    };
    controller = $injector.get('$controller')('GaImportWmsDirectiveController', {'$scope': $rootScope}) 
    $compile(element)($rootScope);
    $rootScope.$digest();
    $translate.uses('fr');
  }));

  it('verifies html elements', inject(function($rootScope) {
    var form = element.find('form');
    expect(form.find('input[type=url][ng-model=fileUrl]').length).to.be(1);
    expect(form.find('.twitter-typeahead').length).to.be(1);
    expect(form.find('.open-wms-list').length).to.be(1);    
    expect(form.find('.bt-connect').length).to.be(1); 
    expect(element.find('table').length).to.be(2); 
    expect(element.find('textarea').length).to.be(1); 
    expect(element.find('.bt-addlayer').length).to.be(1); 
    form.find('.open-wms-list').click();
    expect(element.find('.tt-dropdown-menu').css('display')).not.to.be('none');
    expect(element.find('.tt-suggestion').length).to.be(5);
  }));

  describe('a good WMS GetCapabilities is received', function() {
    var $httpBackend;
    var expectedWmsGetCapAdminUrl = "http://admin.ch/ogcproxy?url=http%3A%2F%2Fwms.geo.admin.ch%2F%3FSERVICE%3DWMS%26REQUEST%3DGetCapabilities%26VERSION%3D1.3.0%26lang%3Dfr";

    beforeEach(inject(function($injector, $rootScope) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(expectedWmsGetCapAdminUrl).respond('<?xml version=\'1.0\' encoding="UTF-8" standalone="no" ?>' +
         '<WMS_Capabilities version="1.3.0"  xmlns="http://www.opengis.net/wms">' +
           '<Service>' +
             '<Name>WMS</Name>' +
             '<Title>Title WMS</Title>' +
             '<Abstract>Abstract WMS</Abstract>' +
             '<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://wms.geo.admin.ch/?"/>' +
           '</Service>' +
           '<Capability>' + 
             '<Request>' +
               '<GetCapabilities>' +
                 '<Format>text/xml</Format>' +
                 '<DCPType>' +
                   '<HTTP>' +
                     '<Get><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://wms.geo.admin.ch/?"/></Get>' +
                     '<Post><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://wms.geo.admin.ch/?"/></Post>' +
                   '</HTTP>' +
                 '</DCPType>' +
               '</GetCapabilities>' +
               '<GetMap>' +
               '</GetMap>' +
               '<GetFeatureInfo>' +
               '</GetFeatureInfo>' +
             '</Request>' +
             '<Exception>' +
               '<Format>XML</Format>' +
               '<Format>INIMAGE</Format>' +
               '<Format>BLANK</Format>' +
             '</Exception>' +
             '<Layer>' +
                 '<Name>main</Name>' +
                 '<Title>Title main</Title>' +
                 '<Abstract>Abstract main</Abstract>' +
                 '<CRS>EPSG:3857</CRS>' +
                 '<CRS>EPSG:21781</CRS>' +
                 '<BoundingBox CRS="EPSG:21781" minx="317000" miny="-87000" maxx="1.057e+06" maxy="413000" />' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Name>foo</Name>' +
                   '<Title>Title foo</Title>' +
                   '<Abstract>Abstract foo</Abstract>' +
                   '<CRS>EPSG:3857</CRS>' +
                   '<BoundingBox CRS="EPSG:21781" minx="317000" miny="-87000" maxx="1.057e+06" maxy="413000" />' +
                 '</Layer>' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Name>bar</Name>' +
                   '<Title>Title bar</Title>' +
                   '<Abstract>Abstract bar</Abstract>' +
                   '<CRS>EPSG:3857</CRS>' +
                   '<BoundingBox CRS="EPSG:3857" minx="317000" miny="-87000" maxx="1.057e+06" maxy="413000" />' +
                 '</Layer>' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Title>Layer not added beacause it has no name</Title>' +
                   '<Abstract>Abstract bar2</Abstract>' +
                   '<CRS>EPSG:3857</CRS>' +
                   '<BoundingBox CRS="EPSG:21781" minx="317000" miny="-87000" maxx="1.057e+06" maxy="413000" />' +
                 '</Layer>' +
               '</Layer>' +
             '</Capability>' +
           '</WMS_Capabilities>'
      );
      $httpBackend.expectGET(expectedWmsGetCapAdminUrl);
      $rootScope.fileUrl = $rootScope.options.defaultWMSList[0];
      $rootScope.handleFileUrl(); 
      $httpBackend.flush(); 
      $rootScope.$digest();
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('uploads and parses successfully', inject(function($rootScope) {
      expect($rootScope.userMessage).to.be('parse_succeeded');   
      expect($rootScope.layers.length).to.be(3);    
    }));
    
   /* it('reorders list of layers', inject(function($rootScope) {
      var titleTds = element.find('.table-content tr');
      expect(titleTds.length).to.be(2);
      expect(titleTds[0].html()).to.be('Title bar');
      expect(titleTds[1].html()).to.be('Title foo');
    }));*/

    it('adds/removes a preview layer to the map', inject(function($rootScope) {
      $rootScope.addLayerHovered($rootScope.layers[0]);
      expect($rootScope.map.getLayers().getLength()).to.be(1);      
      expect($rootScope.olLayerHovered.preview).to.be(true);
      expect($rootScope.map.getLayers().getAt(0).preview).to.be(true);
      $rootScope.removeLayerHovered();   
      expect($rootScope.map.getLayers().getLength()).to.be(0);
      expect($rootScope.layerHovered).to.be(null);
      expect($rootScope.olLayerHovered).to.be(null);
    }));
    
    it('selects/unselects a layer', inject(function($rootScope) {
      $rootScope.toggleLayerSelected($rootScope.layers[0]);
      expect($rootScope.layerSelected.title).to.be('Title foo');
      $rootScope.toggleLayerSelected($rootScope.layers[0]);
      expect($rootScope.layerSelected).to.be(null);
    }));
    
    it('adds a selected layer to the map', inject(function($rootScope) {
      $rootScope.toggleLayerSelected($rootScope.layers[0]);
      $rootScope.addLayerSelected();
      expect($rootScope.map.getLayers().getLength()).to.be(1);      
      expect($rootScope.map.getLayers().getAt(0).preview).to.be(false);
    }));

    it('zooms on layer extent', inject(function($rootScope) {
      $rootScope.zoomOnLayerExtent($rootScope.layers[1]);
      var i = $rootScope.map.getView().getView2D().calculateExtent($rootScope.map.getSize());
      expect(i.toString()).to.be('320102.264231154,-20448.867884423,1053897.735768846,346448.867884423');
    }));
  });
});
