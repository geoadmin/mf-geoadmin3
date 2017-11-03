/* eslint-disable max-len */
describe('ga_kml_service', function() {

  describe('gaKml', function() {
    var gaKml, $rootScope, gaStyleFactory, gaNetworkStatus, gaMapUtils, $httpBackend;

    beforeEach(function() {
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        gaKml = $injector.get('gaKml');
        gaStyleFactory = $injector.get('gaStyleFactory');
        gaNetworkStatus = $injector.get('gaNetworkStatus');
        gaMapUtils = $injector.get('gaMapUtils');
      });

      // URL object doesn't exist in phantomJS
      // https://github.com/ariya/phantomjs/issues/14349
      window.URL = function(url, baseURI) {
        return {
          href: url
        }
      };
    });

    afterEach(function() {
      gaNetworkStatus.offline = false;
    });

    describe('#getType()', function() {
      it('returns a string', function() {
        expect(gaKml.getType()).to.be('KML');
      });
    });

    describe('#getFormat()', function() {

      it('returns an ol.format.KML object', function() {
        var spy = sinon.spy(ol.format, 'KML');
        var f = gaKml.getFormat();
        expect(f).to.be.a(ol.format.KML);
        expect(spy.calledTwice).to.be(true);
        expect(spy.args[1][0].extractStyles).to.be(true);
        expect(spy.args[1][0].defaultStyle[0]).to.be(gaKml.getStyle());
        spy.restore();
      });

      it('returns the same object on 2nd call', function() {
        var spy = sinon.spy(ol.format, 'KML');
        var f = gaKml.getFormat();
        f = gaKml.getFormat();
        expect(f).to.be.a(ol.format.KML);
        expect(spy.calledTwice).to.be(true);
        expect(spy.args[1][0].extractStyles).to.be(true);
        expect(spy.args[1][0].defaultStyle[0]).to.be(gaKml.getStyle());
        spy.restore();
      });
    });

    describe('#getStyle()', function() {

      it('returns an ol.style.Style object', function() {
        var spy = sinon.spy(gaStyleFactory, 'getStyle');
        var f = gaKml.getStyle();
        expect(f).to.be.a(ol.style.Style);
        expect(spy.calledOnce).to.be(true);
        expect(spy.args[0][0]).to.be('kml');
        spy.restore();
      });

      it('returns the same object on 2nd call', function() {
        var spy = sinon.spy(gaStyleFactory, 'getStyle');
        var f = gaKml.getStyle();
        f = gaKml.getStyle();
        expect(f).to.be.a(ol.style.Style);
        expect(spy.calledOnce).to.be(true);
        expect(spy.args[0][0]).to.be('kml');
        spy.restore();
      });
    });

    describe('#sanitize()', function() {

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

      it('uses proxy for all hrefs (except google (only png) and geo.admin images))', function() {
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
        kml = gaKml.sanitize(kml);
        expect(kml).to.be('<kml><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/amoinughudhfoihnkvpodf.com/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/https/amoinughudhfoihnkvpodf.com/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/https/maps.gstatic.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/http/maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://proxy.geo.admin.ch/https/maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.jpeg</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark></kml>');
      });

      it('doesn\'t use proxy for google (only png) and geo.admin images', function() {
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
        kml = gaKml.sanitize(kml);
        expect(kml).to.be('<kml><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://public.geo.admin.ch/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://public.geo.admin.ch/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://public.geo.admin.ch/aaa/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://public.geo.admin.ch/aaa/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://map.geo.admin.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://map.geo.admin.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://mf-geoadmin3.dev.bgdi.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://mf-geoadmin3.dev.bgdi.ch/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://maps.gstatic.com/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
            '<href>https://maps.google.com/aaa/aaa/aaa/aA.aA-aA_aA1.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark></kml>');
      });

      it('forces https for geo.admin hrefs using http', function() {
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
        kml = gaKml.sanitize(kml);
        expect(kml).to.be('<kml><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://map.geo.admin.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://public.geo.admin.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://mf-geoadmin3.dev.bgdi.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark></kml>');
      });

      it('doesn\'t force https', function() {
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
        kml = gaKml.sanitize(kml);
        expect(kml).to.be('<kml><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://map.geo.admin.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://public.geo.admin.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://mf-geoadmin3.dev.bgdi.ch</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://proxy.geo.admin.ch/http/test.test.ch/aaa/aaa/aA</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>https://proxy.geo.admin.ch/https/test.test.ch/aaa/aaa/aA</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark></kml>');
      });

      it('replaces old maki urls by color service', function() {
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
        kml = gaKml.sanitize(kml);
        expect(kml).to.be('<kml><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/square-stroked-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/triangle-stroked-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/marker-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/marker-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/marker-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/marker-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark><Placemark><Style><IconStyle><Icon>\n' +
        '<href>http://api3.geo.admin.ch/color/255,0,0/marker2-24@2x.png</href></Icon></IconStyle></Style><Point><coordinates>170.1435558771009,-43.60505741890396,0</coordinates></Point></Placemark></kml>');
      });
    });

    describe('#sanitizeFeature()', function() {
      var fill = new ol.style.Fill({
        color: 'blue'
      });
      var stroke = new ol.style.Stroke({
        width: 3
      });
      var style = new ol.style.Style({
        fill: fill,
        stroke: stroke,
        text: new ol.style.Text({
          fill: fill,
          stroke: stroke
        }),
        image: new ol.style.Icon({
          src: 'foo.png'
        }),
        zIndex: 7
      });

      afterEach(function() {
        style.getImage().setScale(undefined);
      });

      it('set stroke to undefined if stroke\'s width = 0', function() {
        var f = new ol.Feature();
        f.setStyle([
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              width: 0
            })
          })
        ]);
        gaKml.sanitizeFeature(f);
        var s = f.getStyleFunction().call(f)[0];
        expect(s.getStroke()).to.be(null);
      });

      it('set the default vector style if the feature is a Point (or MultiPoint) and if we are offline', function() {
        gaNetworkStatus.offline = true;

        var fs = [
          new ol.geom.Point([0, 1]),
          new ol.geom.MultiPoint([[0, 1], [3.4]])
        ];
        fs.forEach(function(geom) {
          var f = new ol.Feature(geom);
          f.setStyle([style]);
          gaKml.sanitizeFeature(f);
          var s = f.getStyleFunction().call(f)[0];
          expect(s.getFill().getColor()).to.be('blue');
          expect(s.getStroke().getWidth()).to.be(3);
          expect(s.getImage()).to.be(gaKml.getStyle().getImage());
          expect(s.getText()).to.be(null);
          expect(s.getZIndex()).to.be(7);
        });
      });

      it('set a correct text style if the feature has a name and a text style', function() {
        var fs = [
          new ol.geom.Point([0, 1]),
          new ol.geom.MultiPoint([[0, 1], [3.4]])
        ];
        fs.forEach(function(geom) {
          var f = new ol.Feature(geom);
          f.set('name', 'foo');
          f.setStyle([style]);
          gaKml.sanitizeFeature(f);
          var s = f.getStyleFunction().call(f)[0];
          expect(s.getFill()).to.be(null);
          expect(s.getStroke()).to.be(null);
          expect(s.getImage().getSrc()).to.be('foo.png');
          expect(s.getText().getFont()).to.be(gaStyleFactory.FONT);
          expect(s.getText().getText()).to.be('foo');
          expect(s.getText().getFill().getColor()).to.be('blue');
          expect(s.getText().getStroke().getWidth()).to.be(3);
          expect(s.getText().getScale()).to.be(undefined);
          expect(s.getZIndex()).to.be(7);
        });
      });

      it('set a transparent circle as image if the feature has a name but a image style with scale = 0', function() {
        var fs = [
          new ol.geom.Point([0, 1]),
          new ol.geom.MultiPoint([[0, 1], [3.4]])
        ];
        fs.forEach(function(geom) {
          var f = new ol.Feature(geom);
          f.set('name', 'foo');
          style.getImage().setScale(0);
          f.setStyle([style]);
          gaKml.sanitizeFeature(f);
          var s = f.getStyleFunction().call(f)[0];
          expect(s.getFill()).to.be(null);
          expect(s.getStroke()).to.be(null);
          expect(s.getImage()).to.be(gaStyleFactory.getStyle('transparentCircle'));
          expect(s.getText().getFont()).to.be(gaStyleFactory.FONT);
          expect(s.getText().getText()).to.be('foo');
          expect(s.getText().getFill().getColor()).to.be('blue');
          expect(s.getText().getStroke().getWidth()).to.be(3);
          expect(s.getText().getScale()).to.be(undefined);
          expect(s.getZIndex()).to.be(7);
        });
      });

      it('set the type property if the feature has been drawn by draw tool', function() {
        var f = new ol.Feature();
        f.setId('foo_45546');
        f.setStyle(style);
        gaKml.sanitizeFeature(f);
        expect(f.get('type')).to.be('foo');

        f.set('type', undefined);
        f.setId('foo_3536_3637');
        gaKml.sanitizeFeature(f);
        expect(f.get('type')).to.be(undefined);

        f.setId('foo35363637');
        gaKml.sanitizeFeature(f);
        expect(f.get('type')).to.be(undefined);
      });

      it('set the measure style to measure feature', function() {
        sinon.stub(gaMapUtils, 'isMeasureFeature').returns(true);
        var spy = sinon.spy(gaStyleFactory, 'getFeatureStyleFunction');
        var f = new ol.Feature();
        f.setStyle(style);
        gaKml.sanitizeFeature(f);
        expect(f.get('type')).to.be('measure');
        expect(f.getStyle()).to.be.an(Function);
        expect(spy.calledOnce).to.be(true);
        spy.restore();
        gaMapUtils.isMeasureFeature.restore();
      });

      it('returns a style without image an text for line and polygon geometries', function() {
        var fs = [
          new ol.geom.LinearRing([[0, 1], [0, 2]]),
          new ol.geom.LineString([[0, 1], [0, 2]]),
          new ol.geom.MultiLineString([[[0, 1], [0, 2]], [[0, 1], [3.4]]]),
          new ol.geom.Polygon([[[0, 1], [0, 2]], [[0, 1], [3.4]]]),
          new ol.geom.MultiPolygon([
            [[[0, 1], [0, 2]], [[0, 1], [3.4]]],
            [[[0, 1], [0, 2]], [[0, 1], [3.4]]]
          ])
        ];
        fs.forEach(function(geom) {
          var f = new ol.Feature(geom);
          f.setStyle([style]);
          gaKml.sanitizeFeature(f);
          var s = f.getStyleFunction().call(f)[0];
          expect(s.getFill().getColor()).to.be('blue');
          expect(s.getStroke().getWidth()).to.be(3);
          expect(s.getImage()).to.be(null);
          expect(s.getText()).to.be(null);
          expect(s.getZIndex()).to.be(7);
        });
      });
    });

    describe('#getName()', function() {

      it('get the name to display in layer manager', function() {
        var kml = '<kml><Document> <name>Foo</name></Document></kml></Document';
        expect(gaKml.getName(kml)).to.be('Foo');
      });

      it('returns undefined if no name in the doc', function() {
        var kml = '<kml><Document> </Document></kml></Document';
        expect(gaKml.getName(kml)).to.be(undefined);
      });
    });

    describe('#getLinkedData()', function() {

      var createNetLink = function(href) {
        return '\n<NetworkLink><Link><href>' + href + '</href></Link></NetworkLink>';
      };

      it('returns a promise', function(done) {
        // WARNING: these urls are transformed like the urls in the test above.
        var hrefs = [
          'https://geo.admin.ch/test.php',
          'nonvalidurl.py',
          'https://geo.admin.ch/kml.py'
        ];
        var kml = '<kml>';
        hrefs.forEach(function(href) {
          kml += createNetLink(href);
        });
        kml += '</kml>';

        $httpBackend.whenGET(hrefs[0]).respond('<kml></kml>');
        $httpBackend.whenGET(hrefs[2]).respond('<kml></kml>');
        $httpBackend.expectGET(hrefs[0]);
        $httpBackend.expectGET(hrefs[2]);

        gaKml.getLinkedData(kml).then(function(response) {
          expect(response).to.be.an('array');
          expect(response.length).to.be(2);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });
  });
});
