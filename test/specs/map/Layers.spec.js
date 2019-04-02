/* eslint-disable max-len */
describe('ga_layers_service', function() {

  describe('gaLayers', function() {
    var gaLayers, gaTime, $httpBackend, $rootScope, $q, gaGlobalOptions, gaNetworkStatus, $timeout;
    var expectedUrl = 'https://example.com/all?lang=somelang';

    var dfltGeojson = {
      'features': [{
        'type': 'Feature',
        'geometry': {
          'coordinates': [600000, 200000],
          'type': 'Point'
        },
        'id': '2009',
        'properties': {}
      }],
      'type': 'FeatureCollection'
    };

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
      geojson: {
        type: 'geojson',
        minResolution: 0.5,
        maxResolution: 100,
        opacity: 0.35,
        geojsonUrl: 'http://mygeojson.json',
        styleUrl: '//mystyle.json'
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
    var terrainTpl = '//3d.geo.admin.ch/1.0.0/{layer}/default/{Time}/4326';
    var wmtsLV03Tpl = '//wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{Time}/4326/{z}/{y}/{x}.{format}';
    var wmtsTpl = '//wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{Time}/4326/{z}/{x}/{y}.{format}';
    var vectorTilesTpl = '//vectortiles100.geo.admin.ch/{layer}/{Time}/tileset.json';
    var wmsTpl = '//wms{s}.geo.admin.ch/?layers={layer}&format=image%2F{format}&service=WMS&version=1.3.0&request=GetMap&crs=CRS:84&bbox={westProjected},{southProjected},{eastProjected},{northProjected}&width=512&height=512&styles=';
    var wmsTplTime = wmsTpl + '&time={Time}';

    var expectWmtsUrl = function(l, f, epsg) {
      if (epsg === '21781') {
        return expectUrl(wmtsLV03Tpl, l, undefined, f);
      } else {
        return expectUrl(wmtsTpl, l, undefined, f);
      }
    };
    var expectTerrainUrl = function(l, t, f) {
      return expectUrl(terrainTpl, l, t, f);
    };
    var expectWmsUrl = function(l, f) {
      return expectUrl(wmsTpl, l, undefined, f);
    };
    var expectWmsTimeUrl = function(l, f) {
      return expectUrl(wmsTplTime, l, undefined, f);
    };
    var expectVectorTilesUrl = function(l, t) {
      return expectUrl(vectorTilesTpl, l, t);
    };
    var expectUrl = function(tpl, l, t, f) {
      var tmp = tpl;
      if (angular.isDefined(t)) {
        tmp = tpl.replace('{Time}', t);
      }
      return tmp.replace('{layer}', l).replace('{format}', f || 'png');
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
        $timeout = $injector.get('$timeout');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        gaLayers = $injector.get('gaLayers');
        gaTime = $injector.get('gaTime');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaNetworkStatus = $injector.get('gaNetworkStatus');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('constructor', function() {
      var opaqueLayersIds = [
        'ch.swisstopo.swissimage-product',
        'ch.swisstopo.swissimage-product_3d',
        'ch.swisstopo.pixelkarte-farbe',
        'ch.swisstopo.pixelkarte-farbe_3d',
        'ch.swisstopo.pixelkarte-grau',
        'ch.swisstopo.pixelkarte-grau_3d',
        'ch.swisstopo.swisstlm3d-karte-farbe',
        'ch.swisstopo.swisstlm3d-karte-farbe_3d',
        'ch.swisstopo.swisstlm3d-karte-grau',
        'ch.swisstopo.swisstlm3d-karte-grau_3d',
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
          expect(gaLayers.getLayer(id).opaque).to.be(!(id === 'nonopaque'));
        });
      });

      it('adds terrain layer config', function() {
        $httpBackend.flush();
        $rootScope.$digest();
        var terrain = gaLayers.getLayer('ch.swisstopo.terrain.3d');
        expect(terrain).to.eql({
          type: 'terrain',
          serverLayerName: 'ch.swisstopo.terrain.3d',
          timestamps: ['20180601'],
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

    describe('#_getTerrainUrl', function() {
      var layersConfig = {
        terrain: {
          type: 'terrain',
          timestamps: [
            '20160101'
          ]
        }
      };
      beforeEach(function() {
        $httpBackend.whenGET(expectedUrl).respond(layersConfig);
      });
      it('returns a valid URL', function(done) {
        gaLayers.loadConfig().then(function(layers) {
          var config3d = gaLayers.getConfig3d('terrain');
          var timestamp = gaLayers.getLayerTimestampFromYear(config3d, gaTime.get());
          expect(gaLayers._getTerrainUrl('terrain', timestamp)).to.be(expectTerrainUrl('terrain', '20160101'));
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
    })

    describe('#getCesiumTerrainProviderById()', function() {
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
          expect(prov.bodId).to.be('terrain');
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('doesn\'t use current time', function(done) {
        gaTime.get = function() { return '2017'; };
        gaLayers.loadConfig().then(function(layers) {
          var spy = sinon.spy(gaLayers, 'getLayerTimestampFromYear');
          gaLayers.getCesiumTerrainProviderById('terrain');
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

    describe('#getCesiumTileset3dById', function() {
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
          config3d: 'ch.dummy.badtype.3d'
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
        var prov = gaLayers.getCesiumTileset3dById('ch.dummy.wms2');
        expect(prov).to.eql(undefined);
      });

      it('returns a Cesium3DTileset object', function() {
        var spy = sinon.spy(Cesium, 'Cesium3DTileset');
        var prov = gaLayers.getCesiumTileset3dById('ch.dummy.wms');
        expect(prov).to.be.an(Cesium.Cesium3DTileset);
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectVectorTilesUrl('ch.dummy.tileset.3d', '20170110'));
        expect(prov.bodId).to.be('ch.dummy.wms');
        spy.restore();
      });
    });

    describe('#getCesiumImageryProviderById()', function() {
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
        'ch.swisstopo.swissimage-product': {
          type: 'wmts',
          timestamps: [
            'current'
          ],
          format: 'jpeg',
          serverLayerName: 'ch.swisstopo.swissimage-product'
        },
        wms: {
          type: 'wms',
          wmsLayers: 'wmsLayers'
        },
        wmsTime: {
          type: 'wms',
          wmsLayers: 'wmsLayers',
          timeEnabled: true
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
        wmtstod: {
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
        var prov = gaLayers.getCesiumImageryProviderById('wmts', {time: '20160201'});
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsUrl('serverlayername3d', 'png', '4326'));
        expect(params.subdomains).to.eql(['5', '6', '7', '8', '9']);
        expect(params.minimumLevel).to.eql(gaGlobalOptions.minimumLevel);
        expect(params.maximumRetrievingLevel).to.eql(gaGlobalOptions.maximumRetrievingLevel);
        expect(params.maximumLevel).to.eql(18);
        expect(params.tilingScheme).to.be.an(Cesium.GeographicTilingScheme);
        expect(params.tileWidth).to.eql(256);
        expect(params.tileHeight).to.eql(256);
        expect(params.hasAlphaChannel).to.eql(true);
        expect(params.availableLevels).to.be(gaGlobalOptions.imageryAvailableLevels);
        expect(params.metadataUrl).to.eql(gaGlobalOptions.imageryMetadataUrl);
        expect(params.customTags.Time()).to.be('20160201');
        expect(prov.bodId).to.be('wmts3d');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a wmts with custom value', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('custom', {time: '20160201'});
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsUrl('serverlayername3d', 'jpeg', '4326'));
        expect(params.minimumLevel).to.eql(9);
        expect(params.maximumRetrievingLevel).to.eql(17);
        expect(params.maximumLevel).to.eql(undefined);
        expect(params.hasAlphaChannel).to.eql(false);
        expect(params.customTags.Time()).to.be('20160201');
        expect(prov.bodId).to.be('wmts3dcustom');
        spy.restore();
      });

      it('returns a CesiumImageryProvider form a wmts with the good url for swissimage product in 3d', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('ch.swisstopo.swissimage-product', {time: 'current'});
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmtsUrl('ch.swisstopo.swissimage-product', 'jpeg', '4326'));
        expect(params.customTags.Time()).to.be('current');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a wms config', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('wms', {});
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmsUrl('wmsLayers'));
        expect(params.subdomains).to.eql(['', '0', '1', '2', '3', '4']);
        expect(params.tileWidth).to.eql(512);
        expect(params.tileHeight).to.eql(512);
        expect(params.customTags.Time()).to.be('');
        expect(prov.bodId).to.be('wms');
        spy.restore();
      });

      it('returns a CesiumImageryProvider from a time enabled wms config', function() {
        var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
        var prov = gaLayers.getCesiumImageryProviderById('wmsTime', {});
        expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
        // Properties of Cesium object are set in a promise and I don 't
        // succeed to test it so we test the params we send to the constructor
        // instead.
        var params = spy.args[0][0];
        expect(params.url).to.eql(expectWmsTimeUrl('wmsLayers'));
        expect(params.subdomains).to.eql(['', '0', '1', '2', '3', '4']);
        expect(params.tileWidth).to.eql(512);
        expect(params.tileHeight).to.eql(512);
        expect(params.customTags.Time()).to.be('');
        expect(prov.bodId).to.be('wmsTime');
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

    describe('#getCesiumDataSourceById', function() {
      var layersConfig = {
        'ch.dummy.wms': {
          type: 'wms',
          config3d: 'ch.dummy.kml.3d'
        },
        'ch.dummy.kml.3d': {
          type: 'kml',
          url: 'http://foo.kml'
        },
        'ch.dummy.wms2': {
          type: 'wms',
          config3d: 'ch.dummy.badtype.3d'
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
        expect(args[0]).to.be.an(Cesium.Resource);
        expect(args[0].url).to.be('http://proxy.geo.admin.ch/http/foo.kml');
        expect(args[0].proxy.getURL('http://foo.kml')).to.be('http://proxy.geo.admin.ch/http/foo.kml');
        expect(args[1].camera).to.be(scene.camera);
        expect(args[1].canvas).to.be(scene.canvas);
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
        geojson: dfltLayersConfig.geojson
      };
      layersConfig.wmtsWithResolutions = angular.extend({resolutions: ['100', '50', '10']}, layersConfig.wmts);
      layersConfig.wmtsWithTileGridMinRes = angular.extend({tileGridMinRes: '12'}, layersConfig.wmts);
      layersConfig.wmstiled = angular.copy(layersConfig.wms);
      layersConfig.wmstiled.singleTile = undefined;
      layersConfig.wmsTiledWithResolutions = angular.extend({resolutions: ['100', '50', '10']}, layersConfig.wmstiled);
      layersConfig.wmsTiledWithTileGridMinRes = angular.extend({tileGridMinRes: '12'}, layersConfig.wmstiled);
      layersConfig.geojsondelay = angular.copy(layersConfig.geojson);
      layersConfig.geojsondelay.updateDelay = 60000;

      var expectCommonProperties = function(olLayer, bodId) {
        var layer = layersConfig[bodId];
        var props = [
          'label',
          'timeBehaviour',
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
          expect(layer.getExtent()).to.eql(gaGlobalOptions.swissExtent);
          expect(layer.getPreload()).to.be(0);
          expect(layer.getUseInterimTilesOnError()).to.be(false);
          var source = layer.getSource();
          expect(source instanceof ol.source.WMTS).to.be.ok();
          expect(source.getDimensions().Time).to.be('20180101');
          expect(source.getProjection().getCode()).to.be('EPSG:2056');
          expect(source.getRequestEncoding()).to.be('REST');
          expect(source.getUrls().length).to.be(5);
          expect(source.getUrls()[0]).to.be('//wmts5.geo.admin.ch/1.0.0/serverLayerName/default/{Time}/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg');
          expect(source.getTileLoadFunction()).to.be.a(Function);
          var tileGrid = source.getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
          expect(tileGrid.getResolutions().length).to.equal(27);
          expectCommonProperties(layer, 'wmts');
        });

        it('returns a WMTS layer when time is undefined', function() {
          sinon.stub(gaTime, 'get').returns('1934');
          var layer = gaLayers.getOlLayerById('wmts');
          var source = layer.getSource();
          expect(source instanceof ol.source.WMTS).to.be.ok();
          expect(source.getDimensions().Time).to.be();
        });

        it('returns a WMTS getting the tileGridMinRes from an array of resolutions', function() {
          var tileGrid = gaLayers.getOlLayerById('wmtsWithResolutions').getSource().getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(21);
          // Test if the resolutions array is unchanged
          expect(gaLayers.getLayer('wmtsWithResolutions').resolutions.length).to.be(3);
        });

        it('returns a WMTS getting the tileGridMinRes from tileGridMinRes property', function() {
          var tileGrid = gaLayers.getOlLayerById('wmtsWithTileGridMinRes').getSource().getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(20);
        });

        it('returns a WMS layer', function() {
          var layer = gaLayers.getOlLayerById('wms');
          expect(layer instanceof ol.layer.Image).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.swissExtent);
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
          expect(layer.getExtent()).to.eql(gaGlobalOptions.swissExtent);
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
          expect(tileGrid.getResolutions().length).to.eql(29);
          expectCommonProperties(layer, 'wmstiled');
        });

        it('returns a tiled WMS getting the tileGridMinRes from an array of resolutions', function() {
          var tileGrid = gaLayers.getOlLayerById('wmsTiledWithResolutions').getSource().getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.TileGrid).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(21);
        });

        it('returns a tiled WMS getting the tileGridMinRes from the config', function() {
          var tileGrid = gaLayers.getOlLayerById('wmsTiledWithTileGridMinRes').getSource().getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.TileGrid).to.be.ok();
          expect(tileGrid.getResolutions().length).to.eql(20);
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

        it('returns a GeoJSON layer using default data projection (EPSG:4326)', function(done) {
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mygeojson.json').respond({
            'features': [{
              'type': 'Feature',
              'geometry': {
                'coordinates': [24, 56],
                'type': 'Point'
              },
              'id': '2009',
              'properties': {}
            }],
            'type': 'FeatureCollection'
          });
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mystyle.json').respond({});
          var layer = gaLayers.getOlLayerById('geojson');
          expect(layer instanceof ol.layer.Vector).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          // opacity from layersConfig
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.swissExtent);
          var source = layer.getSource();
          expect(source instanceof ol.source.Vector).to.be.ok();
          expectCommonProperties(layer, 'geojson');
          $q.all([gaLayers.getLayerPromise('geojson'),
            gaLayers.getLayerStylePromise('geojson')]).then(function(vals) {
            expect(vals[0][0].getGeometry().getCoordinates()).to.eql([3639371.9660116024, 2322382.8078037957]);
            done();
          });
          $rootScope.$apply();
          $httpBackend.flush();
        });

        it('returns a GeoJSON layer with updateDelay', function(done) {
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mygeojson.json').respond({
            'features': [{
              'type': 'Feature',
              'geometry': {
                'coordinates': [24, 56],
                'type': 'Point'
              },
              'id': '2009',
              'properties': {}
            }],
            'type': 'FeatureCollection'
          });
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mystyle.json').respond({});
          var layer = gaLayers.getOlLayerById('geojsondelay');
          expectCommonProperties(layer, 'geojsondelay');
          $q.all([gaLayers.getLayerPromise('geojsondelay'),
            gaLayers.getLayerStylePromise('geojsondelay')]).then(function(vals) {
            expect(vals[0][0].getGeometry().getCoordinates()).to.eql([3639371.9660116024, 2322382.8078037957]);
            done();
          });
          $rootScope.$apply();
          $httpBackend.flush();
        });

        it('returns a GeoJSON layer using a custom projection (EPSG:21781)', function(done) {
          var externalStyleUrl = 'http://external/mystyle.json';
          var styleUrl = gaGlobalOptions.proxyUrl + 'http/external%2Fmystyle.json';
          var opts = {
            externalStyleUrl: externalStyleUrl
          };
          $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mygeojson.json').respond({
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:21781'
              }
            },
            'features': [{
              'type': 'Feature',
              'geometry': {
                'coordinates': [600000, 200000],
                'type': 'Point'
              },
              'id': '2009',
              'properties': {}
            }],
            'type': 'FeatureCollection'
          });
          $httpBackend.expectGET(styleUrl).respond({
            'type': 'single',
            'geomType': 'point',
            'vectorOptions': {
              'type': 'square',
              'radius': 10,
              'fill': {
                'color': 'red'
              },
              'stroke': {
                'color': 'red'
              }
            }
          });
          var layer = gaLayers.getOlLayerById('geojson', opts);
          expect(layer instanceof ol.layer.Vector).to.be.ok();
          expect(layer.getMinResolution()).to.be(0.5);
          expect(layer.getMaxResolution()).to.be(100);
          expect(layer.getOpacity()).to.be(0.35);
          expect(layer.getExtent()).to.eql(gaGlobalOptions.swissExtent);
          var source = layer.getSource();
          expect(source instanceof ol.source.Vector).to.be.ok();
          expectCommonProperties(layer, 'geojson');
          $q.all([gaLayers.getLayerPromise('geojson'),
            gaLayers.getLayerStylePromise('geojson')]).then(function(vals) {
            expect(vals[0][0].getGeometry().getCoordinates()).to.eql([2600000, 1199999.999848965]);
            var s = vals[1].getFeatureStyle(vals[0][0]);
            expect(s.getImage().getFill().getColor()).to.equal('red');
            expect(s.getImage().getStroke().getColor()).to.equal('red');
            done();
          });
          $rootScope.$apply();
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

    describe('#getLayerPromise()', function() {

      it('gets a rejected promise if the layer\'s bodId doesn\'t exist', function(done) {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        gaLayers.getLayerPromise('doesntexist').then(angular.noop, function() {
          done();
        });
        $rootScope.$digest();
      });

      it('gets a rejected promise if the layer is not geojson', function(done) {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        gaLayers.getLayerPromise('foo').then(angular.noop, function() {
          done();
        });
        $rootScope.$digest();
      });

      it('creates the layer then gets the promise', function(done) {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mygeojson.json').respond(dfltGeojson);
        $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mystyle.json').respond({});
        var spy = sinon.spy(gaLayers, 'getOlLayerById').withArgs('geojson');
        gaLayers.getLayerPromise('geojson').then(function() {
          done();
        });
        $httpBackend.flush();
        expect(spy.callCount).to.be(1);
        $rootScope.$digest();
      });

      it('gets the promise', function(done) {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mygeojson.json').respond(dfltGeojson);
        $httpBackend.expectGET(gaGlobalOptions.proxyUrl + 'http/mystyle.json').respond({});
        gaLayers.getOlLayerById('geojson');
        $httpBackend.flush();
        gaLayers.getLayerPromise('geojson').then(function() {
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('#getLayer()', function() {

      it('gets the config of a layer', function() {
        $httpBackend.expectGET(expectedUrl).respond(dfltLayersConfig);
        $httpBackend.flush();
        expect(gaLayers.getLayer('foo')).to.be.an(Object);
      });
    });

    describe('#getConfig3d()', function() {

      it('gets the config 3d of a layer', function() {
        $httpBackend.expectGET(expectedUrl).respond({
          'foo': { config3d: 'foo3d' },
          'foo3d': {}
        });
        $httpBackend.flush();
        var config = gaLayers.getLayer('foo');
        expect(gaLayers.getConfig3d(config)).to.be.an(Object);
      });

      it('returns the config 2d if there is no special config 3d for a layer', function() {
        $httpBackend.expectGET(expectedUrl).respond({
          'foo': {}
        });
        $httpBackend.flush();
        var config = gaLayers.getLayer('foo');
        expect(gaLayers.getConfig3d(config)).to.be(config);
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
        var layer = new ol.layer.Tile({});
        expect(gaLayers.isBodLayer(layer)).to.be(false);
        layer.bodId = 'foo';
        expect(gaLayers.isBodLayer(layer)).to.be(true);
      });
    });

    describe('#hasTooltipBodLayer()', function() {

      it('returns false if the layer is not a bod layer', function() {
        $httpBackend.whenGET(expectedUrl).respond({});
        $rootScope.$digest();
        $httpBackend.flush();

        expect(gaLayers.hasTooltipBodLayer(undefined)).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(null)).to.be(false);
        expect(gaLayers.hasTooltipBodLayer('')).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(new ol.layer.Image())).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(new ol.layer.Vector())).to.be(false);
      });

      it('returns true if a bod layer has a tooltip', function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $rootScope.$digest();
        $httpBackend.flush();

        var layer = gaLayers.getOlLayerById('tooltip');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
        layer = gaLayers.getOlLayerById('childtooltip1');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
      });

      it('returns false if a bod layer has no tooltip', function() {
        $httpBackend.whenGET(expectedUrl).respond(dfltLayersConfig);
        $rootScope.$digest();
        $httpBackend.flush();

        var layer = gaLayers.getOlLayerById('notooltip');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(false);
        layer = gaLayers.getOlLayerById('childtooltip1');
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
      });

      it('returns the correct value if 3d is active or not', function() {
        $httpBackend.whenGET(expectedUrl).respond({
          'foo': {config3d: 'foo3d', tooltip: false},
          'foo3d': {tooltip: true},
          'bar': {config3d: 'bar3d', tooltip: true},
          'bar3d': {tooltip: false}
        });
        $rootScope.$digest();
        $httpBackend.flush();
        var layer = {};
        layer.bodId = 'foo';
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(false);
        expect(gaLayers.hasTooltipBodLayer(layer, true)).to.be(true);
        layer.bodId = 'bar';
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
        expect(gaLayers.hasTooltipBodLayer(layer, true)).to.be(false);
      });

      it('returns the parentLayerId value if tooltip is undefined', function() {
        $httpBackend.whenGET(expectedUrl).respond({
          'foo': {parentLayerId: 'parentfoo'},
          'parentfoo': {tooltip: true},
          'bar': {config3d: 'bar3d', tooltip: false},
          'bar3d': {parentLayerId: 'parentfoo'}
        });
        $rootScope.$digest();
        $httpBackend.flush();
        var layer = {};
        layer.bodId = 'foo';
        expect(gaLayers.hasTooltipBodLayer(layer)).to.be(true);
        layer.bodId = 'bar';
        expect(gaLayers.hasTooltipBodLayer(layer, true)).to.be(true);
      });
    });
  });
});
