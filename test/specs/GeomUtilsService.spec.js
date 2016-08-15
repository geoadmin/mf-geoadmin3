describe('ga_geomutils_service', function() {
  var gaGeomUtils;

  beforeEach(function() {
    inject(function($injector) {
      gaGeomUtils = $injector.get('gaGeomUtils');
    });
  });

  describe('hasUniqueCoords', function() {
    var c = [1.1, 2.2, 3.3];

    it('returns true', function() {
      expect(gaGeomUtils.hasUniqueCoord([c, c, c])).to.eql(true);
    });

    it('returns false', function() {
      expect(gaGeomUtils.hasUniqueCoord([[1.2, 2.2, 3.3], c, c])).to.eql(false);
      expect(gaGeomUtils.hasUniqueCoord([c, [1.1, 2.3, 3.3], c])).to.eql(false);
      expect(gaGeomUtils.hasUniqueCoord([c, c, [1.1, 2.2, 3.4]])).to.eql(false);
    });
  });

  describe('close', function() {
    var unclosedCoords = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ];

    it('leaves unclosable geometry intact', function() {

      // Point
      var geom = new ol.geom.Point([0, 0, 0]);
      var coords = geom.getCoordinates();
      expect(coords.length).to.be(3);
      gaGeomUtils.close(geom);
      var coords = geom.getCoordinates();
      expect(coords.length).to.be(3);

      // LineString
      geom = new ol.geom.LineString(unclosedCoords);
      gaGeomUtils.close(geom);
      coords = geom.getCoordinates();
      expect(coords.length).to.be(4);
      expect(coords[0]).not.to.eql(coords[coords[0].length - 1]);

      // MultiPoint
      geom = new ol.geom.MultiPoint(unclosedCoords);
      gaGeomUtils.close(geom);
      coords = geom.getCoordinates();
      expect(coords.length).to.be(4);
      expect(coords[0]).not.to.eql(coords[coords[0].length - 1]);

      // MultiLineString
      var geom = new ol.geom.MultiLineString([unclosedCoords, unclosedCoords]);
      gaGeomUtils.close(geom);
      coords = geom.getCoordinates();
      expect(coords[0][0]).not.to.eql(coords[0][coords[0].length - 1]);
      expect(coords[1][0]).not.to.eql(coords[1][coords[1].length - 1]);
    });

    it('closes geometry', function() {

      // LinearRing
      var unclosedLinearRing = new ol.geom.LinearRing(unclosedCoords);
      gaGeomUtils.close(unclosedLinearRing);
      var coords = unclosedLinearRing.getCoordinates();
      expect(coords[0]).to.eql(coords[coords.length - 1]);

      // Polygon
      var unclosedPolygon = new ol.geom.Polygon([unclosedCoords, unclosedCoords]);
      gaGeomUtils.close(unclosedPolygon);
      coords = unclosedPolygon.getCoordinates();
      expect(coords[0][0]).to.eql(coords[0][coords[0].length - 1]);
      expect(coords[1][0]).to.eql(coords[1][coords[1].length - 1]);

      // MultiPolygon
      var unclosedMultiPolygon = new ol.geom.MultiPolygon([
        [unclosedCoords, unclosedCoords],
        [unclosedCoords, unclosedCoords]
      ]);
      gaGeomUtils.close(unclosedMultiPolygon);
      coords = unclosedMultiPolygon.getCoordinates();
      expect(coords[0][0][0]).to.eql(coords[0][0][coords[0][0].length - 1]);
      expect(coords[0][1][0]).to.eql(coords[0][1][coords[0][1].length - 1]);
      expect(coords[1][0][0]).to.eql(coords[1][0][coords[1][0].length - 1]);
      expect(coords[1][1][0]).to.eql(coords[1][1][coords[1][1].length - 1]);

      // GeometryCollection
      var unclosedGeomColl = new ol.geom.GeometryCollection([
        new ol.geom.Polygon([unclosedCoords, unclosedCoords]),
        new ol.geom.Point([0, 0])
      ]);
      gaGeomUtils.close(unclosedGeomColl);
      coords = unclosedGeomColl.getGeometries()[0].getCoordinates();
      expect(coords[0][0]).to.eql(coords[0][coords[0].length - 1]);
      expect(coords[1][0]).to.eql(coords[1][coords[1].length - 1]);
      // we verify the point is still there
      coords = unclosedGeomColl.getGeometries()[1].getCoordinates();
      expect(coords).to.eql([0, 0]);
    });
  });

  describe('isValid', function() {
    var uniqCoords = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    it('returns false no geom defined', function() {
      expect(gaGeomUtils.isValid()).to.be(false);
    });

    it('detects points geometries as valid', function() {
      // Point
      var geom = new ol.geom.Point([0, 0]);
      expect(gaGeomUtils.isValid(geom)).to.be(true);

      // MultiPoint
      geom = new ol.geom.MultiPoint(uniqCoords);
      expect(gaGeomUtils.isValid(geom)).to.be(true);
    });

    it('detects geometries with unique coords as unvalid', function() {
      var uniqCoords = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];

      // LineString
      var geom = new ol.geom.LinearRing(uniqCoords);
      expect(gaGeomUtils.isValid(geom)).to.be(false);

      // LinearRing
      var geom = new ol.geom.LineString(uniqCoords);
      expect(gaGeomUtils.isValid(geom)).to.be(false);

      // Polygon
      geom = new ol.geom.Polygon([uniqCoords, uniqCoords]);
      expect(gaGeomUtils.isValid(geom)).to.be(false);

      // MultiLineString
      geom = new ol.geom.MultiLineString([uniqCoords, uniqCoords]);
      expect(gaGeomUtils.isValid(geom)).to.be(false);

      // MultiPolygon
      geom = new ol.geom.MultiPolygon([
        [uniqCoords, uniqCoords],
        [uniqCoords, uniqCoords]
      ]);
      expect(gaGeomUtils.isValid(geom)).to.be(false);

      // GeometryCollection
      geom = new ol.geom.GeometryCollection([
        new ol.geom.Polygon([uniqCoords, uniqCoords]),
        new ol.geom.MultiLineString([uniqCoords, uniqCoords])
      ]);
      expect(gaGeomUtils.isValid(geom)).to.be(false);
    });

    it('removes unvalid geometries in multi geometries but detects it as valid', function() {
      var validCoords = uniqCoords.slice();
      validCoords.push([1, 1, 1]);

      // MultiLineString
      var geom = new ol.geom.MultiLineString([uniqCoords, validCoords]);
      expect(gaGeomUtils.isValid(geom)).to.be(true);
      expect(geom.getLineStrings().length).to.be(1);

      // MultiPolygon
      geom = new ol.geom.MultiPolygon([
        [uniqCoords, uniqCoords],
        [validCoords, uniqCoords]
      ]);
      expect(gaGeomUtils.isValid(geom)).to.be(true);
      expect(geom.getPolygons().length).to.be(1);

      // GeometryCollection
      geom = new ol.geom.GeometryCollection([
        new ol.geom.Polygon([uniqCoords, uniqCoords]),
        new ol.geom.MultiLineString([validCoords, uniqCoords])
      ]);
      expect(gaGeomUtils.isValid(geom)).to.be(true);
      expect(geom.getGeometries().length).to.be(1);
    });
  });
});
