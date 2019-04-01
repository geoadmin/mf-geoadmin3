/* eslint-disable max-len */
describe('ga_maputils_service', function() {
  var map, gaDefinePropertiesForLayer;

  var addLayerGroupToMap = function(bodId) {
    var layer = new ol.layer.Group();
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addLayerToMap = function(bodId) {
    var layer = new ol.layer.Tile();
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addVectorLayerToMap = function(bodId) {
    var layer = new ol.layer.Vector();
    layer.setSource(new ol.source.Vector());
    map.addLayer(layer);
    return layer;
  };

  var addImageLayerToMap = function(bodId) {
    var layer = new ol.layer.Image();
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
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" ' +
            'xmlns:gx="http://www.google.com/kml/ext/2.2"></kml>')
      })
    });
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
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx=' +
            '"http://www.google.com/kml/ext/2.2"></kml>')
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
      label: 'nciusdhfjsbnduvishfjknl',
      opacity: 0.1,
      visible: false,
      source: new ol.source.Vector({
        features: kmlFormat.readFeatures('<kml xmlns="http://www.opengis.net/' +
            'kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx=' +
            '"http://www.google.com/kml/ext/2.2"></kml>')
      })
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addGpxLayerToMap = function() {
    var layer = new ol.layer.Vector({
      id: 'GPX||documents/kml/bar.txt',
      url: 'http://documents/kml/bar.kml',
      source: new ol.source.Vector()
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addLocalGpxLayerToMap = function() {
    var layer = new ol.layer.Vector({
      id: 'GPX||blob:http://documents/kml/bar.txt',
      url: 'blob:http://documents/kml/bar.kml',
      source: new ol.source.Vector()
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addBodWmsToMap = function(bodId) {
    var layer = new ol.layer.Image({
      source: new ol.source.ImageWMS()
    });
    layer.set('bodId', bodId);
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

  var addBodWmtsToMap = function(bodId) {
    var layer = new ol.layer.Image();
    layer.set('bodId', bodId);
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  var addExternalWmtsLayerToMap = function() {
    var source = new ol.source.TileImage({
      url: 'http://foo.ch/wmts'
    });
    var layer = new ol.layer.Image({
      id: 'WMTS||The wmts layer||http://foo.ch/wmts.xml',
      url: 'http://foo.ch/wmts',
      type: 'WMTS',
      label: 'The wmts layer',
      opacity: 0.4,
      visible: false,
      source: source
    });
    layer.displayInLayerManager = true;
    map.addLayer(layer);
    return layer;
  };

  describe('gaMapUtils', function() {
    var gaMapUtils, $rootScope;

    beforeEach(function() {
      map = new ol.Map({
        view: new ol.View({
          center: [0, 0],
          resolution: 500
        })
      });
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        gaMapUtils = $injector.get('gaMapUtils');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
      });
    });

    it('tests constants', function() {
      expect(gaMapUtils.Z_PREVIEW_LAYER).to.eql(1000);
      expect(gaMapUtils.Z_PREVIEW_FEATURE).to.eql(1100);
      expect(gaMapUtils.Z_FEATURE_OVERLAY).to.eql(2000);
      expect(gaMapUtils.preload).to.eql(6);
      expect(gaMapUtils.defaultExtent).to.eql([420000, 30000, 900000, 350000]);
      expect(gaMapUtils.viewResolutions).to.eql([650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0,
        2.5, 2.0, 1.0, 0.5, 0.25, 0.1]);
      expect(gaMapUtils.defaultResolution).to.eql(500);
    });

    describe('#getViewResolutionForZoom()', function() {
      it('gets the view resolution from a map zoom level', function() {
        expect(gaMapUtils.getViewResolutionForZoom(10)).to.eql(1);
      });
    });

    describe('#dataURIToBlob()', function() {
      it('transforms a data URI in Blob', function() {
        // base 64 representation of the background image of the map
        var blob = gaMapUtils.dataURIToBlob('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAAAAABzHgM7AAAAAnRSTlMAAHaTzTgAAAARSURBVHgBY3iKBFEAOp/+MgB+UQnYeBZPWAAAAABJRU5ErkJggg==');
        expect(blob.size).to.eql(88);
        expect(blob.type).to.eql('image/png');
      });
    });

    describe('#extentToRectangle()', function() {

      it('using the default projection', function() {
        var rect = gaMapUtils.extentToRectangle([0, 0, 30, 30]);
        expect(rect).to.be.a(Cesium.Rectangle);
        expect([rect.west, rect.south, rect.east, rect.north]).to.eql([-0.3476364767103224, 0.5606780597735368, -0.3476294900800263, 0.5606840053038138]);
      });

      it('using a user defined projection', function() {
        var rect = gaMapUtils.extentToRectangle([0, 0, 20000000, 10000000], ol.proj.get('EPSG:3857'));
        expect(rect).to.be.a(Cesium.Rectangle);
        expect([rect.west, rect.south, rect.east, rect.north]).to.eql([0, 0, 3.1357118857747954, 1.1597019584657118]);
      });
    });

    describe('#getTileKey()', function() {
      it('gets the tile\'s key', function() {
        [
          '//wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//wmts5.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//wmts54.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//wmts540.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//tod.prod.bgdi.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//tod3.prod.bgdi.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg',
          '//tod198.prod.bgdi.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg'
        ].forEach(function(url) {
          expect(gaMapUtils.getTileKey(url)).to.eql('.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140520/21781/18/15/20.jpeg');
        });
      });
    });

    describe('#getMapLayerForBodId()', function() {
      it('gets the olLayer if it\'s on the map', inject(function(gaDefinePropertiesForLayer) {
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
    });

    describe('#getMapOverlayForBodId()', function() {
      it('gets the olLayer if it\'s on the map', inject(function(gaDefinePropertiesForLayer) {
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
    });

    var expectLayerEql = function(isXXXLayerFunc, trueIndexes) {
      [
        addLayerToMap(),
        addLayerGroupToMap(),
        addBodWmsToMap('bodwms'),
        addExternalWmsLayerToMap(),
        addBodWmtsToMap('bodwmtss'),
        addExternalWmtsLayerToMap(), // 5
        addVectorLayerToMap(),
        addImageLayerToMap(),
        addKmlLayerToMap(),
        addLocalKmlLayerToMap(),
        addStoredKmlLayerToMap(), // 10
        addGpxLayerToMap(),
        addLocalGpxLayerToMap()
      ].forEach(function(layer, i) {
        gaDefinePropertiesForLayer(layer);
        expect(gaMapUtils[isXXXLayerFunc](layer)).to.eql(trueIndexes.indexOf(i) > -1);
      });

      expect(gaMapUtils[isXXXLayerFunc](undefined)).to.eql(false);
      expect(gaMapUtils[isXXXLayerFunc](null)).to.eql(false);
      expect(gaMapUtils[isXXXLayerFunc]('')).to.eql(false);
    };

    describe('#isWMSLayer()', function() {
      it('tests if the layer uses WMS data', function() {
        expect(gaMapUtils.isWMSLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isWMSLayer(null)).to.eql(false);
        expect(gaMapUtils.isWMSLayer('')).to.eql(false);

        // with an ol.layer
        expectLayerEql('isWMSLayer', [2, 3]);
      });
    });

    describe('#isExternalWmsLayer()', function() {
      it('tests if the WMS comes from a source outside the bund', function() {
        // with a layer id
        expect(gaMapUtils.isExternalWmsLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('WMS||aa||aa||aa')).to.eql(true);
        expect(gaMapUtils.isExternalWmsLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isExternalWmsLayer('KML||http://test:com/foo.kml')).to.eql(false);

        // with an ol.layer
        expectLayerEql('isExternalWmsLayer', [3]);
      });
    });

    describe('#isExternalWmtsLayer()', function() {
      it('tests if the WMTS comes from a source outside the bund', function() {
        // with a layer id
        expect(gaMapUtils.isExternalWmtsLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('WMTS||aa||aa')).to.eql(true);
        expect(gaMapUtils.isExternalWmtsLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isExternalWmtsLayer('KML||http://test:com/foo.kml')).to.eql(false);

        // with an ol.layer
        expectLayerEql('isExternalWmtsLayer', [5]);
      });
    });

    describe('#isVectorLayer()', function() {
      it('tests if the layer uses vector data', function() {
        // with an ol.layer
        expectLayerEql('isVectorLayer', [6, 8, 9, 10, 11, 12]);
      });
    });

    describe('#isKmlLayer()', function() {
      it('tests if the layer is a KML layer', inject(function(gaDefinePropertiesForLayer) {
        // with a layer id
        expect(gaMapUtils.isKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isKmlLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isKmlLayer('GPX||https://test:com/foo.txt')).to.eql(false);
        expect(gaMapUtils.isKmlLayer('KML||test/local/foo.kml')).to.eql(true);
        expect(gaMapUtils.isKmlLayer('KML||http://test:com/foo.kml')).to.eql(true);
        expect(gaMapUtils.isKmlLayer('KML||https://test:com/foo.kml')).to.eql(true);

        // with an ol.layer
        expectLayerEql('isKmlLayer', [8, 9, 10]);
      }));
    });

    describe('#isLocalKmlLayer()', function() {
      it('tests if the KML used was stored locally', inject(function(gaDefinePropertiesForLayer) {
        // with an ol.layer
        expectLayerEql('isLocalKmlLayer', [9]);
      }));
    });

    describe('#isStoredKmlLayer()', function() {
      it('tests if the KML used comes from public.geo.admin.ch', function() {
        // with a layer id
        expect(gaMapUtils.isStoredKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||test/local/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://test:com/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://test:com/foo.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.bgdi.ch/ggggg.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.admin.ch/gggg.kml')).to.eql(false);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.dev.bgdi.ch/ggggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||http://public.geo.admin.ch/gggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://public.dev.bgdi.ch/ggggg.kml')).to.eql(true);
        expect(gaMapUtils.isStoredKmlLayer('KML||https://public.geo.admin.ch/gggg.kml')).to.eql(true);

        // with an ol.layer
        expectLayerEql('isStoredKmlLayer', [10]);
      });
    });

    describe('#isGpxLayer()', function() {
      it('tests if the layer is a GPX layer', function() {
        // with a layer id
        expect(gaMapUtils.isGpxLayer('ch.bod.layer')).to.eql(false);
        expect(gaMapUtils.isGpxLayer('WMS||aa||aa||aa')).to.eql(false);
        expect(gaMapUtils.isGpxLayer('KML||http://test:com/foo.txt')).to.eql(false);
        expect(gaMapUtils.isGpxLayer('GPX||test/local/foo.txt')).to.eql(true);
        expect(gaMapUtils.isGpxLayer('GPX||http://test:com/foo.txt')).to.eql(true);
        expect(gaMapUtils.isGpxLayer('GPX||https://test:com/foo.txt')).to.eql(true);

        // with an ol.layer
        expectLayerEql('isGpxLayer', [11, 12]);
      });
    });

    describe('#isLocalGpxLayer()', function() {
      it('tests if the GPX used was stored locally', function() {
        expect(gaMapUtils.isLocalGpxLayer(undefined)).to.eql(false);
        expect(gaMapUtils.isLocalGpxLayer(null)).to.eql(false);
        expect(gaMapUtils.isLocalGpxLayer('')).to.eql(false);

        // with an ol.layer
        expectLayerEql('isLocalGpxLayer', [12]);
      });
    });

    describe('#isMeasureFeature()', function() {
      it('test if a feature has been created by the measure tool', function() {
        var feat = new ol.Feature();
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);

        feat.setId('mymeasure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);

        feat.setId('measure_343434');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(true);

        feat.setId(null);
        feat.set('type', 'measure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(true);

        feat.set('type', 'mymeasure');
        expect(gaMapUtils.isMeasureFeature(feat)).to.eql(false);
      });
    });

    describe('#moveLayerOnTop()', function() {
      it('moves layer on top of the map', function() {
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
      });
    });

    /* TODO fix this test
    describe('#resetMapToNorth()', function() {
      it('reset map to north', function(done) {
        map.getView().setRotation(90);
        expect(map.getView().getRotation()).to.be(90);
        gaMapUtils.resetMapToNorth(map).then(function() {
          expect(map.getView().getRotation()).to.be(0);
          done();
        });
      });
    }); */

    describe('#moveTo()', function() {
      it('move map to a coordinate and a zoom', function(done) {
        map.getView().setCenter([1, 2]);
        map.getView().setZoom(6);
        var promise = gaMapUtils.moveTo(map, null, 3, [0, 1]);
        var checkMoveTo = function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          expect(map.getView().getZoom()).to.eql(3);
          done();
        };
        promise ? promise.then(checkMoveTo) : checkMoveTo();
        $rootScope.$digest();
      });
    });

    describe('#zoomToExtent()', function() {
      it('zoom map to en extent', function(done) {
        map.setSize([600, 600]);
        map.getView().setCenter([1, 2]);
        map.getView().setZoom(6);
        var promise = gaMapUtils.zoomToExtent(map, null, [-40, -40, 40, 40]);
        var checkZoomToExtent = function() {
          expect(map.getView().calculateExtent(map.getSize())).to.eql([-44.78732126084546, -44.78732126084546, 44.78732126084546, 44.78732126084546]);
          done();
        };
        promise ? promise.then(checkZoomToExtent) : checkZoomToExtent();
        $rootScope.$digest();
      });
    });

    describe('#panTo()', function() {
      it('pan map to a coordinate', function(done) {
        map.getView().setCenter([1, 2]);
        var promise = gaMapUtils.panTo(map, null, [0, 1]);
        var checkPanTo = function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          done();
        };
        promise ? promise.then(checkPanTo) : checkPanTo();
      });
    });

    /* TODO: fix this test
    describe('#flyTo()', function() {
      it('move map to a coordinate ', function(done) {
        map.setSize([600, 600]);
        map.getView().setCenter([1, 2]);
        map.getView().setResolution(500);
        var dest = [0, 1];
        gaMapUtils.flyTo(map, null, dest, ol.extent.buffer(dest.concat(dest), 100)).then(function() {
          expect(map.getView().getCenter()).to.eql([0, 1]);
          expect(map.getView().calculateExtent(map.getSize())).to.eql([-750, -749, 750, 751]);
          done();
        });
      });
    }); */

    describe('#intersectWithDefaultExtent()', function() {
      var dflt = [420000, 30000, 900000, 350000];

      it('returns the default extent if the extent is not valid', function() {
        expect(gaMapUtils.intersectWithDefaultExtent()).to.eql(dflt);
        expect(gaMapUtils.intersectWithDefaultExtent([1, 2])).to.eql(dflt);
      });

      it('returns undefined if there is no intersection', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([0, 0, 1, 1])).to.eql(undefined);
      });

      it('returns undefined if the extent doesn\'t contains number', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([undefined, 1, 2, 2])).to.eql(undefined);
        // NaN
        expect(gaMapUtils.intersectWithDefaultExtent([0, 1, Math.max(undefined, 5), 2])).to.eql(undefined);
      });

      it('returns the intersection', function() {
        expect(gaMapUtils.intersectWithDefaultExtent([320000, 310000, 800000, 450000])).to.eql([420000, 310000, 800000, 350000]);
      });
    });

    describe('#getFeatureOverlay()', function() {
      it('creates a feature overlay', function() {
        var feats = [new ol.Feature(), new ol.Feature()];
        var style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'red'
          })
        });
        var layer = gaMapUtils.getFeatureOverlay(feats, style);
        expect(layer).to.be.an(ol.layer.Vector);
        expect(layer.getStyle().getFill().getColor()).to.eql('red');
        expect(layer.getSource()).to.be.an(ol.source.Vector);
        expect(layer.getZIndex()).to.eql(gaMapUtils.Z_FEATURE_OVERLAY);
        expect(layer.getSource().getFeatures().length).to.eql(2);
        expect(layer.displayInLayerManager).to.eql(false);
      });
    });

    describe('#getLodFromRes()', function() {
      it('gets lod from resolution', function() {
        expect(gaMapUtils.getLodFromRes()).to.eql(undefined);
        expect(gaMapUtils.getLodFromRes(500)).to.eql(7);
      });
    });

    describe('#getVectorSourceExtent()', function() {
      it('gets the extent of an ol.source.Vector', function() {
        var feat = new ol.Feature(new ol.geom.Point([1, 2]));
        var feat2 = new ol.Feature(new ol.geom.LineString([[-1, -1], [1, 2], [0, 0]]));
        var src = new ol.source.Vector({
          features: [feat, feat2]
        });
        expect(gaMapUtils.getVectorSourceExtent(src)).to.eql([-1, -1, 1, 2]);

        var src2 = new ol.source.Vector({
          features: [feat, feat2],
          useSpatialIndex: false
        });
        expect(gaMapUtils.getVectorSourceExtent(src2)).to.eql([-1, -1, 1, 2]);
      });
    });
  });
});
