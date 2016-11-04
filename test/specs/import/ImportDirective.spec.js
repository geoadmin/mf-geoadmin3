<<<<<<< HEAD:test/specs/importwms/ImportWmsDirective.spec.js
describe('ga_importwms_directive', function() {
  var element, scope, map, httpBackend;

=======
describe('ga_import_directive', function() {
  var element, scope, map;
   
>>>>>>> Unification of WMS and KML import tool:test/specs/import/ImportDirective.spec.js
  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {
        get: function() {
          return 'somelang';
        },
        getNoRm: function() {
          return 'somelang';
        }
      });
    });

    inject(function($injector, $rootScope, $compile,
        $translate, $httpBackend, gaGlobalOptions) {
      httpBackend = $httpBackend;
      map = new ol.Map({});
      map.setSize([600, 300]);
      map.getView().fit([-20000000, -20000000, 20000000, 20000000], map.getSize());

      element = angular.element(
          '<div ga-import ga-import-map="map" ' +
               'ga-import-options="options">' +
          '</div>');
      scope = $rootScope.$new();
      scope.map = map;
      scope.options = {
        defaultGetCapParams: 'SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0',
        defaultWMSList: [
           'https://wms.geo.admin.ch/',
           'http://ogc.heig-vd.ch/mapserver/wms?',
           'http://www.wms.stadt-zuerich.ch/WMS-ZH-STZH-OGD/MapServer/WMSServer?',
           'http://wms.geo.gl.ch/?',
           'http://mapserver1.gr.ch/wms/admineinteilung?'
        ]
      };
      $injector.get('$controller')('GaImportDirectiveController', {'$scope': scope});
      $injector.get('$controller')('GaImportItemDirectiveController', {'$scope': scope});
      $compile(element)(scope);
      var expectedUrl = 'https://example.com/all?lang=somelang';
      httpBackend.whenGET(expectedUrl).respond({});
      httpBackend.expectGET(expectedUrl);
      $rootScope.$digest();
      httpBackend.flush();
      expectedUrl = 'https://example.com/all?lang=fr';
      httpBackend.whenGET(expectedUrl).respond({});
      httpBackend.expectGET(expectedUrl);
      $translate.use('fr');
      $rootScope.$digest();
      httpBackend.flush();
    });

  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('verifies html elements', inject(function($rootScope) {
    var form = element.find('form');
    expect(form.find('input[type=url][ng-model=fileUrl]').length).to.be(1);
    expect(form.find('.twitter-typeahead').length).to.be(1);
<<<<<<< HEAD:test/specs/importwms/ImportWmsDirective.spec.js
    expect(form.find('.ga-import-wms-open').length).to.be(1);
    expect(form.find('.ga-import-wms-connect').length).to.be(1);
    expect(element.find('.ga-import-wms-container').length).to.be(1);
    expect(element.find('.ga-import-wms-content').length).to.be(1);
    expect(element.find('textarea').length).to.be(1);
    expect(element.find('.ga-import-wms-add').length).to.be(1);
    form.find('.ga-import-wms-open').click();
=======
    expect(form.find('.ga-import-open').length).to.be(1);    
    expect(form.find('.ga-import-connect').length).to.be(1); 
    expect(element.find('.ga-import-container').length).to.be(1); 
    expect(element.find('.ga-import-content').length).to.be(1);  
    expect(element.find('textarea').length).to.be(1); 
    expect(element.find('.ga-import-add').length).to.be(1); 
    form.find('.ga-import-open').click();
>>>>>>> Unification of WMS and KML import tool:test/specs/import/ImportDirective.spec.js
    expect(element.find('.tt-dropdown-menu').css('display')).not.to.be('none');
    expect(element.find('.tt-suggestion').length).to.be(5);
  }));

  describe('a good WMS GetCapabilities is received', function() {
    var $httpBackend;
    var expectedWmsGetCapAdminUrl = 'https://wms.geo.admin.ch/?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&lang=fr';

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
      scope.fileUrl = scope.options.defaultWMSList[0];
      scope.handleFileUrl();
      $httpBackend.flush();
      $rootScope.$digest();
    }));

    it('uploads and parses successfully', inject(function() {
      expect(scope.userMessage).to.be('parse_succeeded');
      expect(scope.layers.length).to.be(2);
      expect(scope.layers[1].Layer.length).to.be(1);
    }));
<<<<<<< HEAD:test/specs/importwms/ImportWmsDirective.spec.js

    describe('ga_importwms_item_directive', function() {
=======
    
    describe('ga_import_item_directive', function() {
>>>>>>> Unification of WMS and KML import tool:test/specs/import/ImportDirective.spec.js
      var evt = {
        stopPropagation: function() {}
      };

      it('adds/removes a preview layer to the map', inject(function() {
        scope.addPreviewLayer(evt, scope.layers[0]);
        expect(scope.map.getLayers().getLength()).to.be(1);
        expect(scope.map.getLayers().item(0).preview).to.be(true);
        scope.removePreviewLayer(evt);
        expect(scope.map.getLayers().getLength()).to.be(0);
        expect(scope.options.layerHovered).to.be(null);
      }));

      it('selects/unselects a layer', inject(function() {
        scope.toggleLayerSelected(evt, scope.layers[0]);
        expect(scope.options.layerSelected.Title).to.be('Title foo');
        scope.toggleLayerSelected(evt, scope.layers[0]);
        expect(scope.options.layerSelected).to.be(null);
      }));

      it('adds a selected layer to the map', inject(function() {
        scope.toggleLayerSelected(evt, scope.layers[0]);
        scope.addLayerSelected();
        expect(scope.map.getLayers().getLength()).to.be(1);
        expect(scope.map.getLayers().item(0).preview).to.be(false);
      }));
    });
  });

  describe('a good WMS GetCapabilities but without the map projection is received', function() {
    var $httpBackend;
    var expectedWmsGetCapAdminUrl = 'https://wms.geo.admin.ch/?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&lang=fr';

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
                 '<CRS>EPSG:4326</CRS>' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Name>invalid</Name>' +
                   '<Title>Invalid because no extent defined</Title>' +
                   '<Abstract>Abstract foo</Abstract>' +
                 '</Layer>' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Name>invalid</Name>' +
                   '<Title>Invalid because no EX_GeographicBoundingBox tag defined</Title>' +
                   '<Abstract>Abstract foo</Abstract>' +
                   '<BoundingBox CRS="EPSG:4326" minx="-180" miny="-90" maxx="180" maxy="90" />' +
                 '</Layer>' +
                 '<Layer queryable="1" opaque="0" cascaded="0">' +
                   '<Name>foo</Name>' +
                   '<Title>Title foo</Title>' +
                   '<Abstract>Abstract foo</Abstract>' +
                   '<BoundingBox CRS="EPSG:4326" minx="-180" miny="-90" maxx="180" maxy="90" />' +
                   '<EX_GeographicBoundingBox>' +
                     '<westBoundLongitude>-180</westBoundLongitude>' +
                     '<eastBoundLongitude>180</eastBoundLongitude>' +
                     '<southBoundLatitude>-89.999999</southBoundLatitude>' +
                     '<northBoundLatitude>89.999999</northBoundLatitude>' +
                   '</EX_GeographicBoundingBox>' +
                 '</Layer>' +
               '</Layer>' +
             '</Capability>' +
           '</WMS_Capabilities>'
      );
      $httpBackend.expectGET(expectedWmsGetCapAdminUrl);
      scope.fileUrl = scope.options.defaultWMSList[0];
      scope.handleFileUrl();
      $httpBackend.flush();
      $rootScope.$digest();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('uploads and parses successfully', inject(function() {
      expect(scope.userMessage).to.be('parse_succeeded');
      expect(scope.layers.length).to.be(1);
      expect(scope.layers[0].Name).to.be('foo');
    }));
  });
});
