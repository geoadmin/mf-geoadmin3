describe('ga_permalinklayers_service', function() {
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

  describe('gaPermalinkLayersManager', function() {
    var manager, permalink, gaTopic, params, layersOpacityPermalink, gaDefinePropertiesForLayer,
        layersVisPermalink, layersTimePermalink, layersPermalink, def, $q,
        topic, $rootScope, topicLoaded = {
          id: 'sometopic',
          backgroundLayers: ['bar'],
          selectedLayers: [],
          activatedLayers: []
        }, topicLoaded2 = {
          id: 'sometopic2',
          backgroundLayers: ['bar2'],
          selectedLayers: ['foo', 'bar'],
          activatedLayers: []
        }, topicLoaded3 = {
          id: 'sometopic3',
          backgroundLayers: ['bar3'],
          selectedLayers: ['foo2', 'bar2'],
          activatedLayers: []
        }, topicLoaded4 = {
          id: 'sometopic4',
          backgroundLayers: ['bar4'],
          selectedLayers: [],
          activatedLayers: ['foo3', 'bar3']
        };

    var createManager = function(topicToLoad, layersParam) {
      layersPermalink = layersParam;
      inject(function($injector) {
        manager = $injector.get('gaPermalinkLayersManager');
      });
      manager(map);
      topic = topicToLoad;
      def.resolve();
      $rootScope.$digest();
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

      inject(function($injector) {
        $q = $injector.get('$q');
        def = $q.defer();
        permalink = $injector.get('gaPermalink');
        gaTopic = $injector.get('gaTopic');
        $rootScope = $injector.get('$rootScope');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
      });

      layersPermalink = undefined;
      topic = undefined;
    });

    describe('add/remove layers', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
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

      });
    });

    describe('add/remove local KML layer', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
        var kmlLayer;
        expect(permalink.getParams().layers).to.be(undefined);
        // Local KML layer (add by dnd) is not added to permalink
        kmlLayer = addLocalKmlLayerToMap();
        gaDefinePropertiesForLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql(undefined);
        map.removeLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);
      });
    });

    describe('add/remove external KML layer', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
        var kmlLayer;
        expect(permalink.getParams().layers).to.be(undefined);
        kmlLayer = addKmlLayerToMap();
        gaDefinePropertiesForLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.eql('KML||http://foo.ch/bar.kml');
        map.removeLayer(kmlLayer);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be(undefined);
      });
    });

    describe('add/remove external WMS layer', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
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
      });
    });

    describe('change layer opacity', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
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
      });
    });

    describe('change layer visibility', function() {

      beforeEach(function() {
        createManager(topicLoaded);
      });

      it('changes permalink', function() {
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
      });
    });

    describe('add preselected layers of a topic', function() {

      it('adds layers if no layers parameter', function() {
        expect(permalink.getParams().layers).to.be(undefined);
        createManager(topicLoaded2);
        expect(map.getLayers().getLength()).to.be(2);
        expect(permalink.getParams().layers).to.be('bar,foo');

        // On next topic change the selected layers are added and the previous
        // removed
        topic = topicLoaded3;
        $rootScope.$broadcast('gaTopicChange', {});
        expect(map.getLayers().getLength()).to.be(2);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be('bar2,foo2');


      });

      it('doesn t add layers if the layers parameter is defined', function() {
        createManager(topicLoaded, 'ged');
        expect(map.getLayers().getLength()).to.be(1);
        expect(permalink.getParams().layers).to.be('ged');

        // Even when layers are defined, a topic change does reset the selection
        topic = topicLoaded2;
        $rootScope.$broadcast('gaTopicChange', {});
        expect(map.getLayers().getLength()).to.be(2);
        $rootScope.$digest();
        expect(permalink.getParams().layers).to.be('bar,foo');
      });
    });
  });
});
