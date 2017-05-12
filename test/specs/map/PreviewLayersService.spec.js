describe('ga_previewlayers_service', function() {

  describe('gaPreviewLayers', function() {
    var gaPreviewLayers, map, gaLayers, gaWms, gaTime, gaMapUtils;

    beforeEach(function() {
      module(function($provide) {

        $provide.value('gaLayers', {
          loadConfig: function() {},
          getOlLayerById: function(bodId) {
            var layer = new ol.layer.Layer({});
            layer.bodId = bodId;
            layer.id = bodId;
            layer.timeEnabled = true;
            layer.time = '20161231';
            return layer;
          },
          getLayerTimestampFromYear: function(bodId, time) {
            if (time) {
              return '20171231';
            }
            return '20161231';
          },
          isBodLayer: function(olLayer) {
           return !!(olLayer.bodId);
          }
        });

        $provide.value('gaWms', {
          getOlLayerFromGetCapLayer: function(getCapLayer) {
            var layer = new ol.layer.Layer({});
            layer.id = getCapLayer.id;
            return layer;
          }
        });

        $provide.value('gaTime', {
          get: function() {}
        });
      });

      inject(function($injector) {
        gaPreviewLayers = $injector.get('gaPreviewLayers');
        gaWms = $injector.get('gaWms');
        gaLayers = $injector.get('gaLayers');
        gaMapUtils = $injector.get('gaMapUtils');
        gaTime = $injector.get('gaTime');
      });

      map = new ol.Map({});
      map.setSize([600, 300]);
    });

    describe('addBodLayer', function() {

      beforeEach(function() {
        gaPreviewLayers.addBodLayer(map, 'some');
      });

      it('adds a preview layer with good properties', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        var layer = layers.item(0);
        expect(layer.preview).to.be(true);
        expect(layer.displayInLayerManager).to.be(false);
        expect(layer.getZIndex()).to.be(gaMapUtils.Z_PREVIEW_LAYER);
      });

      it('uses an existing preview layer if exist', function() {
        var spy = sinon.spy(gaLayers, 'getOlLayerById');
        gaPreviewLayers.addBodLayer(map, 'some');
        expect(spy.callCount).to.be(0);
      });

      it('doesn\'t add 2 preview layers', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        gaPreviewLayers.addBodLayer(map, 'other');
        expect(layers.getLength()).to.be(1);
        expect(layers.item(0).bodId).to.be('other');
      });

      it('updates the time property of an existing preview layer', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        var layer = layers.item(0);
        expect(layer.time).to.be('20161231');

        gaTime.get = function() { return '2017';};
        gaPreviewLayers.addBodLayer(map, 'some');
        expect(layer.time).to.be('20171231');
      });
    });

    describe('addGetCapLayer', function() {

      beforeEach(function() {
        gaPreviewLayers.addGetCapLayer(map, {id: 'some', wmsUrl: 'URL'});
      });

      it('adds a preview layer with good properties', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        var layer = layers.item(0);
        expect(layer.preview).to.be(true);
        expect(layer.displayInLayerManager).to.be(false);
        expect(layer.getZIndex()).to.be(gaMapUtils.Z_PREVIEW_LAYER);
      });

      it('uses an existing preview layer if exist', function() {
        var spy = sinon.spy(gaWms, 'getOlLayerFromGetCapLayer');
        gaPreviewLayers.addGetCapLayer(map, {id: 'some', wmsUrl: 'URL'});
        expect(spy.callCount).to.be(0);
      });

      it('doesn\'t add 2 preview layers', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        gaPreviewLayers.addGetCapLayer(map, {id: 'other', wmsUrl: 'URL'});
        expect(layers.getLength()).to.be(1);
        expect(layers.item(0).id).to.be('other');
      });
    });

    describe('addGetCapLayer for WMTS', function() {
      var getCap;

      beforeEach(function() {
        getCap = {
          id: 'some',
          Identifier: 'some',
          capabilitiesUrl: 'URL',
          Dimension: [{
            Identifier: 'Time',
            Default: 'current',
            Value: ['current']
          }],
          sourceConfig: {
            urls: ['URL']
          }
        };
        gaPreviewLayers.addGetCapLayer(map, getCap);
      });

      it('adds a preview WMTS layer with good properties', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        var layer = layers.item(0);
        expect(layer.preview).to.be(true);
        expect(layer.displayInLayerManager).to.be(false);
        expect(layer.getZIndex()).to.be(gaMapUtils.Z_PREVIEW_LAYER);
      });

      it('uses an existing WMTS preview layer if exist', function() {
        var spy = sinon.spy(gaWms, 'getOlLayerFromGetCapLayer');
        gaPreviewLayers.addGetCapLayer(map, getCap);
        expect(spy.callCount).to.be(0);
      });

      it('doesn\'t add 2 WMTS preview layers', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        getCap.id = 'other';
        getCap.Identifier = 'other';
        gaPreviewLayers.addGetCapLayer(map, getCap);
        expect(layers.getLength()).to.be(1);
        expect(layers.item(0).id).to.be('WMTS||other||Time:current||URL');
      });
    });

    describe('removeAll', function() {
      var previewFeaturesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({})
      });
      previewFeaturesLayer.preview = true;

      it('remove only preview layers', function() {
        map.addLayer(previewFeaturesLayer);
        map.addLayer(new ol.layer.Layer({}));
        gaPreviewLayers.addBodLayer(map, 'some');
        gaPreviewLayers.addGetCapLayer(map, {id: 'some1', wmsUrl: 'URL'});

        var layers = map.getLayers();
        expect(layers.getLength()).to.be(3);
        gaPreviewLayers.removeAll(map);
        expect(layers.getLength()).to.be(2);
        expect(layers.item(0).id).to.not.be('some');
        expect(layers.item(1).id).to.not.be('some1');
      });
    });
  });
});
