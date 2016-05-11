describe('ga_exportkml_service', function() {
  var $translate, $window, $document, $httpBackend, gaBrowserSniffer, gaExportKml, gaDefineLayerProperties, gaGlobalOptions, $rootScope, clock;
  var $windowMock, gaExportKmlMock;
  var pointGeom = new ol.geom.Point([-10000000, 10000000]);
  var completeStyle = new ol.style.Style({
    fill: new ol.style.Fill({color: [128, 64, 32, 0.2]}),
    stroke: new ol.style.Stroke({color: [129, 65, 33, 0.4], width: 3}),
    text: new ol.style.Text({text: 'featureWithText'}),        
    image: new ol.style.Icon({src: 'http://featWithImg.png', scale: 2}),
    zIndex: 3 
  });
  var dfltProps = {
    description: 'featWithDescr',
    customProp: 'featWithCustomProp',
    geometry: pointGeom
  };

  // ol.Feature
  var featWithCircle = new ol.Feature(new ol.geom.Circle(pointGeom.getCoordinates(), 10000));
  var featWithNoStyle = new ol.Feature(dfltProps);
  featWithNoStyle.setId('featWithId');

  var featWithProps = new ol.Feature(dfltProps);
  featWithProps.setId('featWithId');
  featWithProps.setStyle([completeStyle]);
  
  var featWithNoImageHack = new ol.Feature(pointGeom);
  featWithNoImageHack.setStyle([new ol.style.Style({
      text: new ol.style.Text({text: 'featureWithText'}),        
      image: new ol.style.Circle()
  })]);

  // KML Placemark node string
  var plkFeatWithProps = '<Placemark id="featWithId">' +
    '<name>featureWithText</name>' +
    '<description>featWithDescr</description>' +
    '<Style>' +
      '<IconStyle>' + 
        '<scale>4</scale>' + 
        '<Icon>' + 
          '<href>http://featWithImg.png</href>' +
        '</Icon>' + 
      '</IconStyle>' +
      '<LabelStyle>' +
        '<color>ff333333</color>' +
      '</LabelStyle>' +
      '<LineStyle>' +
        '<color>66214181</color>' +
        '<width>3</width>' +
      '</LineStyle>' + 
      '<PolyStyle>' + 
        '<color>33204080</color>' + 
      '</PolyStyle>' + 
    '</Style>' +
    '<Point>' + 
      '<coordinates>-89.83152841195214,66.44602771314118</coordinates>' +
    '</Point>' + 
  '</Placemark>';
   
  var plkFeatWithNoImageHack = '<Placemark>' +
    '<name>featureWithText</name>' +
    '<Style>' +
      '<IconStyle>' + 
        '<scale>0</scale>' + 
      '</IconStyle>' +
      '<LabelStyle>' +
        '<color>ff333333</color>' +
      '</LabelStyle>' +
    '</Style>' +
    '<Point>' + 
      '<coordinates>-89.83152841195214,66.44602771314118</coordinates>' +
    '</Point>' + 
  '</Placemark>'; 

  // Create a KML string from a list of KML placemarks 
  var getKml = function(plks) {
    var kml = '<kml xmlns="http://www.opengis.net/kml/2.2" ' +
                   'xmlns:gx="http://www.google.com/kml/ext/2.2" ' +
                   'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                   'xsi:schemaLocation="http://www.opengis.net/kml/2.2 ' +
                   'https://developers.google.com/kml/schema/kml22gx.xsd">' +
      '<Document><name>layerWithLabel</name>';
    plks.forEach(function(item) {
      kml += item;
    });
    kml += '</Document></kml>';
    return kml; 
  };
   
  // Create a vector layer ifrom a liste of ol.Feature
  var createVectorLayer = function(feats, useStyle) {
    var layer = new ol.layer.Vector({
      label: 'layerWithLabel',
      source:  new ol.source.Vector({
        features: feats
      })
    });
    if (useStyle) {
      layer.setStyle([completeStyle]);
    }
    gaDefineLayerProperties(layer);
    return layer;
  }

  beforeEach(function() {
        
    inject(function($injector) {
      $translate = $injector.get('$translate');
      $window = $injector.get('$window');
      $document = $injector.get('$document');
      $httpBackend = $injector.get('$httpBackend');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaExportKml = $injector.get('gaExportKml');
      gaDefineLayerProperties = $injector.get('gaDefinePropertiesForLayer');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      $rootScope = $injector.get('$rootScope');
      $windowMock = sinon.mock($window);
      gaExportKmlMock = sinon.mock(gaExportKml);
    });
    clock = sinon.useFakeTimers(new Date(2016,1,1).getTime());
  });

  afterEach(function() {
    clock.restore();
    $windowMock.restore();
    gaExportKmlMock.restore();
  });
  
  describe('creates', function() {

    it('a KML with one complete feature', function() {
      var layer = createVectorLayer([featWithProps]);
      var kml = gaExportKml.create(layer, 'EPSG:3857');
      expect(kml).to.be(getKml([plkFeatWithProps]));
    });

    it('a KML excluding unmanaged geomeries (Circle)', function() {
      var layer = createVectorLayer([featWithProps, featWithCircle]);
      var kml = gaExportKml.create(layer, 'EPSG:3857');
      expect(kml).to.be(getKml([plkFeatWithProps]));
    });

    it('a KML using no image hack', function() {
      var layer = createVectorLayer([featWithNoImageHack]);
      var kml = gaExportKml.create(layer, 'EPSG:3857');
      expect(kml).to.be(getKml([plkFeatWithNoImageHack]));
    });

    it('a KML using layer\'s style function', function() {
      var layer = createVectorLayer([featWithNoStyle], true);
      var kml = gaExportKml.create(layer, 'EPSG:3857');
      expect(kml).to.be(getKml([plkFeatWithProps]));
    });
  
  });
  
  describe('creates and download', function() {
  
    it('nothing', function() {
      var layer = createVectorLayer([featWithProps]);
      var canSave = gaExportKmlMock.expects('canSave').once().returns(false);
      var alret = $windowMock.expects('alert').once().withArgs('export_kml_notsupported');
      gaExportKml.createAndDownload(layer, 'EPSG:3857');
      canSave.verify();
      alret.verify();
    });
    
    describe('using download service', function() {
      var dlUrl, fileName, fileUrl, open; 
       
      var expectations = function() {
        var canSave = gaExportKmlMock.expects('canSave').once().returns(true);
 
        $httpBackend.whenPOST(dlUrl).respond({"url": fileUrl});
        $httpBackend.expectPOST(dlUrl, {
          kml: getKml([plkFeatWithProps]),
          filename: fileName
        });
       
        var layer = createVectorLayer([featWithProps]);
        gaExportKml.createAndDownload(layer, 'EPSG:3857');
     
        $httpBackend.flush();
        canSave.verify();
        open.verify();
      };
      
      beforeEach(function() {
        dlUrl = gaGlobalOptions.apiUrl + '/downloadkml';
        fileName = 'map.geo.admin.ch_KML_20160201000000.kml'; 
        fileUrl = gaGlobalOptions.apiUrl + '/kml/' + fileName; 
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('on IE 9', function() {
        gaBrowserSniffer.msie = 9;
        gaBrowserSniffer.safari = false;
        gaBrowserSniffer.blob = true;
        open = $windowMock.expects('open').once().withArgs(fileUrl).returns({});
        expectations();
      });  
      
      // TODO: How to avoid page reload
      /*it('on Safari', function() {
        gaBrowserSniffer.msie = false;
        gaBrowserSniffer.safari = true;
        gaBrowserSniffer.blob = true;
        open = $windowMock.expects('open').never();
        open = $windowMock.expects('location').once().returns({});
        expectations();
      });*/
      
      /*it('on browser where Blob is not supported', function() {
        gaBrowserSniffer.msie = false;
        gaBrowserSniffer.safari = false;
        gaBrowserSniffer.blob = false;
        $window = {
          location: {href:''},
          open: function(){}
        };
        open = $windowMock.expects('open').never();
        expectations();
       });*/
    });

    // TODO: Test Blob creation     
    it('using Blob and saveAs', function() {
      $window.saveAs = function(){};
      gaBrowserSniffer.safari = false;
      gaBrowserSniffer.blob = true;
      var fileName = 'map.geo.admin.ch_KML_.kml';
      var canSave = gaExportKmlMock.expects('canSave').once().returns(true);
      var spySaveAs = sinon.spy($window, 'saveAs');
      
      var layer = createVectorLayer([featWithProps]);
      gaExportKml.createAndDownload(layer, 'EPSG:3857');
     
      canSave.verify();
      expect(spySaveAs.calledOnce).to.be.ok();
    });

  });

  it('can save', function() {
    gaBrowserSniffer.mobile = false;
    expect(gaExportKml.canSave()).to.be(true);
    gaBrowserSniffer.mobile = true;
    expect(gaExportKml.canSave()).to.be(false);
  });

});
