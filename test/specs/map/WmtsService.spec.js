/* eslint-disable max-len */
describe('ga_wmts_service', function() {
  describe('gaWmts', function() {
    var gaWmts, map, gaGlobalOptions;

    var expectProperties = function(layer, options) {
      // Test Layer's properties
      // set in constructor
      expect(layer).to.be.an(ol.layer.Tile);
      expect(layer.id).to.be(options.id || 'WMTS||' + options.layer + '||' + options.capabilitiesUrl);
      expect(layer.url).to.be(options.capabilitiesUrl);
      expect(layer.type).to.be('TILE');
      expect(layer.invertedOpacity).to.be(options.invertedOpacity || 0);
      expect(layer.visible).to.be(angular.isDefined(options.visible) ? options.visible : true);
      expect(layer.get('attribution')).to.be(options.attribution);

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

      // Tests Cesium provider
      var prov = layer.getCesiumImageryProvider();
      expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
      expect(prov.url).to.be('https://foo.ch?service=WMTS&version=1.0.0&request=GetTile&layer=undefined&format=image/jpeg&style=undefined&time=undefined&tilematrixset=4326&tilematrix={z}&tilecol={x}&tilerow={y}');
      expect(prov.minimumRetrievingLevel).to.be(window.minimumRetrievingLevel);
      expect(prov.rectangle).to.be.an(Cesium.Rectangle);
      expect(prov.rectangle.west).to.be(-0.29442293174255596);
      expect(prov.rectangle.south).to.be(0.5857374801382434);
      expect(prov.rectangle.east).to.be(-0.19026022765439166);
      expect(prov.rectangle.north).to.be(0.6536247392283254);

      if (options.useThirdPartyData) {
        expect(prov.proxy.getURL('http://wmts.ch')).to.be(
            gaGlobalOptions.proxyUrl + 'http/wmts.ch');
      } else {
        expect(prov.proxy.getURL('https://wms.geo.admin.ch')).to.be(
            'https://wms.geo.admin.ch');
      }
      expect(prov.tilingScheme).to.be.an(Cesium.GeographicTilingScheme);
      expect(prov.hasAlphaChannel).to.be(true);
      expect(prov.availableLevels).to.be(window.imageryAvailableLevels);
    };

    beforeEach(function() {
      inject(function($injector) {
        gaWmts = $injector.get('gaWmts');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
      });
      map = new ol.Map({});
    });

    describe('#addWmtsToMap()', function() {
      var url = 'https://foo.ch?';
      var minimalOptions = {
        label: 'WMTS layer',
        sourceConfig: {
          matrixSet: 4326,
          urls: [url]
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
            urls: [url]
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

      it('returns undefined if the content is empty', function() {
        var identifier = 'ch.are.alpenkonvention';
        var getCap = {};
        var options = gaWmts.getLayerOptionsFromIdentifier(map, getCap, identifier);
        expect(options).to.be(undefined);
      });

      it('returns undefined if there is no layers', function() {
        var identifier = 'ch.are.alpenkonvention';
        var getCap = {
          Contents: {
            Layer: []
          }
        };
        var options = gaWmts.getLayerOptionsFromIdentifier(map, getCap, identifier);
        expect(options).to.be(undefined);
      });

      [
        'base/test/data/wmts-basic.xml',
        'base/test/data/wmts-basic-without-operationsmd.xml'
      ].forEach(function(getCapUrl) {
        it('returns options for the proper layer with ' + getCapUrl, function(done) {
          $.get(getCapUrl, function(response) {
            var getCapabilities = new ol.format.WMTSCapabilities().read(response);
            var identifier = 'ch.are.alpenkonvention';
            // We need to set the extent of the projection
            var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
            defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);

            var options = gaWmts.getLayerOptionsFromIdentifier(map, getCapabilities, identifier, getCapUrl);
            expect(options.capabilitiesUrl).to.be(getCapUrl);
            expect(options.label).to.be('Convention des Alpes');
            expect(options.layer).to.be(identifier);
            done();
          });
        });
      });

      it('set good attributions if serviceProvider is not in the GetCap', function(done) {
        var getCapUrl = 'base/test/data/simple-wmts.xml';
        $.get(getCapUrl, function(response) {
          var identifier = 'tiled95_Uebersichtsplan1978';
          var getCapabilities = new ol.format.WMTSCapabilities().read(response);
          // We need to set the extent of the projection
          var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
          defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);

          var options = gaWmts.getLayerOptionsFromIdentifier(map, getCapabilities, identifier, 'http://test.ch/' + getCapUrl);
          expect(options.capabilitiesUrl).to.be('http://test.ch/' + getCapUrl);
          expect(options.label).to.be('tiled95_Uebersichtsplan1978');
          expect(options.sourceConfig.attributions[0]).to.contain('test.ch');
          expect(options.layer).to.be(identifier);
          done();
        });
      });
    });
  });
});
