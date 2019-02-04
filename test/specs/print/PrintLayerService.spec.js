/* eslint-disable max-len */
describe('ga_printlayer_service', function() {

  describe('gaPrintLayer', function() {

    var $translate, gaPrintLayer, $window;

    var extent = [2420000, 1030000, 2900000, 1350000];
    var center = [2600000, 1200000];
    var config = {};

    // WMTS
    var sourceWMTS = new ol.source.WMTS({
      url: 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan2012/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan2012/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
      tileGrid: new ol.tilegrid.WMTS({
        origin: [-29386400, 30814500],
        tileSize: 512,
        matrixIds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        resolutions: [
          66.14596562525627, 33.07298281262813,
          16.933367200065604, 8.466683600032802, 4.233341800016401,
          2.1166709000082005, 1.0583354500041002, 0.5291677250020501,
          0.26458386250102506, 0.13229193125051253
        ]
      }),
      projection: 'EPSG:21781',
      layer: 'Uebersichtsplan_2012',
      requestEncoding: 'REST'
    });
    var layerWMTS = new ol.layer.Tile({
      source: sourceWMTS,
      extent: [-29386400, 30000, 900000, 30814500]
    });

    // WMS
    var layerWMS = new ol.layer.Image({
      type: 'WMS',
      opacity: 1,
      visible: true,
      extent: extent,
      source: new ol.source.ImageWMS({
        url: 'https://wms.geo.admin.ch/?',
        projection: new ol.proj.Projection({
          code: 'EPSG:2056',
          units: 'm',
          extent: extent
        }),
        ratio: 1,
        params: {
          LAYERS: 'ch.swisstopo.fixpunkte-agnes'
        }
      })
    });

    // Vector
    var geometry = new ol.geom.Point(center);
    var feature = new ol.Feature({
      name: 'dummy',
      geometry: geometry
    });
    feature.set('toto', 'abcd')
    var layerVector = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [feature]
      })
    });

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
        $window = $injector.get('$window');
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

    describe('#encodeVector()', function() {

      it('returns an encoded vector layer', function() {
        var encVector = gaPrintLayer.encodeVector(layerVector, layerVector.getSource().getFeatures(), false, 2000000,
            extent, 150);

        expect(encVector.type).to.eql('Vector');
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
        feature.set('toto', 'abcd')
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
        expect(encFeatures.encStyles[1]).to.eql({
          id: 1,
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
        var encStyle = encFeatures.encStyles['2'];

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
        var encStyle = encFeatures.encStyles['3'];
        expect(encFeatures.encFeatures[0].geometry.coordinates).to.eql(center);

        expect(encStyle.fillColor).to.eql('#008000');
        expect(encStyle.strokeColor).to.eql('#ffffff');
        expect(encStyle.pointRadius).to.eql(6);
      });

      it('returns only needed attributes', function() {

        var vectorWithoutStyle = new ol.layer.Vector({
          source: source
        });

        var encFeatures = gaPrintLayer.encodeFeatures(vectorWithoutStyle, feature, false, 20000,
            extent, 150);
        // Remove properties from feature in the encoded feature
        expect(feature.getKeys()).to.eql([ 'name', 'geometry', 'toto' ]);
        expect(encFeatures.encFeatures[0].properties).to.eql({ _gx_style: 4 });
      });

    });

    describe('#encodeWMTS()', function() {

      it('returns an encoded WMTS layer (full version)', function() {
        var encWMTS = gaPrintLayer.encodeWMTS(layerWMTS, config);

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

      it('returns an encoded WMS layer', function() {

        var wmsLayer = gaPrintLayer.encodeWMS(layerWMS, layerWMS.getSource().getProjection(), {});

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
          identifier: '0',
          resolution: 66.14596562525627,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 889, -901 ]
        }, {
          identifier: '1',
          resolution: 33.07298281262813,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 1777, -1804 ]
        }, { identifier: '2',
          resolution: 16.933367200065604,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 3470, -3525 ]
        }, {
          identifier: '3',
          resolution: 8.466683600032802,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 6939, -7052 ]
        }, {
          identifier: '4',
          resolution: 4.233341800016401,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 13877, -14105 ]
        }, {
          identifier: '5',
          resolution: 2.1166709000082005,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 27753, -28212 ]
        }, {
          identifier: '6',
          resolution: 1.0583354500041002,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 55506, -56425 ]
        }, {
          identifier: '7',
          resolution: 0.5291677250020501,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 111011, -112851 ]
        }, {
          identifier: '8',
          resolution: 0.26458386250102506,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 222021, -225703 ]
        }, {
          identifier: '9',
          resolution: 0.13229193125051253,
          topLeftCorner: [ -29386400, 30814500 ],
          tileSize: [ 512, 512 ],
          matrixSize: [ 444041, -451408 ] } ]);
      });
    });

    describe('#encodeOverlay()', function() {
      var elt, ov, opt = {
        markerUrl: 'marker.png',
        bubbleUrl: 'bubble.png'
      };

      beforeEach(function() {
        elt = $('<div>foo</div>');
        ov = new ol.Overlay({
          element: elt[0]
        });
      });

      var getStyleAsString = function(styleNb, text, opt) {
        return '{"type":"Vector","styles":{"1":{"externalGraphic":"' +
            opt.markerUrl + '","graphicWidth":20,"graphicHeight":30,"graphicXOffset":-12,"graphicYOffset":-30},"2":{"externalGraphic":"' +
            opt.bubbleUrl + '","graphicWidth":97,"graphicHeight":27,"graphicXOffset":-48,"graphicYOffset":-27,"label":"' +
            text + '","labelXOffset":0,"labelYOffset":18,"fontColor":"#ffffff","fontSize":10,"fontWeight":"normal"},"3":{"label":"' +
            text + '","labelXOffset":0,"labelYOffset":10,"fontColor":"#ffffff","fontSize":8,"fontWeight":"normal","fillColor":"#ff0000","strokeColor":"#ff0000"}},"styleProperty":"_gx_style","geoJson":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"_gx_style":' +
            styleNb + '},"geometry":{"type":"Point","coordinates":[1,2,0]}}]},"name":"drawing","opacity":1}';
      };

      it('returns undefined if the overlay has no position', function() {
        elt.addClass('popover');
        var res = gaPrintLayer.encodeOverlay(ov, undefined, opt);
        expect(res).to.be();
      });

      it('returns undefined if the overlay has a class popover', function() {
        elt.addClass('popover');
        var res = gaPrintLayer.encodeOverlay(ov, undefined, opt);
        expect(res).to.be();
      });

      it('returns an encoded overlay for elt without text (style 1)', function() {
        ov.setPosition([1, 2]);
        ov.setElement($('<div></div>')[0]);
        var res = gaPrintLayer.encodeOverlay(ov, undefined, opt);
        expect(JSON.stringify(res)).to.be(getStyleAsString(1, '', opt));
      });

      it('returns an encoded overlay for elt with text (style 2)', function() {
        ov.setPosition([1, 2]);
        var res = gaPrintLayer.encodeOverlay(ov, undefined, opt);
        expect(JSON.stringify(res)).to.be(getStyleAsString(2, 'foo', opt));
      });

      it('returns an encoded overlay for measure elt (style 3)', function() {
        ov.setPosition([1, 2]);
        elt.addClass('ga-draw-measure-tmp');

        var res = gaPrintLayer.encodeOverlay(ov, undefined, opt);
        expect(JSON.stringify(res)).to.be(getStyleAsString(3, 'foo', opt));
      });
    });

    describe('#encodeGraticule()', function() {

      it('returns an encoded graticule layer', function() {
        var res = gaPrintLayer.encodeGraticule(50);
        expect(JSON.stringify(res)).to.be('{"baseURL":"https://wms.geo.admin.ch/","opacity":1,"singleTile":true,"type":"WMS","layers":["org.epsg.grid_2056"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"MAP_RESOLUTION":50}}');
      });
    });

    describe('#encodeGroup() and #encodeLayer', function() {

      it('returns an encoded group', function() {
        var stub = sinon.stub($window.console, 'error').withArgs('Trying to encode a group with the layer encoder!');
        var gr = new ol.layer.Group({
          layers: [
            new ol.layer.Layer({}),
            new ol.layer.Group({}),
            layerWMS,
            layerWMTS,
            layerVector,
            new ol.layer.Image({visible: true})
          ]
        });
        gr.getLayers().forEach(function(l, idx) {
          if (idx > 0) {
            l.visible = true;
          }
        });
        var proj = ol.proj.get('EPSG:4326');
        var coords = [1, 2, 3, 4];
        var res = gaPrintLayer.encodeGroup(gr, proj, 300, coords, 500, 96);
        expect(res.length).to.be(3);
        expect(stub.callCount).to.be(1);
      });
    });
  });
});
