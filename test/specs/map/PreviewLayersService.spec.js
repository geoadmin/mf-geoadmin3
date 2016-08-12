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

    describe('addGetCapWMSLayer', function() {

      beforeEach(function() {
        gaPreviewLayers.addGetCapWMSLayer(map, {id: 'some'});
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
        gaPreviewLayers.addGetCapWMSLayer(map, {id: 'some'});
        expect(spy.callCount).to.be(0);
      });

      it('doesn\'t add 2 preview layers', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        gaPreviewLayers.addGetCapWMSLayer(map, {id: 'other'});
        expect(layers.getLength()).to.be(1);
        expect(layers.item(0).id).to.be('other');
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
        gaPreviewLayers.addGetCapWMSLayer(map, {id: 'some1'});

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
