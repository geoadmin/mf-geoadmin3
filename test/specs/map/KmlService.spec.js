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
  var createValidPlkLineString = function(id) {
    return '<Placemark id="' + (angular.isDefined(id) ? id : cpt++) + '">' +
        '<name>Swiss Line</name>' +
        '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>Line</p></body></html>]]></description>' +
        '<styleUrl>#styleLine1</styleUrl>' +
        '<LineString>' +
          '<coordinates>9.1,46.8,0 10.1,46.8,0 11.1,46.8,0</coordinates>' +
        '</LineString>' +
      '</Placemark>';
  };
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
  var styleLabelScale0 = '<Style id="styleLabelScale0">' +
      '<LabelStyle>' +
        '<color>7f101112</color>' +
        '<scale>0</scale>' +
      '</LabelStyle>' +
    '</Style>';
  var styleIcon = '<Style id="styleIcon">' +
      '<IconStyle>' +
        '<Icon>' +
          '\n<href>http://voila.fr/ki.pmg</href>' +
        '</Icon>' +
      '</IconStyle>' +
    '</Style>';
  var styleIconScale0 = '<Style id="styleIconScale0">' +
      '<IconStyle>' +
        '<scale>0</scale>' +
        '<Icon>' +
          '\n<href>http://voila.fr/ki.pmg</href>' +
          '<scale>0</scale>' +

        '</Icon>' +
        '<scale>0</scale>' +

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
    var gaKml, $rootScope, $httpBackend, gaNetowrkStatus, gaStorageMock, gaUrlUtilsMock, gaStyleFactoryMock, gaMapUtilsMock;

    beforeEach(function() {
      module(function($provide) {
        var gaStorage = {
          getItem: function(id) {
            return undefined;
          },
          setItem: function(id, value) {}
        };
        gaStorageMock = sinon.mock(gaStorage);
        $provide.value('gaStorage', gaStorage);
      });

      inject(function($injector) {
        gaKml = $injector.get('gaKml');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaUrlUtilsMock = sinon.mock($injector.get('gaUrlUtils'));
        gaStyleFactoryMock = sinon.mock($injector.get('gaStyleFactory'));
        gaNetworkStatus = $injector.get('gaNetworkStatus');
        gaMapUtilsMock = sinon.mock($injector.get('gaMapUtils'));
     });
    });

    afterEach(function () {
   });

   
    it('defines if we should use an ol.layer.ImageVector', function() {
      expect(gaKml.useImageVector(100000)).to.be(false);
      expect(gaKml.useImageVector(30000000)).to.be(true);
      expect(gaKml.useImageVector('100000')).to.be(false);
      expect(gaKml.useImageVector('30000000')).to.be(true);
      expect(gaKml.useImageVector(undefined)).to.be(false);
      expect(gaKml.useImageVector(null)).to.be(false);
      expect(gaKml.useImageVector('dfdsfsdfsdfs')).to.be(false);
    });

    it('tests validity of a file size', function() {
      expect(gaKml.isValidFileSize(10000000)).to.be(true);
      expect(gaKml.isValidFileSize(30000000)).to.be(false);
      expect(gaKml.isValidFileSize('10000000')).to.be(true);
      expect(gaKml.isValidFileSize('30000000')).to.be(false);
      expect(gaKml.isValidFileSize(undefined)).to.be(true);
      expect(gaKml.isValidFileSize(null)).to.be(true);
      expect(gaKml.isValidFileSize('sdfsdfdsfsd')).to.be(true);

    });
     
    it('tests validity of a file content', function() {
      expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
      expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
      expect(gaKml.isValidFileContent(undefined)).to.be(false);
      expect(gaKml.isValidFileContent(null)).to.be(false);
      expect(gaKml.isValidFileContent(212334)).to.be(false);
    });

    describe('addKmlToMap', function() {
      var map;
      beforeEach(function() {
        map = new ol.Map({});
      });

      it('doesn\'t add layer if kml string is not defined', function() {
        gaKml.addKmlToMap(map).then(function() {
        }, function(reason) {
          expect(reason).to.be('No KML data found');
          expect(map.getLayers().getLength()).to.be(0); 
        });
        $rootScope.$digest();
      });

      it('adds layer if a kml string is defined (parseable or not)', function() {
        var kml = 'sdgfsdgfdgg'; 
        gaKml.addKmlToMap(map, kml).then(function() {
          expect(map.getLayers().getLength()).to.be(1); 
        });
        $rootScope.$digest();
      });
         
      it('set a correct layer\'s id', function() {
        // When layerOptions is not defined
        gaKml.addKmlToMap(map, validKml).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||undefined');
        });
        $rootScope.$digest();

        // When layerOptions has an url property
        gaKml.addKmlToMap(map, validKml, {url: 'http://test.ch'}).then(function(olLayer) {
          expect(olLayer.id).to.be('KML||http://test.ch');
        });
        $rootScope.$digest();
      });
   
      it('search for offline data', function() {
        var getItem = gaStorageMock.expects('getItem').once().withArgs('KML||undefined');
        var setItem = gaStorageMock.expects('setItem').never();
          
        gaKml.addKmlToMap(map, validKml).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
        });
        $rootScope.$digest();
      });
      
      it('updates offline data', function() {
        var getItem = gaStorageMock.expects('getItem').once()
            .withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').once()
            .withArgs('KML||offdataexist', validKml);
          
        gaKml.addKmlToMap(map, validKml, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
        });
        $rootScope.$digest();
      });
       
      it('uses offline data', function() {
        var getItem = gaStorageMock.expects('getItem').once()
            .withArgs('KML||offdataexist').returns(validKml2);
        var setItem = gaStorageMock.expects('setItem').never()
            .withArgs('KML||offdataexist', validKml);
          
        gaKml.addKmlToMap(map, undefined, {url: 'offdataexist'}).then(function(olLayer) {
          getItem.verify();
          setItem.verify();
          expect(olLayer.getSource().getFeatures().length).to.be(1);
        });
        $rootScope.$digest();
      });

      // TODO: The regex doesn't work correctly when the file is all in one
      // line
      it('uses ogcproxy for all hrefs (except google and geo.admin images) and use https for geo.admin images (include ogcproxy urls)', function() {
        var hrefs = [
          'http://maps.google.com/blue.png',
          'https://maps.gstatic.com/pushpin.png',
          'http://test.ch/blue.png',
          'http://map.geo.admin.ch/blue.png',
          'https://map.dev.bgdi.ch/blue.png',
          'https://test.ch/yellow.jpeg'
        ];
        var idxProxify = [2, 5]; // urls transformed with ogcproxy
        var idxHttps = [2, 3, 5]; // urls transformed from http to https

        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createPlacemarkWithHref(href);
        });
        kml += '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures(); 
          feats.forEach(function(feat, idx) {
            var hrefTest = hrefs[idx];
           
            if (idxProxify.indexOf(idx) != -1) {
              hrefTest = gaGlobalOptions.ogcproxyUrl + hrefTest;
            }
            
            if (idxHttps.indexOf(idx) != -1) {
              hrefTest = hrefTest.replace(/^http:/, 'https:');
            }
            expect(feat.getStyleFunction().call(feat)[0].getImage().getSrc()).to.be(hrefTest);
          });
        });
        $rootScope.$digest();
      });

      it('download files from network links tags when the link is valid', function() {
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
        });
        $httpBackend.flush();
        $rootScope.$digest();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('doesn\'t add feature without geometry', function() {
        var kml = '<kml><Placemark></Placemark></kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          expect(olLayer.getSource().getFeatures().length).to.be(0);
        });
        $rootScope.$digest();
      });

      it('closes unclosed geometry', function() {
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
        });
        $rootScope.$digest();
      });

      it('set empty feature\'s id to undefined', function() {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getId()).to.be(undefined);
        });
        $rootScope.$digest();
      });

      it('transforms the feature\'s geometry using the map projection', function() {
        var kml = '<kml>' + createValidPlkPoint('') + '</kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feats = olLayer.getSource().getFeatures();
          expect(feats[0].getGeometry().getCoordinates()).to.eql([1013007.3662187896, 5909489.863677091, 0]);
        });
        $rootScope.$digest();
      });

      it('uses default style', function() {
        var kml = '<kml>' + createValidPlkPoint() + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').once()
            .withArgs('kml').returns(dfltStyle);
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          getStyle.verify();
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getFill().getColor()).to.eql(dfltStyle.getFill().getColor());
        });
        $rootScope.$digest();
      });

      it('extracts styles and properties', function() {
        // WARNING: <Document> tag is needed to parse styles
        var kml = '<kml><Document>' + styleLine1 + createValidPlkLineString() + '</Document></kml>';
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getStroke().getColor()).to.eql([18, 17, 16, 0.4980392156862745]);
          expect(feat.get('name')).not.to.be(undefined);
          expect(feat.get('description')).not.to.be(undefined);
        });
        $rootScope.$digest();
      });

      it('applies default image style if offline', function() {
        var kml = '<kml>' + createPlacemarkWithHref('http://test.vh/test.png') + '</kml>';
        var getStyle = gaStyleFactoryMock.expects('getStyle').twice()
            .withArgs('kml').returns(dfltStyle);
        gaNetworkStatus.offline = true;
        gaKml.addKmlToMap(map, kml).then(function(olLayer) {
          var feat = olLayer.getSource().getFeatures()[0];
          var style = feat.getStyleFunction().call(feat)[0];
          expect(style.getImage() instanceof ol.style.Circle).to.be(true);
          expect(style.getImage().getFill().getColor()).to.eql(dfltStyle.getImage().getFill().getColor());
        });
        $rootScope.$digest();
      });
      
      describe('displays feature\'s name', function() {
        // TODO: Tests polygon, multipolygon ....
        it('only on Point and MultiPoint geometry by default', function() {
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
          });
          $rootScope.$digest();
        });

        it('with transparent circle if image\'s scale == 0', function() {
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
          var getStyle =  gaStyleFactoryMock.expects('getStyle').once()
              .withArgs('transparentCircle').returns(trspStyle);

          gaKml.addKmlToMap(map, kml).then(function(olLayer) {
            getStyle.verify();
            var feat = olLayer.getSource().getFeatures()[0];
            var style = feat.getStyleFunction().call(feat)[0];
            expect(style.getImage() instanceof ol.style.Circle).to.be(true);
            expect(style.getImage().getFill().getColor()).to.eql(trsp);
            expect(style.getImage().getStroke().getColor()).to.eql(trsp);
          });
          $rootScope.$digest();
        });
      });
      
      it('set feature\'s type property if the feature has been created by draw tool', function() {
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
        });
        $rootScope.$digest();         
      });

      it('applies measure style to measure feature', function() {
        var kml = '<kml><Document>' +
            createValidPlkPoint('measure_bbbb') +
          '</Document></kml>';
        var isMeasFeat = gaMapUtilsMock.expects('isMeasureFeature').once().returns(true);
        var getStyle = gaStyleFactoryMock.expects('getFeatureStyleFunction').once()
             .withArgs('measure').returns(new ol.style.Style());
          
         gaKml.addKmlToMap(map, kml).then(function(olLayer) {
           isMeasFeat.verify();
           getStyle.verify();
           var feats = olLayer.getSource().getFeatures();
           expect(feats[0].get('type')).to.be('measure');
         });
         $rootScope.$digest();  
      });

      // TODO: tests more geometry types
      it('removes image and text styles for all geometries except (Point, MultiPoint and GeometryCollection)', function() {
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
        });
        $rootScope.$digest();
      });
      it('adds Overlays for measure feature', function() {
      });

      describe('uses a KML layer from public.geo.admin.ch', function() {
        it('adds Overlays for measure feature', function() {
        });
      });

    });
  });
});
