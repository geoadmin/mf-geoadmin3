describe('ga_kml_service', function() {
  var cpt = 0;
  var validKml = '<kml></kml>';
  var createValidPlkPoint = function(id, styleUrl) {
    return '<Placemark id="' + (angular.isDefined(id) ? id : cpt++) + '">' +
        '<name>Point</name>' +
        '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>Point</p></body></html>]]></description>' +
        '<styleUrl>' + (styleUrl || '#style1') + '</styleUrl>' +
        '<Point>' +
          '<coordinates>9.1,46.8,0</coordinates>' +
        '</Point>' +
      '</Placemark>';
  };
  var createValidPlkMultiPoint = function(id, styleUrl) {
    return '\n<Placemark id="' + (angular.isDefined(id) ? id : cpt++) + '">' +
        '<name>MultiPoint</name>' +
        '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>Point</p></body></html>]]></description>' +
        '<styleUrl>' + (styleUrl || '#style1') + '</styleUrl>' +
        '<MultiGeometry>' +
          '<Point>' +
            '<coordinates>9.1,46.8,0</coordinates>' +
          '</Point>' +
          '<Point>' +
            '<coordinates>10.1,46.8,0</coordinates>' +
          '</Point>' +
        '</MultiGeometry>' +
      '</Placemark>';
  };
  var createValidPlkLineString = function(id, styleId) {
    return '<Placemark id="' + (angular.isDefined(id) ? id : cpt++) + '">' +
        '<name>Swiss Line</name>' +
        '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>Line</p></body></html>]]></description>' +
        '<styleUrl>#' + (styleId || 'styleLine1') + '</styleUrl>' +
        '<LineString>' +
          '<coordinates>9.1,46.8,0 10.1,46.4,0 11.1,46.8,0</coordinates>' +
        '</LineString>' +
      '</Placemark>';
  };
  var styleLine0 = '<Style id="styleLine0">' +
      '<LineStyle>' +
        '<color>7f101112</color>' +
        '<width>0</width>' +
      '</LineStyle>' +
    '</Style>';
  var styleLine1 = '<Style id="styleLine1">' +
      '<LineStyle>' +
        '<color>7f101112</color>' +
      '</LineStyle>' +
    '</Style>';
  var styleLabel = '<Style id="styleLabel">' +
      '<LabelStyle>' +
        '<color>7f101112</color>' +
      '</LabelStyle>' +
    '</Style>';
  var styleLabelScale = '<Style id="styleLabelScale">' +
      '<LabelStyle>' +
        '<color>7f101112</color>' +
        '<scale>0.7</scale>' +
      '</LabelStyle>' +
    '</Style>';
  var styleLabelScale0 = '<Style id="styleLabelScale0">' +
      '<LabelStyle>' +
        '<color>7f101112</color>' +
        '<scale>0</scale>' +
      '</LabelStyle>' +
    '</Style>';
  var styleIcon = '<Style id="styleIcon">' +
      '<IconStyle>' +
        '<Icon>' +
          '\n<href>http://voila.fr/ki.png</href>' +
        '</Icon>' +
      '</IconStyle>' +
    '</Style>';
  var styleIconScale = '<Style id="styleIconScale">' +
      '<IconStyle>' +
        '<scale>0.7</scale>' +
        '<Icon>' +
          '\n<href>http://voila.fr/ki.png</href>' +
        '</Icon>' +
      '</IconStyle>' +
    '</Style>';
  var styleIconScale0 = '<Style id="styleIconScale0">' +
      '<IconStyle>' +
        '<scale>0</scale>' +
        '<Icon>' +
          '\n<href>http://voila.fr/ki.png</href>' +
        '</Icon>' +
      '</IconStyle>' +
    '</Style>';

  var validKml2 = '<kml>' + createValidPlkPoint() + '</kml>';
  var validKml3 = '<kml>' + createValidPlkPoint() + createValidPlkPoint() + '</kml>';

  var createPlacemarkWithHref = function(href) {
    return '<Placemark>' +
        '<Style>' +
          '<IconStyle>' +
            '<Icon>' +
              '\n<href>' + href + '</href>' +
            '</Icon>' +
          '</IconStyle>' +
        '</Style>' +
        '<Point>' +
          '<coordinates>170.1435558771009,-43.60505741890396,0</coordinates>' +
        '</Point>' +
      '</Placemark>';
  };

  var createNetLink = function(href) {
    return '\n<NetworkLink><Link><href>' + href + '</href></Link></NetworkLink>';
  };
  // Default style for KML layer
  var fill = new ol.style.Fill({
    color: [111, 111, 111, 0.1]
  });
  var stroke = new ol.style.Stroke({
    color: [255, 0, 0, 1],
    width: 1.5
  });
  var dfltStyle = new ol.style.Style({
    fill: fill,
    stroke: stroke,
    image: new ol.style.Circle({
      radius: 7,
      fill: fill,
      stroke: stroke
    }),
    text: new ol.style.Text({
      font: 'normal 16px Helvetica',
      fill: fill,
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 3
      })
    })
  });

  describe('gaKml', function() {
    var map, gaKml, $rootScope, $httpBackend, gaNetworkStatus, gaStorageMock, gaUrlUtilsMock,
        gaStyleFactoryMock, gaMapUtilsMock, gaMeasureMock, gaGlobalOptions, $windowMock;

    beforeEach(function() {

      inject(function($injector) {
        gaKml = $injector.get('gaKml');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaUrlUtilsMock = sinon.mock($injector.get('gaUrlUtils'));
        gaStyleFactoryMock = sinon.mock($injector.get('gaStyleFactory'));
        gaNetworkStatus = $injector.get('gaNetworkStatus');
        gaMapUtilsMock = sinon.mock($injector.get('gaMapUtils'));
        gaMeasureMock = sinon.mock($injector.get('gaMeasure'));
        gaStorageMock = sinon.mock($injector.get('gaStorage'));
        $windowMock = sinon.mock($injector.get('$window'));
      });
      map = new ol.Map({});
    });

    afterEach(function() {
      $windowMock.restore();
    });

    describe('#useImageVector()', function() {
      it('defines if we should use an ol.layer.ImageVector', function() {
        expect(gaKml.useImageVector(100000)).to.be(false);
        expect(gaKml.useImageVector(30000000)).to.be(true);
        expect(gaKml.useImageVector('100000')).to.be(false);
        expect(gaKml.useImageVector('30000000')).to.be(true);
        expect(gaKml.useImageVector(undefined)).to.be(false);
        expect(gaKml.useImageVector(null)).to.be(false);
        expect(gaKml.useImageVector('dfdsfsdfsdfs')).to.be(false);
      });
    });

    describe('#isValidFileSize()', function() {
      it('tests validity of a file size', function() {
        $windowMock.expects('alert').withExactArgs('file_too_large (max. 20 MB)').twice();
        expect(gaKml.isValidFileSize(10000000)).to.be(true);
        expect(gaKml.isValidFileSize(30000000)).to.be(false);
        expect(gaKml.isValidFileSize('10000000')).to.be(true);
        expect(gaKml.isValidFileSize('30000000')).to.be(false);
        expect(gaKml.isValidFileSize(undefined)).to.be(true);
        expect(gaKml.isValidFileSize(null)).to.be(true);
        expect(gaKml.isValidFileSize('sdfsdfdsfsd')).to.be(true);
        $windowMock.verify();
      });
    });

    describe('#isValidFileContent()', function() {
      it('tests validity of a file content', function() {
        $windowMock.expects('alert').withExactArgs('file_is_not_kml').exactly(4);
        expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
        expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
        expect(gaKml.isValidFileContent(undefined)).to.be(false);
        expect(gaKml.isValidFileContent(null)).to.be(false);
        expect(gaKml.isValidFileContent(212334)).to.be(false);
        $windowMock.verify();
      });
    });

    describe('#getFormat()', function() {

      it('returns an ol.format.KML object', function() {
        var getStyle = gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        var spy = sinon.spy(ol.format, 'KML');
        var f = gaKml.getFormat();
        expect(f).to.be.a(ol.format.KML);
        getStyle.verify();
        expect(spy.calledTwice).to.be(true);
        expect(spy.args[1][0].extractStyles).to.be(true);
        expect(spy.args[1][0].defaultStyle[0]).to.be(dfltStyle);
      });

      it('returns the same object on 2nd call', function() {
        var getStyle = gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        var f = gaKml.getFormat();
        var f2 = gaKml.getFormat();
        expect(f).to.be(f2);
        getStyle.verify();
      });
    });

    describe('#addKmlToMap()', function() {

      it('doesn\'t add layer if kml string is not defined', function(done) {
        gaKml.addKmlToMap(map).then(function() {
        }, function(reason) {
          expect(reason).to.be('No KML data found');
          expect(map.getLayers().getLength()).to.be(0);
          done();
        });
        $rootScope.$digest();
      });

      it('adds layer if a kml string is defined (parseable or not)', function(done) {
        var kml = 'sdgfsdgfdgg';
        gaKml.addKmlToMap(map, kml).then(function() {
          expect(map.getLayers().getLength()).to.be(1);
          done();
        });
        $rootScope.$digest();
      });

      it('set a correct layer\'s id', function(done) {
        // When layerOptions is not defined
        gaKml.addKmlToMap(map, validKml).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||undefined');
          done();
        });
        $rootScope.$digest();

        // When layerOptions has an url property
        gaKml.addKmlToMap(map, validKml, {url: 'http://test.ch'}).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||http://test.ch');
          done();
        });
        $rootScope.$digest();
      });

      it('search for offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once().withArgs('KML||undefined');
        var setItem = gaStorageMock.expects('setItem').never();

        gaKml.addKmlToMap(map, validKml).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          done();
        });
        $rootScope.$digest();
      });

      it('updates offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once()
            .withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').once()
            .withArgs('KML||offdataexist', validKml);

        gaKml.addKmlToMap(map, validKml, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          done();
        });
        $rootScope.$digest();
      });

      it('uses offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once()
            .withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').never()
            .withArgs('KML||offdataexist', validKml);

        gaKml.addKmlToMap(map, undefined, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          expect(olLayer.getSource().getFeatures().length).to.be(1);
          done();
        });
        $rootScope.$digest();
      });

      it('uses proxy for all hrefs (except google (only png) and geo.admin images))', function(done) {
        var hrefs = [
          'http://amoinughudhfoihnkvpodf.com/aA.aA-aA_aA1.png',
          'https://amoinughudhfoihnkvpodf.com/aA.aA-aA_aA1.png',
          'http://maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'http://maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg',
          'http://maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'https://maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg',
          'http://maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'http://maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg',
          'https://maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg'
        ];

        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          feats.forEach(function(feat, idx) {
            var src = feat.getStyleFunction().call(feat)[0].getImage().getSrc();
            expect(src.indexOf('https://proxy.geo.admin.ch') != -1).to.be(true);
            done();
          });
        });
        $rootScope.$digest();
      });

      it('doesn\'t use proxy for google (only png) and geo.admin images', function(done) {
        var hrefs = [
          'http://public.geo.admin.ch/aA.aA-aA_aA1.png',
          'https://public.geo.admin.ch/aA.aA-aA_aA1.png',
          'http://public.geo.admin.ch/aaa/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'https://public.geo.admin.ch/aaa/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'http://map.geo.admin.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'https://map.geo.admin.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'http://mf-geoadmin3.dev.bgdi.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'https://mf-geoadmin3.dev.bgdi.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png',
          'https://maps.gstatic.com/aA.aA-aA_aA1.png',
          'https://maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.png'
        ];

        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          feats.forEach(function(feat, idx) {
            var src = feat.getStyleFunction().call(feat)[0].getImage().getSrc();
            expect(src.indexOf(gaGlobalOptions.proxyUrl) != -1).to.be(false);
            done();
          });
        });
        $rootScope.$digest();
      });

      it('forces https for geo.admin hrefs using http', function(done) {
        var hrefs = [
          'http://map.geo.admin.ch',
          'http://public.geo.admin.ch',
          'http://mf-geoadmin3.dev.bgdi.ch'
        ];
        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          feats.forEach(function(feat, idx) {
            var hrefTest = hrefs[idx].replace(/^http:/, 'https:');
            expect(feat.getStyleFunction().call(feat)[0].getImage().getSrc()).to.be(hrefTest);
            done();
          });
        });
        $rootScope.$digest();
      });

      it('doesn\'t force https', function(done) {
        var hrefs = [
          'https://map.geo.admin.ch',
          'https://public.geo.admin.ch',
          'https://mf-geoadmin3.dev.bgdi.ch',
          'http://test.test.ch/aaa/aaa/aA',
          'https://test.test.ch/aaa/aaa/aA'
        ];
        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          feats.forEach(function(feat, idx) {
            var src = feat.getStyleFunction().call(feat)[0].getImage().getSrc();
            var hrefTest = hrefs[idx];
            if (/^http:/.test(hrefTest)) {
              hrefTest = hrefTest.replace(/^http:/, 'https:');
              expect(src).not.to.be(hrefTest);
            } else {
              expect(src).to.be(hrefTest);
            }
            done();
          });
        });
        $rootScope.$digest();
      });

      it('replaces old maki urls by color service', function(done) {
        var hrefs = [
          'http://map.geo.admin.ch/1465993254/img/maki/square-stroked-24@2x.png',
          'http://map.geo.admin.ch/master/3ea0981/1471529293/1471529293/img/maki/triangle-stroked-24@2x.png',
          'http://map.geo.admin.ch/aaa/aA4-aA4_aA61470313709/img/maki/marker-24@2x.png',
          'http://mf-geoadmin3.dev.bgdi.ch/aaa/aA4-aA4_aA6/img/maki/marker-24@2x.png',
          'https://map.geo.admin.ch/1470313709/img/maki/marker-24@2x.png',
          'https://mf-geoadmin3.int.bgdi.ch/aaa/aA4-aA4_aA6/img/maki/marker-24@2x.png',
          'https://mf-geoadmin3.int.bgdi.ch/aaa/aA4-aA4_aA6/img/maki/marker2-24@2x.png'
        ];
        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          feats.forEach(function(feat, idx) {
            var src = feat.getStyleFunction().call(feat)[0].getImage().getSrc();
            expect(src.indexOf('/color/255,0,0') != -1).to.be(true);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('download files from network links tags when the link is valid', function(done) {
        // WARNING: these urls are transformed like the urls in the test above.
        var hrefs = [
          'https://geo.admin.ch/test.php',
          'nonvalidurl.py',
          'https://geo.admin.ch/kml.py'
        ];
        var kml = '<kml>' + createValidPlkPoint();
        hrefs.forEach(function(href) {
          kml += createNetLink(href);
        });
        kml += '</kml>';

        $httpBackend.whenGET(hrefs[0]).respond(validKml2);
        $httpBackend.whenGET(hrefs[2]).respond(validKml3);
        $httpBackend.expectGET(hrefs[0]);
        $httpBackend.expectGET(hrefs[2]);

        var isValid1 = gaUrlUtilsMock.expects('isValid').once().withArgs(hrefs[0]).returns(true);
        var isValid2 = gaUrlUtilsMock.expects('isValid').once().withArgs(hrefs[2]).returns(true);
        var isNotValid = gaUrlUtilsMock.expects('isValid').once().withArgs(hrefs[1]).returns(false);
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          isValid1.verify();
          isValid2.verify();
          isNotValid.verify();
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(4);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('doesn\'t add feature without geometry', function(done) {
        var kml = '<kml><Placemark></Placemark></kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          expect(olLayer.getSource().getFeatures().length).to.be(0);
          done();
        });
        $rootScope.$digest();
      });

      it('closes unclosed geometry', function(done) {
        var unclosedCoords = '<coordinates>0,0,0 1,0,0 1,1,0 0,1,0</coordinates>';
        var unclosedLinearRing = '<LinearRing>' + unclosedCoords + '</LinearRing>';
        var unclosedPolygon = '<Polygon>' +
            '<outerBoundaryIs>' + unclosedLinearRing + '</outerBoundaryIs>' +
            '<innerBoundaryIs>' + unclosedLinearRing + '</innerBoundaryIs>' +
          '</Polygon>';
        var unclosedMultiPolygon = '<MultiGeometry>' +
            unclosedPolygon + unclosedPolygon +
         '</MultiGeometry>';

        // a heterogenous MultiGeometry creates a GeometryCollection feature
        var unclosedGeomColl = '<MultiGeometry>' +
            unclosedPolygon + '<Point><coordinates>0,0,0</coordinates></Point>' +
         '</MultiGeometry>';


        var kml = '<kml>' +
            '<Placemark>' + unclosedLinearRing + '</Placemark>' +
            '<Placemark>' + unclosedPolygon + '</Placemark>' +
            '<Placemark>' + unclosedMultiPolygon + '</Placemark>' +
            '<Placemark>' + unclosedGeomColl + '</Placemark>' +
          '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(4);

          // LinearRing (the kml parser creates a Polygon geometry)
          var coords = feats[0].getGeometry().getCoordinates();
          expect(coords[0][0]).to.eql(coords[0][coords[0].length - 1]);

          // Polygon
          coords = feats[1].getGeometry().getCoordinates();
          expect(coords[0][0]).to.eql(coords[0][coords[0].length - 1]);
          expect(coords[1][0]).to.eql(coords[1][coords[1].length - 1]);

          // MultiPolygon
          coords = feats[2].getGeometry().getCoordinates();
          expect(coords[0][0][0]).to.eql(coords[0][0][coords[0][0].length - 1]);
          expect(coords[0][1][0]).to.eql(coords[0][1][coords[0][1].length - 1]);
          expect(coords[1][0][0]).to.eql(coords[1][0][coords[1][0].length - 1]);
          expect(coords[1][1][0]).to.eql(coords[1][1][coords[1][1].length - 1]);

          // GeometryCollection
          coords = feats[3].getGeometry().getGeometries()[0].getCoordinates();
          expect(coords[0][0]).to.eql(coords[0][coords[0].length - 1]);
          expect(coords[1][0]).to.eql(coords[1][coords[1].length - 1]);
          // we verify the point is still there
          coords = feats[3].getGeometry().getGeometries()[1].getCoordinates();
          expect(coords).to.eql([0, -7.081154551613622e-10, 0]);
          done();
        });
        $rootScope.$digest();
      });

      it('remove geometries with unique coordinates', function(done) {
        var uniqCoords = '<coordinates>0,0,0 0,0,0 0,0,0 0,0,0</coordinates>';
        var linearRing = '<LinearRing>' + uniqCoords + '</LinearRing>';
        var polygon = '<Polygon>' +
            '<outerBoundaryIs>' + linearRing + '</outerBoundaryIs>' +
            '<innerBoundaryIs>' + linearRing + '</innerBoundaryIs>' +
          '</Polygon>';
        var multiPolygon = '<MultiGeometry>' +
            polygon + polygon +
         '</MultiGeometry>';
        var line = '<LineString>' + uniqCoords + '</LineString>';
        var multiLine = '<MultiGeometry>' +
            line + line +
         '</MultiGeometry>';
         var lineWithOneCoord = '<LineString>0,0,0</LineString>';


        // a heterogenous MultiGeometry creates a GeometryCollection feature
        var geomColl = '<MultiGeometry>' +
            polygon + '<Point><coordinates>0,0,0</coordinates></Point>' +
            line +
         '</MultiGeometry>';


        var kml = '<kml>' +
            '<Placemark>' + linearRing + '</Placemark>' +
            '<Placemark>' + polygon + '</Placemark>' +
            '<Placemark>' + multiPolygon + '</Placemark>' +
            '<Placemark>' + geomColl + '</Placemark>' +
            '<Placemark>' + line + '</Placemark>' +
            '<Placemark>' + multiLine + '</Placemark>' +
            '<Placemark>' + lineWithOneCoord + '</Placemark>' +
          '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(1);

          // we verify the point is still there
          coords = feats[0].getGeometry().getGeometries()[0].getCoordinates();
          expect(coords).to.eql([0, -7.081154551613622e-10, 0]);

          done();
        });
        $rootScope.$digest();
      });

      // Note: a 2 points LinearRing is not a valid geometry
      it('don\'t remove geometries with good coordinates, at least 4 (#3334)', function(done) {
        var uniqCoords = '<coordinates>1,0,0 2,0,0 2,2,0 1,0,0</coordinates>';
        var linearRing = '<LinearRing>' + uniqCoords + '</LinearRing>';
        var polygon = '<Polygon>' +
            '<outerBoundaryIs>' + linearRing + '</outerBoundaryIs>' +
            '<innerBoundaryIs>' + linearRing + '</innerBoundaryIs>' +
          '</Polygon>';
        var multiPolygon = '<MultiGeometry>' +
            polygon + polygon +
         '</MultiGeometry>';
        var line = '<LineString>' + uniqCoords + '</LineString>';
        var multiLine = '<MultiGeometry>' +
            line + line +
         '</MultiGeometry>';
         var lineWithOneCoord = '<LineString>0,0,0</LineString>';


        // a heterogenous MultiGeometry creates a GeometryCollection feature
        var geomColl = '<MultiGeometry>' +
            polygon +
            '<Point><coordinates>0,0,0</coordinates></Point>' +
            line +
         '</MultiGeometry>';


        var kml = '<kml>' +
            '<Placemark>' + linearRing + '</Placemark>' +
            '<Placemark>' + polygon + '</Placemark>' +
            '<Placemark>' + multiPolygon + '</Placemark>' +
            '<Placemark>' + geomColl + '</Placemark>' +
            '<Placemark>' + line + '</Placemark>' +
            '<Placemark>' + multiLine + '</Placemark>' +
          '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(6);
          done();
        });
        $rootScope.$digest();
      });

      it('set empty feature\'s id to undefined', function(done) {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getId()).to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });

      it('transforms the feature\'s geometry using the map projection', function(done) {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getGeometry().getCoordinates()).to.eql([1013007.3662187896, 5909489.863677091, 0]);
          done();
        });
        $rootScope.$digest();
      });

      it('uses default point style', function(done) {
        var kml = '<kml>' + createValidPlkPoint() + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          getStyle.verify();
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage().getFill().getColor()).to.eql(dfltStyle.getImage().getFill().getColor());
          expect(style.getImage().getStroke().getColor()).to.eql(dfltStyle.getImage().getStroke().getColor());
          expect(style.getImage().getScale()).to.eql(1);
          done();
        });
        $rootScope.$digest();
      });

      it('uses a correct user\'s style defined', function(done) {
        // WARNING: <Document> tag is needed to parse styles
        var kml = '<kml><Document>' +
            styleIcon +
            createValidPlkPoint(undefined, '#styleIcon') +
            styleIconScale +
            createValidPlkPoint(undefined, '#styleIconScale') +
            createValidPlkPoint(undefined, '#styleIconScale') +
          '</Document></kml>';
        var trsp = [0, 0, 0, 0];
        var trspStyle = new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({color: trsp}),
          stroke: new ol.style.Stroke({color: trsp})
        });
        gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        var getStyle = gaStyleFactoryMock.expects('getStyle').never();

        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          getStyle.verify();
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage()).to.be.an(ol.style.Icon);
          expect(style.getImage().getSrc()).to.eql('https://proxy.geo.admin.ch/http/voila.fr/ki.png');
          expect(style.getImage().getScale()).to.eql(1);
          expect(style.getImage().getRotateWithView()).to.eql(false);
          expect(style.getImage().getAnchor()).to.eql(null);
          expect(style.getImage().getOpacity()).to.eql(1);
          expect(style.getImage().getRotation()).to.eql(0);

          feat = olLayer.getSource().getFeatures()[1];
          style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage()).to.be.an(ol.style.Icon);
          expect(style.getImage().getSrc()).to.eql('https://proxy.geo.admin.ch/http/voila.fr/ki.png');
          expect(style.getImage().getScale()).to.eql(0.7);
          expect(style.getImage().getRotateWithView()).to.eql(false);
          expect(style.getImage().getAnchor()).to.eql(null);
          expect(style.getImage().getOpacity()).to.eql(1);
          expect(style.getImage().getRotation()).to.eql(0);

          /// Test if the style is well cloned
          feat = olLayer.getSource().getFeatures()[2];
          style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage().getScale()).to.eql(0.7);
          done();
        });
        $rootScope.$digest();
      });

      it('uses default line style', function(done) {
        var kml = '<kml>' + createValidPlkLineString() + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          getStyle.verify();
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getFill().getColor()).to.eql(dfltStyle.getFill().getColor());
          expect(style.getStroke().getWidth()).to.eql(dfltStyle.getStroke().getWidth());
          expect(style.getStroke().getColor()).to.eql(dfltStyle.getStroke().getColor());
          done();
        });
        $rootScope.$digest();
      });

      it('extracts styles and properties', function(done) {
        // WARNING: <Document> tag is needed to parse styles
        var kml = '<kml><Document>' + styleLine1 + createValidPlkLineString() + '</Document></kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getStroke().getColor()).to.eql([18, 17, 16, 0.4980392156862745]);
          expect(feat.get('name')).not.to.be(undefined);
          expect(feat.get('description')).not.to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });

      it('applies default image style if offline', function(done) {
        var kml = '<kml>' + createPlacemarkWithHref('http://test.vh/test.png') + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').twice()
            .withArgs('kml').returns(dfltStyle);
        gaNetworkStatus.offline = true;
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage() instanceof ol.style.Circle).to.be(true);
          expect(style.getImage().getScale()).to.be(1);
          expect(style.getImage().getFill().getColor()).to.eql(dfltStyle.getImage().getFill().getColor());
          done();
        });
        $rootScope.$digest();
      });

      it('remove stroke\'s if width=0', function(done) {
        // WARNING: <Document> tag is needed to parse styles
        var kml = '<kml><Document>' + styleLine0 + createValidPlkLineString(undefined, 'styleLine0') + '</Document></kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getStroke()).to.be(null);
          done();
        });
        $rootScope.$digest();
      });

      describe('displays feature\'s name', function() {
        // TODO: Tests polygon, multipolygon ....
        it('only on Point and MultiPoint geometry by default', function(done) {
          // WARNING: <Document> tag is needed to parse styles
          var kml = '<kml><Document>' +
              createValidPlkPoint() +
              createValidPlkMultiPoint() +
              createValidPlkLineString() +
            '</Document></kml>';

          gaKml.addKmlToMap(map, kml).then(function(olLayer) {
            var feats = olLayer.getSource().getFeatures();
            var style = feats[0].getStyleFunction().call(feats[0])[0];
            expect(style.getText().getText()).to.be('Point');
            style = feats[1].getStyleFunction().call(feats[1])[0];
            expect(style.getText().getText()).to.be('MultiPoint');
            style = feats[2].getStyleFunction().call(feats[2])[0];
            expect(style.getText()).to.be(null);
            done();
          });
          $rootScope.$digest();
        });

        it('with correct default style', function(done) {
          // WARNING: <Document> tag is needed to parse styles
          var kml = '<kml><Document>' +
              createValidPlkPoint() +
            '</Document></kml>';

          gaKml.addKmlToMap(map, kml).then(function(olLayer) {
            var feats = olLayer.getSource().getFeatures();
            var style = feats[0].getStyleFunction().call(feats[0])[0];
            var text = style.getText();
            expect(text.getFont()).to.be('normal 16px Helvetica');
            expect(text.getText()).to.be('Point');
            expect(text.getFill().getColor()).to.eql([255, 0, 0, 0.7]);
            expect(text.getStroke().getColor()).to.eql([255, 255, 255, 1]);
            expect(text.getScale()).to.be(undefined);
            done();
          });
          $rootScope.$digest();
        });

        it('with correct user\'s style defined', function(done) {
          // WARNING: <Document> tag is needed to parse styles
          var kml = '<kml><Document>' +
              styleLabel +
              createValidPlkPoint(undefined, 'styleLabel') +
              styleLabelScale +
              createValidPlkPoint(undefined, 'styleLabelScale') +
              styleLabelScale0 +
              createValidPlkPoint(undefined, 'styleLabelScale0') +
            '</Document></kml>';

          gaKml.addKmlToMap(map, kml).then(function(olLayer) {
            var feats = olLayer.getSource().getFeatures();
            var style = feats[0].getStyleFunction().call(feats[0])[0];
            var text = style.getText();
            expect(text.getFont()).to.be('normal 16px Helvetica');
            expect(text.getText()).to.be('Point');
            expect(text.getFill().getColor()).to.eql([18, 17, 16, 0.4980392156862745]);
            expect(text.getStroke().getColor()).to.eql([255, 255, 255, 1]);
            expect(text.getScale()).to.be(undefined);
            style = feats[1].getStyleFunction().call(feats[0])[0];
            text = style.getText();
            expect(text.getFont()).to.be('normal 16px Helvetica');
            expect(text.getText()).to.be('Point');
            expect(text.getFill().getColor()).to.eql([18, 17, 16, 0.4980392156862745]);
            expect(text.getStroke().getColor()).to.eql([255, 255, 255, 1]);
            expect(text.getScale()).to.be(0.7);
            style = feats[2].getStyleFunction().call(feats[0])[0];
            text = style.getText();
            expect(text).to.be(null);
            done();
          });
          $rootScope.$digest();
        });

        it('with transparent circle if image\'s scale == 0', function(done) {
          // WARNING: <Document> tag is needed to parse styles
          var kml = '<kml><Document>' +
              styleIconScale0 +
              createValidPlkPoint(undefined, '#styleIconScale0') +
            '</Document></kml>';
          var trsp = [0, 0, 0, 0];
          var trspStyle = new ol.style.Circle({
            radius: 1,
            fill: new ol.style.Fill({color: trsp}),
            stroke: new ol.style.Stroke({color: trsp})
          });
          gaStyleFactoryMock.expects('getStyle').once()
              .withArgs('kml').returns(dfltStyle);
          var getStyle = gaStyleFactoryMock.expects('getStyle').once()
              .withArgs('transparentCircle').returns(trspStyle);

          gaKml.addKmlToMap(map, kml).then(function(olLayer) {
            getStyle.verify();
            var feat = olLayer.getSource().getFeatures()[0];
            var style = feat.getStyleFunction().call(feat)[0];
            expect(style.getImage() instanceof ol.style.Circle).to.be(true);
            expect(style.getImage().getFill().getColor()).to.eql(trsp);
            expect(style.getImage().getStroke().getColor()).to.eql(trsp);
            expect(style.getImage().getScale()).to.eql(1);
            done();
          });
          $rootScope.$digest();
        });
      });

      it('set feature\'s type property if the feature has been created by draw tool', function(done) {
        var kml = '<kml><Document>' +
            createValidPlkPoint('linepolygon_bbbb') +
            createValidPlkPoint() + // id defined
            createValidPlkPoint('') + // id undefined
          '</Document></kml>';

        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].get('type')).to.be('linepolygon');
          expect(feats[1].get('type')).to.be(undefined);
          expect(feats[2].get('type')).to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });

      it('applies measure style to measure feature', function(done) {
        var kml = '<kml><Document>' +
            createValidPlkPoint('measure_bbbb') +
          '</Document></kml>';
        var isMeasFeat = gaMapUtilsMock.expects('isMeasureFeature').twice().returns(true);
        var getStyle = gaStyleFactoryMock.expects('getFeatureStyleFunction').once()
             .withArgs('measure').returns(new ol.style.Style());

         gaKml.addKmlToMap(map, kml).then(function(olLayer) {
           isMeasFeat.verify();
           getStyle.verify();
           var feats = olLayer.getSource().getFeatures();
           expect(feats[0].get('type')).to.be('measure');
           done();
         });
         $rootScope.$digest();
      });

      // TODO: tests more geometry types
      it('removes image and text styles for all geometries except (Point, MultiPoint and GeometryCollection)', function(done) {
        // WARNING: <Document> tag is needed to parse styles
        var kml = '<kml><Document>' +
            createValidPlkPoint() +
            createValidPlkMultiPoint() +
            createValidPlkLineString() +
          '</Document></kml>';

        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          var style = feats[0].getStyleFunction().call(feats[0])[0];
          expect(style.getText()).to.not.be(undefined);
          style = feats[1].getStyleFunction().call(feats[1])[0];
          expect(style.getText()).to.not.be(undefined);
          style = feats[2].getStyleFunction().call(feats[2])[0];
          expect(style.getText()).to.be(null);
          expect(style.getImage()).to.be(null);
          done();
        });
        $rootScope.$digest();
      });

      it('adds Layer at the correct place', function(done) {
        var kml = '<kml><Document><name>Layer1</name></Document></kml>';
        gaKml.addKmlToMap(map, kml);
        $rootScope.$digest();

        // at the end to the collection
        kml = '<kml><Document><name>Layer2</name></Document></kml>';
        gaKml.addKmlToMap(map, kml).then(function() {
          expect(map.getLayers().getLength()).to.be(2);
          expect(map.getLayers().item(1).label).to.be('Layer2');
          done();
        });
        $rootScope.$digest();

        // at a specific index
        kml = '<kml><Document><name>Layer3</name></Document></kml>';
        gaKml.addKmlToMap(map, kml, {}, 1).then(function() {
          expect(map.getLayers().getLength()).to.be(3);
          expect(map.getLayers().item(1).label).to.be('Layer3');
          done();
        });
        $rootScope.$digest();
      });

      it('adds Overlays for measure feature from a public.geo.admin.ch KML', function() {
        var addOverlays, registerOverlaysEvents, kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').once();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaKml.addKmlToMap(map, kml, {
           url: 'http://public.geo.admin.ch/nciusdhfjsbnduvishfjknl'
        });
        $rootScope.$digest();
        addOverlays.verify();
        regOverlays.verify();
      });

      it('adds Overlays for measure feature from a local KML', function() {
        var addOverlays, registerOverlaysEvents, kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').once();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaKml.addKmlToMap(map, kml, {
           url: 'foo/kml.kml'
        });
        $rootScope.$digest();
        addOverlays.verify();
        regOverlays.verify();
      });

      it('doesn\'t add Overlays for measure feature if layer is hidden', function() {
        var addOverlays, registerOverlaysEvents, kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').never();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaKml.addKmlToMap(map, kml, {
           visible: false,
           url: 'http://public.geo.admin.ch/nciusdhfjsbnduvishfjknl'
        });
        $rootScope.$digest();
        addOverlays.verify();
        regOverlays.verify();
      });

      it('doesn\'t zoom to data extent by default', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('bbbb') +
          '</Document></kml>';
        var fit = sinon.mock(map.getView()).expects('fit').never();
        gaKml.addKmlToMap(map, kml);
        $rootScope.$digest();
        fit.verify();
      });

      it('doesn\'t zoom to data extent if outside default extent', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('bbbb') +
          '</Document></kml>';
        var fit = sinon.mock(map.getView()).expects('fit').never();
        gaKml.addKmlToMap(map, kml, {
          zoomToExtent: true
        });
        $rootScope.$digest();
        fit.verify();
      });

      it('zooms to data extent if intersects with default extent (ol.source.Vector)', function() {
        // We set an dflt extent in 3857
        gaGlobalOptions.defaultExtent = [-20000000, -20000000, 20000000, 20000000];
        var kml = '<kml><Document>' +
            createValidPlkLineString() +
          '</Document></kml>';
        var fit = sinon.mock(map.getView()).expects('fit').once().withArgs([1013007.36621878961, 5844682.851056053, 1235646.3478053366, 5909489.863677091]);
        gaKml.addKmlToMap(map, kml, {
          zoomToExtent: true
        });
        $rootScope.$digest();
        fit.verify();
      });

      it('zooms to data extent if intersects with default extent (ol.source.ImageVector)', function() {
        // We set an dflt extent in 3857
        gaGlobalOptions.defaultExtent = [-20000000, -20000000, 20000000, 20000000];
        var kml = '<kml><Document>' +
            createValidPlkLineString() +
          '</Document></kml>';
        sinon.stub(gaKml, 'useImageVector').returns(true);
        var fit = sinon.mock(map.getView()).expects('fit').once().withArgs([1013007.36621878961, 5844682.851056053, 1235646.3478053366, 5909489.863677091]);
        gaKml.addKmlToMap(map, kml, {
          zoomToExtent: true,
          useImageVector: true
        });
        $rootScope.$digest();
        fit.verify();
      });
    });

    describe('#addKmlToMapForUrl()', function() {
      var gaKmlMock, url, prtl, encoded;

      beforeEach(function() {
        prtl = 'http';
        gaKmlMock = sinon.mock(gaKml);
        url = 'test.kml';
        encoded = gaGlobalOptions.proxyUrl + prtl + '/' +
            encodeURIComponent(url);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('set good properties before calling addKmlToMap', function() {
        $httpBackend.whenGET(encoded).respond(validKml2);
        $httpBackend.expectGET(encoded);

        var useImgVec = gaKmlMock.expects('useImageVector').once().returns(true);
        var addKmlToMap = gaKmlMock.expects('addKmlToMap').once().withArgs(map, validKml2, {
          url: prtl + '://' + url,
          useImageVector: true
        });
        gaKml.addKmlToMapForUrl(map, prtl + '://' + url);

        $httpBackend.flush();
        $rootScope.$digest();
        addKmlToMap.verify();
        useImgVec.verify();
      });

      it('calls addKmlToMap directly when offline', function() {
        gaNetworkStatus.offline = true;
        var addKmlToMap = gaKmlMock.expects('addKmlToMap').once();
        gaKml.addKmlToMapForUrl(map, 'https://test.kml');
        $rootScope.$digest();
        addKmlToMap.verify();
      });

      it('calls addKmlToMap directly when request failed', function() {
        $httpBackend.whenGET(encoded).respond(404, 'File not found');
        $httpBackend.expectGET(encoded);

        var addKmlToMap = gaKmlMock.expects('addKmlToMap').once();

        gaKml.addKmlToMapForUrl(map, 'http://test.kml');

        $httpBackend.flush();
        $rootScope.$digest();
        addKmlToMap.verify();
      });

      it('doesn\'t call addKmlToMap if content is not valid', function() {
        $httpBackend.whenGET(encoded).respond(validKml2);
        $httpBackend.expectGET(encoded);

        var addKmlToMap = gaKmlMock.expects('addKmlToMap').never();
        var isValid = gaKmlMock.expects('isValidFileContent').once().returns(false);

        gaKml.addKmlToMapForUrl(map, 'http://test.kml');

        $httpBackend.flush();
        $rootScope.$digest();

        addKmlToMap.verify();
        isValid.verify();
      });

      it('doesn\'t call addKmlToMap if file size is not valid', function() {
        $httpBackend.whenGET(encoded).respond(validKml2);
        $httpBackend.expectGET(encoded);

        var addKmlToMap = gaKmlMock.expects('addKmlToMap').never();
        var isValid = gaKmlMock.expects('isValidFileSize').once().returns(false);

        gaKml.addKmlToMapForUrl(map, 'http://test.kml');

        $httpBackend.flush();
        $rootScope.$digest();

        addKmlToMap.verify();
        isValid.verify();
      });
    });
  });
});
