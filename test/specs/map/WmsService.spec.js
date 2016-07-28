describe('ga_wms_service', function() {

  describe('gaWms', function() {
    var gaWms, map;

    var getExternalWmsLayer = function(params) {
      var layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          params: params
        })
      });
      layer.id = 'WMS||The wms layer||http://foo.ch/wms||' + name;
      layer.displayInLayerManager = true;
      layer.type = 'WMS';
      layer.url = 'http://foo.ch/wms';
      return layer;
    };
    
    var expectProperties = function(layer, options) {
       // set in constructor
      expect(layer).to.be.an(ol.layer.Image);
      expect(layer.id).to.be(options.id || 'WMS||' + options.label + '||' + options.url + '||' + options.LAYERS);
      expect(layer.url).to.be(options.url);
      expect(layer.type).to.be('WMS');
      expect(layer.invertedOpacity).to.be(options.invertedOpacity || '0');
      
      expect(layer.visible).to.be(angular.isDefined(options.visible)? options.visible : true);
      expect(layer.get('attribution')).to.be(options.attribution);
      expect(layer.getExtent()).to.be(options.extent);
      
      // set after creation
      expect(layer.preview).to.be(!!options.preview);
      expect(layer.displayInLayerManager).to.be(!layer.preview);
      expect(layer.useThirdPartyData).to.be(!!options.useThirdPartyData);
      expect(layer.label).to.be(options.label);
      expect(layer.getCesiumImageryProvider).to.be.a(Function);


      var source = layer.getSource();
      expect(source).to.be.an(ol.source.ImageWMS);
      expect(source.getUrl()).to.be(options.url);
      var projCode = (source.getProjection()) ? source.getProjection().getCode() : undefined;
      expect(projCode).to.be(options.projection);
    
      var params = source.getParams();
      expect(params.LAYERS).to.be(options.LAYERS);
      expect(params.VERSION).to.be(options.VERSION || '1.3.0');
    };
    
    beforeEach(function() {
      inject(function($injector) {
        gaWms = $injector.get('gaWms');
      });
      map = new ol.Map({});
    });
    
    describe('addWmsToMap', function() {
      
      it('adds a layer using minimal parameters', function() {
        var params = {
          LAYERS: 'some'
        };
        var options =  {
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
          VERSION: 'custom'
        };
        var options =  {
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
          invertedOpacity: '0.5',
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
        var options =  {
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
        var options =  {label: 'somelabel', url: 'https://wms.ch'};
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
        map.addLayer(new ol.layer.Layer({}));
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
    });

    describe('getOlLayerFromGetCapLayer', function() {
      
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

    describe('getLegend', function() {
      it('tests with default values', function(){
        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer'
        });
        var expectedHtml = '<img src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&amp;layer=somelayer&amp;' +
            'style=default&amp;service=WMS&amp;version=1.3.0&amp;' +
            'format=image%2Fpng&amp;sld_version=1.1.0">';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = res.data;
          expect(html).to.be(expectedHtml);
        });
      });
      it('tests with custom values', function(){
        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer',
          STYLE: 'layerstyle',
          VERSION: '1.1.1'
        });
        var expectedHtml = '<img src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&amp;layer=somelayer&amp;' +
            'style=layerstyle&amp;service=WMS&amp;version=1.1.1&amp;' +
            'format=image%2Fpng&amp;sld_version=1.1.0">';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = res.data;
          expect(html).to.be(expectedHtml);
        });
      });
    });
  });
});
