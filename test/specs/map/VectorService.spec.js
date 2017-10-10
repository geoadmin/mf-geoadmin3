/* eslint-disable max-len */
describe('ga_vector_service', function() {
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

  describe('gaVector', function() {
    var map, gaVector, $rootScope, $httpBackend, gaNetworkStatus, gaStorageMock,
      gaStyleFactoryMock, gaMapUtilsMock, gaMeasureMock, gaGlobalOptions, $windowMock, ngeoFileMock, gaUrlUtilsMock;

    beforeEach(function() {

      inject(function($injector) {
        gaVector = $injector.get('gaVector');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaStyleFactoryMock = sinon.mock($injector.get('gaStyleFactory'));
        gaNetworkStatus = $injector.get('gaNetworkStatus');
        gaMapUtilsMock = sinon.mock($injector.get('gaMapUtils'));
        gaMeasureMock = sinon.mock($injector.get('gaMeasure'));
        gaStorageMock = sinon.mock($injector.get('gaStorage'));
        gaUrlUtilsMock = sinon.mock($injector.get('gaUrlUtils'));
        $windowMock = sinon.mock($injector.get('$window'));
        ngeoFileMock = sinon.mock($injector.get('ngeoFile'));
      });
      map = new ol.Map({});
    });

    afterEach(function() {
      $windowMock.restore();
    });

    describe('#useImageVector()', function() {
      it('defines if we should use an ol.layer.ImageVector', function() {
        expect(gaVector.useImageVector(100000)).to.be(false);
        expect(gaVector.useImageVector(30000000)).to.be(true);
        expect(gaVector.useImageVector('100000')).to.be(false);
        expect(gaVector.useImageVector('30000000')).to.be(true);
        expect(gaVector.useImageVector(undefined)).to.be(false);
        expect(gaVector.useImageVector(null)).to.be(false);
        expect(gaVector.useImageVector('dfdsfsdfsdfs')).to.be(false);
      });
    });

    describe('#addToMap()', function() {

      it('doesn\'t add layer if vector data is not defined', function(done) {
        gaVector.addToMap(map).then(function() {
        }, function(reason) {
          expect(reason).to.be('No vector data found');
          expect(map.getLayers().getLength()).to.be(0);
          done();
        });
        $rootScope.$digest();
      });

      it('adds layer if vector data is defined (parseable or not)', function(done) {
        var data = 'sdgfsdgfdgg';
        gaVector.addToMap(map, data).then(function() {
          expect(map.getLayers().getLength()).to.be(1);
          done();
        });
        $rootScope.$digest();
      });

      it('set a correct layer\'s id', function(done) {
        // When layerOptions is not defined
        gaVector.addToMap(map, validKml).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||undefined');
          done();
        });
        $rootScope.$digest();

        // When layerOptions has an url property
        gaVector.addToMap(map, validKml, {url: 'http://test.ch'}).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||http://test.ch');
          done();
        });
        $rootScope.$digest();
      });

      it('search for offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once().withArgs('KML||undefined');
        var setItem = gaStorageMock.expects('setItem').never();

        gaVector.addToMap(map, validKml).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          done();
        });
        $rootScope.$digest();
      });

      it('updates offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once().
            withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').once().
            withArgs('KML||offdataexist', validKml);

        gaVector.addToMap(map, validKml, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          done();
        });
        $rootScope.$digest();
      });

      it('uses offline data', function(done) {
        var getItem = gaStorageMock.expects('getItem').once().
            withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').never().
            withArgs('KML||offdataexist', validKml);

        gaVector.addToMap(map, undefined, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          expect(olLayer.getSource().getFeatures().length).to.be(1);
          done();
        });
        $rootScope.$digest();
      });

      it('doesn\'t add feature without geometry', function(done) {
        var kml = '<kml><Placemark></Placemark></kml>';
        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        gaVector.addToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(1);

          // we verify the point is still there
          var coords = feats[0].getGeometry().getGeometries()[0].getCoordinates();
          expect(coords).to.eql([0, -7.081154551613622e-10, 0]);

          done();
        });
        $rootScope.$digest();
      });

      // Note: a 2 points LinearRing is not a valid geometry
      it('doesn\'t remove geometries with good coordinates, at least 4 (#3334)', function(done) {
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
            '<Placemark>' + lineWithOneCoord + '</Placemark>' +
            '<Placemark>' + multiLine + '</Placemark>' +
          '</kml>';
        gaVector.addToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(6);
          done();
        });
        $rootScope.$digest();
      });

      it('set empty feature\'s id to undefined', function(done) {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaVector.addToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getId()).to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });

      it('transforms the feature\'s geometry using the map projection', function(done) {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaVector.addToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getGeometry().getCoordinates()).to.eql([1013007.3662187896, 5909489.863677091, 0]);
          done();
        });
        $rootScope.$digest();
      });

      it('download files from network links tags when the link is valid', function(done) {
        var createNetLink = function(href) {
          return '\n<NetworkLink><Link><href>' + href + '</href></Link></NetworkLink>';
        };
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
        var validKml2 = '<kml>' + createValidPlkPoint() + '</kml>';
        var validKml3 = '<kml>' + createValidPlkPoint() + createValidPlkPoint() + '</kml>';

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
        gaVector.addToMap(map, kml).then(function(olLayer) {
          isValid1.verify();
          isValid2.verify();
          isNotValid.verify();
          var feats = olLayer.getSource().getFeatures();
          expect(feats.length).to.be(4);

          // Verify coordinates are not reprojected twice
          var projectedCoord = [1013007.3662187896, 5909489.863677091, 0];
          expect(feats[0].getGeometry().getCoordinates()).to.eql(projectedCoord);
          expect(feats[1].getGeometry().getCoordinates()).to.eql(projectedCoord);
          expect(feats[2].getGeometry().getCoordinates()).to.eql(projectedCoord);
          expect(feats[3].getGeometry().getCoordinates()).to.eql(projectedCoord);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('uses default point style', function(done) {
        var kml = '<kml>' + createValidPlkPoint() + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').once().
            withArgs('kml').returns(dfltStyle);
        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        gaStyleFactoryMock.expects('getStyle').once().
            withArgs('kml').returns(dfltStyle);
        var getStyle = gaStyleFactoryMock.expects('getStyle').never();

        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        var getStyle = gaStyleFactoryMock.expects('getStyle').once().
            withArgs('kml').returns(dfltStyle);
        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        var getStyle = gaStyleFactoryMock.expects('getStyle').once().
            withArgs('kml').returns(dfltStyle);
        gaNetworkStatus.offline = true;
        gaVector.addToMap(map, kml).then(function(olLayer) {
          getStyle.verify();
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
        gaVector.addToMap(map, kml).then(function(olLayer) {
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

          gaVector.addToMap(map, kml).then(function(olLayer) {
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

          gaVector.addToMap(map, kml).then(function(olLayer) {
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

          gaVector.addToMap(map, kml).then(function(olLayer) {
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
          gaStyleFactoryMock.expects('getStyle').once().
              withArgs('kml').returns(dfltStyle);
          var getStyle = gaStyleFactoryMock.expects('getStyle').once().
              withArgs('transparentCircle').returns(trspStyle);

          gaVector.addToMap(map, kml).then(function(olLayer) {
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

        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        var getStyle = gaStyleFactoryMock.expects('getFeatureStyleFunction').once().
            withArgs('measure').returns(new ol.style.Style());

        gaVector.addToMap(map, kml).then(function(olLayer) {
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

        gaVector.addToMap(map, kml).then(function(olLayer) {
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
        gaVector.addToMap(map, kml);
        $rootScope.$digest();

        // at the end to the collection
        kml = '<kml><Document><name>Layer2</name></Document></kml>';
        gaVector.addToMap(map, kml).then(function() {
          expect(map.getLayers().getLength()).to.be(2);
          expect(map.getLayers().item(1).label).to.be('Layer2');
          done();
        });
        $rootScope.$digest();

        // at a specific index
        kml = '<kml><Document><name>Layer3</name></Document></kml>';
        gaVector.addToMap(map, kml, {}, 1).then(function() {
          expect(map.getLayers().getLength()).to.be(3);
          expect(map.getLayers().item(1).label).to.be('Layer3');
          done();
        });
        $rootScope.$digest();
      });

      it('adds Overlays for measure feature from a public.geo.admin.ch KML', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').once();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaVector.addToMap(map, kml, {
          url: 'http://public.geo.admin.ch/nciusdhfjsbnduvishfjknl'
        });
        $rootScope.$digest();
        addOverlays.verify();
        regOverlays.verify();
      });

      it('adds Overlays for measure feature from a local KML', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').once();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaVector.addToMap(map, kml, {
          url: 'foo/kml.kml'
        });
        $rootScope.$digest();
        addOverlays.verify();
        regOverlays.verify();
      });

      it('doesn\'t add Overlays for measure feature if layer is hidden', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('measure_bbbb') +
          '</Document></kml>';
        var addOverlays = gaMeasureMock.expects('addOverlays').never();
        var regOverlays = gaMeasureMock.expects('registerOverlaysEvents').once();
        gaVector.addToMap(map, kml, {
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
        gaVector.addToMap(map, kml);
        $rootScope.$digest();
        fit.verify();
      });

      it('doesn\'t zoom to data extent if outside default extent', function() {
        var kml = '<kml><Document>' +
            createValidPlkLineString('bbbb') +
          '</Document></kml>';
        var fit = sinon.mock(map.getView()).expects('fit').never();
        gaVector.addToMap(map, kml, {
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
        gaVector.addToMap(map, kml, {
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
        sinon.stub(gaVector, 'useImageVector').returns(true);
        var fit = sinon.mock(map.getView()).expects('fit').once().withArgs([1013007.36621878961, 5844682.851056053, 1235646.3478053366, 5909489.863677091]);
        gaVector.addToMap(map, kml, {
          zoomToExtent: true,
          useImageVector: true
        });
        $rootScope.$digest();
        fit.verify();
      });
    });

    describe('#addToMapForUrl()', function() {
      var gaVectorMock, url, prtl, encoded;

      beforeEach(function() {
        prtl = 'http';
        gaVectorMock = sinon.mock(gaVector);
        url = 'test.kml';
        encoded = gaGlobalOptions.proxyUrl + prtl + '/' +
            encodeURIComponent(url);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('set good properties before calling addToMap', function() {
        $httpBackend.whenGET(encoded).respond(validKml2);
        $httpBackend.expectGET(encoded);

        var useImgVec = gaVectorMock.expects('useImageVector').once().returns(true);
        var addToMap = gaVectorMock.expects('addToMap').once().withArgs(map, validKml2, {
          url: prtl + '://' + url,
          useImageVector: true
        });
        gaVector.addToMapForUrl(map, prtl + '://' + url);

        $httpBackend.flush();
        $rootScope.$digest();
        addToMap.verify();
        useImgVec.verify();
      });

      it('calls addToMap directly when offline', function() {
        gaNetworkStatus.offline = true;
        var addToMap = gaVectorMock.expects('addToMap').once();
        gaVector.addToMapForUrl(map, 'https://test.kml');
        $rootScope.$digest();
        addToMap.verify();
      });

      it('calls addToMap directly when request failed', function() {
        $httpBackend.whenGET(encoded).respond(404, 'File not found');
        $httpBackend.expectGET(encoded);

        var addToMap = gaVectorMock.expects('addToMap').once();

        gaVector.addToMapForUrl(map, 'http://test.kml');

        $httpBackend.flush();
        $rootScope.$digest();
        addToMap.verify();
      });

      it('doesn\'t call addToMap if file size is not valid', function() {
        $httpBackend.whenGET(encoded).respond(validKml2);
        $httpBackend.expectGET(encoded);

        var addToMap = gaVectorMock.expects('addToMap').never();
        var isValid = ngeoFileMock.expects('isValidFileSize').once().returns(false);

        gaVector.addToMapForUrl(map, 'http://test.kml');

        $httpBackend.flush();
        $rootScope.$digest();

        addToMap.verify();
        isValid.verify();
      });
    });
  });
});
