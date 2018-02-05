/* eslint-disable max-len */
describe('ga_printlayer_service', function() {

  describe('gaPrintLayer', function() {

    var $translate, gaPrintLayer;

    var extent = [2420000, 1030000, 2900000, 1350000];
    var center = [2600000, 1200000];

    beforeEach(function() {
      module(function($provide) {
        var lang = 'fr';
        $provide.value('gaLang', {
          get: function() {
            return lang;
          }
        });
      });

      inject(function($injector) {
        $translate = $injector.get('$translate');
        gaPrintLayer = $injector.get('gaPrintLayer');
      });
    });

    describe('#encodeLegend()', function() {

      var lyr = new ol.layer.Tile();
      lyr.bodId = 'ch.swisstopo.swisstlm3d-wanderwege';
      var config = {
        hasLegend: true,
        label: 'Chemins de randonnée pédestre'
      };
      var options = {
        legendUrl: 'https://mf-chsdi3.dev.bgdi.ch/static/images/legends/',
        pdfLegendList: []
      };

      it('returns an encoded legend', function() {

        var stub = sinon.stub($translate, 'instant').returns('booba fait du ski avec Martine');

        var encLegend = gaPrintLayer.encodeLegend(lyr, config, options);
        expect(encLegend.classes[0].icon).to.eql(
            options.legendUrl + 'ch.swisstopo.swisstlm3d-wanderwege_fr.png'
        );
        stub.restore();
      });
    });

    describe('#encodeStyles()', function() {

      var source, feature;

      beforeEach(function() {
        var geometry = new ol.geom.Point(center);
        feature = new ol.Feature({
          name: 'dummy',
          geometry: geometry
        });
        source = new ol.source.Vector({});
        source.addFeature(feature);
      });

      afterEach(function() {
        source = null;
        feature = null;
      });

      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#dddddd',
            width: 15
          }),
          fill: new ol.style.Fill({
            color: '#ffa500'
          })
        })
      });
      function styleFunction(feature) {
        var style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 2
            }),
            fill: new ol.style.Fill({
              color: 'green'
            })
          })
        });
        return [style];
      }

      it('returns an encoded features with no style', function() {

        var vectorWithoutStyle = new ol.layer.Vector({
          source: source
        });

        var encFeatures = gaPrintLayer.encodeFeatures(vectorWithoutStyle, feature, false, 20000,
            extent, 150);
        // Default style
        expect(encFeatures.encStyles[0]).to.eql({
          id: 0,
          zIndex: undefined,
          rotation: 0,
          pointRadius: 5,
          graphicWidth: 4.41,
          graphicHeight: 4.41,
          graphicXOffset: -2.205,
          graphicYOffset: -2.205,
          fillColor: '#ffffff',
          fillOpacity: 0.4,
          strokeWidth: 0.75,
          strokeColor: '#3399cc',
          strokeOpacity: 1,
          strokeLinecap: 'round',
          strokeLinejoin: 'round' }
        );
      });

      it('returns an encoded features with style', function() {

        var vectorWithStyle = new ol.layer.Vector({
          source: source,
          style: style
        });
        var encFeatures = gaPrintLayer.encodeFeatures(vectorWithStyle, feature, false, 20000,
            extent, 150);
        var encStyle = encFeatures.encStyles['1'];

        expect(encFeatures.encFeatures[0].geometry.coordinates).to.eql(center);
        expect(encStyle.fillColor).to.eql('#ffa500');
        expect(encStyle.strokeColor).to.eql('#dddddd');
        expect(encStyle.pointRadius).to.eql(10);

      });

      it('returns an encoded features with style function', function() {
        var vectorWithStyleFunction = new ol.layer.Vector({
          source: source,
          style: styleFunction
        });

        var encFeatures = gaPrintLayer.encodeFeatures(vectorWithStyleFunction, feature, false, 20000,
            extent, 150);
        var encStyle = encFeatures.encStyles['2'];
        expect(encFeatures.encFeatures[0].geometry.coordinates).to.eql(center);

        expect(encStyle.fillColor).to.eql('#008000');
        expect(encStyle.strokeColor).to.eql('#ffffff');
        expect(encStyle.pointRadius).to.eql(6);

      });
    });

    describe('#encodeWMTS()', function() {
      var extent = [-29386400, 30000, 900000, 30814500];
      var config = {};
      var options = {
        origin: [-29386400, 30814500],
        tileSize: 512,
        matrixIds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        resolutions: [66.14596562525627, 33.07298281262813, 16.933367200065604, 8.466683600032802, 4.233341800016401,
          2.1166709000082005, 1.0583354500041002, 0.5291677250020501, 0.26458386250102506, 0.13229193125051253]
      };
      var tileGrid = new ol.tilegrid.WMTS(options);
      var source = new ol.source.WMTS({
        url: 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan2012/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan2012/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        tileGrid: tileGrid,
        projection: 'EPSG:21781',
        layer: 'Uebersichtsplan_2012',
        requestEncoding: 'REST'
      });
      var layer = new ol.layer.Tile({
        source: source,
        extent: extent
      });

      it('returns an encoded WMTS layer (full version)', function() {
        var encWMTS = gaPrintLayer.encodeWMTS(layer, config);

        expect(encWMTS.baseURL).to.eql('http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan2012/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan2012/%7BStyle%7D/%7BTileMatrixSet%7D/%7BTileMatrix%7D/%7BTileRow%7D/%7BTileCol%7D.png');
        expect(encWMTS.layer).to.eql('Uebersichtsplan_2012');
        expect(encWMTS.matrixIds.length).to.eql(10);
      });
    });

    describe('#encodeBase()', function() {

      var lyr = new ol.layer.Vector({
        source: new ol.source.Vector()
      });

      it('returns an encoded base layer', function() {
        var opacity = 0.65;
        lyr.setOpacity(opacity);
        var base = gaPrintLayer.encodeBase(lyr);

        expect(base.opacity).to.eql(opacity);
      });

      it('returns an encoded base layer with right bodId', function() {
        var bodId = 'toto';
        lyr.bodId = bodId;
        var base = gaPrintLayer.encodeBase(lyr);

        expect(base.layer).to.eql(bodId);
      });
    });

    describe('#encodeGraticule()', function() {

      it('returns an encoded Dimensions', function() {

        var dpi = 150;
        var graticule = gaPrintLayer.encodeGraticule(dpi);

        expect(graticule.customParams.MAP_RESOLUTION).to.eql(dpi);
        expect(graticule.layers).to.eql(['org.epsg.grid_2056']);
      });
    });

    describe('#encodeDimensions()', function() {

      var params = {
        Time: 'current'
      };

      it('returns an encoded Dimensions', function() {

        var dimensions = gaPrintLayer.encodeDimensions(params);

        expect(dimensions).to.eql({ TIME: 'current' });
      });
    });

    describe('#encodeWMS()', function() {

      var proj = new ol.proj.Projection({
        code: 'EPSG:2056',
        units: 'm',
        extent: extent
      });

      var options = {
        url: 'https://wms.geo.admin.ch/?',
        projection: proj,
        ratio: 1,
        params: {
          LAYERS: 'ch.swisstopo.fixpunkte-agnes'
        }
      };

      var source = new ol.source.ImageWMS(options);

      var layer = new ol.layer.Image({
        id: options.id,
        url: options.url,
        type: 'WMS',
        opacity: 1,
        visible: true,
        extent: extent,
        source: source
      });

      it('returns an encoded WMS layer', function() {

        var wmsLayer = gaPrintLayer.encodeWMS(layer, proj, {});

        expect(wmsLayer).to.eql({
          opacity: 1,
          type: 'WMS',
          baseURL: 'https://wms.geo.admin.ch/?',
          layers: [ 'ch.swisstopo.fixpunkte-agnes' ],
          styles: [ '' ],
          format: 'image/png',
          customParams:
           { EXCEPTIONS: 'XML',
             TRANSPARENT: 'true',
             MAP_RESOLUTION: 150,
             VERSION: '1.3.0',
             CRS: 'EPSG:2056' },
          singleTile: false
        });
      });
    });

    describe('#encodeWMS111()', function() {

      var proj = new ol.proj.Projection({
        code: 'EPSG:2056',
        units: 'm',
        extent: extent
      });

      var options = {
        url: 'https://wms.tutu.org',
        projection: proj,
        ratio: 1,
        params: {
          LAYERS: 'not-so-important',
          VERSION: '1.1.1'
        }
      };

      var source = new ol.source.ImageWMS(options);

      var layer = new ol.layer.Image({
        id: options.id,
        url: options.url,
        type: 'WMS',
        opacity: 1,
        visible: true,
        extent: extent,
        source: source
      });

      it('returns an encoded external 1.1.1 WMS  layer', function() {

        var wmsLayer = gaPrintLayer.encodeWMS(layer, proj, {});

        expect(wmsLayer).to.eql({
          opacity: 1,
          type: 'WMS',
          baseURL: 'https://wms.tutu.org',
          layers: [ 'not-so-important' ],
          styles: [ '' ],
          format: 'image/png',
          customParams:
           { EXCEPTIONS: 'XML',
             TRANSPARENT: 'true',
             VERSION: '1.1.1',
             SRS: 'EPSG:2056' },
          singleTile: false
        });
      });
    });
    describe('#encodeMatrixIds()', function() {

      var extent = [672499.0, 238999.0, 689999.0, 256999.0];

      var options = {
        origin: [-29386400, 30814500],
        tileSize: 512,
        matrixIds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        sizes: [
          [889, 904],
          [1777, 1807],
          [3470, 3528],
          [6939, 7055],
          [13877, 14108],
          [27753, 28215],
          [55506, 56428],
          [111012, 112854],
          [222023, 225707],
          [444046, 451412]
        ],
        resolutions: [66.14596562525627, 33.07298281262813, 16.933367200065604, 8.466683600032802, 4.233341800016401, 2.1166709000082005, 1.0583354500041002, 0.5291677250020501, 0.26458386250102506, 0.13229193125051253]
      };

      var tileGrid = new ol.tilegrid.WMTS(options);

      it('returns an encoded tilematrix', function() {

        var matrixIds = gaPrintLayer.encodeMatrixIds(tileGrid, extent);

        expect(matrixIds).to.eql([{
          'identifier': '0',
          'resolution': 66.14596562525627,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [889, 904]
        }, {
          'identifier': '1',
          'resolution': 33.07298281262813,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [1777, 1807]
        }, {
          'identifier': '2',
          'resolution': 16.933367200065604,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [3470, 3528]
        }, {
          'identifier': '3',
          'resolution': 8.466683600032802,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [6939, 7055]
        }, {
          'identifier': '4',
          'resolution': 4.233341800016401,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [13877, 14108]
        }, {
          'identifier': '5',
          'resolution': 2.1166709000082005,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [27753, 28215]
        }, {
          'identifier': '6',
          'resolution': 1.0583354500041002,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [55506, 56428]
        }, {
          'identifier': '7',
          'resolution': 0.5291677250020501,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [111011, 112854]
        }, {
          'identifier': '8',
          'resolution': 0.26458386250102506,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [222021, 225706]
        }, {
          'identifier': '9',
          'resolution': 0.13229193125051253,
          'topLeftCorner': [-29386400, 30814500],
          'tileSize': [512, 512],
          'matrixSize': [444041, 451411]
        }]);
      });
    });
  });
});
