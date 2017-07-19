describe('ga_printlayer_service', function() {

  describe('gaPrintLayer', function() {

    var $translate, gaPrintLayer, gaUrlUtils, gaLang;

    var extent = [420000, 30000, 900000, 350000];
    var center =  [600000, 200000];
    var matrixIds = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
    var resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5];
    var tileOrigin = [420000, 350000];

    beforeEach(function() {
      module(function($provide) {
        var lang = 'fr';
        $provide.value('gaLang',  {
          get: function() {
            return lang;
          }
        });
      });

      inject(function($injector) {
        $translate = $injector.get('$translate');
        gaPrintLayer = $injector.get('gaPrintLayer');
        gaLang = $injector.get('gaLang');
        gaMarkerOverlay = $injector.get('gaMarkerOverlay');
        gaUrlUtils = $injector.get('gaUrlUtils');
      });
    });

    describe('#encodeLegend()', function() {

      var lyr = new ol.layer.Tile();
      lyr.bodId = 'ch.swisstopo.swisstlm3d-wanderwege';
      var config = {
        hasLegend: true,
        label: "Chemins de randonnée pédestre"
      }
      var options = {
        legendUrl: "https://mf-chsdi3.dev.bgdi.ch/static/images/legends/",
        pdfLegendList: []
      }

      it('returns an encoded legend', function() {

        var stub = sinon.stub($translate, 'instant').returns('booba fait du ski avec Martine');

        var encLegend = gaPrintLayer.encodeLegend(lyr, config, options);
        expect(encLegend.classes[0].icon).to.eql(
           options.legendUrl +  'ch.swisstopo.swisstlm3d-wanderwege_fr.png'
        );
        stub.restore();
      });
    });
    
    describe('#encodeDimensions()', function() {
        
       var geometry = new ol.geom.Point(center);
       var feature = new ol.Feature({
         name: "dummy",
         geometry: geometry
       });
       var source = new ol.source.Vector({});
       source.addFeature( feature );

      var vector = new ol.layer.Vector({
        source: source
      });

      it('returns an encoded features', function() {


        var encFeatures = gaPrintLayer.encodeFeatures(vector, feature, false, 20000,
           extent, 150);

        expect(encFeatures.encFeatures[0].geometry.coordinates).to.eql(center);
        
        expect(encFeatures.encStyles[0]).to.eql( { 
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
    });

    describe('#encodeWMTS()', function() {


      var config = {
        "attribution": "swisstopo",
        "chargeable": true,
        "searchable": false,
        "format": "jpeg",
        "hasLegend": true,
        "serverLayerName": "ch.swisstopo.pixelkarte-farbe",
        "attributionUrl": "https://www.swisstopo.admin.ch/fr/home.html",
        "tooltip": false,
        "parentLayerId": "ch.swisstopo.pixelkarte-farbe",
        "highlightable": true,
        "background": true,
        "timestamps": ["current"],
        "topics": "api,swissmaponline,wms-naz,wms-swisstopowms",
        "resolutions": [1, 0.5, 0.25],
        "label": "ch.swisstopo.pixelkarte-farbe_wmts",
        "type": "wmts",
        "timeEnabled": false,
        "minResolution": 1.5
      };

      var options = {
        origin: [420000, 350000],
        tileSize: 256,
        matrixIds: matrixIds,
        resolutions: resolutions,
      }

      var tileGrid = new ol.tilegrid.WMTS(options);

      var source = new ol.source.WMTS({
        url: '//wmts100.geo.admin.ch/1.0.0/{Layer}/default/current/21781/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
        tileGrid: tileGrid,
        projection: "EPSG:21781",
        layer: config.serverLayerName,
        requestEncoding: 'REST',
        dimensions: {
          "Time": "current"
        }
      });

      var layer = new ol.layer.Tile({
        source: source,
        extent: extent
      });

      it('returns an encoded WMTS layer (simplified version, only for layers in layersConfig)', function() {
        var encWMTS = gaPrintLayer.encodeWMTS(layer, config);

        expect(encWMTS).to.eql({
          "layer": "ch.swisstopo.pixelkarte-farbe",
          "opacity": 1,
          "type": "WMTS",
          "version": "1.0.0",
          "requestEncoding": "REST",
          "formatSuffix": "jpeg",
          "style": "default",
          "dimensions": ["TIME"],
          "params": {
            "TIME": "current"
          },
          "matrixSet": "21781",
          "baseURL": "https://wmts.geo.admin.ch",
          "zoomOffset": 0,
          "tileOrigin": tileOrigin,
          "tileSize": [256, 256],
          "resolutions": resolutions,
          "maxExtent": extent 
        });
      });
    });

    describe('#encodeWMTS()', function() {
      var extent = [-29386400, 30000, 900000, 30814500];
      var config = {};
      var options = {
        origin: [-29386400, 30814500],
        tileSize: 512,
        matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        resolutions: [66.14596562525627, 33.07298281262813, 16.933367200065604, 8.466683600032802, 4.233341800016401,
            2.1166709000082005, 1.0583354500041002,  0.5291677250020501, 0.26458386250102506,  0.13229193125051253]
      };
      var tileGrid = new ol.tilegrid.WMTS(options);
      var source = new ol.source.WMTS({
        url: 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan2012/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan2012/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        tileGrid: tileGrid,
        projection: "EPSG:21781",
        layer: 'Uebersichtsplan_2012',
        requestEncoding: 'REST'
      });
      var layer = new ol.layer.Tile({
        source: source,
        extent: extent
      });

      it('returns an encoded WMTS layer (full version)', function() {
        var encWMTS = gaPrintLayer.encodeWMTS(layer, config);

        expect(encWMTS.baseURL).to.eql( 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan2012/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan2012/%7BStyle%7D/%7BTileMatrixSet%7D/%7BTileMatrix%7D/%7BTileRow%7D/%7BTileCol%7D.png' );
        expect(encWMTS.layer).to.eql('Uebersichtsplan_2012');
        expect(encWMTS.matrixIds.length).to.eql(10);
      });
    });
    
    describe('#encodeBase()', function() {

      var lyr = new ol.layer.Tile();
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
        expect(graticule.layers).to.eql(['org.epsg.grid_2056'] );
      });
    });

    describe('#encodeDimensions()', function() {

      var params = {
        Time: "current"
      }

      it('returns an encoded Dimensions', function() {

        var dimensions = gaPrintLayer.encodeDimensions(params)

        expect(dimensions).to.eql({ TIME: 'current' });
      });
    });

    describe('#encodeWMS()', function() {

      var options = {
        url: "https://wms.geo.admin.ch/?",
        projection: "EPSG:21781",
        ratio: 1,
        params: {
          LAYERS: "ch.swisstopo.fixpunkte-agnes"
        }
      }

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

        var wmsLayer = gaPrintLayer.encodeWMS(layer, {})

        expect(wmsLayer).to.eql({
          "opacity": 1,
          "type": "WMS",
          "baseURL": "https://wms.geo.admin.ch/?",
          "layers": ["ch.swisstopo.fixpunkte-agnes"],
          "styles": [""],
          "format": "image/png",
          "customParams": {
            "EXCEPTIONS": "XML",
            "TRANSPARENT": "true",
            "CRS": "EPSG:21781",
            "MAP_RESOLUTION": "150"
          },
          "singleTile": false
        });
      });
    });

    describe('#encodeMatrixIds()', function() {

      var extent = [672499.0, 238999.0, 689999.0, 256999.0];

      var options = {
        origin: [-29386400, 30814500],
        tileSize: 512,
        matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
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
        resolutions: [66.14596562525627, 33.07298281262813, 16.933367200065604, 8.466683600032802, 4.233341800016401, 2.1166709000082005, 1.0583354500041002, 0.5291677250020501, 0.26458386250102506, 0.13229193125051253],
      }

      var tileGrid = new ol.tilegrid.WMTS(options)

      it('returns an encoded tilematrix', function() {

        var matrixIds = gaPrintLayer.encodeMatrixIds(tileGrid, extent)

        expect(matrixIds).to.eql([{
          "identifier": "0",
          "resolution": 66.14596562525627,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [889, 904]
        }, {
          "identifier": "1",
          "resolution": 33.07298281262813,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [1777, 1807]
        }, {
          "identifier": "2",
          "resolution": 16.933367200065604,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [3470, 3528]
        }, {
          "identifier": "3",
          "resolution": 8.466683600032802,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [6939, 7055]
        }, {
          "identifier": "4",
          "resolution": 4.233341800016401,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [13877, 14108]
        }, {
          "identifier": "5",
          "resolution": 2.1166709000082005,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [27753, 28215]
        }, {
          "identifier": "6",
          "resolution": 1.0583354500041002,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [55506, 56428]
        }, {
          "identifier": "7",
          "resolution": 0.5291677250020501,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [111011, 112854]
        }, {
          "identifier": "8",
          "resolution": 0.26458386250102506,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [222021, 225706]
        }, {
          "identifier": "9",
          "resolution": 0.13229193125051253,
          "topLeftCorner": [-29386400, 30814500],
          "tileSize": [512, 512],
          "matrixSize": [444041, 451411]
        }]);
      });
    });
  }); 
});
