describe('ga_map_service', function() {
  var map;

  var addLayerToMap = function(bodId) {
    var layer = new ol.layer.Tile();
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
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
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
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
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

  describe('gaLayers', function() {
    var layers, $httpBackend, $rootScope;


    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {
            return {
              id: 'sometopic',
              backgroundLayers: ['bar']
            }
          }
        });
        $provide.value('gaLang',{
          get: function() {
            return 'somelang';
          }
        });
      });

      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        layers = $injector.get('gaLayers');
      });

      var expectedUrl = 'http://example.com/all?lang=somelang';
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
      $httpBackend.expectGET(expectedUrl);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    describe('getOlLayerById', function() {
      it('returns layers with correct settings', function() {
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
  });

  describe('gaLayersPermalinkManager', function() {
    var manager, permalink, gaTopic, params, layersOpacityPermalink,
        layersVisPermalink, layersTimePermalink, layersPermalink, def,
        topic, topicLoaded = {
          id: 'sometopic',
          backgroundLayers: ['bar'],
          selectedLayers: []
        }, topicLoaded2 = {
          id: 'sometopic2',
          backgroundLayers: ['bar2'],
          selectedLayers: ['foo', 'bar']
        }, topicLoaded3 = {
          id: 'sometopic3',
          backgroundLayers: ['bar3'],
          selectedLayers: ['foo2', 'bar2']
        };

    beforeEach(function() {
      map = new ol.Map({});

      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            return def.promise; 
          },
          getLayer: function(id) {
            return {};
          },
          getLayerProperty: function(key) {
            if (key == 'background') {
              return false;
            }
          },
          getOlLayerById: function(bodId) {
            var layer = new ol.layer.Tile();
            layer.bodId = bodId;
            layer.displayInLayerManager = true;
            return layer;
          }
        });
        $provide.value('gaTopic', {
          loadConfig: function() {
            return def.promise; 
          },
          get: function() {
            return topic;
          }
        });

        $provide.value('gaPermalink', {
          getParams: function() {
            params = {
              layers: layersPermalink,
              layers_opacity: layersOpacityPermalink,
              layers_visibility: layersVisPermalink,
              layers_timestamp: layersTimePermalink,
              mobile: false
            };
            return params;
          },
          updateParams: function(params) {
            layersPermalink = params.layers || layersPermalink;
            layersOpacityPermalink = params.layers_opacity || layersOpacityPermalink;
            layersVisPermalink = params.layers_visibility || layersVisPermalink;
            layersTimePermalink = params.layers_timestamp || layersTimePermalink;
          },
          deleteParam: function(param) {
            if (param == 'layers') {
              layersPermalink = undefined;
            } else if (param == 'layers_opacity') {
              layersOpacityPermalink = undefined;
            } else if (param == 'layers_visibility') {
              layersVisPermalink = undefined;
            } else if (param == 'layers_timestamp') {
              layersTimePermalink = undefined;
            }
            delete params[param];
          }
        });
        $provide.value('gaLang', {
          get: function() {
            return 'somelang';
          }
        });
      });

      inject(function(_gaLayersPermalinkManager_, _gaPermalink_, _gaTopic_, $q) {
        def = $q.defer();
        manager = _gaLayersPermalinkManager_;
        permalink = _gaPermalink_;
        gaTopic = _gaTopic_;
      });

      manager(map);
    });

    describe('add/remove layers', function() {
      it('changes permalink', inject(function($rootScope,
                                              gaDefinePropertiesForLayer) {
        var fooLayer, barLayer, kmlLayer, wmsLayer;

        expect(permalink.getParams().layers).to.be(undefined);
        topic = topicLoaded;
        def.resolve();
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

    describe('add/remove local KML layer', function() {
      it('changes permalink', inject(function($rootScope, gaDefinePropertiesForLayer) {
        var kmlLayer;
        expect(permalink.getParams().layers).to.be(undefined);
        def.resolve(); 
        // Local KML layer (add by dnd) is not added to permalink
        kmlLayer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql(undefined);
        map.removeLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);
      }));
    });

    describe('add/remove external KML layer', function() {
      it('changes permalink', inject(function($rootScope, gaDefinePropertiesForLayer) {
        var kmlLayer;
        expect(permalink.getParams().layers).to.be(undefined);
        def.resolve(); 
        kmlLayer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('KML||http://foo.ch/bar.kml');
        map.removeLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);
      }));
    });

    describe('add/remove external WMS layer', function() {
      it('changes permalink', inject(function($rootScope, gaDefinePropertiesForLayer) {
        var wmsLayer;
        expect(permalink.getParams().layers).to.be(undefined);
        def.resolve(); 
        wmsLayer = addExternalWmsLayerToMap();
        gaDefinePropertiesForLayer(wmsLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('WMS||The wms layer||http://foo.ch/wms||ch.wms.name');
        map.removeLayer(wmsLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);
      }));
    });

    describe('change layer opacity', function() {
      it('changes permalink',
          inject(function($rootScope, gaDefinePropertiesForLayer) {
        def.resolve(); 
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
        def.resolve();
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

    describe('add preselected layers of a topic', function() {

      it('adds layers if no layers parameter', inject(function($rootScope) {
        // For next test
        topic = topicLoaded2;

        expect(permalink.getParams().layers).to.be(undefined);
        def.resolve();
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.be(2);
        expect(permalink.getParams().layers).to.be('bar,foo');

        // On next topic change the selected layers are added
        topic = topicLoaded3;
        $rootScope.$broadcast('gaTopicChange', {});
        expect(map.getLayers().getLength()).to.be(4);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be('bar,foo,bar2,foo2');

        // For next test 
        permalink.deleteParam('layers');
        topic = topicLoaded;
        layersPermalink = 'ged';
      }));

      it('doesn t add layers if the layers parameter is defined', inject(function($rootScope) {
        expect(permalink.getParams().layers).to.be('ged');
        def.resolve();
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.be(1);
        expect(permalink.getParams().layers).to.be('ged');

        // On next topic change the selected layers are added
        topic = topicLoaded2;
        $rootScope.$broadcast('gaTopicChange', {});
        expect(map.getLayers().getLength()).to.be(3);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be('ged,bar,foo');

        // For next test
        topic = undefined;
        layersPermalink = undefined;
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

  describe('gaMapUtils', function() {
    var gaMapUtils, map;

    var addLayerToMap = function(bodId) {
      var layer = new ol.layer.Tile();
      map.addLayer(layer);
      return layer;
    };

    beforeEach(function() {
      map = new ol.Map({});

      inject(function($injector) {
        gaMapUtils = $injector.get('gaMapUtils');
      });
    });

    it('tests constants', function() {
      expect(gaMapUtils.preload).to.eql(6);
      expect(gaMapUtils.defaultExtent).to.eql([420000, 30000, 900000, 350000]);
      expect(gaMapUtils.viewResolutions).to.eql([650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
          2.5, 2.0, 1.0, 0.5, 0.25, 0.1]);
    });

    it('tests getViewResolutionForZoom', function() {
      expect(gaMapUtils.getViewResolutionForZoom(10)).to.eql(1);
    });

    it('tests getTileKey', function() {
      var tileUrl = "//wmts5.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg";
      expect(gaMapUtils.getTileKey(tileUrl)).to.eql(".geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg");
    });

    it('tests getMapLayerForBodId', inject(function(gaDefinePropertiesForLayer) {
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

    it('tests getMapOverlayForBodId', inject(function(gaDefinePropertiesForLayer) {
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

    it('tests getAttribution', function() {
      var text = '<img src="text.png"></img>@company 2015';
      var olAttr = gaMapUtils.getAttribution(text);
      expect(olAttr).to.be.an(ol.Attribution);
      expect(olAttr.getHTML()).to.eql(text);
      var olAttr2 = gaMapUtils.getAttribution(text);
      expect(olAttr2).to.be.an(ol.Attribution);
      expect(olAttr2).to.eql(olAttr);
    });

    it('tests isKmlLayer', inject(function(gaDefinePropertiesForLayer) {
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
    
    it('tests isLocalKmlLayer', inject(function(gaDefinePropertiesForLayer) {

      // with an ol.layer
      var layer = addLayerToMap();
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

    it('tests isStoredKmlLayer', inject(function(gaDefinePropertiesForLayer) {

      // with an ol.layer
      var layer = addLayerToMap();
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

    it('tests isExternalWmsLayer', inject(function(gaDefinePropertiesForLayer) {
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
     }));

    it('tests moveLayerOnTop', inject(function(gaDefinePropertiesForLayer) {
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
});
