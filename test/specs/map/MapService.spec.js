describe('ga_map_service', function() {

  describe('gaLayers', function() {
    var layers, $httpBackend;

    var expectedUrl = 'http://example.com/sometopic?lang=somelang';

    beforeEach(function() {

      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET(expectedUrl).respond({
          foo: {
            type: 'wmts',
            matrixSet: 'set1',
            timestamps: ['t1', 't2']
          },
          bar: {
            type: 'wmts',
            matrixSet: 'set2',
            timestamps: ['t3', 't4']
          }
        });
      });

      inject(function($injector, $translate, $rootScope) {
        layers = $injector.get('gaLayers');

        $httpBackend.expectGET(expectedUrl);
        $translate.uses('somelang');
        $rootScope.$broadcast('gaTopicChange',
          {id: 'sometopic', backgroundLayers: ['bar']});
        $rootScope.$digest();
      });

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    describe('getOlLayerById', function() {
      it('returns layers with correct settings', function() {
        $httpBackend.flush();
        var layer = layers.getOlLayerById('foo');
        expect(layer instanceof ol.layer.Tile).to.be.ok();
        var source = layer.getSource();
        expect(source instanceof ol.source.WMTS).to.be.ok();
        var tileGrid = source.getTileGrid();
        expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
        var resolutions = tileGrid.getResolutions();
        expect(resolutions.length).to.eql(27);
      });
    });

    describe('set layer visibility through accessor', function() {
      it('sets the visibility as expected', function() {
        $httpBackend.flush();
        var layer = layers.getOlLayerById('foo');
        expect(layer.getVisible()).to.be.ok();
        expect(layer.visible).to.be.ok();
        layer.visible = false;
        expect(layer.getVisible()).not.to.be.ok();
        expect(layer.visible).not.to.be.ok();
        layer.visible = true;
        expect(layer.getVisible()).to.be.ok();
        expect(layer.visible).to.be.ok();
      });
    });

    describe('set layer opacity through accessor', function() {
      it('sets the visibility as expected', function() {
        $httpBackend.flush();
        var layer = layers.getOlLayerById('foo');
        expect(layer.getOpacity()).to.be(1);
        expect(layer.invertedOpacity).to.be("0");
        layer.invertedOpacity = 0.2;
        expect(layer.getOpacity()).to.be(0.8);
        expect(typeof layer.invertedOpacity).to.eql('string');
        layer.invertedOpacity = 1;
        expect(layer.getOpacity()).to.be(0);
        expect(layer.invertedOpacity).to.be("1");
      });
    });

    describe('getBackgroundLayers', function() {
      it('returns correct background layers information', function() {
        $httpBackend.flush();
        var backgroundLayers = layers.getBackgroundLayers();
        expect(backgroundLayers.length).to.be(1);
        expect(backgroundLayers[0].id).to.be('bar');
      });
    });

  });

  describe('gaLayersPermalinkManager', function() {
    var map, manager, permalink;

    var addLayerToMap = function(bodId) {
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      layer.bodId = bodId;
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
        url: 'http://foo.ch/bar.kml',
        type: 'KML',
        label: 'KML',
        opacity: 0.1,
        visible: false,
        source: new ol.source.Vector({
          features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
        })
      });
      layer.displayInLayerManager = true;
      map.addLayer(layer);
      return layer;
    };
    
    var addExternalWmsLayerToMap = function() {
      var source = new ol.source.ImageWMS({
        params: {LAYERS: 'ch.wms.name'},
        url: 'http://foo.ch/wms',
      });
      var layer = new ol.layer.Image({
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

    beforeEach(function() {
      map = new ol.Map({});

      module(function($provide) {
        $provide.value('gaLayers', {
          getLayer: function(id) {
            return {};
          },
          getLayerProperty: function(key) {
            if (key == 'background') {
              return false;
            }
          }
        });
      });

      inject(function($injector) {
        manager = $injector.get('gaLayersPermalinkManager');
        permalink = $injector.get('gaPermalink');
      });

      manager(map);
    });

    describe('add/remove layers', function() {
      it('changes permalink', inject(function($rootScope,
                                              gaDefinePropertiesForLayer) {
        var fooLayer, barLayer, kmlLayer, wmsLayer;

        expect(permalink.getParams().layers).to.be(undefined);

        fooLayer = addLayerToMap('foo');
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('foo');

        barLayer = addLayerToMap('bar');
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('foo,bar');
        
        kmlLayer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('foo,bar,KML||http://foo.ch/bar.kml');
         
        wmsLayer = addExternalWmsLayerToMap(); 
        gaDefinePropertiesForLayer(wmsLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('foo,bar,KML||http://foo.ch/bar.kml,WMS||The wms layer||http://foo.ch/wms||ch.wms.name');
        
        map.removeLayer(wmsLayer);
        map.removeLayer(kmlLayer); 
        map.removeLayer(fooLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('bar');

        map.removeLayer(barLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);

      }));
    });

    describe('change layer opacity', function() {
      it('changes permalink',
          inject(function($rootScope, gaDefinePropertiesForLayer) {
        var fooLayer, barLayer;

        fooLayer = addLayerToMap('foo');
        gaDefinePropertiesForLayer(fooLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.be(undefined);

        fooLayer.setOpacity('0.5');
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.eql('0.5');

        barLayer = addLayerToMap('bar');
        gaDefinePropertiesForLayer(barLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.eql('0.5,1');

        barLayer.setOpacity('0.2');
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.eql('0.5,0.2');

        fooLayer.setOpacity('1');
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.eql('1,0.2');

        barLayer.setOpacity('1');
        $rootScope.$digest();
        expect(permalink.getParams().layers_opacity).to.be(undefined);
      }));
    });

    describe('change layer visibility', function() {
      it('changes permalink',
          inject(function($rootScope, gaDefinePropertiesForLayer) {
        var fooLayer, barLayer;

        fooLayer = addLayerToMap('foo');
        gaDefinePropertiesForLayer(fooLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.be(undefined);

        fooLayer.visible = false;
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.eql('false');

        barLayer = addLayerToMap('bar');
        gaDefinePropertiesForLayer(barLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.eql('false,true');

        barLayer.visible = false;
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.eql('false,false');

        fooLayer.visible = true;
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.eql('true,false');

        barLayer.visible = true;
        $rootScope.$digest();
        expect(permalink.getParams().layers_visibility).to.be(undefined);
      }));
    });

  });
  
  describe('gaKml', function() {
    var gaKml;

    beforeEach(function() {
      inject(function($injector) {
        gaKml = $injector.get('gaKml');
      });
    });
   
    it('defines if we should use an ol.layer.ImageVector', function() {
      expect(gaKml.useImageVector(100000)).to.be(false);
      expect(gaKml.useImageVector(30000000)).to.be(true);
      expect(gaKml.useImageVector('100000')).to.be(false);
      expect(gaKml.useImageVector('30000000')).to.be(true);
      expect(gaKml.useImageVector(undefined)).to.be(false);
      expect(gaKml.useImageVector(null)).to.be(false);
      expect(gaKml.useImageVector('dfdsfsdfsdfs')).to.be(false);
    });

    it('tests validity of a file size', function() {
      expect(gaKml.isValidFileSize(10000000)).to.be(true);
      expect(gaKml.isValidFileSize(30000000)).to.be(false);
      expect(gaKml.isValidFileSize('10000000')).to.be(true);
      expect(gaKml.isValidFileSize('30000000')).to.be(false);
      expect(gaKml.isValidFileSize(undefined)).to.be(true);
      expect(gaKml.isValidFileSize(null)).to.be(true);
      expect(gaKml.isValidFileSize('sdfsdfdsfsd')).to.be(true);

    });
     
    it('tests validity of a file content', function() {
      expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
      expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
      expect(gaKml.isValidFileContent(undefined)).to.be(false);
      expect(gaKml.isValidFileContent(null)).to.be(false);
      expect(gaKml.isValidFileContent(212334)).to.be(false);
    });
  });
});
