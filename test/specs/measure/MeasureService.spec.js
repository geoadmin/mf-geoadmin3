describe('ga_measure_service', function() {

  describe('gaMeasure', function() {
    var gaMeasure, polygon, lineString, linearRing, circle, point;

    beforeEach(function() {

      inject(function($injector) {
        gaMeasure = $injector.get('gaMeasure');
      });

      polygon = new ol.geom.Polygon([[
        [0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]
      ]]);

      linearRing = new ol.geom.LinearRing([
        [0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]
      ]);

      lineString = new ol.geom.LineString([
        [0, 0], [1000, 0], [1000, 1000], [0, 1000]
      ]);

      circle = new ol.geom.Circle([0, 0], 1000);

      point = new ol.geom.Point([0, 0]);
    });


   describe('#formatCoordinates(coordinates)', function() {
      it('returns formatted 2D coordinates', function() {
        expect(gaMeasure.formatCoordinates([2457749.999996144, 1056249.999834365])).to.eql("2'457'750, 1'056'250");
      });

      it('returns formatted 3D coordinates', function() {
        expect(gaMeasure.formatCoordinates([2457749.999996144, 1056249.999834365, 451.423])).to.eql("2'457'750, 1'056'250, 451.4");
      });
    });

   describe('#getLength()', function() {
      it('returns the length of a geometry', function() {
        expect(gaMeasure.getLength(lineString)).to.eql(3000);
        expect(gaMeasure.getLength(linearRing)).to.eql(4000);
        expect(gaMeasure.getLength(polygon)).to.eql(4000);
        expect(gaMeasure.getLength(circle)).to.eql(6283.185307179586);
        expect(gaMeasure.getLength(point)).to.eql(0);
      });
    });

    describe('#getLengthLabel()', function() {
      it('returns the length\'s label', function() {
        expect(gaMeasure.getLengthLabel(lineString)).to.eql('3 km');
        expect(gaMeasure.getLengthLabel(linearRing)).to.eql('4 km');
        expect(gaMeasure.getLengthLabel(polygon)).to.eql('4 km');
        expect(gaMeasure.getLengthLabel(circle)).to.eql('6.28 km');
        expect(gaMeasure.getLengthLabel(point)).to.eql('0 m');
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
      });
    });

    describe('#getAzimuth()', function() {
      it('returns the azimuth of a geometry', function() {
        expect(gaMeasure.getAzimuth(lineString)).to.eql(90);
        expect(gaMeasure.getAzimuth(linearRing)).to.eql(90);
        expect(gaMeasure.getAzimuth(polygon)).to.eql(90);
        expect(gaMeasure.getAzimuth(circle)).to.eql(0);
        expect(gaMeasure.getAzimuth(point)).to.eql(0);
      });
    });

    describe('#getAzimuthLabel()', function() {
      it('returns the azimuth\'s label', function() {
        expect(gaMeasure.getAzimuthLabel(lineString)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(linearRing)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(polygon)).to.eql('90&deg');
        expect(gaMeasure.getAzimuthLabel(circle)).to.eql('0&deg');
        expect(gaMeasure.getAzimuthLabel(point)).to.eql('0&deg');
      });
    });
  });
});
