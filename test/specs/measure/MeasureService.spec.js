describe('ga_measure_service', function() {
  var gaMeasure, measureFilter, polygon, lineString, linearRing, circle, point;
  beforeEach(function() {
    inject(function($injector) {
      gaMeasure = $injector.get('gaMeasure');
      measureFilter = $injector.get('measureFilter');
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
    point = new ol.geom.Point([0, 0]);;
  });

  describe('measure filter', function() {
    it('displays "-" when value is not a number', function() {
      expect(measureFilter(null)).to.eql('-');
      expect(measureFilter(undefined)).to.eql('-');
      expect(measureFilter('')).to.eql('-');
      expect(measureFilter('123')).to.eql('-');
      expect(measureFilter(+Infinity)).to.eql('-');    
      expect(measureFilter(-Infinity)).to.eql('-');    
      expect(measureFilter(NaN)).to.eql('-');    
    });
    it('displays a distance', function() {
      var num = 1234.5678; 
      expect(measureFilter(num)).to.eql('1.23 km');
      expect(measureFilter(num, 'distance')).to.eql('1.23 km');
      expect(measureFilter(num, 'distance', ' m')).to.eql('1234.57 m');
      expect(measureFilter(num, 'distance', [' m'])).to.eql('1234.57 m');
      expect(measureFilter(num, 'distance', [' m'], 1)).to.eql('1234.6 m');
      expect(measureFilter(1234.00, 'distance', ' m')).to.eql('1234 m');    
    });
    it('displays an area', function() {
      var num = 1234567.9428; 
      expect(measureFilter(num, 'area')).to.eql('1.23 km&sup2');
      expect(measureFilter(num, 'area', ' m&sup2')).to.eql('1234567.94 m&sup2');
      expect(measureFilter(num, 'area', [' m&sup2'])).to.eql('1234567.94 m&sup2');
      expect(measureFilter(num, 'area', [' m&sup2'], 1)).to.eql('1234567.9 m&sup2');
      expect(measureFilter(1234.00, 'area', ' m&sup2')).to.eql('1234 m&sup2');    
    });
    it('displays an angle', function() {
      var num = 240.1234; 
      expect(measureFilter(num, 'angle')).to.eql('240.12&deg');
      expect(measureFilter(num, 'angle', '&deg')).to.eql('240.12&deg');
      expect(measureFilter(num, 'angle', ['&deg'])).to.eql('240.12&deg');
      expect(measureFilter(num, 'angle', '&deg', 1)).to.eql('240.1&deg');
      expect(measureFilter(240.00, 'angle')).to.eql('240&deg');    
    });

  });
  describe('measure service', function() {
    it('tests getLength method', function() {
      expect(gaMeasure.getLength(lineString)).to.eql(3000);
      expect(gaMeasure.getLength(linearRing)).to.eql(4000);   
      expect(gaMeasure.getLength(polygon)).to.eql(4000);
      expect(gaMeasure.getLength(circle)).to.eql(6283.185307179586);
      expect(gaMeasure.getLength(point)).to.eql(0);   
    });
    it('tests getLengthLabel method', function() {
      expect(gaMeasure.getLengthLabel(lineString)).to.eql('3 km');
      expect(gaMeasure.getLengthLabel(linearRing)).to.eql('4 km');   
      expect(gaMeasure.getLengthLabel(polygon)).to.eql('4 km');
      expect(gaMeasure.getLengthLabel(circle)).to.eql('6.28 km');
      expect(gaMeasure.getLengthLabel(point)).to.eql('0 m');   
    });
    it('tests getArea method', function() {
      expect(gaMeasure.getArea(lineString)).to.eql(0);
      expect(gaMeasure.getArea(lineString, true)).to.eql(1000000);
      expect(gaMeasure.getArea(linearRing)).to.eql(1000000);   
      expect(gaMeasure.getArea(polygon)).to.eql(1000000);
      expect(gaMeasure.getArea(circle)).to.eql(3141592.653589793);
      expect(gaMeasure.getArea(point)).to.eql(0);   
    });
    it('tests getAreaLabel method', function() {
      expect(gaMeasure.getAreaLabel(lineString)).to.eql('0 m&sup2');
      expect(gaMeasure.getAreaLabel(lineString, true)).to.eql('1 km&sup2');
      expect(gaMeasure.getAreaLabel(linearRing)).to.eql('1 km&sup2');   
      expect(gaMeasure.getAreaLabel(polygon)).to.eql('1 km&sup2');
      expect(gaMeasure.getAreaLabel(circle)).to.eql('3.14 km&sup2');
      expect(gaMeasure.getAreaLabel(point)).to.eql('0 m&sup2');   
    });
    it('tests getAzimuth method', function() {
      expect(gaMeasure.getAzimuth(lineString)).to.eql(90);
      expect(gaMeasure.getAzimuth(linearRing)).to.eql(90);   
      expect(gaMeasure.getAzimuth(polygon)).to.eql(90);
      expect(gaMeasure.getAzimuth(circle)).to.eql(0);
      expect(gaMeasure.getAzimuth(point)).to.eql(0);   
    });
    it('tests getAzimuthLabel method', function() {
      expect(gaMeasure.getAzimuthLabel(lineString)).to.eql('90&deg');
      expect(gaMeasure.getAzimuthLabel(linearRing)).to.eql('90&deg');   
      expect(gaMeasure.getAzimuthLabel(polygon)).to.eql('90&deg');
      expect(gaMeasure.getAzimuthLabel(circle)).to.eql('0&deg');
      expect(gaMeasure.getAzimuthLabel(point)).to.eql('0&deg');   
    });

  });
});
