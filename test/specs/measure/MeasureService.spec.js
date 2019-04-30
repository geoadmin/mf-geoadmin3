/* eslint-disable max-len */
describe('ga_measure_service', function() {

  describe('gaMeasure', function() {
    var gaMeasure, polygon, lineString, linearRing, circle, point, multiLineString,
      multiLineStringOne, multiLineStringConnected, geomColl, geomCollOne;

    beforeEach(function() {

      inject(function($injector) {
        gaMeasure = $injector.get('gaMeasure');
      });

      point = new ol.geom.Point([0, 0]);

      circle = new ol.geom.Circle([0, 0], 1000);

      polygon = new ol.geom.Polygon([[
        [0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]
      ]]);

      linearRing = new ol.geom.LinearRing([
        [0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]
      ]);

      lineString = new ol.geom.LineString([
        [0, 0], [1000, 0], [1000, 1000], [0, 1000]
      ]);

      multiLineString = new ol.geom.MultiLineString([
        [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
        [[1, 0], [1000, 0], [1000, 1000], [0, 1000]]
      ]);

      multiLineStringOne = new ol.geom.MultiLineString([
        [[0, 0], [1000, 0], [1000, 1000], [0, 1000]]
      ]);

      multiLineStringConnected = new ol.geom.MultiLineString([
        [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
        [[0, 1000], [2000, 0], [2000, 2000], [0, 2000]],
        [[0, 2000], [3000, 0], [3000, 3000], [0, 3000]]
      ]);

      geomColl = new ol.geom.GeometryCollection([lineString, circle]);

      geomCollOne = new ol.geom.GeometryCollection([lineString]);
    });

    describe('#formatCoordinates(coordinates)', function() {
      it('returns formatted 2D coordinates', function() {
        expect(gaMeasure.formatCoordinates([2457749.999996144, 1056249.999834365])).to.eql("2'457'750, 1'056'250");
      });

      it('returns formatted 3D coordinates', function() {
        expect(gaMeasure.formatCoordinates([2457749.999996144, 1056249.999834365, 451.423])).to.eql("2'457'750, 1'056'250, 451.4");
      });

      it('returns correct precision', function() {
        expect(gaMeasure.formatCoordinates([2457749.999996144, 1056249.999834365], 0)).to.eql("2'457'750, 1'056'250");
        expect(gaMeasure.formatCoordinates([2457749.899996144, 1056249.899834365], 1)).to.eql("2'457'749.9, 1'056'249.9");
        expect(gaMeasure.formatCoordinates([2457749.899996144, 1056249.899834365], 3)).to.eql("2'457'749.900, 1'056'249.900");
      });

    });

    describe('#getLength()', function() {
      it('returns the length of a geometry', function() {
        expect(gaMeasure.getLength(lineString)).to.eql(3000);
        expect(gaMeasure.getLength(linearRing)).to.eql(4000);
        expect(gaMeasure.getLength(polygon)).to.eql(4000);
        expect(gaMeasure.getLength(circle)).to.eql(6283.185307179586);
        expect(gaMeasure.getLength(point)).to.eql(0);
        expect(gaMeasure.getLength(multiLineString)).to.eql(0);
        expect(gaMeasure.getLength(multiLineStringOne)).to.eql(3000);
        expect(gaMeasure.getLength(multiLineStringConnected)).to.eql(18841.619252963777);
        expect(gaMeasure.getLength(geomColl)).to.eql(0);
        expect(gaMeasure.getLength(geomCollOne)).to.eql(3000);
      });
    });

    describe('#getLengthLabel()', function() {
      it('returns the length\'s label', function() {
        expect(gaMeasure.getLengthLabel(lineString)).to.eql('3 km');
        expect(gaMeasure.getLengthLabel(linearRing)).to.eql('4 km');
        expect(gaMeasure.getLengthLabel(polygon)).to.eql('4 km');
        expect(gaMeasure.getLengthLabel(circle)).to.eql('6.28 km');
        expect(gaMeasure.getLengthLabel(point)).to.eql('0 m');
        expect(gaMeasure.getLengthLabel(multiLineString)).to.eql('0 m');
        expect(gaMeasure.getLengthLabel(multiLineStringOne)).to.eql('3 km');
        expect(gaMeasure.getLengthLabel(multiLineStringConnected)).to.eql('18.84 km');
        expect(gaMeasure.getLengthLabel(geomColl)).to.eql('0 m');
        expect(gaMeasure.getLengthLabel(geomCollOne)).to.eql('3 km');
      });
    });

    describe('#getArea()', function() {
      it('returns the area of geometry', function() {
        expect(gaMeasure.getArea(lineString)).to.eql(0);
        expect(gaMeasure.getArea(lineString, true)).to.eql(1000000);
        expect(gaMeasure.getArea(linearRing)).to.eql(1000000);
        expect(gaMeasure.getArea(polygon)).to.eql(1000000);
        expect(gaMeasure.getArea(circle)).to.eql(3141592.653589793);
        expect(gaMeasure.getArea(point)).to.eql(0);
        expect(gaMeasure.getArea(multiLineString)).to.eql(0);
        expect(gaMeasure.getArea(multiLineString, true)).to.eql(0);
        expect(gaMeasure.getArea(multiLineStringOne)).to.eql(0);
        expect(gaMeasure.getArea(multiLineStringOne, true)).to.eql(1000000);
        expect(gaMeasure.getArea(multiLineStringConnected)).to.eql(0);
        expect(gaMeasure.getArea(multiLineStringConnected, true)).to.eql(10000000);
        expect(gaMeasure.getArea(geomColl)).to.eql(0);
        expect(gaMeasure.getArea(geomCollOne)).to.eql(0);
        expect(gaMeasure.getArea(geomCollOne, true)).to.eql(1000000);
      });
    });

    describe('#getAreaLabel()', function() {
      it('returns the area\'s label', function() {
        expect(gaMeasure.getAreaLabel(lineString)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(lineString, true)).to.eql('1 km&sup2');
        expect(gaMeasure.getAreaLabel(linearRing)).to.eql('1 km&sup2');
        expect(gaMeasure.getAreaLabel(polygon)).to.eql('1 km&sup2');
        expect(gaMeasure.getAreaLabel(circle)).to.eql('3.14 km&sup2');
        expect(gaMeasure.getAreaLabel(point)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(multiLineString)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(multiLineString, true)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(multiLineStringOne)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(multiLineStringOne, true)).to.eql('1 km&sup2');
        expect(gaMeasure.getAreaLabel(multiLineStringConnected)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(multiLineStringConnected, true)).to.eql('10 km&sup2');
        expect(gaMeasure.getAreaLabel(geomColl)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(geomCollOne)).to.eql('0 m&sup2');
        expect(gaMeasure.getAreaLabel(geomCollOne, true)).to.eql('1 km&sup2');
      });
    });

    describe('#getAzimuth()', function() {
      it('returns the azimuth of a geometry', function() {
        expect(gaMeasure.getAzimuth(lineString)).to.eql(90);
        expect(gaMeasure.getAzimuth(linearRing)).to.eql(90);
        expect(gaMeasure.getAzimuth(polygon)).to.eql(90);
        expect(gaMeasure.getAzimuth(circle)).to.eql(0);
        expect(gaMeasure.getAzimuth(point)).to.eql(0);
        expect(gaMeasure.getAzimuth(multiLineString)).to.eql(0);
        expect(gaMeasure.getAzimuth(multiLineStringOne)).to.eql(90);
        expect(gaMeasure.getAzimuth(multiLineStringConnected)).to.eql(90);
        expect(gaMeasure.getAzimuth(geomColl)).to.eql(0);
        expect(gaMeasure.getAzimuth(geomCollOne)).to.eql(90);
      });
    });

    describe('#getAzimuthLabel()', function() {
      it('returns the azimuth\'s label', function() {
        expect(gaMeasure.getAzimuthLabel(lineString)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(linearRing)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(polygon)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(circle)).to.eql('0&deg');
        expect(gaMeasure.getAzimuthLabel(point)).to.eql('0&deg');
        expect(gaMeasure.getAzimuthLabel(multiLineString)).to.eql('0&deg');
        expect(gaMeasure.getAzimuthLabel(multiLineStringOne)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(multiLineStringConnected)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(geomColl)).to.eql('0&deg');
        expect(gaMeasure.getAzimuthLabel(geomCollOne)).to.eql('90&deg');
      });
    });

    describe('#createOverlay()', function() {
      var spy;

      beforeEach(function() {
        spy = sinon.spy(ol, 'Overlay');
      });

      afterEach(function() {
        spy.restore();
      });

      it('creates an ol.Overlay object', function() {
        var ov = gaMeasure.createOverlay();
        expect(ov).to.be.an(ol.Overlay);
        expect(ov.getElement().nodeName).to.be('DIV');
        expect(ov.getElement().className).to.be('ga-draw-measure-static');
        expect(ov.getPositioning()).to.be('bottom-center');
        expect(spy.args[0][0].stopEvent).to.be(true);
      });

      it('creates an ol.Overlay object with a custom cssClass', function() {
        var ov = gaMeasure.createOverlay('custom');
        expect(ov).to.be.an(ol.Overlay);
        expect(ov.getElement().nodeName).to.be('DIV');
        expect(ov.getElement().className).to.be('custom');
        expect(ov.getPositioning()).to.be('bottom-center');
        expect(spy.args[0][0].stopEvent).to.be(true);
      });

      it('creates an ol.Overlay object with stopEvent = false', function() {
        var ov = gaMeasure.createOverlay('custom', false);
        expect(ov).to.be.an(ol.Overlay);
        expect(ov.getElement().nodeName).to.be('DIV');
        expect(ov.getElement().className).to.be('custom');
        expect(ov.getPositioning()).to.be('bottom-center');
        expect(spy.args[0][0].stopEvent).to.be(false);
      });
    });

    describe('#updateOverlays()', function() {

      it('does nothing if the feature has no overlays', function() {
        var layer = new ol.layer.Tile({});
        var feat = new ol.Feature();
        gaMeasure.updateOverlays(layer, feat);
        expect(feat.get('overlays')).to.be(undefined);
      });

      describe('for a polygon', function() {
        var feat, layer = new ol.layer.Tile({});
        var coords = [
          [3, 15],
          [2, 17],
          [1, 13],
          [1.5, 1],
          [7, 10]
        ];
        var coordsClosed = coords.concat();
        coordsClosed.push([3, 15]);
        var poly = new ol.geom.Polygon([coordsClosed]);

        beforeEach(function() {
          layer.setOpacity(1);
          feat = new ol.Feature();
          feat.set('overlays', new ol.Collection());
        });

        it('displays an overlay representing the area', function() {
          feat.setGeometry(poly);
          gaMeasure.updateOverlays(layer, feat);
          var ovs = feat.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          var ovArea = feat.get('overlays').item(0);
          expect(ovArea.getElement().innerHTML.indexOf('47.25 m')).to.be(0);
          expect(ovArea.getElement().style.opacity).to.eql(1);
          expect(ovArea.getPosition()).to.eql([3.777777777777778, 9, 5.222222222222222]);
        });

        it('set position to undefined if area is 0', function() {
          var coords = [[[0, 1000], [1, 1000], [2, 1000], [3, 1000],
            [0, 1000]]];
          feat.setGeometry(new ol.geom.Polygon(coords));
          gaMeasure.updateOverlays(layer, feat);
          var ovs = feat.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.item(0).getPosition()).to.be(undefined);
        });

        it('use the existing overlay if it exists', function() {
          var spy = sinon.spy(gaMeasure, 'createOverlay');
          feat.setGeometry(poly);
          gaMeasure.updateOverlays(layer, feat);
          expect(spy.calledTwice).to.be(true);
          spy.resetHistory();
          gaMeasure.updateOverlays(layer, feat);
          expect(spy.callCount).to.be(0);
        });
      });

      describe('for a line or a polygon', function() {
        var featLine, featPoly, layer = new ol.layer.Tile({});

        beforeEach(function() {
          layer.setOpacity(1);
          featLine = new ol.Feature();
          featLine.set('overlays', new ol.Collection());
          featPoly = new ol.Feature();
          featPoly.set('overlays', new ol.Collection());
        });

        it('set position to undefined if length is 0', function() {
          var coords = [[0, 0], [0, 0]];
          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);
          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.item(0).getPosition()).to.be(undefined);
        });

        it('update distance overlays', function() {
          var coords = [
            [3, 15],
            [2, 17],
            [1, 13],
            [1.5, 1],
            [7, 10]
          ];
          var coordsClosed = coords.concat();
          coordsClosed.push([3, 15]);

          featLine.setGeometry(new ol.geom.LineString(coords));
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));

          // Line
          gaMeasure.updateOverlays(layer, featLine);
          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(1);
          var ov = featLine.get('overlays').item(0);
          expect(ov.getElement().innerHTML).to.be('28.92 m');
          expect(ov.getElement().style.opacity).to.eql(1);
          expect(ov.getPosition()).to.eql([7, 10]);

          // Polygon
          gaMeasure.updateOverlays(layer, featPoly);
          ovs = featPoly.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(2);
          ov = featPoly.get('overlays').item(1);
          expect(ov.getElement().innerHTML).to.be('35.32 m');
          expect(ov.getElement().style.opacity).to.eql(1);
          expect(ov.getPosition()).to.eql([3, 15]);
        });

        it('displays azimuth if there is only 2 points', function() {
          var coords = [
            [3, 15],
            [2, 17]
          ];
          var coordsClosed = coords.concat();
          coordsClosed.push([3, 15]);

          featLine.setGeometry(new ol.geom.LineString(coords));
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));

          // Line
          gaMeasure.updateOverlays(layer, featLine);
          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(1);
          var ov = featLine.get('overlays').item(0);
          // Only to avoid to set a weird character which break the vim display
          var text = ov.getElement().innerHTML;
          expect(/^333.43/.test(text)).to.be(true);
          expect(/ \/ 2\.24 m$/.test(text)).to.be(true);
          expect(ov.getElement().style.opacity).to.eql(1);
          expect(ov.getPosition()).to.eql([2, 17]);

          // Polygon (no azimuth)
          gaMeasure.updateOverlays(layer, featPoly);
          ovs = featPoly.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(2);
          ov = featPoly.get('overlays').item(1);
          expect(ov.getElement().innerHTML).to.be('4.47 m');
          expect(ov.getElement().style.opacity).to.eql(1);
          expect(ov.getPosition()).to.eql([3, 15]);
        });

        it('displays overlays every km', function() {
          // Line
          var coords = [
            [0, 1000],
            [999, 1000],
            [2200, 1000]
          ];

          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);

          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(3);

          var ov = ovs.item(0);
          expect(ov.getElement().innerHTML).to.be('2.20 km');
          expect(ov.getPosition()).to.eql([2200, 1000]);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('1 km');
          expect(ov.getPosition()).to.eql([1000, 1000]);

          ov = ovs.item(2);
          expect(ov.getElement().innerHTML).to.be('2 km');
          expect(ov.getPosition()).to.eql([2000, 1000]);

          // Polygon
          var coordsClosed = coords.concat([[1, 1000], [0, 1000]]);
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));
          gaMeasure.updateOverlays(layer, featPoly);

          ovs = featPoly.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(6);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('4.40 km');
          expect(ov.getPosition()).to.eql([0, 1000]);

          ov = ovs.item(3);
          expect(ov.getElement().innerHTML).to.be('2 km');
          expect(ov.getPosition()).to.eql([2000, 1000]);

          ov = ovs.item(5);
          expect(ov.getElement().innerHTML).to.be('4 km');
          expect(ov.getPosition()).to.eql([400, 1000]);
        });

        it('displays overlays every 10km (length >= 20km)', function() {
          // Line
          var coords = [
            [0, 1000],
            [999, 1000],
            [25000, 1000]
          ];

          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);

          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(3);

          var ov = ovs.item(0);
          expect(ov.getElement().innerHTML).to.be('25 km');
          expect(ov.getPosition()).to.eql([25000, 1000]);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('10 km');
          expect(ov.getPosition()).to.eql([10000, 1000]);

          ov = ovs.item(2);
          expect(ov.getElement().innerHTML).to.be('20 km');
          expect(ov.getPosition()).to.eql([20000, 1000]);

          // Polygon
          var coordsClosed = coords.concat([[1, 1000], [0, 1000]]);
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));
          gaMeasure.updateOverlays(layer, featPoly);

          ovs = featPoly.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(6);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('50 km');
          expect(ov.getPosition()).to.eql([0, 1000]);

          ov = ovs.item(3);
          expect(ov.getElement().innerHTML).to.be('20 km');
          expect(ov.getPosition()).to.eql([20000, 1000]);

          ov = ovs.item(5);
          expect(ov.getElement().innerHTML).to.be('40 km');
          expect(ov.getPosition()).to.eql([10000, 1000]);
        });

        it('displays overlays every 100km (length >= 200km)', function() {
          // Line
          var coords = [
            [0, 1000],
            [999, 1000],
            [250000, 1000]
          ];

          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);

          var ovs = featLine.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(3);

          var ov = ovs.item(0);
          expect(ov.getElement().innerHTML).to.be('250 km');
          expect(ov.getPosition()).to.eql([250000, 1000]);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('100 km');
          expect(ov.getPosition()).to.eql([100000, 1000]);

          ov = ovs.item(2);
          expect(ov.getElement().innerHTML).to.be('200 km');
          expect(ov.getPosition()).to.eql([200000, 1000]);

          // Polygon
          var coordsClosed = coords.concat([[1, 1000], [0, 1000]]);
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));
          gaMeasure.updateOverlays(layer, featPoly);

          ovs = featPoly.get('overlays');
          expect(ovs).to.be.an(ol.Collection);
          expect(ovs.getLength()).to.be(6);

          ov = ovs.item(1);
          expect(ov.getElement().innerHTML).to.be('500 km');
          expect(ov.getPosition()).to.eql([0, 1000]);

          ov = ovs.item(3);
          expect(ov.getElement().innerHTML).to.be('200 km');
          expect(ov.getPosition()).to.eql([200000, 1000]);

          ov = ovs.item(5);
          expect(ov.getElement().innerHTML).to.be('400 km');
          expect(ov.getPosition()).to.eql([100000, 1000]);
        });

        it('uses the default opacity of the layer', function() {
          // Line
          var coords = [
            [0, 1000],
            [999, 1000],
            [250000, 1000]
          ];

          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);
          featLine.get('overlays').forEach(function(ov) {
            expect(ov.getElement().style.opacity).to.eql(1);
          });

          // Polygon
          var coordsClosed = coords.concat([[1, 1000], [0, 1000]]);
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));
          gaMeasure.updateOverlays(layer, featPoly);

          featLine.get('overlays').forEach(function(ov) {
            expect(ov.getElement().style.opacity).to.eql(1);
          });
        });

        it('uses the opacity of the layer', function() {
          layer.setOpacity(0.2);

          // Line
          var coords = [
            [0, 1000],
            [999, 1000],
            [250000, 1000]
          ];

          featLine.setGeometry(new ol.geom.LineString(coords));
          gaMeasure.updateOverlays(layer, featLine);
          featLine.get('overlays').forEach(function(ov) {
            expect(ov.getElement().style.opacity).to.eql(0.2);
          });

          // Polygon
          var coordsClosed = coords.concat([[1, 1000], [0, 1000]]);
          featPoly.setGeometry(new ol.geom.Polygon([coordsClosed]));
          gaMeasure.updateOverlays(layer, featPoly);

          featLine.get('overlays').forEach(function(ov) {
            expect(ov.getElement().style.opacity).to.eql(0.2);
          });
        });
      });
    });

    describe('#addOverlays()', function() {
      var c = [0, 0];
      var stubUp, stubAdd, stubRm, map = new ol.Map({}), layer = new ol.layer.Tile({}),
        feat = new ol.Feature();
      var goodGeoms = [
        new ol.geom.LineString([c]),
        new ol.geom.Polygon([[c, c]])
      ];

      beforeEach(function() {
        stubUp = sinon.stub(gaMeasure, 'updateOverlays');
        stubAdd = sinon.stub(map, 'addOverlay');
        stubRm = sinon.stub(map, 'removeOverlay');
      });

      afterEach(function() {
        stubUp.restore();
        stubAdd.restore();
        stubRm.restore();
      });

      it('does nothing if the feature is not a lineString or a polygon', function() {
        [
          new ol.geom.Point(c),
          new ol.geom.LinearRing([c]),
          new ol.geom.MultiPoint([c, c]),
          new ol.geom.MultiLineString([[c], [c]]),
          new ol.geom.MultiPolygon([[[c]], [[c]]]),
          new ol.geom.GeometryCollection(),
          new ol.geom.Circle([3, 3], 5)
        ].forEach(function(geom) {
          feat.setGeometry(geom);
          gaMeasure.addOverlays(map, layer, feat);
          expect(stubUp.callCount).to.be(0);
        });
      });

      goodGeoms.forEach(function(geom) {

        it('creates a new collection of overlays', function() {
          feat.setGeometry(geom);
          gaMeasure.addOverlays(map, layer, feat);
          expect(feat.get('overlays')).to.be.an(ol.Collection);
          expect(stubUp.callCount).to.be(1);
          expect(stubUp.calledWithExactly(layer, feat)).to.be(true);
        });

        it('adds/removes automatically an overlay to the map when it\'s added to the collection', function() {
          feat.setGeometry(geom);
          gaMeasure.addOverlays(map, layer, feat);
          expect(feat.get('overlays')).to.be.an(ol.Collection);
          expect(stubUp.callCount).to.be(1);
          var ov1 = new ol.Overlay({});

          // Add
          feat.get('overlays').push(ov1);
          expect(stubAdd.callCount).to.be(1);
          expect(stubAdd.calledWithExactly(ov1)).to.be(true);
          expect(stubUp.callCount).to.be(1);

          // Remove
          feat.get('overlays').pop();
          expect(stubRm.callCount).to.be(1);
          expect(stubRm.calledWithExactly(ov1)).to.be(true);
          expect(stubUp.callCount).to.be(1);
        });

        it('updates overlays on each feature change event', function() {
          feat.setGeometry(geom);
          gaMeasure.addOverlays(map, layer, feat);
          expect(feat.get('overlays')).to.be.an(ol.Collection);
          expect(stubUp.callCount).to.be(1);
          expect(stubUp.calledWithExactly(layer, feat)).to.be(true);

          // TOFIX: Change
          // The updateOverlays method is well called on change event but the
          // stub doesn't see it.
          // feat.setGeometry(new ol.geom.LineString([[0, 0]]));
          // expect(stubUp.callCount).to.be(2);
          // expect(stubUp.getCall(1).calledWithExactly(layer, feat)).to.be(true);
        });
      });
    });

    describe('#removeOverlays()', function() {
      var spy, ovs, feat1 = new ol.Feature(),
        feat2 = new ol.Feature();

      beforeEach(function() {
        ovs = new ol.Collection();
        feat1.set('overlays', ovs);
        spy = sinon.spy(ovs, 'clear');
      });

      afterEach(function() {
        spy.resetHistory();
      });

      it('does nothing', function() {
        gaMeasure.removeOverlays(feat2);
        expect(spy.callCount).to.be(0);
      });

      it('clears the collection', function() {
        gaMeasure.removeOverlays(feat1);
        expect(spy.calledOnce).to.be(true);
      });
    });

    describe('#canShowAzimuthCircle()', function() {
      var c = [3, 3];

      describe('returns false', function() {

        it('if the geometry is not a LineString', function() {
          [
            new ol.geom.Point(c),
            new ol.geom.LinearRing([c]),
            new ol.geom.Polygon([[c]]),
            new ol.geom.MultiPoint([c, c]),
            new ol.geom.MultiLineString([[c], [c]]),
            new ol.geom.MultiPolygon([[[c]], [[c]]]),
            new ol.geom.GeometryCollection(),
            new ol.geom.Circle([3, 3], 5)
          ].forEach(function(geom) {
            expect(gaMeasure.canShowAzimuthCircle(geom)).to.be(false);
          });
        });

        it('if the lineString contains only one coordinate', function() {
          var geom = new ol.geom.LineString([c]);
          expect(gaMeasure.canShowAzimuthCircle(geom)).to.be(false);
        });

        it('if the lineString contains 3 coordinates', function() {
          var geom = new ol.geom.LineString([c, c, [2, 2]]);
          expect(gaMeasure.canShowAzimuthCircle(geom)).to.be(false);
        });
      });

      describe('returns true', function() {

        it('if the linestring contains 2 coordinates', function() {
          var geom = new ol.geom.LineString([c, c]);
          expect(gaMeasure.canShowAzimuthCircle(geom)).to.be(true);
        });

        it('if the linestring contains 3 coordinates but the 2 last coordinates are equal', function() {
          var geom = new ol.geom.LineString([c, c, c]);
          expect(gaMeasure.canShowAzimuthCircle(geom)).to.be(true);
        });
      });
    });

    describe('#registerOverlaysEvents()', function() {
      var map, layer, stubRm, stubAdd,
        elt = document.createElement('div'),
        eltOv1 = document.createElement('div'),
        eltOv2 = document.createElement('div'),
        ov1 = new ol.Overlay({element: eltOv1}),
        ov2 = new ol.Overlay({element: eltOv2}),
        feat1 = new ol.Feature(),
        feat2 = new ol.Feature(),
        featMeas1 = new ol.Feature({id: 'measure_1'}),
        featMeas2 = new ol.Feature({id: 'measure_2'});

      feat1.set('overlays', 'lala');
      feat2.set('overlays', 'lala');
      featMeas1.setId('measure_1');
      featMeas2.set('type', 'measure');

      var layerImg = new ol.layer.Image({});

      beforeEach(function() {
        stubRm = sinon.stub(gaMeasure, 'removeOverlays');
        stubAdd = sinon.stub(gaMeasure, 'addOverlays');
        layer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [feat1, feat2]
          })
        });
        document.body.appendChild(elt);
        document.body.appendChild(eltOv1);
        document.body.appendChild(eltOv2);

        map = new ol.Map({target: elt});
      });

      afterEach(function() {
        document.body.removeChild(elt);
        document.body.removeChild(eltOv1);
        document.body.removeChild(eltOv2);
      });

      it('does nothing if the layer is not an ol.layer.Vector', function() {
        map.addLayer(layerImg);
        gaMeasure.registerOverlaysEvents(map, layer);
        map.removeLayer(layer);
        expect(stubRm.called).to.be(false);
      });

      describe('add/removes overlays when the layer is added/removed', function() {

        it('does nothing when the layer is not displayed in layers manager', function() {
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          layer.setVisible(false);
          expect(stubRm.called).to.be(false);
        });

        it('does nothing if features are not measure features', function() {
          layer.displayInLayerManager = true;
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          layer.setVisible(false);
          expect(stubRm.called).to.be(false);
        });

        it('works', function() {
          layer.displayInLayerManager = true;
          layer.getSource().addFeatures([featMeas1, featMeas2]);
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          expect(stubRm.called).to.be(false);

          map.getLayers().pop();
          expect(stubRm.calledTwice).to.be(true);
          expect(stubRm.args[0][0]).to.be(featMeas1);
          expect(stubRm.args[1][0]).to.be(featMeas2);

          map.getLayers().insertAt(0, layer);
          expect(stubAdd.calledTwice).to.be(true);
          expect(stubAdd.getCall(0).calledWithExactly(map, layer, featMeas1)).to.be(true);
          expect(stubAdd.getCall(1).calledWithExactly(map, layer, featMeas2)).to.be(true);
        });
      });

      describe('add/removes overlays on visibility changes', function() {

        it('does nothing when the layer is not displayed in layers manager', function() {
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          layer.setVisible(false);
          expect(stubRm.called).to.be(false);
        });

        it('does nothing if features are not measure features', function() {
          layer.displayInLayerManager = true;
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          layer.setVisible(false);
          expect(stubRm.called).to.be(false);
        });

        it('works', function() {
          layer.displayInLayerManager = true;
          layer.getSource().addFeatures([featMeas1, featMeas2]);
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          expect(stubRm.called).to.be(false);

          layer.setVisible(false);
          expect(stubRm.calledTwice).to.be(true);
          expect(stubRm.args[0][0]).to.be(featMeas1);
          expect(stubRm.args[1][0]).to.be(featMeas2);

          layer.setVisible(true);
          expect(stubAdd.calledTwice).to.be(true);
          expect(stubAdd.getCall(0).calledWithExactly(map, layer, featMeas1)).to.be(true);
          expect(stubAdd.getCall(1).calledWithExactly(map, layer, featMeas2)).to.be(true);
        });
      });

      describe('changes overlays\'s style on opacity changes', function() {

        it('does nothing when the layer is not displayed in layers manager', function() {
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          var spy = sinon.spy(layer.getSource(), 'forEachFeature');
          layer.setOpacity(0.3);
          expect(spy.called).to.be(false);
        });

        it('works only if the feature is a measure feature and has overlays', function() {
          layer.displayInLayerManager = true;
          featMeas1.set('overlays', [ov1, ov2]);
          layer.getSource().addFeatures([featMeas1, featMeas2]);
          map.addLayer(layer);
          gaMeasure.registerOverlaysEvents(map, layer);
          layer.setOpacity(0.4);
          expect(ov1.getElement().style.opacity).to.eql(0.4);
          expect(ov1.getElement().style.opacity).to.eql(0.4);
        });
      });
    });
  });
});
