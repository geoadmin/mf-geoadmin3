/* eslint-disable max-len */
describe('ga_wms_service', function() {

  describe('gaWms', function() {
    var gaWms, map, gaGlobalOptions, $rootScope, gaLang, gaLayers, gaTileGrid;

    var getExternalWmsLayer = function(params) {
      var layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          params: params
        })
      });
      layer.id = 'WMS||The wms layer||http://foo.ch/wms||' + name;
      layer.displayInLayerManager = true;
      layer.url = 'http://foo.ch/wms';
      return layer;
    };

    var expectProperties = function(layer, options) {
      // Test Layer's properties
      // set in constructor
      expect(layer).to.be.an(options.layerClass || ol.layer.Image);
      expect(layer.id).to.be(options.id || 'WMS||' + options.label + '||' + options.url + '||' + options.LAYERS);
      expect(layer.url).to.be(options.url);
      expect(layer.invertedOpacity).to.be(options.invertedOpacity || 0);
      expect(layer.visible).to.be(angular.isDefined(options.visible) ? options.visible : true);
      expect(layer.get('attribution')).to.be(options.attribution);
      expect(layer.getExtent()).to.be(options.extent);

      // set after creation
      expect(layer.preview).to.be(!!options.preview);
      expect(layer.displayInLayerManager).to.be(!layer.preview);
      expect(layer.useThirdPartyData).to.be(!!options.useThirdPartyData);
      expect(layer.label).to.be(options.label);
      expect(layer.getCesiumImageryProvider).to.be.a(Function);

      // Tests source's properties
      var source = layer.getSource();
      expect(source).to.be.an(options.sourceClass || ol.source.ImageWMS);
      if (source.getUrls) {
        expect(source.getUrls()).to.eql(options.urls);
      } else {
        expect(source.getUrl()).to.be(options.url);
      }
      var projCode = (source.getProjection()) ? source.getProjection().getCode() : undefined;
      expect(projCode).to.be(options.projection);

      // Tests WMS params
      var params = source.getParams();
      expect(params.LAYERS).to.be(options.LAYERS);
      expect(params.VERSION).to.be(options.VERSION || '1.3.0');

      // Tests Cesium provider
      var srsStr = '', crsStr = '&crs=' + 'EPSG%3A4326';
      options.bbox = '{southProjected},{westProjected},{northProjected},{eastProjected}';
      if (options.VERSION === '1.1.1') {
        options.bbox = '{westProjected},{southProjected},{eastProjected},{northProjected}';
        srsStr = '&srs=EPSG%3A4326';
        crsStr = '';
      }
      options.bbox = options.bbox.replace(/,/g, '%2C');
      var spy = sinon.spy(Cesium, 'UrlTemplateImageryProvider');
      var prov = layer.getCesiumImageryProvider();
      expect(prov).to.be.an(Cesium.UrlTemplateImageryProvider);
      var url = options.url +
          '?layers=' + options.LAYERS +
          '&format=' + (options.FORMAT || 'image%2Fpng') +
          '&service=WMS' +
          '&version=' + (options.VERSION || '1.3.0') +
          '&request=GetMap' +
          crsStr +
          '&bbox=' + options.bbox +
          '&width=256&height=256' +
          '&styles=' + (options.STYLES || '') +
          '&transparent=true' +
          srsStr;
      var p = spy.args[0][0];
      expect(p.url).to.be.a(Cesium.Resource);
      expect(p.minimumRetrievingLevel).to.be(gaGlobalOptions.minimumRetrievingLevel);
      expect(p.rectangle).to.be.an(Cesium.Rectangle);
      expect(p.rectangle.west).to.be(-0.2944229317425553);
      expect(p.rectangle.south).to.be(0.5857374801382434);
      expect(p.rectangle.east).to.be(-0.19026022765439154);
      expect(p.rectangle.north).to.be(0.6536247392283254);

      if (options.useThirdPartyData) {
        expect(p.url.url).to.be(gaGlobalOptions.proxyUrl + encodeURIComponent(url).replace('https%3A%2F%2F', 'https/'));
        expect(p.url.proxy.getURL('http://wms.ch')).to.be(
            gaGlobalOptions.proxyUrl + 'http/wms.ch');
      } else {
        expect(p.url.url).to.be(url);
        expect(p.url.proxy.getURL('https://wms.geo.admin.ch')).to.be(
            'https://wms.geo.admin.ch');
      }
      expect(p.tilingScheme).to.be.an(Cesium.GeographicTilingScheme);
      expect(p.hasAlphaChannel).to.be(true);
      expect(p.availableLevels).to.be(gaGlobalOptions.imageryAvailableLevels);
      expect(p.metadataUrl).to.be(gaGlobalOptions.imageryMetadataUrl);
      expect(p.subdomains).to.eql(['', '0', '1', '2', '3', '4']);
      spy.restore();
    };

    beforeEach(function() {
      inject(function($injector) {
        gaWms = $injector.get('gaWms');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaLang = $injector.get('gaLang');
        gaLayers = $injector.get('gaLayers');
        gaTileGrid = $injector.get('gaTileGrid');
        $rootScope = $injector.get('$rootScope');
      });
      map = new ol.Map({});
    });

    describe('#addWmsToMap()', function() {

      it('adds a layer using minimal parameters', function() {
        var params = {
          LAYERS: 'some'
        };
        var options = {
          label: 'somelabel',
          url: 'https://wms.ch'
        };
        gaWms.addWmsToMap(map, params, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          url: options.url,
          visible: true,
          useThirdPartyData: true,
          label: options.label,
          projection: undefined,
          LAYERS: params.LAYERS
        });
      });

      it('adds a layer with custom options', function() {
        var params = {
          LAYERS: 'some',
          VERSION: '1.1.1'
        };
        var options = {
          url: 'https://wms.geo.admin.ch',
          opacity: 0.5,
          visible: false,
          attribution: 'someattr',
          extent: [0, 0, 10, 10],
          preview: true,
          label: 'somelabel',
          projection: 'EPSG:4326'
        };
        gaWms.addWmsToMap(map, params, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          id: 'WMS||' + options.label + '||' + options.url + '||' + params.LAYERS + '||' + params.VERSION,
          url: options.url,
          invertedOpacity: 0.5,
          visible: options.visible,
          attribution: options.attribution,
          extent: options.extent,
          preview: options.preview,
          useThirdPartyData: false,
          label: options.label,
          projection: 'EPSG:4326',
          LAYERS: params.LAYERS,
          VERSION: params.VERSION
        });
      });

      it('adds a layer using reprojection', function() {
        var params = {
          LAYERS: 'some',
          VERSION: 'custom'
        };
        var options = {
          url: 'https://wms.geo.admin.ch',
          label: 'somelabel',
          useReprojection: true
        };
        gaWms.addWmsToMap(map, params, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          id: 'WMS||' + options.label + '||' + options.url + '||' + params.LAYERS + '||' + params.VERSION + '||true',
          url: options.url,
          label: options.label,
          projection: 'EPSG:4326',
          LAYERS: params.LAYERS,
          VERSION: params.VERSION
        });
      });

      it('adds a layer at the correct index in the layer list', function() {
        var idx = 2;
        var params = {LAYERS: 'some'};
        var options = {label: 'somelabel', url: 'https://wms.ch'};
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        map.addLayer(new ol.layer.Tile({}));
        gaWms.addWmsToMap(map, params, options, idx);
        expect(map.getLayers().getLength()).to.be(6);

        var layer = map.getLayers().item(idx);
        expectProperties(layer, {
          url: options.url,
          visible: true,
          useThirdPartyData: true,
          label: options.label,
          projection: undefined,
          LAYERS: params.LAYERS
        });
      });

      it('adds a tiled layer using minimal parameters', function() {
        var params = {
          LAYERS: 'some'
        };
        var options = {
          label: 'somelabel',
          url: 'https://wms{s}.ch'
        };
        gaWms.addWmsToMap(map, params, options);
        expect(map.getLayers().getLength()).to.be(1);

        var layer = map.getLayers().item(0);
        expectProperties(layer, {
          layerClass: ol.layer.Tile,
          sourceClass: ol.source.TileWMS,
          url: options.url,
          urls: [
            'https://wms.ch',
            'https://wms0.ch',
            'https://wms1.ch',
            'https://wms2.ch',
            'https://wms3.ch',
            'https://wms4.ch'
          ],
          visible: true,
          useThirdPartyData: true,
          label: options.label,
          projection: undefined,
          LAYERS: params.LAYERS
        });
      });

      it('use the gutter from layersConfig if it exists', function() {
        var params = {
          LAYERS: 'some'
        };
        var config = {
          type: 'wms',
          gutter: '123',
          url: 'https://wms{s}.ch'
        };
        var stub = sinon.stub(gaLayers, 'getLayer').withArgs(params.LAYERS).returns(config);
        gaWms.addWmsToMap(map, params, {
          url: 'https://wms{s}.ch'
        });
        expect(stub.callCount).to.be(1);
        expect(map.getLayers().getLength()).to.be(1);
        // Only in debug mode
        if (map.getLayers().item(0).getSource().getGutterInternal) {
          var g = map.getLayers().item(0).getSource().getGutterInternal();
          expect(g).to.be('123');
        }
      });

      it('use the tilegridMinRes from layersConfig if it exists', function() {
        var params = {
          LAYERS: 'some'
        };
        var config = {
          type: 'wms',
          url: 'https://wms{s}.ch',
          tileGridMinRes: 500
        };
        var tg = new ol.tilegrid.TileGrid({origin: [0, 0], resolutions: [10000, 5000, 1000, 545, 490, 120]});
        var stub = sinon.stub(gaLayers, 'getLayer').withArgs(params.LAYERS).returns(config);
        var stub2 = sinon.stub(gaTileGrid, 'get').withArgs(500, 'wms').returns(tg);
        gaWms.addWmsToMap(map, params, {
          url: 'https://wms{s}.ch'
        });
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
        expect(map.getLayers().getLength()).to.be(1);
        expect(map.getLayers().item(0).getSource().getTileGrid()).to.be(tg);
      });

      it('use the resolutions from layersConfig if it exists', function() {
        var params = {
          LAYERS: 'some'
        };
        var config = {
          type: 'wms',
          url: 'https://wms{s}.ch',
          resolutions: [1000, 500, 488]
        };
        var tg = new ol.tilegrid.TileGrid({origin: [0, 0], resolutions: [10000, 5000]});
        var stub = sinon.stub(gaLayers, 'getLayer').withArgs(params.LAYERS).returns(config);
        var stub2 = sinon.stub(gaTileGrid, 'get').withArgs(488, 'wms').returns(tg);
        gaWms.addWmsToMap(map, params, {
          url: 'https://wms{s}.ch'
        });
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
        expect(map.getLayers().getLength()).to.be(1);
        expect(map.getLayers().item(0).getSource().getTileGrid()).to.be(tg);
      });
    });

    describe('#getOlLayerFromGetCapLayer()', function() {

      it('creates a layer with minimal param', function() {
        var options = {
          Name: 'some',
          Title: 'somelabel',
          wmsVersion: '1.1.1',
          wmsUrl: 'https://wms.ch',
          extent: [0, 0, 10, 10],
          useReprojection: true
        };

        var layer = gaWms.getOlLayerFromGetCapLayer(options);

        expectProperties(layer, {
          id: 'WMS||' + options.Title + '||' + options.wmsUrl + '||' + options.Name + '||' + options.wmsVersion + '||true',
          url: options.wmsUrl,
          useThirdPartyData: true,
          label: options.Title,
          projection: 'EPSG:4326',
          LAYERS: options.Name,
          VERSION: options.wmsVersion
        });
      });
    });

    describe('#getLegend()', function() {
      it('tests with default values', function(done) {

        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer'
        });
        var expectedHtml = '<img alt="No legend available" src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&layer=somelayer&style=default&service=WMS&' +
            'version=1.3.0&format=image%2Fpng&sld_version=1.1.0&lang=' + gaLang.get() + '"></img>';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = resp.data;
          expect(html).to.be(expectedHtml);
          done();
        });
        $rootScope.$digest();
      });

      it('tests with custom values', function(done) {
        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer',
          STYLE: 'layerstyle',
          VERSION: '1.1.1'
        });
        var expectedHtml = '<img alt="No legend available" src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&layer=somelayer&style=default&service=WMS&' +
            'version=1.1.1&format=image%2Fpng&sld_version=1.1.0&lang=' + gaLang.get() + '"></img>';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = resp.data;
          expect(html).to.be(expectedHtml);
          done();
        });
        $rootScope.$digest();
      });
    });
  });
});
