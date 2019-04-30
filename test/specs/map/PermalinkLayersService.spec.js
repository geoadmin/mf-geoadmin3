/* eslint-disable max-len */
describe('ga_permalinklayers_service', function() {
  // FIXME
  // var map, gaDefinePropertiesForLayer;

  // var addLayerToMap = function(bodId, opacity, visible, time) {
  //   var layer = new ol.layer.Tile({
  //     opacity: opacity || 1,
  //     visible: (visible === false) ? visible : true
  //   });
  //   gaDefinePropertiesForLayer(layer);
  //   layer.bodId = bodId;
  //   layer.displayInLayerManager = true;
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addLocalKmlLayerToMap = function() {
  //   var kmlFormat = new ol.format.KML({
  //     extractStyles: true,
  //     extractAttributes: true
  //   });
  //   var layer = new ol.layer.Vector({
  //     id: 'KML||documents/kml/bar.kml',
  //     url: 'documents/kml/bar.kml',
  //     type: 'KML',
  //     label: 'KML',
  //     opacity: 0.1,
  //     visible: false,
  //     source: new ol.source.Vector({
  //       features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
  //     })
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addKmlLayerToMap = function(opacity, visible) {
  //   var kmlFormat = new ol.format.KML({
  //     extractStyles: true,
  //     extractAttributes: true
  //   });
  //   var layer = new ol.layer.Vector({
  //     id: 'KML||http://foo.ch/bar.kml',
  //     url: 'http://foo.ch/bar.kml',
  //     type: 'KML',
  //     label: 'KML',
  //     opacity: opacity || 0.1,
  //     visible: visible || false,
  //     source: new ol.source.Vector({
  //       features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
  //     })
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addLocalGpxLayerToMap = function() {
  //   var format = new ol.format.GPX({
  //     readExtensions: false
  //   });
  //   var layer = new ol.layer.Vector({
  //     id: 'GPX||documents/gpx/bar.gpx',
  //     url: 'documents/gpx/bar.gpx',
  //     type: 'GPX',
  //     label: 'GPX',
  //     opacity: 0.1,
  //     visible: false,
  //     source: new ol.source.Vector({
  //       features: format.readFeatures('<gpx version="1.1" creator="www.GPS-Tracks.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"></gpx>')
  //     })
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addGpxLayerToMap = function(opacity, visible) {
  //   var format = new ol.format.GPX({
  //     readExtensions: false
  //   });
  //   var layer = new ol.layer.Vector({
  //     id: 'GPX||http://foo.ch/bar.gpx',
  //     url: 'http://foo.ch/bar.gpx',
  //     type: 'GPX',
  //     label: 'GPX',
  //     opacity: opacity || 0.1,
  //     visible: visible || false,
  //     source: new ol.source.Vector({
  //       features: format.readFeatures('<gpx version="1.1" creator="www.GPS-Tracks.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"></gpx>')
  //     })
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addExternalWmsLayerToMap = function(opacity, visible) {
  //   var source = new ol.source.ImageWMS({
  //     params: {LAYERS: 'ch.wms.name'},
  //     url: 'http://foo.ch/wms'
  //   });
  //   var layer = new ol.layer.Image({
  //     id: 'WMS||The wms layer||http://foo.ch/wms||ch.wms.name',
  //     url: 'http://foo.ch/wms',
  //     type: 'WMS',
  //     label: 'The wms layer',
  //     opacity: opacity || 0.4,
  //     visible: visible || false,
  //     source: source
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // var addExternalWmtsLayerToMap = function(opacity, visible) {
  //   var source = new ol.source.WMTS({});
  //   var layer = new ol.layer.Tile({
  //     id: 'WMTS||ch.wmts.name||http://foo.ch/wmts/getcap.xml',
  //     url: 'http://foo.ch/wmts/getcap.xml',
  //     label: 'The wmts layer',
  //     opacity: opacity || 0.4,
  //     visible: visible || false,
  //     source: source
  //   });
  //   layer.displayInLayerManager = true;
  //   gaDefinePropertiesForLayer(layer);
  //   map.addLayer(layer);
  //   return layer;
  // };

  // describe('gaPermalinkLayersManager', function() {
  //   var manager, permalink, params, layersOpacityPermalink, layersParamsPermalink,
  //     layersVisPermalink, layersTimePermalink, layersPermalink, def, $q, gaWmts,
  //     topic, $rootScope, topicLoaded = {
  //       id: 'sometopic',
  //       backgroundLayers: ['bar'],
  //       selectedLayers: [],
  //       activatedLayers: []
  //     }, topicLoaded2 = {
  //       id: 'sometopic2',
  //       backgroundLayers: ['bar2'],
  //       selectedLayers: ['foo', 'bar'],
  //       activatedLayers: []
  //     }, topicLoaded3 = {
  //       id: 'sometopic3',
  //       backgroundLayers: ['bar3'],
  //       selectedLayers: ['foo2', 'bar2'],
  //       activatedLayers: []
  //     };

  //   var createManager = function(topicToLoad, layersParam, opacityParam, visParam, timeParam, paramsParam) {
  //     layersPermalink = layersParam || layersPermalink;
  //     layersOpacityPermalink = opacityParam || layersOpacityPermalink;
  //     layersVisPermalink = visParam || layersVisPermalink;
  //     layersTimePermalink = timeParam || layersTimePermalink;
  //     layersParamsPermalink = paramsParam || layersParamsPermalink;
  //     inject(function($injector) {
  //       manager = $injector.get('gaPermalinkLayersManager');
  //     });
  //     manager(map);
  //     topic = topicToLoad;
  //     def.resolve();
  //     $rootScope.$digest();
  //   };

  //   beforeEach(function() {
  //     map = new ol.Map({});

  //     module(function($provide) {
  //       $provide.value('gaLayers', {
  //         loadConfig: function() {
  //           return def.promise;
  //         },
  //         getLayer: function(id) {
  //           return /^(GPX|KML|WMS|WMTS)/.test(id) ? null : {};
  //         },
  //         getLayerProperty: function(key) {
  //           if (key === 'background') {
  //             return false;
  //           }
  //         },
  //         getOlLayerById: function(bodId) {
  //           var layer = new ol.layer.Tile();
  //           layer.bodId = bodId;
  //           layer.id = bodId;
  //           layer.displayInLayerManager = true;
  //           return layer;
  //         }
  //       });

  //       $provide.value('gaTopic', {
  //         loadConfig: function() {
  //           return def.promise;
  //         },
  //         get: function() {
  //           return topic;
  //         }
  //       });

  //       $provide.value('gaVector', {
  //         addToMapForUrl: function(map, url, options, idx) {
  //           if (/KML/i.test(url)) {
  //             addKmlLayerToMap(options.opacity, options.visible);
  //           } else if (/GPX/i.test(url)) {
  //             addGpxLayerToMap(options.opacity, options.visible);
  //           }
  //         }
  //       });

  //       $provide.value('gaWms', {
  //         addWmsToMap: function(map, params, options, idx) {
  //           addExternalWmsLayerToMap(options.opacity, options.visible);
  //         }
  //       });

  //       $provide.value('gaWmts', {
  //         addWmtsToMapFromGetCapUrl: function(map, url, id, options, idx) {
  //           addExternalWmtsLayerToMap(options.opacity, options.visible);
  //         }
  //       });

  //       $provide.value('gaPermalink', {
  //         getParams: function() {
  //           params = {
  //             layers: layersPermalink,
  //             layers_opacity: layersOpacityPermalink,
  //             layers_visibility: layersVisPermalink,
  //             layers_timestamp: layersTimePermalink,
  //             layers_params: layersParamsPermalink,
  //             mobile: false
  //           };
  //           return params;
  //         },
  //         updateParams: function(params) {
  //           layersPermalink = params.layers || layersPermalink;
  //           layersOpacityPermalink = params.layers_opacity || layersOpacityPermalink;
  //           layersVisPermalink = params.layers_visibility || layersVisPermalink;
  //           layersTimePermalink = params.layers_timestamp || layersTimePermalink;
  //           layersParamsPermalink = params.layers_params || layersParamsPermalink;
  //         },
  //         deleteParam: function(param) {
  //           if (param === 'layers') {
  //             layersPermalink = undefined;
  //           } else if (param === 'layers_opacity') {
  //             layersOpacityPermalink = undefined;
  //           } else if (param === 'layers_visibility') {
  //             layersVisPermalink = undefined;
  //           } else if (param === 'layers_timestamp') {
  //             layersTimePermalink = undefined;
  //           } else if (param === 'layers_params') {
  //             layersParamsPermalink = undefined;
  //           }
  //           delete params[param];
  //         }
  //       });
  //       $provide.value('gaLang', {
  //         get: function() {
  //           return 'somelang';
  //         }
  //       });
  //     });

  //     inject(function($injector) {
  //       $q = $injector.get('$q');
  //       permalink = $injector.get('gaPermalink');
  //       $rootScope = $injector.get('$rootScope');
  //       gaWmts = $injector.get('gaWmts');
  //       gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
  //     });

  //     def = $q.defer();
  //     layersPermalink = undefined;
  //     layersOpacityPermalink = undefined;
  //     layersVisPermalink = undefined;
  //     layersTimePermalink = undefined;
  //     layersParamsPermalink = undefined;
  //     topic = undefined;
  //   });

  //   describe('loads from permalink', function() {

  //     it('a bod layer', function() {
  //       createManager(topicLoaded, 'foo', '1', 'true');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be('foo');
  //       expect(permalink.getParams().layers_opacity).to.be(undefined);
  //       expect(permalink.getParams().layers_visibility).to.be(undefined);
  //     });

  //     it('an external KML layer', function() {
  //       var id = 'KML||http://foo.ch/bar.kml';
  //       createManager(topicLoaded, id, '0.3', 'false', undefined, 'updateDelay=3');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be(id);
  //       expect(permalink.getParams().layers_opacity).to.be('0.3');
  //       expect(permalink.getParams().layers_visibility).to.be('false');
  //       expect(permalink.getParams().layers_params).to.be('updateDelay=3');
  //     });

  //     it('an external GPX layer', function() {
  //       var id = 'GPX||http://foo.ch/bar.gpx';
  //       createManager(topicLoaded, id, '0.2', 'false', undefined, 'updateDelay=13');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be(id);
  //       expect(permalink.getParams().layers_opacity).to.be('0.2');
  //       expect(permalink.getParams().layers_visibility).to.be('false');
  //       expect(permalink.getParams().layers_params).to.be('updateDelay=13');
  //     });

  //     it('an external WMS layer', function() {
  //       var id = 'WMS||The wms layer||http://foo.ch/wms||ch.wms.name';
  //       createManager(topicLoaded, id, '1', 'false');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be(id);
  //       expect(permalink.getParams().layers_opacity).to.be(undefined);
  //       expect(permalink.getParams().layers_visibility).to.be('false');
  //     });

  //     it('an external WMTS layer', function() {
  //       var id = 'WMTS||ch.wmts.name||http://foo.ch/wmts/getcap.xml';
  //       var spy = sinon.spy(gaWmts, 'addWmtsToMapFromGetCapUrl');
  //       createManager(topicLoaded, id, '1', 'false');
  //       expect(spy.args[0][0]).to.be(map);
  //       expect(spy.args[0][3].index).to.be(1);
  //       expect(spy.args[0][3].opacity).to.be('1');
  //       expect(spy.args[0][3].visible).to.be(false);
  //       expect(spy.args[0][3].timestamp).to.be();
  //       expect(spy.args[0][2]).to.be('ch.wmts.name');
  //       expect(spy.args[0][1]).to.be('http://foo.ch/wmts/getcap.xml');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be(id);
  //       expect(permalink.getParams().layers_opacity).to.be(undefined);
  //       expect(permalink.getParams().layers_visibility).to.be('false');
  //     });

  //     it('every layer types in once', function() {
  //       var id = 'KML||http://foo.ch/bar.kml,foo,WMS||The wms layer||http://foo.ch/wms||ch.wms.name,WMTS||ch.wmts.name||http://foo.ch/wmts/getcap.xml,GPX||http://foo.ch/bar.gpx';
  //       createManager(topicLoaded, id, '0.1,0.2,0.3,0.4,0.5', 'true,false,true,false,true', ',2,3,4,5');
  //       expect(map.getLayers().getLength()).to.be(5);
  //       expect(permalink.getParams().layers_opacity).to.be('0.1,0.2,0.3,0.4,0.5');
  //       expect(permalink.getParams().layers_visibility).to.be('true,false,true,false,true');
  //     });
  //   });

  //   describe('add/remove layers', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var fooLayer, barLayer, kmlLayer, wmsLayer, wmtsLayer, gpxLayer;

  //       expect(permalink.getParams().layers).to.be(undefined);
  //       fooLayer = addLayerToMap('foo');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('foo');

  //       barLayer = addLayerToMap('bar');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('foo,bar');

  //       var layerSpec = 'foo,bar,KML||http://foo.ch/bar.kml';
  //       kmlLayer = addKmlLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(layerSpec);

  //       layerSpec += ',WMS||The wms layer||http://foo.ch/wms||ch.wms.name';
  //       wmsLayer = addExternalWmsLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(layerSpec);

  //       layerSpec += ',WMTS||ch.wmts.name||http://foo.ch/wmts/getcap.xml';
  //       wmtsLayer = addExternalWmtsLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(layerSpec);

  //       layerSpec += ',GPX||http://foo.ch/bar.gpx'
  //       gpxLayer = addGpxLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(layerSpec);

  //       map.removeLayer(gpxLayer);
  //       map.removeLayer(wmtsLayer);
  //       map.removeLayer(wmsLayer);
  //       map.removeLayer(kmlLayer);
  //       map.removeLayer(fooLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('bar');

  //       map.removeLayer(barLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('add/remove local KML layer', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var kmlLayer;
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       // Local KML layer (add by dnd) is not added to permalink
  //       kmlLayer = addLocalKmlLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(undefined);
  //       map.removeLayer(kmlLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('add/remove external KML layer', function() {

  //     it('changes permalink', function() {
  //       createManager(topicLoaded);
  //       var kmlLayer;
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       kmlLayer = addKmlLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('KML||http://foo.ch/bar.kml');
  //       map.removeLayer(kmlLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('add/remove local GPX layer', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var layer;
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       // Local GPX layer (add by dnd) is not added to permalink
  //       layer = addLocalGpxLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql(undefined);
  //       map.removeLayer(layer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('add/remove external GPX layer', function() {

  //     it('changes permalink', function() {
  //       createManager(topicLoaded);
  //       var kmlLayer;
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       kmlLayer = addGpxLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('GPX||http://foo.ch/bar.gpx');
  //       map.removeLayer(kmlLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('add/remove external WMS layer', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var wmsLayer;
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       def.resolve();
  //       wmsLayer = addExternalWmsLayerToMap();
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.eql('WMS||The wms layer||http://foo.ch/wms||ch.wms.name');
  //       map.removeLayer(wmsLayer);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be(undefined);
  //     });
  //   });

  //   describe('change layer opacity', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var fooLayer, barLayer;

  //       fooLayer = addLayerToMap('foo');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.be(undefined);

  //       fooLayer.setOpacity('0.5');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.eql('0.5');

  //       barLayer = addLayerToMap('bar');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.eql('0.5,1');

  //       barLayer.setOpacity('0.2');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.eql('0.5,0.2');

  //       fooLayer.setOpacity('1');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.eql('1,0.2');

  //       barLayer.setOpacity('1');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_opacity).to.be(undefined);
  //     });
  //   });

  //   describe('change layer visibility', function() {

  //     beforeEach(function() {
  //       createManager(topicLoaded);
  //     });

  //     it('changes permalink', function() {
  //       var fooLayer, barLayer;

  //       fooLayer = addLayerToMap('foo');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.be();

  //       fooLayer.visible = false;
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.eql('false');

  //       barLayer = addLayerToMap('bar');
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.eql('false,true');

  //       barLayer.visible = false;
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.eql('false,false');

  //       fooLayer.visible = true;
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.eql('true,false');

  //       barLayer.visible = true;
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers_visibility).to.be(undefined);
  //     });
  //   });

  //   describe('add preselected layers of a topic', function() {

  //     it('adds layers if no layers parameter', function() {
  //       expect(permalink.getParams().layers).to.be(undefined);
  //       createManager(topicLoaded2);
  //       expect(map.getLayers().getLength()).to.be(2);
  //       expect(permalink.getParams().layers).to.be('bar,foo');

  //       // On next topic change the selected layers are added and the previous
  //       // removed
  //       topic = topicLoaded3;
  //       $rootScope.$broadcast('gaTopicChange', {});
  //       expect(map.getLayers().getLength()).to.be(2);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be('bar2,foo2');

  //     });

  //     it('doesn t add layers if the layers parameter is defined', function() {
  //       createManager(topicLoaded, 'ged');
  //       expect(map.getLayers().getLength()).to.be(1);
  //       expect(permalink.getParams().layers).to.be('ged');

  //       // Even when layers are defined, a topic change does reset the selection
  //       topic = topicLoaded2;
  //       $rootScope.$broadcast('gaTopicChange', {});
  //       expect(map.getLayers().getLength()).to.be(2);
  //       $rootScope.$digest();
  //       expect(permalink.getParams().layers).to.be('bar,foo');
  //     });
  //   });
  // });
});
