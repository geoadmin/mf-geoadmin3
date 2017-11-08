/* eslint-disable max-len */
describe('ga_geomutils_service', function() {
  var gaGeomUtils;

  beforeEach(function() {
    inject(function($injector) {
      gaGeomUtils = $injector.get('gaGeomUtils');
    });
  });

  describe('#hasUniqueCoords()', function() {
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

  describe('#close()', function() {
    var unclosedCoords = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ];

    var closedCoords = [
      [0, 1, 0],
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
      coords = geom.getCoordinates();
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
      geom = new ol.geom.MultiLineString([unclosedCoords, unclosedCoords]);
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

    it('doesn\'t close geometry if not necessary', function() {

      // LinearRing
      var closedLinearRing = new ol.geom.LinearRing(closedCoords);
      gaGeomUtils.close(closedLinearRing);
      var coords = closedLinearRing.getCoordinates();
      var idx = coords[0].length - 1;
      expect(coords[idx]).not.to.eql(coords[idx - 1]);

      // Polygon
      var closedPolygon = new ol.geom.Polygon([closedCoords, closedCoords]);
      gaGeomUtils.close(closedPolygon);
      coords = closedPolygon.getCoordinates();

      expect(coords[0][idx]).not.to.eql(coords[0][idx - 1]);
      expect(coords[1][idx]).not.to.eql(coords[1][idx - 1]);

      // MultiPolygon
      var closedMultiPolygon = new ol.geom.MultiPolygon([
        [closedCoords, closedCoords],
        [closedCoords, closedCoords]
      ]);
      gaGeomUtils.close(closedMultiPolygon);
      coords = closedMultiPolygon.getCoordinates();
      expect(coords[0][0][idx]).not.to.eql(coords[0][0][idx - 1]);
      expect(coords[0][1][idx]).not.to.eql(coords[0][1][idx - 1]);
      expect(coords[1][0][idx]).not.to.eql(coords[1][0][idx - 1]);
      expect(coords[1][1][idx]).not.to.eql(coords[1][1][idx - 1]);

      // GeometryCollection
      var closedGeomColl = new ol.geom.GeometryCollection([
        new ol.geom.Polygon([closedCoords, closedCoords]),
        new ol.geom.Point([0, 0])
      ]);
      gaGeomUtils.close(closedGeomColl);
      coords = closedGeomColl.getGeometries()[0].getCoordinates();
      expect(coords[0][idx]).not.to.eql(coords[0][idx - 1]);
      expect(coords[1][idx]).not.to.eql(coords[1][idx - 1]);
      // we verify the point is still there
      coords = closedGeomColl.getGeometries()[1].getCoordinates();
      expect(coords).to.eql([0, 0]);
    });
  });

  describe('#isValid()', function() {
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
      geom = new ol.geom.LineString(uniqCoords);
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

  describe('#multiLineStringToLineString()', function() {
    var lineString = new ol.geom.LineString([
      [0, 0], [1000, 0], [1000, 1000], [0, 1000]
    ]);

    var multiLineString = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
      [[1, 0], [1000, 0], [1000, 1000], [0, 1000]]
    ]);

    var multiLineStringOne = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]]
    ]);

    var multiLineStringConnected = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
      [[0, 1000], [2000, 0], [2000, 2000], [0, 2000]],
      [[0, 2000], [3000, 0], [3000, 3000], [0, 3000]]
    ]);

    it('returns the original geometry if it\'s not a MultiLineString', function() {
      var g = gaGeomUtils.multiLineStringToLineString(lineString);
      expect(g).to.be(lineString);
    });

    it('returns the original geometry if the MultiLineString is not convertible', function() {
      var g = gaGeomUtils.multiLineStringToLineString(multiLineString);
      expect(g).to.be(multiLineString);
    });

    it('converts to a LineString if the MultiLineString contains one LineString', function() {
      var g = gaGeomUtils.multiLineStringToLineString(multiLineStringOne);
      expect(g).to.be.a(ol.geom.LineString);
      expect(g.getCoordinates()).to.eql(multiLineStringOne.getLineString(0).getCoordinates());
    });

    it('converts to a LineString if the MultiLineString contains connected LineStrings', function() {
      var g = gaGeomUtils.multiLineStringToLineString(multiLineStringConnected);
      expect(g).to.be.a(ol.geom.LineString);
      expect(g.getFirstCoordinate()).to.eql([0, 0]);
      expect(g.getLastCoordinate()).to.eql([0, 3000]);
    });
  });

  describe('#multiGeomToSingleGeom()', function() {
    var lineString = new ol.geom.LineString([
      [0, 0], [1000, 0], [1000, 1000], [0, 1000]
    ]);

    var multiLineString = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
      [[1, 0], [1000, 0], [1000, 1000], [0, 1000]]
    ]);

    var multiLineStringOne = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]]
    ]);

    var multiLineStringConnected = new ol.geom.MultiLineString([
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]],
      [[0, 1000], [2000, 0], [2000, 2000], [0, 2000]],
      [[0, 2000], [3000, 0], [3000, 3000], [0, 3000]]
    ]);

    var geomColl = new ol.geom.GeometryCollection([lineString, new ol.geom.Point([0, 0])]);
    var geomCollOne = new ol.geom.GeometryCollection([lineString]);
    var geomCollRec = new ol.geom.GeometryCollection([geomCollOne]);

    var point = new ol.geom.Point([0, 0]);
    var multiPoint = new ol.geom.MultiPoint([point.getCoordinates(), point.getCoordinates()]);
    var multiPointOne = new ol.geom.MultiPoint([point.getCoordinates()]);

    var polygon = new ol.geom.Polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]]);
    var multiPolygon = new ol.geom.MultiPolygon([
      polygon.getCoordinates(),
      polygon.getCoordinates()
    ]);
    var multiPolygonOne = new ol.geom.MultiPolygon([polygon.getCoordinates()]);

    it('returns the original geometry', function() {
      [
        point,
        lineString,
        polygon,
        geomColl,
        multiPoint,
        multiLineString,
        multiPolygon
      ].forEach(function(geom) {
        var g = gaGeomUtils.multiGeomToSingleGeom(geom);
        expect(g).to.be(geom);
      });
    });

    it('returns a single Point geometry', function() {
      var g = gaGeomUtils.multiGeomToSingleGeom(multiPointOne);
      expect(g).to.be.a(ol.geom.Point);
    });

    it('returns a single LineString geometry', function() {
      var g = gaGeomUtils.multiGeomToSingleGeom(multiLineStringOne);
      expect(g).to.be.a(ol.geom.LineString);
      g = gaGeomUtils.multiGeomToSingleGeom(multiLineStringConnected);
      expect(g).to.be.a(ol.geom.LineString);
    });

    it('returns a single Polygon geometry', function() {
      var g = gaGeomUtils.multiGeomToSingleGeom(multiPolygonOne);
      expect(g).to.be.a(ol.geom.Polygon);
    });

    it('returns a single geometry from a GeometryCollection', function() {
      var g = gaGeomUtils.multiGeomToSingleGeom(geomCollOne);
      expect(g).to.be.a(ol.geom.LineString);
      g = gaGeomUtils.multiGeomToSingleGeom(geomCollRec);
      expect(g).to.be.a(ol.geom.LineString);
    });
  });
});
