describe('ga_geometry_service', function() {
  var gaGeom, point, line, poly1, poly2, coll1, coll2;

  beforeEach(function() {
    inject(function($injector) {
      gaGeom = $injector.get('gaGeom');
      var outer1 = [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]],
          outer2 = [[30, 8], [9, 23], [9, 21], [8, 27], [8, 8]],
          inner1 = [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]],
          inner2 = [[8, 8], [9, 8], [9, 9], [8, 9], [8, 8]];
      point = new ol.geom.Point([10, 20]);
      line = new ol.geom.LineString([[10, 20], [30, 40]]);
      poly1 = new ol.geom.Polygon([outer1, inner1]);
      poly2 = new ol.geom.Polygon([outer2, inner2]);
      coll1 = new ol.geom.GeometryCollection([point, line, poly2]);
      coll2 = new ol.geom.GeometryCollection([coll1, poly2]);
    });
  });
  
  describe('gets centroid of', function() {
  
    it('a SimpleGeometry (Point, Line, Polygon)', function() {
      var centroid = gaGeom.centroid(point);
      expect(centroid).to.be.an(ol.geom.Point);
      expect(centroid.getCoordinates()).to.be.eql([10, 20]);
      
      centroid = gaGeom.centroid(line);
      expect(centroid).to.be.an(ol.geom.Point);
      expect(centroid.getCoordinates()).to.be.eql([20, 30]);

      centroid = gaGeom.centroid(poly1);
      expect(centroid).to.be.an(ol.geom.Point);
      expect(centroid.getCoordinates()).to.be.eql([2.7, 2.7]);

    });

    it('a GeometryCollection', function() {
      var centroid = gaGeom.centroid(coll1);
      expect(centroid).to.be.an(ol.geom.Point);
      expect(centroid.getCoordinates()).to.be.eql([12, 16.076923076923077]);

      centroid = gaGeom.centroid(coll2);
      expect(centroid).to.be.an(ol.geom.Point);
      expect(centroid.getCoordinates()).to.be.eql([11.391304347826088, 14.695652173913043]);
    });

  });
});

