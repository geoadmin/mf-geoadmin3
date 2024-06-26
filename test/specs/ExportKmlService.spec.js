/* eslint-disable max-len */
describe('ga_exportkml_service', function() {

  describe('gaExportKml', function() {
    var $window, $httpBackend, gaBrowserSniffer, gaExportKml, gaDefineLayerProperties, gaGlobalOptions, clock;
    var $windowMock, gaExportKmlMock;
    var pointGeom = new ol.geom.Point([-10000000, 10000000]);
    var pointGeomWithProps = new ol.geom.Point([-10000000, 10000000]);
    pointGeomWithProps.set('altitudeMode', 'clampToGround');
    pointGeomWithProps.set('tessellate', '1');
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
    var t = new Date('2016-01-15T10:00:00.000Z').getTime();
    var tFormatted = window.moment(t).format('YYYYMMDDhhmmss');
    var kmlFileName = 'map.geo.admin.ch_KML_' + tFormatted + '.kml';
    // ol.Feature
    var featWithCircle = new ol.Feature(new ol.geom.Circle(pointGeom.getCoordinates(), 10000));
    var featWithNoStyle = new ol.Feature(dfltProps);
    featWithNoStyle.setId('featWithId');

    var featWithProps = new ol.Feature(dfltProps);
    featWithProps.setId('featWithId');
    featWithProps.setStyle([completeStyle]);

    var featWithGeomProps = new ol.Feature(pointGeomWithProps);
    featWithGeomProps.setStyle([new ol.style.Style({
      stroke: new ol.style.Stroke({color: '#ff0000'})
    })]);

    var featWithNoImageHack = new ol.Feature(pointGeom);
    featWithNoImageHack.setStyle([new ol.style.Style({
      text: new ol.style.Text({text: 'featureWithText'}),
      image: new ol.style.Circle()
    })]);

    // KML Placemark node string
    var plkFeatWithProps = '<Placemark id="featWithId">' +
      '<ExtendedData><Data name="customProp"><value>featWithCustomProp</value></Data></ExtendedData>' +
      '<name>featureWithText</name>' +
      '<description>featWithDescr</description>' +
      '<Style>' +
        '<IconStyle>' +
          '<scale>2</scale>' +
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

    var plkFeatWithGeomProps = '<Placemark>' +
      '<Style><LineStyle><color>ff0000ff</color></LineStyle></Style>' +
      '<Point>' +
        '<tessellate>1</tessellate>' +
        '<altitudeMode>clampToGround</altitudeMode>' +
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
        source: new ol.source.Vector({
          features: feats
        })
      });
      if (useStyle) {
        layer.setStyle([completeStyle]);
      }
      gaDefineLayerProperties(layer);
      return layer;
    };

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$window', {
          location: {
            href: '',
            search: {
              substring: function() {}
            }
          },
          open: function() {},
          navigator: window.navigator,
          addEventListener: function() {},
          document: window.document,
          parent: window.parent,
          moment: window.moment
        });
      });

      inject(function($injector) {
        $window = $injector.get('$window');
        $httpBackend = $injector.get('$httpBackend');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaExportKml = $injector.get('gaExportKml');
        gaDefineLayerProperties = $injector.get('gaDefinePropertiesForLayer');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        $windowMock = sinon.mock($window);
        gaExportKmlMock = sinon.mock(gaExportKml);
      });

      clock = sinon.useFakeTimers(t);
    });

    afterEach(function() {
      clock.restore();
      $windowMock.restore();
      gaExportKmlMock.restore();
    });

    describe('#create()', function() {

      it('creates a KML with one complete feature', function() {
        var layer = createVectorLayer([featWithProps]);
        var kml = gaExportKml.create(layer, 'EPSG:3857');
        expect(kml).to.be(getKml([plkFeatWithProps]));
      });

      it('creates a KML excluding unmanaged geomeries (Circle)', function() {
        var layer = createVectorLayer([featWithProps, featWithCircle]);
        var kml = gaExportKml.create(layer, 'EPSG:3857');
        expect(kml).to.be(getKml([plkFeatWithProps]));
      });

      it('creates a KML using no image hack', function() {
        var layer = createVectorLayer([featWithNoImageHack]);
        var kml = gaExportKml.create(layer, 'EPSG:3857');
        expect(kml).to.be(getKml([plkFeatWithNoImageHack]));
      });

      it('creates a KML using layer\'s style function', function() {
        var layer = createVectorLayer([featWithNoStyle], true);
        var kml = gaExportKml.create(layer, 'EPSG:3857');
        expect(kml).to.be(getKml([plkFeatWithProps]));
      });

      it('creates a KML using geometry\'s properties', function() {
        var layer = createVectorLayer([featWithGeomProps], true);
        var kml = gaExportKml.create(layer, 'EPSG:3857');
        expect(kml).to.be(getKml([plkFeatWithGeomProps]));
      });
    });

    describe('#createAndDownload()', function() {

      describe('using download service', function() {
        var dlUrl, fileUrl, open;

        var expectations = function(winLocation) {

          $httpBackend.whenPOST(dlUrl).respond({'url': fileUrl});
          $httpBackend.expectPOST(dlUrl, {
            kml: getKml([plkFeatWithProps]),
            filename: kmlFileName
          });

          var layer = createVectorLayer([featWithProps]);
          gaExportKml.createAndDownload(layer, 'EPSG:3857');

          $httpBackend.flush();
          open.verify();
          expect($window.location).to.be(winLocation);
        };

        beforeEach(function() {
          dlUrl = gaGlobalOptions.apiUrl + '/downloadkml';
          fileUrl = gaGlobalOptions.apiUrl + '/kml/' + kmlFileName;
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
          expectations($window.location);
        });

        it.skip('on Safari', function() {
          gaBrowserSniffer.msie = false;
          gaBrowserSniffer.safari = true;
          gaBrowserSniffer.blob = true;
          open = $windowMock.expects('open').never();
          expectations(fileUrl);
        });

        it('on browser where Blob is not supported', function() {
          gaBrowserSniffer.msie = false;
          gaBrowserSniffer.safari = false;
          gaBrowserSniffer.blob = false;
          open = $windowMock.expects('open').never();
          expectations(fileUrl);
        });
      });

      it('using Blob and saveAs', function() {
        $window.saveAs = function() {};
        gaBrowserSniffer.safari = false;
        gaBrowserSniffer.blob = true;
        var spySaveAs = sinon.spy($window, 'saveAs');
        var layer = createVectorLayer([featWithProps]);
        gaExportKml.createAndDownload(layer, 'EPSG:3857');
        expect(spySaveAs.calledOnce).to.be.ok();
        expect(spySaveAs.args[0][1]).to.be(kmlFileName);
        expect(spySaveAs.args[0][0]).to.be.a(Blob);
      });
    });
  });
});
