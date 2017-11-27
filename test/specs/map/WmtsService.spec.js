/* eslint-disable max-len */
describe('ga_wmts_service', function() {
  describe('gaWmts', function() {
    var gaWmts, map, map2056, gaGlobalOptions, gaMapUtils, $httpBackend;

    var expectProperties = function(layer, options) {
     console.log('expect');
      // Test Layer's properties
      // set in constructor
      expect(layer).to.be.an(ol.layer.Tile);
      expect(layer.id).to.be(options.id || 'WMTS||' + options.layer + '||' + options.capabilitiesUrl);
      expect(layer.url).to.be(options.capabilitiesUrl);
      expect(layer.type).to.be('TILE');
      expect(layer.invertedOpacity).to.be(options.invertedOpacity || 0);
      expect(layer.visible).to.be(angular.isDefined(options.visible) ? options.visible : true);

      // set after creation
      expect(layer.preview).to.be(!!options.preview);
      expect(layer.displayInLayerManager).to.be(!layer.preview);
      expect(layer.useThirdPartyData).to.be(!!options.useThirdPartyData);
      expect(layer.label).to.be(options.label);
      expect(layer.getCesiumImageryProvider).to.be.a(Function);

      // Tests source's properties
      var source = layer.getSource();
      expect(source).to.be.an(ol.source.WMTS);
      expect(source.urls[0]).to.be(options.url);
 console.log('expect2');
     
      // Tests Cesium provider
      var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
      console.log('expect3');
     var prov = layer.getCesiumImageryProvider();
      console.log('expect4');
      if (!prov) {
        expect(prov).to.be(undefined);
        expect(layer.displayIn3d).to.be(false);
        spy.restore();
        return;
      }
      expect(layer.displayIn3d).to.be(true);
        console.log(prov);
      expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
      var p = spy.args[0][0];
    console.log('ii');
      expect(p.url).to.be(options.url3d);
     console.log('ii');
     expect(p.minimumRetrievingLevel).to.be(gaGlobalOptions.minimumRetrievingLevel);
      console.log('ii');
    expect(p.rectangle).to.be.an(Cesium.Rectangle);
      expect(p.rectangle.west).to.be(-0.21764144550040762);
      expect(p.rectangle.south).to.be(0.7527404204957977);
      expect(p.rectangle.east).to.be(0.12982982483435074);
      expect(p.rectangle.north).to.be(0.75613172160374);
   console.log('ii');
      
      if (options.useThirdPartyData) {
        expect(p.proxy.getURL('http://wmts.ch')).to.be(
            gaGlobalOptions.proxyUrl + 'http/wmts.ch');
      } else {
        expect(p.proxy.getURL('https://wms.geo.admin.ch')).to.be(
            'https://wms.geo.admin.ch');
      }
      expect(p.tilingScheme).to.be.an(options.tilingScheme || Cesium.GeographicTilingScheme);
      expect(p.hasAlphaChannel).to.be(true);
      expect(p.availableLevels).to.be(gaGlobalOptions.imageryAvailableLevels);
      spy.restore();
    };

    beforeEach(function() {
      inject(function($injector) {
        gaWmts = $injector.get('gaWmts');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaMapUtils = $injector.get('gaMapUtils');
        $httpBackend = $injector.get('$httpBackend');
      });
      
      map = new ol.Map({});
      map2056 = new ol.Map({
        view: new ol.View({
          projection: ol.proj.get('2056')
        })
      });
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
                useThirdPartyData: true,
                layer: identifier,
                capabilitiesUrl: getCapUrl,
                projection: undefined
              });
              done();
            });
          });
        });
      });

      it.only('makes the layer displayable in 3d if the GetCap contains a matrixSet compatible with EPSG:3857 and using KVP syntax', function(done) {
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
            url3d: 'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts?service=WMTS&version=1.0.0&request=GetTile&layer=core003_feathering_mixed&format=image/png&style=default&time=undefined&tilematrixset=g&tilematrix={z}&tilecol={x}&tilerow={y}',
            visible: true,
            useThirdPartyData: true,
            layer: identifier,
            capabilitiesUrl: 'http://test.ch/' + getCapUrl,
            tilingScheme: Cesium.WebMercatorTilingScheme
          });
          done();
        });
      });

      it.only('makes the layer displayable in 3d if the GetCap contains a matrixSet compatible with EPSG:4326 and using KVP syntax', function(done) {

        var getCapUrl = 'base/test/data/wmts-copernicus.xml';
        // We need to set the extent of the projection
        sinon.stub(gaMapUtils, 'intersectWithDefaultExtent').returns([1000000, 100000001, 1000000, 1000000]);
        var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
        defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);
        $.get(getCapUrl, function(response) {
          var identifier = 'core003_seamline_mixed';
          var getCap = new ol.format.WMTSCapabilities().read(response);
          var layer = gaWmts.getOlLayerFromGetCap(map2056, getCap, identifier, {
            capabilitiesUrl: 'http://test.ch/' + getCapUrl
          });
                  expectProperties(layer, {
            label: 'CORE_003 Mosaic, natural color composition, based on seamline detection, Mixed PNG/JPEG',
            url: 'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts?',
            url3d: 'http://cidportal.jrc.ec.europa.eu/copernicus/services/tile/wmts?service=WMTS&version=1.0.0&request=GetTile&layer=core003_seamline_mixed&format=image/png&style=default&time=undefined&tilematrixset=g&tilematrix={z}&tilecol={x}&tilerow={y}',
            visible: true,
            useThirdPartyData: true,
            layer: identifier,
            capabilitiesUrl: 'http://test.ch/' + getCapUrl,
            tilingScheme: Cesium.WebMercatorTilingScheme
          });
          done();
        });
      });

    });


    describe('#addWmtsToMap()', function() {
      var url = 'https://foo.ch?';
      var minimalOptions = {
        label: 'WMTS layer',
        sourceConfig: {
          matrixSet: 4326,
          urls: [url],
          projection: ol.proj.get('EPSG:4326')
        },
        layer: 'ch.wmts.layer',
        capabilitiesUrl: 'https://foo.ch/Capabilities.xml'
      };

      it('adds a layer using minimal parameters', function() {
        var options = minimalOptions;
        gaWmts.addWmtsToMap(map, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          url: url,
          label: 'WMTS layer',
          visible: true,
          opacity: 1,
          useThirdPartyData: true,
          layer: options.layer,
          capabilitiesUrl: options.capabilitiesUrl,
          projection: undefined
        });
      });

      it('adds a layer using custom parameters', function() {
        var options = minimalOptions;
        options.opacity = '0.2';
        options.visible = false;
        gaWmts.addWmtsToMap(map, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          url: url,
          label: 'WMTS layer',
          visible: false,
          invertedOpacity: 0.8,
          useThirdPartyData: true,
          layer: options.layer,
          capabilitiesUrl: options.capabilitiesUrl,
          projection: undefined
        });
      });

      it('adds a layer at the correct index in the layer list', function() {
        var idx = 2;
        var url = 'https://foo.ch?';
        var options = {
          label: 'WMTS layer',
          sourceConfig: {
            matrixSet: 4326,
            urls: [url],
            projection: ol.proj.get('EPSG:4326')
          },
          layer: 'ch.wmts.layer',
          capabilitiesUrl: 'https://foo.ch/Capabilities.xml'
        };
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        gaWmts.addWmtsToMap(map, options, idx);
        expect(map.getLayers().getLength()).to.be(6);

        var layer = map.getLayers().item(idx);
        expectProperties(layer, {
          url: url,
          label: 'WMTS layer',
          visible: true,
          useThirdPartyData: true,
          layer: options.layer,
          capabilitiesUrl: options.capabilitiesUrl,
          projection: undefined
        });
      });

      it('adds a layer which can\'t be displayed in 3d', function() {
        var url = 'https://foo.ch?';
        var options = {
          label: 'WMTS layer',
          sourceConfig: {
            matrixSet: 2056,
            urls: [url],
            projection: ol.proj.get('EPSG:2056')
          },
          layer: 'ch.wmts.layer',
          capabilitiesUrl: 'https://foo.ch/Capabilities.xml'
        };
        gaWmts.addWmtsToMap(map, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          provider: null,
          url: url,
          label: 'WMTS layer',
          visible: true,
          opacity: 1,
          useThirdPartyData: true,
          layer: options.layer,
          capabilitiesUrl: options.capabilitiesUrl,
          projection: undefined
        });
      });
    });

    describe('#getOlLayerFromGetCapLayer()', function() {

      it('creates a layer with minimal param', function() {
        var url = 'https://foo.ch?';
        var getCap = {
          Title: 'WMTS layer',
          sourceConfig: {
            matrixSet: 4326,
            urls: [url]
          },
          Identifier: 'ch.wmts.layer',
          capabilitiesUrl: 'https://foo.ch/Capabilities.xml'
        };

        var layer = gaWmts.getOlLayerFromGetCapLayer(map, getCap);

        expectProperties(layer, {
          url: url,
          label: 'WMTS layer',
          visible: true,
          useThirdPartyData: true,
          layer: getCap.Identifier,
          capabilitiesUrl: getCap.capabilitiesUrl,
          projection: undefined
        });
      });
    });

    describe('#getLayerOptionsFromIdentifier()', function() {
    });
  });
});
