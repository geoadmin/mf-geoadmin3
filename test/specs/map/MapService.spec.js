describe('ga_map_service', function() {
  var map;

  var addLayerGroupToMap = function(bodId) {
    var layer = new ol.layer.Group();
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addLayerToMap = function(bodId) {
    var layer = new ol.layer.Tile();
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addVectorLayerToMap = function(bodId) {
    var layer = new ol.layer.Vector();
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addLocalKmlLayerToMap = function() {
    var kmlFormat = new ol.format.KML({
      extractStyles: true,
      extractAttributes: true
    });
    var layer = new ol.layer.Vector({
      id: 'KML||documents/kml/bar.kml',
      url: 'documents/kml/bar.kml',
      type: 'KML',
      label: 'KML',
      opacity: 0.1,
      visible: false,
      source: new ol.source.Vector({
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx=' +
            '"http://www.google.com/kml/ext/2.2"></kml>')
      })
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addKmlLayerToMap = function() {
    var kmlFormat = new ol.format.KML({
      extractStyles: true,
      extractAttributes: true
    });
    var layer = new ol.layer.Vector({
      id: 'KML||http://foo.ch/bar.kml',
      url: 'http://foo.ch/bar.kml',
      type: 'KML',
      label: 'KML',
      opacity: 0.1,
      visible: false,
      source: new ol.source.Vector({
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" ' +
            'xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
      })
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addStoredKmlLayerToMap = function() {
    var kmlFormat = new ol.format.KML({
      extractStyles: true,
      extractAttributes: true
    });
    var layer = new ol.layer.Vector({
      id: 'KML||http://public.geo.admin.ch/nciusdhfjsbnduvishfjknl',
      url: 'http://public.geo.admin.ch/nciusdhfjsbnduvishfjknl',
      type: 'KML',
      label: 'nciusdhfjsbnduvishfjknl',
      opacity: 0.1,
      visible: false,
      source: new ol.source.Vector({
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx=' +
            '"http://www.google.com/kml/ext/2.2"></kml>')
      })
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addExternalWmsLayerToMap = function() {
    var source = new ol.source.ImageWMS({
      params: {LAYERS: 'ch.wms.name'},
      url: 'http://foo.ch/wms'
    });
    var layer = new ol.layer.Image({
      id: 'WMS||The wms layer||http://foo.ch/wms||ch.wms.name',
      url: 'http://foo.ch/wms',
      type: 'WMS',
      label: 'The wms layer',
      opacity: 0.4,
      visible: false,
      source: source
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addExternalWmtsLayerToMap = function() {
    var source = new ol.source.TileImage({
      url: 'http://foo.ch/wmts'
    });
    var layer = new ol.layer.Image({
      id: 'WMTS||The wms layer||http://foo.ch/wms||ch.wms.name',
      url: 'http://foo.ch/wmts',
      type: 'WMTS',
      label: 'The wmts layer',
      opacity: 0.4,
      visible: false,
      source: source
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addBodWmsToMap = function(bodId) {
    var layer = new ol.layer.Image();
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addBodWmtsToMap = function(bodId) {
    var layer = new ol.layer.Image();
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  describe('gaTileGrid', function() {
    var gaTileGrid;
    var orig = [420000, 350000];
    var dfltRes = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
        2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5,
        2.5, 2, 1.5, 1, 0.5];
    var wmsRes = dfltRes.concat([0.25, 0.1]);
    var getMatrixIds = function(res) {
      return $.map(res, function(r, i) { return i + '';});
    };

    describe('#get()', function() {

      beforeEach(function() {
        inject(function($injector) {
          gaTileGrid = $injector.get('gaTileGrid');
        });
      });

      it('creates a WMTS tilegrid with default values', function() {
        var tg = gaTileGrid.get();
        expect(tg).to.be.an(ol.tilegrid.WMTS);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(dfltRes));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(dfltRes);
      });

      it('creates a WMS tilegrid with default values', function() {
        var tg = gaTileGrid.get(undefined, undefined, 'wms');
        expect(tg).to.be.an(ol.tilegrid.TileGrid);
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(wmsRes);
      });

      it('uses resolutions specified in parameter', function() {
        var res = [5, 2, 1];
        var tg = gaTileGrid.get(res);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(res));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(res, undefined, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);
      });

      it('uses minResolution specified in parameter', function() {
        var initRes = [15, 10, 5, 2, 1, 0.5];
        var minRes = 2;
        var res = [15, 10, 5, 2];
        var tg = gaTileGrid.get(initRes.concat([]), minRes);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(res));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(initRes, minRes, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(undefined, undefined, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(wmsRes);
      });
    });
  });

  describe('gaDefinePropertiesForLayer', function() {
    var gaDefine, layer;

    var expectLinkedToLayer = function(olLayer, prop) {
      olLayer.set(prop, 'test');
      expect(olLayer[prop]).to.be('test');
      olLayer[prop] = 'test2';
      expect(olLayer.get(prop)).to.be('test2');
    };

    beforeEach(function() {

      inject(function($injector) {
        gaDefine = $injector.get('gaDefinePropertiesForLayer');
      });

      layer = new ol.layer.Tile();
    });

    it('verifies properties linked to a layer\'s property', function() {
      gaDefine(layer);

      var properties = [
        'bodId',
        'label',
        'url',
        'type',
        'altitudeMode',
        'timeEnabled',
        'timestamps',
        'altitudeMode'
      ];

      properties.forEach(function(prop) {
        expect(layer[prop]).to.be(layer.get(prop));
        expectLinkedToLayer(layer, prop);
      });
    });

    it('verifies writability and default values of properties added', function() {
      // Use for test of userVisible property
      layer.setVisible(false);
      gaDefine(layer);

      var properties = [
        'altitudeMode',
        'background',
        'displayInLayerManager',
        'useThirdPartyData',
        'preview',
        'geojsonUrl',
        'updateDelay',
        'userVisible'
      ];

      var dfltValues = [
        'clampToGround',
        false,
        true,
        false,
        false,
        null,
        null,
        layer.getVisible()
      ];

      properties.forEach(function(prop, i) {
        expect(layer[prop]).to.be(dfltValues[i]);
        layer[prop] = 'test';
        expect(layer[prop]).to.be('test');
      });
    });

    it('verifies visible property', function() {
      var prop = 'visible';
      gaDefine(layer);

      expect(layer[prop]).to.be(layer.userVisible);

      layer[prop] = true;
      layer.hiddenByOther = false;
      expect(layer.visible).to.be(layer.getVisible());

      layer[prop] = false;
      layer.hiddenByOther = true;
      expect(layer.visible).to.be(layer.getVisible());

      layer[prop] = true;
      layer.hiddenByOther = true;
      expect(layer.visible).to.be(!layer.getVisible());

      layer[prop] = false;
      layer.hiddenByOther = false;
      expect(layer.visible).to.be(layer.getVisible());
    });

    it('verifies hiddenByOther property', function() {
      var prop = 'hiddenByOther';
      gaDefine(layer);

      expect(layer[prop]).to.be(layer.get(prop));
      expectLinkedToLayer(layer, prop);

      layer.userVisible = false;
      layer[prop] = false;
      expect(layer.visible).to.be(false);
      expect(layer.getVisible()).to.be(false);

      layer.userVisible = true;
      layer[prop] = false;
      expect(layer.visible).to.be(true);
      expect(layer.getVisible()).to.be(true);

      layer.userVisible = false;
      layer[prop] = true;
      expect(layer.visible).to.be(false);
      expect(layer.getVisible()).to.be(false);

      layer.userVisible = true;
      layer[prop] = true;
      expect(layer.visible).to.be(true);
      expect(layer.getVisible()).to.be(false);
    });

    it('verifies invertedOpacity property', function() {
      var prop = 'invertedOpacity';
      gaDefine(layer);

      expect(layer.getOpacity()).to.be.a('number');
      expect(layer.getOpacity()).to.be(1);
      expect(layer[prop]).to.be.a('number');
      expect(layer[prop]).to.be(0);

      layer.setOpacity(0.2);
      expect(layer[prop]).to.be.a('number');
      expect(layer[prop]).to.be(0.8);

      layer.invertedOpacity = 0.3;
      expect(layer.getOpacity()).to.be.a('number');
      expect(layer.getOpacity()).to.be(0.7);
    });

    it('verifies id property', function() {
      var prop = 'id';
      gaDefine(layer);
      layer.bodId = 'bodId';
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be('bodId');
      expectLinkedToLayer(layer, prop);
    });

    it('verifies adminId property', function() {
      var prop = 'adminId';
      gaDefine(layer);
      layer.bodId = 'bodId';
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be('bodId');
      expectLinkedToLayer(layer, prop);
    });

    it('verifies time property', function() {
      var prop = 'time';

      // WMTS
      var layer = new ol.layer.Tile({
        source: new ol.source.WMTS({})
      });
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be('test');
      expect(layer.getSource().getDimensions().Time).to.be('test');
      // If the value hasn't change don't set the dimension
      layer.getSource().updateDimensions({Time: 'test2'});
      expect(layer[prop]).to.be('test2');

      // If the value hasn't change,  don't set the dimension
      var spy = sinon.spy(layer.getSource(), 'updateDimensions');
      layer[prop] = 'test2';
      expect(spy.callCount).to.be(0);
      spy.restore();

      // ImageWMS && TileWMS
      var layers = [
        new ol.layer.Tile({
          source: new ol.source.ImageWMS({})
        }),
        new ol.layer.Tile({
          source: new ol.source.TileWMS({})
        })
      ];
      layers.forEach(function(layer) {
        gaDefine(layer);
        expect(layer.get(prop)).to.be(undefined);
        expect(layer[prop]).to.be(undefined);
        layer[prop] = 'test';
        expect(layer.get(prop)).to.be('test');
        expect(layer.getSource().getParams().TIME).to.be('test');
        layer.getSource().updateParams({TIME: 'test3'});
        expect(layer[prop]).to.be('test3');

        // If the value hasn't change,  don't set the dimension
        var spy = sinon.spy(layer.getSource(), 'updateParams');
        layer[prop] = 'test3';
        expect(spy.callCount).to.be(0);

        // Verifies the TIME parameter is correctly deleted from the object when
        // it is set to undefined.
        layer[prop] = undefined;
        expect(layer.getSource().getParams().hasOwnProperty('TIME')).to.be(false);
        expect(spy.callCount).to.be(1);
        spy.restore();
      });

      // Base layer
      layer = new ol.layer.Layer({});
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be('test');

      // Layer group
      layer = new ol.layer.Group({});
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be(undefined);
    });

    it('verifies getCesiumImageryProvider property', function() {
      var prop = 'getCesiumImageryProvider';
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be.a(Function);
      expectLinkedToLayer(layer, prop);
    });
  });

  describe('gaLayers', function() {
    var gaLayers, gaTime, $httpBackend, $rootScope, gaGlobalOptions, gaBrowserSniffer, gaNetworkStatus;
    var expectedUrl = 'https://example.com/all?lang=somelang';
    var dfltLayersConfig = {
      foo: {
        type: 'wmts',
        matrixSet: 'set1',
        timestamps: ['t1', 't2'],
        parentLayerId: 'bar'
      },
      bar: {
        type: 'wmts',
        matrixSet: 'set2',
        timestamps: ['t3', 't4']
      },
      bodwms: {
        type: 'wms'
      },
      tooltip: {
        type: 'aggregate',
        tooltip: true,
        subLayersIds: ['childtooltip1', 'childtooltip2']
      },
      notooltip: {
        type: 'aggreagate',
        tooltip: false,
        subLayersIds: ['childnotooltip1', 'childnotooltip2']
      },
      childtooltip1: {
        type: 'wmts',
        matrixSet: 'set5',
        timestamps: ['t8', 't9'],
        parentLayerId: 'tooltip'
      },
      childtooltip2: {
        type: 'wmts',
        matrixSet: 'set5',
        timestamps: ['t8', 't9'],
        parentLayerId: 'tooltip'
      },
      childnotooltip1: {
        type: 'wmts',
        matrixSet: 'set6',
        timestamps: ['t10', 't11'],
        parentLayerId: 'notooltip'
      },
      childnotooltip2: {
        type: 'wmts',
        matrixSet: 'set7',
        timestamps: ['t12', 't13'],
        parentLayerId: 'notooltip'
      },
      'ch.bafu.wrz-wildruhezonen_portal': {},
      'ch.swisstopo.swisstlm3d-wanderwege': {},
      'ch.swisstopo.fixpunkte-agnes': {},
      'ch.bfe.sachplan-geologie-tiefenlager': {},
      'ch.vbs.patrouilledesglaciers-z_rennen': {}
    };
    var terrainTpl = '//3d.geo.admin.ch/1.0.0/{layer}/default/{time}/4326';
    var wmtsTpl = '//wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{time}/4326/{z}/{y}/{x}.{format}';
    var wmtsMpTpl = window.location.protocol + '//wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{time}/4326/{z}/{x}/{y}.{format}';
    var vectorTilesTpl = '//vectortiles100.geo.admin.ch/{layer}/{time}/';
    var wmsTpl = '//wms{s}.geo.admin.ch/?layers={layer}&format=image%2F{format}&service=WMS&version=1.3.0&request=GetMap&crs=CRS:84&bbox={westProjected},{southProjected},{eastProjected},{northProjected}&width=512&height=512&styles=';
    var expectWmtsUrl = function(l, t, f) {
      return expectUrl(wmtsTpl, l, t, f);
    };
    var expectWmtsMpUrl = function(l, t, f) {
      return expectUrl(wmtsMpTpl, l, t, f);
    };
    var expectTerrainUrl = function(l, t, f) {
      return expectUrl(terrainTpl, l, t, f);
    };
    var expectWmsUrl = function(l, f) {
      return expectUrl(wmsTpl, l, null, f);
    };
    var expectVectorTilesUrl = function(l, t) {
      return expectUrl(vectorTilesTpl, l, t);
    };
    var expectUrl = function(tpl, l, t, f) {
      return tpl.replace('{layer}', l).replace('{time}', t).replace('{format}', f || 'png');
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
        $provide.value('gaLang', {
          get: function() {
            return 'somelang';
          },
          getNoRm: function() {
            return 'somelang';
          }
        });
      });

      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        gaLayers = $injector.get('gaLayers');
        gaTime = $injector.get('gaTime');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaNetworkStatus = $injector.get('gaNetworkStatus');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('constructor', function() {
      var opaqueLayersIds = [
        'ch.swisstopo.swissimage-product',
        'ch.swisstopo.pixelkarte-farbe',
        'ch.swisstopo.pixelkarte-grau',
        'ch.swisstopo.swisstlm3d-karte-farbe',
        'ch.swisstopo.swisstlm3d-karte-grau',
        'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
        'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'
      ];
      var layersConfig = {
        'noopaque': {}
      };
      opaqueLayersIds.forEach(function(id) {
        layersConfig[id] = {};
      });

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
      });

      it('sets opaque property to hardcoded layers if exists', function() {
        $httpBackend.flush();
        $rootScope.$digest();
        opaqueLayersIds.forEach(function(id) {
          expect(gaLayers.getLayer(id).opaque).to.be(!(id == 'nonopaque'));
        });
      });

      it('adds terrain layer config', function() {
        $httpBackend.flush();
        $rootScope.$digest();
        var terrain = gaLayers.getLayer('ch.swisstopo.terrain.3d');
        expect(terrain).to.eql({
          type: 'terrain',
          serverLayerName: 'ch.swisstopo.terrain.3d',
          timestamps: ['20160115'],
          attribution: 'swisstopo',
          attributionUrl: 'https://www.swisstopo.admin.ch/somelang/home.html'
        });
      });

      it('register to $translateChangeEnd event on first load', function() {
        var spy = sinon.spy($rootScope, '$on');
        $httpBackend.flush();
        $rootScope.$digest();
        expect(spy.calledWith('$translateChangeEnd')).to.be(true);
      });

      it('reload the layer\'s config then broadcast a gaLayersTranslationChange event on language change (2nd load)', function() {
        $httpBackend.flush();
        $rootScope.$digest();
        $httpBackend.expectGET(expectedUrl.replace('somelang', 'someotherlang')).respond(layersConfig);

        var spy = sinon.spy($rootScope, '$broadcast');
        $rootScope.$broadcast('$translateChangeEnd', {language: 'someotherlang'});
        $httpBackend.flush();
        $rootScope.$digest();
        expect(spy.calledWith('gaLayersTranslationChange')).to.be(true);
      });
    });

    describe('#loadConfig()', function() {

      it('returns a promise', function(done) {
        $httpBackend.expectGET(expectedUrl).respond({});
        gaLayers.loadConfig().then(function() {
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });
    });

    describe('#getConfig3d()', function() {
      var layersConfig = {
        foo: {
        'config3d': 'foo3d'
        },
        foo3d: {},
        fooNo3d: {}
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
      });

      it('gets the config 3d of a layer', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var conf3d = gaLayers.getConfig3d(gaLayers.getLayer('foo'));
          expect(conf3d).to.be(gaLayers.getLayer('foo3d'));
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('gets the config 2d if no config 3d available', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var conf3d = gaLayers.getConfig3d(gaLayers.getLayer('fooNo3d'));
          expect(conf3d).to.be(gaLayers.getLayer('fooNo3d'));
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    describe('#getCesiumTerrainProviderById()' , function() {
      var layersConfig = {
        terrain: {
          type: 'terrain',
          timestamps: [
            '20160101'
          ]
        },
        terrainserver: {
          type: 'terrain',
          timestamps: [
            '20160101'
          ],
          serverLayerName: 'serverlayername'
        },
        notterrain: {
          type: 'wms'
        }
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);

        // Avoid log from Cesium
        Cesium.TileProviderError.handleError = function() {};
      });

      it('returns undefined when layer\'s type is not managed', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var prov = gaLayers.getCesiumTerrainProviderById('notterrain');
          expect(prov).to.eql(undefined);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('returns a CesiumTerrainProvider', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var prov = gaLayers.getCesiumTerrainProviderById('terrain');
          expect(prov).to.be.an(Cesium.CesiumTerrainProvider);
          expect(prov._url).to.be(expectTerrainUrl('terrain', '20160101'));
          var rect = prov._rectangle;
          expect(rect).to.be.a(Cesium.Rectangle);
          expect([rect.west, rect.south, rect.east, rect.north]).to.eql([0.08750953387026623, 0.7916115588834566, 0.20031905334970387, 0.8425581080106397]);
          expect(prov._terrainAvailabLeLevels).to.be(window.terrainAvailableLevels);
          expect(prov.bodId).to.be('terrain');
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('doesn\'t use crrent time', function(done) {
        gaTime.get = function() {return '2017';};
        gaLayers.loadConfig().then(function(layers) {
          var spy = sinon.spy(gaLayers, 'getLayerTimestampFromYear');
          var prov = gaLayers.getCesiumTerrainProviderById('terrain');
          expect(spy.calledWith(layersConfig.terrain, '2017')).to.be(true);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('uses serverLayerName if exist', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var prov = gaLayers.getCesiumTerrainProviderById('terrainserver');
          expect(prov._url).to.be(expectTerrainUrl('serverlayername', '20160101'));
          expect(prov.bodId).to.be('terrainserver');
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    describe('#getCesiumTileset3DById' , function() {
      var layersConfig = {
        'ch.dummy.wms': {
          type: 'wms',
          config3d: 'ch.dummy.tileset.3d',
          timestamps: [
            '20170110'
          ]
        },
        'ch.dummy.tileset.3d': {
          type: 'tileset3d',
          serverLayerName: 'ch.dummy.tileset.3d',
          timestamps: [
            '20170110'
          ]
        },
        'ch.dummy.wms2': {
          type: 'wms',
          config3d: 'ch.dummy.badtype.3d',
        },
        'ch.dummy.badtype.3d': {
          type: 'wmts'
        }
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('returns undefined when layer\'s type is not managed', function() {
        var prov = gaLayers.getCesiumTileset3DById('ch.dummy.wms2');
        expect(prov).to.eql(undefined);
      });

      it('returns a Cesium3DTileset object', function() {
        var spy = sinon.spy(Cesium, 'Cesium3DTileset');
        var prov = gaLayers.getCesiumTileset3DById('ch.dummy.wms');
        expect(prov).to.be.an(Cesium.Cesium3DTileset);
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectVectorTilesUrl('ch.dummy.tileset.3d', '20170110'));
        expect(prov.bodId).to.be('ch.dummy.wms');
        spy.restore();
      });
    });

    describe('#getCesiumImageryProviderById()' , function() {
      var layersConfig = {
        'ch.dummy.terrain.3d': {
          type: 'terrain',
          timestamps: [
            '20180101'
          ]
        },
        aggregate: {
          type: 'aggregate',
          subLayersIds: ['wms', 'wmts']
        },
        aggregateofaggregate: {
          type: 'aggregate',
          subLayersIds: ['aggregate', 'wmts']
        },

        wmts: {
          type: 'wmts',
          config3d: 'wmts3d',
          timestamps: [
            '20160101'
          ],
          serverLayerName: 'serverlayername'
        },
        wmts3d: {
          type: 'wmts',
          timestamps: [
            '20160201'
          ],
          serverLayerName: 'serverlayername3d'
        },
        wms: {
          type: 'wms',
          wmsLayers: 'wmsLayers'
        },
        custom: {
          type: 'wmts',
          config3d: 'wmts3dcustom'
        },
        wmts3dcustom: {
          type: 'wmts',
          timestamps: [
            '20160201'
          ],
          serverLayerName: 'serverlayername3d',
          format: 'pngjpeg',
          minResolution: 0.5,
          maxResolution: 100
        },
        wmtsmapproxy: {
          type: 'wmts',
          timestamps: [
            '20160201'
          ]
        },
        badtype: {
          type: 'geojson'
        }
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('returns undefined when layer\'s type is not managed', function() {
        var prov = gaLayers.getCesiumImageryProviderById('badtype');
        expect(prov).to.eql(undefined);
      });

      it('returns a CesiumImageryProvider from wmts config', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('wmts');
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsUrl('serverlayername3d', '20160201'));
        expect(params.subdomains).to.eql(['5', '6', '7', '8', '9']);
        expect(params.minimumLevel).to.eql(window.minimumLevel);
        expect(params.maximumRetrievingLevel).to.eql(window.maximumRetrievingLevel);
        expect(params.maximumLevel).to.eql(18);
        expect(params.tilingScheme).to.be.an(Cesium.GeographicTilingScheme);
        expect(params.tileWidth).to.eql(256);
        expect(params.tileHeight).to.eql(256);
        expect(params.hasAlphaChannel).to.eql(true);
        expect(params.availableLevels).to.be(window.imagerAvailableLevels);
        expect(params.metadataUrl).to.eql('//3d.geo.admin.ch/imagery/');
        expect(prov.bodId).to.be('wmts3d');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a wmts with custom value', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('custom');
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsUrl('serverlayername3d', '20160201', 'jpeg'));
        expect(params.minimumLevel).to.eql(9);
        expect(params.maximumRetrievingLevel).to.eql(17);
        expect(params.maximumLevel).to.eql(undefined);
        expect(params.hasAlphaChannel).to.eql(false);
        expect(prov.bodId).to.be('wmts3dcustom');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a wmts using mapproxy tiles', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('wmtsmapproxy');
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsMpUrl('wmtsmapproxy', '20160201'));
        expect(params.subdomains).to.eql(['20', '21', '22', '23', '24']);
        expect(prov.bodId).to.be('wmtsmapproxy');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a wms config', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('wms');
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmsUrl('wmsLayers'));
        expect(params.subdomains).to.eql(['', '0', '1', '2', '3', '4']);
        expect(params.tileWidth).to.eql(512);
        expect(params.tileHeight).to.eql(512);
        expect(prov.bodId).to.be('wms');
        spy.restore();
      });

      it('returns an array of CesiumImageryProvider from an aggregate layer config', function() {
        var prov = gaLayers.getCesiumImageryProviderById('aggregate');
        prov.forEach(function(item) {
          expect(item).to.be.an(Cesium.UrlTemplateImageryProvider);
        });
        expect(prov.length).to.be(2);
      });

      it('returns an array of CesiumImageryProvider from a recursive aggregate layer config', function() {
        var prov = gaLayers.getCesiumImageryProviderById('aggregateofaggregate');
        prov.forEach(function(item) {
          expect(item).to.be.an(Cesium.UrlTemplateImageryProvider);
        });
        expect(prov.length).to.be(3);
      });
    });

    describe('#getCesiumDataSourceById' , function() {
      var layersConfig = {
        'ch.dummy.wms': {
          type: 'wms',
          config3d: 'ch.dummy.kml.3d',
        },
        'ch.dummy.kml.3d': {
          type: 'kml',
          url: 'http://foo.kml'
        },
        'ch.dummy.wms2': {
          type: 'wms',
          config3d: 'ch.dummy.badtype.3d',
        },
        'ch.dummy.badtype.3d': {
          type: 'tileset3d'
        }
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('returns undefined when layer\'s type is not managed', function() {
        var prov = gaLayers.getCesiumDataSourceById('ch.dummy.wms2');
        expect(prov).to.eql(undefined);
      });

      it('loads DataSource with good params', function() {
        var spy = sinon.stub(Cesium.KmlDataSource, 'load').returns('lala');
        var scene = {camera: {}, canvas: {}};
        var res = gaLayers.getCesiumDataSourceById('ch.dummy.wms', scene);
        expect(res).to.be('lala');
        expect(spy.callCount).to.be(1);
        var args = spy.args[0];
        expect(args[0]).to.be('http://foo.kml');
        expect(args[1].camera).to.be(scene.camera);
        expect(args[1].canvas).to.be(scene.canvas);
        expect(args[1].proxy.getURL('http://foo.kml')).to.be('http://proxy.geo.admin.ch/http/foo.kml');
        spy.restore();
      });
    });

    describe('#getOlLayerById()', function() {
      var layersConfig = {
        wmts: {
          type: 'wmts',
          timestamps: [
            '20180101'
          ],
          serverLayerName: 'serverLayerName',
          label: 'label',
          timeEnabled: true,
          minResolution: 0.5,
          maxResolution: 100,
          opacity: 0.35,
          format: 'jpeg'
        },
        wms: {
          type: 'wms',
          timestamps: [
            '20180101'
          ],
          wmsLayers: 'serverLayerName',
          label: 'label',
          timeEnabled: true,
          minResolution: 0.5,
          maxResolution: 100,
          opacity: 0.35,
          singleTile: true,
          format: 'png'
        },
        aggregate: {
          type: 'aggregate',
          subLayersIds: ['wms', 'wmts'],
          minResolution: 0.5,
          maxResolution: 100,
          opacity: 0.35
        },
        geojson: {
          type: 'geojson',
          minResolution: 0.5,
          maxResolution: 100,
          opacity: 0.35,
          geojsonUrl: 'http://my.json',
          styleUrl: '//mystyle.json'
        }
      };
      layersConfig.wmstiled = angular.copy(layersConfig.wms);
      layersConfig.wmstiled.singleTile = undefined;
      layersConfig.geojsondelay = angular.copy(layersConfig.geojson);
      layersConfig.geojsondelay.updateDelay = 60000;

      var expectCommonProperties = function(olLayer, bodId) {
        var layer = layersConfig[bodId];
        var props = [
          'label',
          'type',
          'timeEnabled',
          'timestamps',
          'geojsonUrl',
          'updateDelay'
        ];
        props.forEach(function(item) {
          expect(olLayer[item]).to.eql(layer[item]);
        });
        expect(olLayer.bodId).to.eql(bodId);
        expect(olLayer.getCesiumImageryProvider).to.be.a(Function);
      };

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
        $httpBackend.flush();
        $rootScope.$digest();
      });

      describe('when online', function() {

        it('returns a WMTS layer', function() {
          var layer = gaLayers.getOlLayerById('wmts');
          expect(layer instanceof ol.layer.Tile).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.defaultExtent);
          expect(layer.getPreload()).to.be(0);
          expect(layer.getUseInterimTilesOnError()).to.be(false);
          var source = layer.getSource();
          expect(source instanceof ol.source.WMTS).to.be.ok();
          expect(source.getDimensions().Time).to.be('20180101');
          expect(source.getProjection().getCode()).to.be('EPSG:21781');
          expect(source.getRequestEncoding()).to.be('REST');
          expect(source.getUrls().length).to.be(5);
          expect(source.getUrls()[0]).to.be('//wmts5.geo.admin.ch/1.0.0/serverLayerName/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.jpeg');
          expect(source.getTileLoadFunction()).to.be.a(Function);
          var tileGrid = source.getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(27);
          expectCommonProperties(layer, 'wmts');
        });

        it('returns a WMS layer', function() {
          var layer = gaLayers.getOlLayerById('wms');
          expect(layer instanceof ol.layer.Image).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.defaultExtent);
          var source = layer.getSource();
          expect(source instanceof ol.source.ImageWMS).to.be.ok();
          expect(source.getUrl()).to.be('//wms.geo.admin.ch/');
          expect(source.getParams()).to.eql({
            LAYERS: 'serverLayerName',
            FORMAT: 'image/png',
            LANG: 'somelang',
            TIME: '20180101'
          });
          expectCommonProperties(layer, 'wms');
        });

        it('returns a tiled WMS layer', function() {
          var layer = gaLayers.getOlLayerById('wmstiled');
          expect(layer instanceof ol.layer.Tile).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.defaultExtent);
          expect(layer.getPreload()).to.be(0);
          expect(layer.getUseInterimTilesOnError()).to.be(false);
          var source = layer.getSource();
          expect(source instanceof ol.source.TileWMS).to.be.ok();
          expect(source.getUrls().length).to.be(6);
          expect(source.getUrls()[0]).to.be('//wms.geo.admin.ch/');
          expect(source.getParams()).to.eql({
            LAYERS: 'serverLayerName',
            FORMAT: 'image/png',
            LANG: 'somelang',
            TIME: '20180101'
          });
          expect(source.getTileLoadFunction()).to.be.a(Function);
          var tileGrid = source.getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.TileGrid).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(27);
          expectCommonProperties(layer, 'wmstiled');
        });

        it('returns a layer group', function() {
          var layer = gaLayers.getOlLayerById('aggregate');
          expect(layer instanceof ol.layer.Group).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getLayers().getLength()).to.be(2);
          expectCommonProperties(layer, 'aggregate');
        });

        it('returns a GeoJSON layer', function() {
          $httpBackend.expectGET('http://mystyle.json').respond({});
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/my.json').respond({
            'features': [{
              'type': 'Feature',
              'geometry': {
                'coordinates': [557660, 33280],
                'type': 'Point'
              },
              'id': '2009',
              'properties': {}
            }],
            'type': 'FeatureCollection'
          });
          var layer = gaLayers.getOlLayerById('geojson');
          expect(layer instanceof ol.layer.Vector).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(1);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.defaultExtent);
          var source = layer.getSource();
          expect(source instanceof ol.source.Vector).to.be.ok();
          expectCommonProperties(layer, 'geojson');
          $httpBackend.flush();
        });

        it('returns a GeoJSON layer with updateDelay', function() {
          $httpBackend.expectGET('http://mystyle.json').respond({});
          var layer = gaLayers.getOlLayerById('geojsondelay');
          expectCommonProperties(layer, 'geojsondelay');
          $httpBackend.flush();
        });
      });

      describe('when offline', function() {

        beforeEach(function() {
          gaNetworkStatus.offline = true;
        });

        it('returns a WMTS layer', function() {
          var layer = gaLayers.getOlLayerById('wmts');
          expect(layer.getMinResolution()).to.be(null);
          expect(layer.getPreload()).to.be(6);
          expect(layer.getUseInterimTilesOnError()).to.be(true);
        });

        it('returns a tiled WMS layer', function() {
          var layer = gaLayers.getOlLayerById('wmstiled');
          expect(layer.getPreload()).to.be(6);
          expect(layer.getUseInterimTilesOnError()).to.be(true);
        });
      });
    });

    describe('#getLayer()', function() {

      it('gets the config of a layer', function() {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        expect(gaLayers.getLayer('foo')).to.be.an(Object);
      });
    });

    describe('#getLayerProperty()', function() {

      it('gets the property of a layer\'s config', function() {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        expect(gaLayers.getLayerProperty('foo', 'type')).to.be('wmts');
      });
    });

    describe('#getMetaDataOfLayer()', function() {

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
      });

      it('returns correct metadata url from a bod id', function() {
        var expectedMdUrl = 'https://legendservice.com/all/somelayer?lang=somelang';
        $httpBackend.expectGET(expectedMdUrl).respond({});
        gaLayers.getMetaDataOfLayer('somelayer');
        $httpBackend.flush();
      });
    });

    describe('#getLayerTimestampFromYear()', function() {
      var layersConfig = {
        wmts: {
          type: 'wmts',
          timestamps: [
            '20160101',
            '19280101',
            '18643112'
          ]
        },
        terrain: {
          type: 'terrain',
          timestamps: [
            '20150101',
            '19280101'
          ]
        },
        othertype: {
          type: 'othertype'
        }
      };

      layersConfig.wmtste = angular.copy(layersConfig.wmts);
      layersConfig.wmtste.timeEnabled = true;

      layersConfig.wmtsyear = angular.copy(layersConfig.wmtste);
      layersConfig.wmtsyear.timeBehaviour = '1928';

      layersConfig.wmtsmonth = angular.copy(layersConfig.wmtste);
      layersConfig.wmtsmonth.timeBehaviour = '192804';

      layersConfig.wmtsday = angular.copy(layersConfig.wmtste);
      layersConfig.wmtsday.timeBehaviour = '19280504';

      layersConfig.wmtsall = angular.copy(layersConfig.wmtste);
      layersConfig.wmtsall.timeBehaviour = 'all';

      layersConfig.wmtslast = angular.copy(layersConfig.wmtste);
      layersConfig.wmtslast.timeBehaviour = 'last';

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
        $httpBackend.flush();
      });

      it('accepts a layer\'s config or a bodId as paramater', function() {
        var ts = gaLayers.getLayerTimestampFromYear(layersConfig.wmts);
        expect(ts).to.be('20160101');

        ts = gaLayers.getLayerTimestampFromYear('wmts');
        expect(ts).to.be('20160101');
      });

      describe('no time enabled layer', function() {

        it('returns first timestamp found for WMTS and Terrain', function() {
          var ts = gaLayers.getLayerTimestampFromYear('wmts');
          expect(ts).to.be('20160101');

          ts = gaLayers.getLayerTimestampFromYear('terrain');
          expect(ts).to.be('20150101');

          ts = gaLayers.getLayerTimestampFromYear('othertype');
          expect(ts).to.be(undefined);
        });
      });

      describe('time enabled layer', function() {

        it('accepts a number as yearStr parameter', function() {
          var ts = gaLayers.getLayerTimestampFromYear('wmtste', 2016);
          expect(ts).to.be('20160101');
          ts = gaLayers.getLayerTimestampFromYear('wmtste', '2016');
          expect(ts).to.be('20160101');
        });

        it('returns a timestamp depending on timeBehavior property', function() {
          var ts = gaLayers.getLayerTimestampFromYear('wmtsyear');
          expect(ts).to.be('19280101');
          ts = gaLayers.getLayerTimestampFromYear('wmtsmonth');
          expect(ts).to.be('19280101');
          ts = gaLayers.getLayerTimestampFromYear('wmtsday');
          expect(ts).to.be('19280101');
          ts = gaLayers.getLayerTimestampFromYear('wmtsall');
          expect(ts).to.be(undefined);
          ts = gaLayers.getLayerTimestampFromYear('wmtslast');
          expect(ts).to.be('20160101');
        });

        it('returns a timestmap depending on yearStr defined in parameter', function() {
          var ts = gaLayers.getLayerTimestampFromYear('wmtste', '1978');
          expect(ts).to.be(undefined);
          ts = gaLayers.getLayerTimestampFromYear('wmtste', '1864');
          expect(ts).to.be('18643112');
        });
      });
    });

    describe('#isBodLayer()', function() {

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
      });

      it('returns a boolean', function() {
       var layer = new ol.layer.Layer({});
       expect(gaLayers.isBodLayer(layer)).to.be(false);
       layer.bodId = 'foo';
       expect(gaLayers.isBodLayer(layer)).to.be(true);
      });
    });

    describe('#getBodParentLayerId()', function() {

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
      });

      it('returns parent layer id if it exists', function() {
       var layer = new ol.layer.Layer({});
       expect(gaLayers.getBodParentLayerId(layer)).to.be(undefined);
       layer.bodId = 'foo';
       expect(gaLayers.getBodParentLayerId(layer)).to.be('bar');
      });
    });

    describe('#hasTooltipBodLayer()', function() {

      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('determines if a bod layer has a tooltip', function() {
        expect(gaLayers.hasTooltipBodLayer(undefined)).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(null)).to.be(false);
        expect(gaLayers.hasTooltipBodLayer('')).to.be(false);

        var layer = gaLayers.getOlLayerById('tooltip');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
        layer = gaLayers.getOlLayerById('notooltip');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(false);
        layer = gaLayers.getOlLayerById('childtooltip1');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
        layer = gaLayers.getOlLayerById('childnotooltip2');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(false);

        expect(gaLayers.hasTooltipBodLayer(new ol.layer.Image())).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(new ol.layer.Vector())).to.be(false);
      });
    });
  });

  describe('gaLayerFilters', function() {
    var gaLayerFilters, gaDefinePropertiesForLayer, gaLayers;

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
      });

      inject(function($injector) {
        gaLayerFilters = $injector.get('gaLayerFilters');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
        gaLayers = $injector.get('gaLayers');
      });
    });

    describe('#selected()', function() {

      it('keeps layers in the display manager', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.selected(layer)).to.be(true);
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.selected(layer)).to.be(false);
      });
    });

    describe('#selectAndVisible()', function() {

      it('keeps visible layers in the display manager', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        layer.visible = true;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(true);
        layer.visible = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
        layer.visible = true;
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
        layer.visible = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
      });
    });

    describe('#permalinked()', function() {

      it('keeps layers displayed in layer manager', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.permalinked(layer)).to.be(false);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.permalinked(layer)).to.be(true);
      });

      it('excludes local kml layer', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.id = 'KML||mykml';
        layer.url = 'http://mykml';
        layer.type = 'KML';
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.permalinked(layer)).to.be(true);
        layer.url = 'mylocalkml';
        expect(gaLayerFilters.permalinked(layer)).to.be(false);
      });
    });

    describe('#timeEnabled()', function() {
      var layer;

      beforeEach(function() {
        layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.timeEnabled = true;
      });

      it('keeps only visible time enabled layers', function() {
        expect(gaLayerFilters.timeEnabled(layer)).to.be(true);
        layer.visible = false;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });

      it('excludes background layers', function() {
        layer.background = true;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });

      it('excludes preview layers', function() {
        layer.preview = true;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });
    });

    describe('#potentialTooltip()', function() {
      var stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'hasTooltipBodLayer');
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps visible bod layers', function() {
        stub.returns(true);
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(true);
      });

      it('excludes bod layer without tooltip', function() {
        stub.returns(false);
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
      });

      it('excludes vector layers', function() {
        stub.returns(true);
        // Not a vector layer -> no support of intersection on vector layers
        // in query tool
        var layer = new ol.layer.Vector({ source: new ol.source.Vector({}) });
        gaDefinePropertiesForLayer(layer);
        layer.bodId = 'foo';
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
      });
    });

    describe('#searchable()', function() {
      var layer, stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'getLayerProperty');
        layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps searchable and visible bod layers', function() {
        stub.returns(true);
        expect(gaLayerFilters.searchable(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.searchable(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.searchable(layer)).to.be(true);
      });

      it('excludes bod layer not searchable', function() {
        stub.returns(false);
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.searchable(layer)).to.be(false);
      });
    });

    describe('#queryable()', function() {
      var layer, stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'getLayerProperty');
        layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps queryable and visible bod layers', function() {
        stub.returns(['attr1']);
        expect(gaLayerFilters.queryable(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.queryable(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(true);
      });

      it('excludes bod layer not queryable', function() {
        stub.returns([]);
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(false);

        stub.returns();
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(false);
      });
    });

    describe('#background()', function() {

      it('keeps background layers', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.background = true;
        expect(gaLayerFilters.background(layer)).to.be(true);
        layer.background = false;
        expect(gaLayerFilters.background(layer)).to.be(false);
      });
    });

    describe('#realtime()', function() {

      it('keeps only realtime layers', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        expect(gaLayerFilters.realtime(layer)).to.be(false);
        layer.updateDelay = null;
        expect(gaLayerFilters.realtime(layer)).to.be(false);
        layer.updateDelay = 100;
        expect(gaLayerFilters.realtime(layer)).to.be(true);
      });
    });
  });

  describe('gaMapUtils', function() {
    var gaMapUtils, $rootScope, $timeout;

    var addLayerToMap = function(bodId) {
      var layer = new ol.layer.Tile();
      map.addLayer(layer);
      return layer;
    };

    beforeEach(function() {
      map = new ol.Map({
        view: new ol.View({
          center: [0, 0],
          resolution: 500
        })
      });
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
        gaMapUtils = $injector.get('gaMapUtils');
      });
    });

    it('tests constants', function() {
      expect(gaMapUtils.Z_PREVIEW_LAYER).to.eql(1000);
      expect(gaMapUtils.Z_PREVIEW_FEATURE).to.eql(1100);
      expect(gaMapUtils.Z_FEATURE_OVERLAY).to.eql(2000);
      expect(gaMapUtils.preload).to.eql(6);
      expect(gaMapUtils.defaultExtent).to.eql([420000, 30000, 900000, 350000]);
      expect(gaMapUtils.viewResolutions).to.eql([650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
          2.5, 2.0, 1.0, 0.5, 0.25, 0.1]);
      expect(gaMapUtils.defaultResolution).to.eql(500);
    });

    describe('#getViewResolutionForZoom()', function() {
      it('gets the view resolution from a map zoom level', function() {
        expect(gaMapUtils.getViewResolutionForZoom(10)).to.eql(1);
      });
    });

    describe('#dataURIToBlob()', function() {
      it('transforms a data URI in Blob', function() {
        // base 64 representation of the background image of the map
        var blob = gaMapUtils.dataURIToBlob('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAAAAABzHgM7AAAAAnRSTlMAAHaTzTgAAAARSURBVHgBY3iKBFEAOp/+MgB+UQnYeBZPWAAAAABJRU5ErkJggg==');
        expect(blob.size).to.eql(88);
        expect(blob.type).to.eql('image/png');
      });
    });

    describe('#extentToRectangle()', function() {

      it('using the default projection', function() {
        var rect = gaMapUtils.extentToRectangle([0, 0, 30, 30]);
        expect(rect).to.be.a(Cesium.Rectangle);
        expect([rect.west, rect.south, rect.east, rect.north]).to.eql([-0.002860778099859713, 0.7834821027741324, -0.0028535435287705122, 0.783487245504938]);
      });

      it('using a user defined projection', function() {
        var rect = gaMapUtils.extentToRectangle([0, 0, 20000000, 10000000], ol.proj.get('EPSG:3857'));
        expect(rect).to.be.a(Cesium.Rectangle);
        expect([rect.west, rect.south, rect.east, rect.north]).to.eql([0, 0, 3.1357118857747954, 1.1597019584657118]);
      });
    });

    describe('#getTileKey()', function() {
      it('gets the tile\'s key', function() {
        [
          '//wmts5.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//wmts54.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//wmts540.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg'
        ].forEach(function(url) {
          expect(gaMapUtils.getTileKey(url)).to.eql('.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg');
        });
      });
    });

    describe('#getMapLayerForBodId()', function() {
      it('gets the olLayer if it\'s on the map', inject(function(gaDefinePropertiesForLayer) {
         var foundLayer;
         var nonBodLayer = addLayerToMap();
         gaDefinePropertiesForLayer(nonBodLayer);
         foundLayer = gaMapUtils.getMapLayerForBodId(map, 'ch.bod.layer');
         expect(foundLayer).to.eql(undefined);

         var prevLayer = addLayerToMap();
         gaDefinePropertiesForLayer(prevLayer);
         prevLayer.bodId = 'ch.bod.layer';
         prevLayer.preview = true;
         foundLayer = gaMapUtils.getMapLayerForBodId(map, 'ch.bod.layer');
         expect(foundLayer).to.eql(undefined);

         var bgLayer = addLayerToMap();
         gaDefinePropertiesForLayer(bgLayer);
         bgLayer.bodId = 'ch.bod.layer';
         bgLayer.background = true;
         foundLayer = gaMapUtils.getMapLayerForBodId(map, 'ch.bod.layer');
         expect(foundLayer).to.eql(bgLayer);

         var bodLayer = addLayerToMap();
         gaDefinePropertiesForLayer(bodLayer);
         bodLayer.bodId = 'ch.bod.layer';
         foundLayer = gaMapUtils.getMapLayerForBodId(map, 'ch.bod.layer');
         expect(foundLayer).to.eql(bodLayer);
      }));
    });

    describe('#getMapOverlayForBodId()', function() {
      it('gets the olLayer if it\'s on the map', inject(function(gaDefinePropertiesForLayer) {
        var foundLayer;
        var nonBodLayer = addLayerToMap();
        gaDefinePropertiesForLayer(nonBodLayer);
        foundLayer = gaMapUtils.getMapOverlayForBodId(map, 'ch.bod.layer');
        expect(foundLayer).to.eql(undefined);

        var prevLayer = addLayerToMap();
        gaDefinePropertiesForLayer(prevLayer);
        prevLayer.bodId = 'ch.bod.layer';
        prevLayer.preview = true;
        foundLayer = gaMapUtils.getMapOverlayForBodId(map, 'ch.bod.layer');
        expect(foundLayer).to.eql(undefined);

        var bgLayer = addLayerToMap();
        gaDefinePropertiesForLayer(bgLayer);
        bgLayer.bodId = 'ch.bod.layer';
        bgLayer.background = true;
        foundLayer = gaMapUtils.getMapOverlayForBodId(map, 'ch.bod.layer');
        expect(foundLayer).to.eql(undefined);

        var bodLayer = addLayerToMap();
        gaDefinePropertiesForLayer(bodLayer);
        bodLayer.bodId = 'ch.bod.layer';
        foundLayer = gaMapUtils.getMapOverlayForBodId(map, 'ch.bod.layer');
        expect(foundLayer).to.eql(bodLayer);
      }));
    });


    describe('#isWMSLayer()', function() {
      it('tests if the layer uses WMS data', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isWMSLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isWMSLayer(null)).to.eql(false);
        expect(gaMapUtils.isWMSLayer('')).to.eql(false);

        var layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isWMSLayer(layer)).to.eql(false);
        layer = addVectorLayerToMap('ch.bod.layer');
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isWMSLayer(layer)).to.eql(false);
        layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isWMSLayer(layer)).to.eql(false);
        layer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isWMSLayer(layer)).to.eql(true);
      }));
    });


    describe('#isVectorLayer()', function() {
      it('tests if the layer uses vector data', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isVectorLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isVectorLayer(null)).to.eql(false);
        expect(gaMapUtils.isVectorLayer('')).to.eql(false);

        var layer = addVectorLayerToMap('ch.bod.layer');
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isVectorLayer(layer)).to.eql(false);
        layer.setSource(new ol.source.Vector());
        expect(gaMapUtils.isVectorLayer(layer)).to.eql(true);
        layer.setSource(new ol.source.ImageVector({source: new ol.source.Vector()}));
        expect(gaMapUtils.isVectorLayer(layer)).to.eql(true);
        layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isVectorLayer(layer)).to.eql(false);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isVectorLayer(layer)).to.eql(true);
      }));
    });


    describe('#isKmlLayer()', function() {
      it('tests if the layer is a KML layer', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isKmlLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isKmlLayer(null)).to.eql(false);
        expect(gaMapUtils.isKmlLayer('')).to.eql(false);

        // with a layer id
        expect(gaMapUtils.isKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isKmlLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isKmlLayer('KML||test/local/foo.kml')).to.eql(true);
        expect(gaMapUtils.isKmlLayer('KML||http://test:com/foo.kml')).to.eql(true);
        expect(gaMapUtils.isKmlLayer('KML||https://test:com/foo.kml')).to.eql(true);

        // with an ol.layer
        var layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(false);
        layer = addLayerGroupToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(false);
        layer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(false);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(true);
        layer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(true);
        layer = addStoredKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isKmlLayer(layer)).to.eql(true);
      }));
    });


    describe('#isLocalKmlLayer()', function() {
      it('tests if the KML used was stored locally', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isLocalKmlLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isLocalKmlLayer(null)).to.eql(false);
        expect(gaMapUtils.isLocalKmlLayer('')).to.eql(false);

        // with an ol.layer
        var layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(false);
        layer = addLayerGroupToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(false);
        layer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(false);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(false);
        layer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(true);
        layer = addStoredKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isLocalKmlLayer(layer)).to.eql(false);
      }));
    });

    describe('#isStoredKmlLayer()', function() {
      it('tests if the KML used comes from public.geo.admin.ch', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isStoredKmlLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer(null)).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('')).to.eql(false);

        // with a layer id
        expect(gaMapUtils.isStoredKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://test:com/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://test:com/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.bgdi.ch/ggggg.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.admin.ch/gggg.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.dev.bgdi.ch/ggggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.geo.admin.ch/gggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://public.dev.bgdi.ch/ggggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://public.geo.admin.ch/gggg.kml')).to.eql(true);

        // with an ol.layer
        var layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addLayerGroupToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addStoredKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(true);
      }));
    });

    describe('#isExternalWmsLayer()', function() {
      it('tests if the WMS comes from a source outside the bund', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isExternalWmsLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer(null)).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('')).to.eql(false);

        // with a layer id
        expect(gaMapUtils.isExternalWmsLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa||aa||aa')).to.eql(true);
        expect(gaMapUtils.isExternalWmsLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('KML||http://test:com/foo.kml')).to.eql(false);

        // with an ol.layer
        var layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(false);
        layer = addLayerGroupToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(true);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(false);
        layer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(false);
        layer = addStoredKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(false);
        layer = addBodWmsToMap('bodwms');
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmsLayer(layer)).to.eql(false);
      }));
    });

    describe('#isExternalWmtsLayer()', function() {
      it('tests if the WMTS comes from a source outside the bund', inject(function(gaDefinePropertiesForLayer) {
        expect(gaMapUtils.isExternalWmtsLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer(null)).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('')).to.eql(false);

        // with a layer id
        expect(gaMapUtils.isExternalWmtsLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMTS||aa||aa')).to.eql(true);
        expect(gaMapUtils.isExternalWmtsLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('KML||http://test:com/foo.kml')).to.eql(false);

        // with an ol.layer
        var layer = addLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(false);
        layer = addLayerGroupToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isStoredKmlLayer(layer)).to.eql(false);
        layer = addExternalWmtsLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(true);
        layer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(false);
        layer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(false);
        layer = addStoredKmlLayerToMap();
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(false);
        layer = addBodWmtsToMap('bodwmtss');
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils.isExternalWmtsLayer(layer)).to.eql(false);
      }));
    });

    describe('#isMeasureFeature()', function() {
      it('test if a feature has been created by the measure tool', function() {
        var feat = new ol.Feature();
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);

        feat.setId('mymeasure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);

        feat.setId('measure_343434');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(true);

        feat.setId(null);
        feat.set('type', 'measure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(true);

        feat.set('type', 'mymeasure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);
      });
    });

    describe('#moveLayerOnTop()', function() {
      it('moves layer on top of the map', inject(function(gaDefinePropertiesForLayer) {
        var firstLayerAdded = addLayerToMap();
        var secondLayerAdded = addLayerToMap();
        var thirdLayerAdded = addLayerToMap();

        gaMapUtils.moveLayerOnTop(map, firstLayerAdded);
        expect(firstLayerAdded).to.eql(map.getLayers().getArray()[2]);
        expect(thirdLayerAdded).to.eql(map.getLayers().getArray()[1]);
        expect(secondLayerAdded).to.eql(map.getLayers().getArray()[0]);

        gaMapUtils.moveLayerOnTop(map, secondLayerAdded);
        expect(secondLayerAdded).to.eql(map.getLayers().getArray()[2]);
        expect(firstLayerAdded).to.eql(map.getLayers().getArray()[1]);
        expect(thirdLayerAdded).to.eql(map.getLayers().getArray()[0]);
      }));
    });

    /* TODO: fix this test
    describe('#resetMapToNorth()', function() {
      it.only('reset map to north', function(done) {
        map.getView().setRotation(90);
        expect(map.getView().getRotation()).to.be(90);
        gaMapUtils.resetMapToNorth(map).then(function() {
          expect(map.getView().getRotation()).to.be(0);
          done();
        });
      });
    });*/

    describe('#moveTo()', function() {
      it('move map to a coordinate and a zoom', function(done) {
        map.getView().setCenter([1, 2]);
        map.getView().setZoom(6);
        gaMapUtils.moveTo(map, null, 3, [0, 1]).then(function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          expect(map.getView().getZoom()).to.eql(3);
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('#zoomToExtent()', function() {
      it('zoom map to en extent', function(done) {
        map.setSize([600, 600]);
        map.getView().setCenter([1, 2]);
        map.getView().setZoom(6);
        gaMapUtils.zoomToExtent(map, null, [-40, -40, 40, 40]).then(function() {
          expect(map.getView().calculateExtent(map.getSize())).to.eql([-44.78732126084546, -44.78732126084546, 44.78732126084546, 44.78732126084546]);
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('#panTo()', function() {
      it('pan map to a coordinate', function(done) {
        map.getView().setCenter([1, 2]);
        gaMapUtils.panTo(map, null, [0, 1]).then(function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          done();
        });
        $rootScope.$digest();
      });
    });

    /* TODO: fix this test
    describe('#flyTo()', function() {
      it('move map to a coordinate ', function(done) {
        map.setSize([600, 600]);
        map.getView().setCenter([1, 2]);
        map.getView().setResolution(500);
        var dest = [0, 1];
        gaMapUtils.flyTo(map, null, dest, ol.extent.buffer(dest.concat(dest), 100)).then(function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          expect(map.getView().calculateExtent(map.getSize())).to.eql([-750, -749, 750, 751]);
          done();
        });
      });
    });*/

    describe('#intersectWithDefaultExtent()', function() {
      var dflt = [420000, 30000, 900000, 350000];

      it('returns the default extent if the extent is not valid', function() {
        expect(gaMapUtils.intersectWithDefaultExtent()).to.eql(dflt);
        expect(gaMapUtils.intersectWithDefaultExtent([1, 2])).to.eql(dflt);
      });

      it('returns undefined if there is no intersection', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([0, 0, 1, 1])).to.eql(undefined);
      });

      it('returns undefined if the extent doesn\'t contains number', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([undefined, 1, 2, 2])).to.eql(undefined);
        // NaN
        expect(gaMapUtils.intersectWithDefaultExtent([0, 1, Math.max(undefined, 5), 2])).to.eql(undefined);
      });

      it('returns the intersection', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([320000, 310000, 800000, 450000])).to.eql([420000, 310000, 800000, 350000]);
      });
    });

    describe('#getFeatureOverlay()', function() {
      it('creates a feature overlay', function() {
        var feats = [new ol.Feature(), new ol.Feature()];
        var style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'red'
          })
        });
        var layer = gaMapUtils.getFeatureOverlay(feats, style);
        expect(layer).to.be.an(ol.layer.Vector);
        expect(layer.getStyle().getFill().getColor()).to.eql('red');
        expect(layer.getSource()).to.be.an(ol.source.Vector);
        expect(layer.getZIndex()).to.eql(gaMapUtils.Z_FEATURE_OVERLAY);
        expect(layer.getSource().getFeatures().length).to.eql(2);
        expect(layer.displayInLayerManager).to.eql(false);
      });
    });

    describe('#getLodFromRes()', function() {
      it('gets lod from resolution', function() {
        expect(gaMapUtils.getLodFromRes()).to.eql(undefined);
        expect(gaMapUtils.getLodFromRes(500)).to.eql(7);
      });
    });

    describe('#getVectorSourceExtent()', function() {
      it('gets the extent of an ol.source.Vector', function() {
        var feat = new ol.Feature(new ol.geom.Point([1, 2]));
        var feat2 = new ol.Feature(new ol.geom.LineString([[-1, -1], [1, 2], [0, 0]]));
        var src = new ol.source.Vector({
          features: [feat, feat2]
        });
        expect(gaMapUtils.getVectorSourceExtent(src)).to.eql([-1, -1, 1, 2]);

        var src2 = new ol.source.Vector({
          features: [feat, feat2],
          useSpatialIndex: false
        });
        expect(gaMapUtils.getVectorSourceExtent(src2)).to.eql([-1, -1, 1, 2]);
      });
    });
  });
});
