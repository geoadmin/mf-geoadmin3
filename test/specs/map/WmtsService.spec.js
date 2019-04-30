/* eslint-disable max-len */
describe('ga_wmts_service', function() {
  describe('gaWmts', function() {
    var gaWmts, map, map2056, gaGlobalOptions, gaMapUtils, $httpBackend, $timeout, $window;

    var expectProperties = function(layer, options) {
      // Test Layer's properties
      // set in constructor
      expect(layer).to.be.an(ol.layer.Tile);
      expect(layer.id).to.be(options.id || 'WMTS||' + options.layer + '||' + options.capabilitiesUrl);
      expect(layer.url).to.be(options.capabilitiesUrl);
      expect(layer.invertedOpacity).to.be(options.invertedOpacity || 0);
      expect(layer.visible).to.be(angular.isDefined(options.visible) ? options.visible : true);
      // set after creation
      expect(layer.preview).to.be(!!options.preview);
      expect(layer.displayInLayerManager).to.be(!layer.preview);
      expect(layer.useThirdPartyData).to.be(!!options.useThirdPartyData);
      expect(layer.label).to.be(options.label);
      expect(layer.timeEnabled).to.be(options.timeEnabled);
      expect(layer.time).to.be(options.time);
      expect(layer.getCesiumImageryProvider).to.be.a(Function);

      // Tests source's properties
      var source = layer.getSource();
      expect(source).to.be.an(ol.source.WMTS);
      expect(source.urls[0]).to.be(options.url);

      // Tests Cesium provider
      var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
      var prov = layer.getCesiumImageryProvider();
      if (!prov && !options.url3d) {
        expect(prov).to.be(undefined);
        expect(layer.displayIn3d).to.be(false);
        // The 2nd call should return undefiend driectly
        var spy2 = sinon.spy(layer, 'getSource');
        layer.getCesiumImageryProvider();
        expect(spy2.callCount).to.be(0);
        spy.restore();
        return;
      }
      expect(layer.displayIn3d).to.be(true);
      expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
      var p = spy.args[0][0];
      expect(p.url).to.be.a(Cesium.Resource);
      expect(p.minimumRetrievingLevel).to.be(gaGlobalOptions.minimumRetrievingLevel);
      expect(p.rectangle).to.be.an(Cesium.Rectangle);
      expect(p.rectangle.west).to.be(-0.21764144550040762);
      expect(p.rectangle.south).to.be(0.7527404204957977);
      expect(p.rectangle.east).to.be(0.12982982483435074);
      expect(p.rectangle.north).to.be(0.75613172160374);

      if (options.useThirdPartyData) {
        expect(p.url.url).to.be(gaGlobalOptions.proxyUrl + encodeURIComponent(options.url3d).replace('http%3A%2F%2F', 'http/'));
        expect(p.url.proxy.getURL('http://wmts.ch')).to.be(
            gaGlobalOptions.proxyUrl + 'http/wmts.ch');
      } else {
        expect(p.proxy.getURL('https://wms.geo.admin.ch')).to.be(
            'https://wms.geo.admin.ch');
      }
      expect(p.tilingScheme).to.be.an(options.tilingScheme || Cesium.GeographicTilingScheme);
      expect(p.hasAlphaChannel).to.be(angular.isDefined(options.hasAlphaChannel) ? options.hasAlphaChannel : true);
      expect(p.availableLevels).to.be(gaGlobalOptions.imageryAvailableLevels);
      spy.restore();
    };

    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');
        $window = $injector.get('$window');
        gaWmts = $injector.get('gaWmts');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaMapUtils = $injector.get('gaMapUtils');
      });

      map = new ol.Map({});
      map2056 = new ol.Map({
        view: new ol.View({
          projection: ol.proj.get('2056')
        })
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

    describe('#getOlLayerFromGetCap()', function() {

      it('parse the GetCap with the ol formatter if it\'s a string', function() {
        var getCap = '<Capabilities version="1.0.0"></capabilities>';
        var spy = sinon.spy(ol.format.WMTSCapabilities.prototype, 'read');
        var layer = gaWmts.getOlLayerFromGetCap(map, getCap, 'id', {});
        expect(spy.callCount).to.be(1);
        expect(spy.args[0][0]).to.be(getCap);
        expect(layer).to.be(undefined);
      });

      it('returns undefined if the content is empty', function() {
        var identifier = 'ch.are.alpenkonvention';
        var getCap = {};
        var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {
          capabilitiesUrl: 'http:// wmts.xml'
        });
        expect(layer).to.be(undefined);
      });

      it('returns undefined if there is no layers', function() {
        var identifier = 'ch.are.alpenkonvention';
        var getCap = {
          Contents: {
            Layer: []
          }
        };
        var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {});
        expect(layer).to.be(undefined);
      });

      describe('set timeEnabled and time properties', function() {
        var getCapUrl = 'base/test/data/wmts-basic.xml';
        it(' set timeEnabled to false if the layer has 2 timestamps but one is current', function(done) {
          $.get(getCapUrl, function(resp) {
            var getCap = new ol.format.WMTSCapabilities().read(resp);
            var identifier = 'ch.vbs.waldschadenkarte';

            var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {
              capabilitiesUrl: getCapUrl
            });
            expectProperties(layer, {
              url: 'https://wmts.geo.admin.ch/1.0.0/ch.vbs.waldschadenkarte/default/{Time}/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
              label: 'Carte des dégâts aux forêts',
              visible: true,
              useThirdPartyData: false,
              layer: identifier,
              capabilitiesUrl: getCapUrl,
              time: 'current',
              projection: undefined,
              timeEnabled: false
            });
            done();
          });
        });

        it('set timeEnabled to true if the layer has more than 2 timestamps and one is current', function(done) {
          $.get(getCapUrl, function(resp) {
            var getCap = new ol.format.WMTSCapabilities().read(resp);
            var identifier = 'ch.vbs.waldschadenkarte2';

            var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {
              capabilitiesUrl: getCapUrl
            });
            expectProperties(layer, {
              url: 'https://wmts.geo.admin.ch/1.0.0/ch.vbs.waldschadenkarte/default/{Time}/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
              label: 'Carte des dégâts aux forêts',
              visible: true,
              useThirdPartyData: false,
              layer: identifier,
              capabilitiesUrl: getCapUrl,
              time: 'current',
              projection: undefined,
              timeEnabled: true
            });
            done();
          });
        });
      });

      describe('using swiss layers, which are not display in 3d', function() {
        [
          'base/test/data/wmts-basic.xml',
          'base/test/data/wmts-basic-without-operationsmd.xml'
        ].forEach(function(getCapUrl) {
          it('returns the proper layer with ' + getCapUrl, function(done) {
            $.get(getCapUrl, function(resp) {
              var identifier = 'ch.are.alpenkonvention';
              var getCap = new ol.format.WMTSCapabilities().read(resp);

              var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {
                capabilitiesUrl: getCapUrl
              });
              expectProperties(layer, {
                url: 'https://wmts.geo.admin.ch/1.0.0/ch.are.alpenkonvention/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.png',
                label: 'Convention des Alpes',
                visible: true,
                useThirdPartyData: false,
                layer: identifier,
                capabilitiesUrl: getCapUrl,
                time: '20090101',
                timeEnabled: false,
                projection: undefined
              });
              done();
            });
          });
        });
      });

      it('get a layer using EPSG:3857 and EPSG:4326 and using KVP syntax', function(done) {
        var getCapUrl = 'base/test/data/wmts-copernicus.xml';
        // We need to set the extent of the projection
        sinon.stub(gaMapUtils, 'intersectWithDefaultExtent').returns([1000000, 100000001, 1000000, 1000000]);
        var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
        defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);
        $.get(getCapUrl, function(response) {
          var identifier = 'core003_feathering_mixed';
          var getCap = new ol.format.WMTSCapabilities().read(response);
          var layer = gaWmts.getOlLayerFromGetCap(map, getCap, identifier, {
            capabilitiesUrl: 'http://test.ch/' + getCapUrl
          });
          expectProperties(layer, {
            label: 'CORE_003 Mosaic, natural color composition, feathering applied to scene borders, Mixed PNG/JPEG',
            url: 'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts?',
            url3d: 'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts?service=WMTS&version=1.0.0&request=GetTile&layer=core003_feathering_mixed&format=image%2Fpng&style=default&time=undefined&tilematrixset=g&tilematrix={z}&tilecol={x}&tilerow={y}',
            visible: true,
            useThirdPartyData: true,
            time: undefined,
            layer: identifier,
            capabilitiesUrl: 'http://test.ch/' + getCapUrl,
            tilingScheme: Cesium.WebMercatorTilingScheme
          });
          done();
        });
      });

      it('get a layer using EPSG:2056 and EPSG:4326 tile matrix and using REST syntax', function(done) {
        var getCapUrl = 'base/test/data/simple-wmts.xml';
        // We need to set the extent of the projection
        sinon.stub(gaMapUtils, 'intersectWithDefaultExtent').returns([1000000, 100000001, 1000000, 1000000]);
        var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
        defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);
        $.get(getCapUrl, function(response) {
          var identifier = 'tiled95_Uebersichtsplan1978';
          var getCap = new ol.format.WMTSCapabilities().read(response);
          var layer = gaWmts.getOlLayerFromGetCap(map2056, getCap, identifier, {
            capabilitiesUrl: 'http://test.ch/' + getCapUrl
          });
          expectProperties(layer, {
            label: 'tiled95_Uebersichtsplan1978',
            url: 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan1978/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan1978/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
            url3d: 'http://www.gis.stadt-zuerich.ch/maps/rest/services/tiled95/Uebersichtsplan1978/MapServer/WMTS/tile/1.0.0/tiled95_Uebersichtsplan1978/default/default029mm/{z}/{y}/{x}.jpg',
            visible: true,
            useThirdPartyData: true,
            layer: identifier,
            capabilitiesUrl: 'http://test.ch/' + getCapUrl,
            tilingScheme: Cesium.GeographicTilingScheme,
            hasAlphaChannel: false
          });
          done();
        });
      });
    });

    describe('#addWmtsToMapFromGetCap()', function() {

      it('adds a layer on top', function() {
        var getCap = {};
        var layerIdentifier = 'foo';
        var options = {};
        var layer = new ol.layer.Tile({});

        // Add layers to test insertion
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));

        sinon.stub(gaWmts, 'getOlLayerFromGetCap').withArgs(map, getCap, layerIdentifier, options).returns(layer);

        var layerReturned = gaWmts.addWmtsToMapFromGetCap(map, getCap, layerIdentifier, options);
        var layerAdded = map.getLayers().item(4);

        expect(map.getLayers().getLength()).to.be(5);
        expect(layerReturned).to.be(layer);
        expect(layerAdded).to.be(layer);
      });

      it('adds a layer at the correct index', function() {
        var getCap = {};
        var layerIdentifier = 'foo';
        var options = {
          index: 2
        };
        var layer = new ol.layer.Tile({});

        // Add layers to test insertion
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));

        sinon.stub(gaWmts, 'getOlLayerFromGetCap').withArgs(map, getCap, layerIdentifier, options).returns(layer);
        var layerReturned = gaWmts.addWmtsToMapFromGetCap(map, getCap, layerIdentifier, options);
        var layerAdded = map.getLayers().item(options.index);

        expect(map.getLayers().getLength()).to.be(5);
        expect(layerReturned).to.be(layer);
        expect(layerAdded).to.be(layer);
      });
    });

    describe('#addWmtsToMapFromGetCapUrl()', function(done) {

      it('adds a layer', function(done) {
        var getCapUrl = 'http://foo.ch/wmts';
        var getCap = {};
        var layerIdentifier = 'foo';
        var options = {};
        var layer = new ol.layer.Tile({});

        var stub = sinon.stub(gaWmts, 'addWmtsToMapFromGetCap').withArgs(map, getCap, layerIdentifier, options).returns(layer);
        $httpBackend.expectGET('http://proxy.geo.admin.ch/http/foo.ch%2Fwmts').respond(getCap);

        gaWmts.addWmtsToMapFromGetCapUrl(map, getCapUrl, layerIdentifier, options).
            then(function(layerReturned) {
              expect(layerReturned).to.be(layer);
              expect(stub.args[0][3].capabilitiesUrl).to.be(getCapUrl);
              done();
            });
        $httpBackend.flush();
      });

      it('caches the request', function(done) {
        var getCapUrl = 'http://foo.ch/wmts';
        var getCap = {};
        var layerIdentifier = 'foo';
        var options = {};
        var layer = new ol.layer.Tile({});

        sinon.stub(gaWmts, 'addWmtsToMapFromGetCap').withArgs(map, getCap, layerIdentifier, options).returns(layer);
        $httpBackend.expectGET('http://proxy.geo.admin.ch/http/foo.ch%2Fwmts').respond(getCap);

        gaWmts.addWmtsToMapFromGetCapUrl(map, getCapUrl, layerIdentifier, options).
            then(function(layerReturned1) {
              expect(layerReturned1).to.be(layer);

              gaWmts.addWmtsToMapFromGetCapUrl(map, getCapUrl, layerIdentifier, options).
                  then(function(layerReturned2) {
                    expect(layerReturned2).to.be(layer);
                    done();
                  });
              $httpBackend.verifyNoOutstandingRequest();
            });
        $httpBackend.flush();
      });

      it('displays an error message in the console', function() {
        var getCapUrl = 'http://foo.ch/wmts';
        var getCap = {};
        var layerIdentifier = 'foo';
        var options = {};
        var layer = new ol.layer.Tile({});

        var spy = sinon.stub($window.console, 'error');
        sinon.stub(gaWmts, 'addWmtsToMapFromGetCap').withArgs(map, getCap, layerIdentifier, options).returns(layer);
        $httpBackend.expectGET('http://proxy.geo.admin.ch/http/foo.ch%2Fwmts').respond(404, 'bad');

        gaWmts.addWmtsToMapFromGetCapUrl(map, getCapUrl, layerIdentifier, options).then(function(resp) {
          expect(resp).to.be();
          expect(spy.callCount).to.be(1);
          expect(spy.args[0][0]).to.be('Loading of external WMTS layer foo failed. Failed to get capabilities from server.Reason : [object Object]');
          spy.restore();
          done();
        });
        $httpBackend.flush();
      });
    });
  });
});
