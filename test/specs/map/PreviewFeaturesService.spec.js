/* eslint-disable max-len */
describe('ga_previewfeatures_service', function() {

  describe('gaPreviewFeatures', function() {
    var gaPreviewFeatures, map, $httpBackend, gaMapUtils, gaStyleFactory, gaLayers, $q;

    var tpl = window.location.protocol + '//api3.geo.admin.ch/123456/rest/services/all/MapServer/{{layerId}}/{{featId}}?sr=3857&geometryFormat=geojson';
    var expectGET = function(featIdsByBodId) {
      angular.forEach(featIdsByBodId, function(featIds, layerId) {
        featIds.forEach(function(featId) {
          var url = tpl.replace('{{layerId}}', layerId).replace('{{featId}}', featId);
          $httpBackend.expectGET(url).respond({
            'feature': {
              'geometry': {
                'type': 'Point',
                'coordinates': [599647.904, 200509.928]
              },
              'layerBodId': layerId,
              'geometryType': 'Feature',
              'bbox': [599647.904, 200509.928, 599647.904, 200509.928],
              'featureId': featId,
              'layerName': 'Registre des b\u00e2timents et des logements',
              'type': 'Feature',
              'properties': {
                'bgdi_created': '2016-07-24T19:16:28.596736'
              },
              'id': layerId + featId
            }
          });
        });
      });
    };

    var layerBodTypeWMTS = {
      type: 'wmts'
    };

    var layerBodTypeGeojson = {
      type: 'geojson'
    };

    var provideServices = function($provide) {
      $provide.value('gaLayers', {
        loadConfig: function() {
          return $q.when({})
        },
        getLayerProperty: angular.noop,
        getLayerPromise: function() {
          return $q.when({})
        }
      });
    };

    beforeEach(function() {
      module(function($provide) {
        provideServices($provide);
      });
      inject(function($injector) {
        gaPreviewFeatures = $injector.get('gaPreviewFeatures');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        gaMapUtils = $injector.get('gaMapUtils');
        gaStyleFactory = $injector.get('gaStyleFactory');
        gaLayers = $injector.get('gaLayers');
      });

      map = new ol.Map({});
      map.setSize([600, 300]);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#add()', function() {

      beforeEach(function() {
        var feat = new ol.Feature();
        feat.set('layerId', 'somelayer');
        gaPreviewFeatures.add(map, feat);
      });

      it('adds a vector layer correctly configured', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        var layer = layers.item(0);
        expect(layer).to.be.an(ol.layer.Vector);
        expect(layer.preview).to.be(true);
        expect(layer.displayInLayerManager).to.be(false);
        expect(layer.getZIndex()).to.be(gaMapUtils.Z_PREVIEW_FEATURE);
      });

      it('adds a feature correctly configured', function() {
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(1);
        var feat = feats[0];
        expect(feat.getStyle()).to.be(gaStyleFactory.getStyle('select'));
      });

      it('doesn\'t add a 2nd layer on the next call', function() {
        var layers = map.getLayers();
        expect(layers.getLength()).to.be(1);
        gaPreviewFeatures.add(map, new ol.Feature());
        expect(layers.getLength()).to.be(1);
      });

      it('adds a 2nd feature on the next call', function() {
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(1);
        gaPreviewFeatures.add(map, new ol.Feature());
        feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(2);
      });

      it('removes the features and the layer when the associated layer is removed', function() {
        var layer = new ol.layer.Tile({});
        layer.id = 'somelayer';
        map.addLayer(layer);
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(1);
        map.removeLayer(layer);
        expect(map.getLayers().getLength()).to.be(0);
      });

      it('removes the feature and not the layer when the associated layer is removed', function() {
        gaPreviewFeatures.add(map, new ol.Feature());
        var layer = new ol.layer.Tile({});
        layer.id = 'somelayer';
        map.addLayer(layer);
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(2);
        map.removeLayer(layer);
        expect(map.getLayers().getLength()).to.be(1);
        feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(1);
      });
    });

    describe('#remove()', function() {

      beforeEach(function() {
        gaPreviewFeatures.clear(map);
      });

      it('does nothing if the feature is udnefined', function(done) {
        gaPreviewFeatures.remove(map);
        done();
      });

      it('does nothing if the feature does not exist in the source', function(done) {
        gaPreviewFeatures.remove(map, new ol.Feature());
        done();
      });

      it('removes the feature', function() {
        var feat = new ol.Feature();
        feat.setId('test');
        feat.set('layerId', 'somelayer');
        gaPreviewFeatures.add(map, feat);
        gaPreviewFeatures.add(map, new ol.Feature());
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(2);
        expect(feats[0].getId()).to.be('test');
        gaPreviewFeatures.remove(map, feat);
        feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(1);
        expect(feats[0].getId()).not.to.be('test');
      });
    });

    describe('#addBodFeatures()', function() {

      it('clear the preview features first', function() {
        var spy = sinon.spy(gaPreviewFeatures, 'clear');
        gaPreviewFeatures.addBodFeatures(map);
        expect(spy.calledOnce).to.be(true);
        expect(spy.calledWith(map)).to.be(true);
      });

      it('For WMS/WMTS-layer: loads then adds new features from their ids',
          function(done) {
            var stub = sinon.stub(gaLayers, 'getLayerProperty');
            stub.withArgs('somelayer').returns(layerBodTypeWMTS);
            stub.withArgs('somelayer2').returns(layerBodTypeWMTS);
            var ids = {
              'somelayer': ['id1', 'id2'],
              'somelayer2': ['id1', 'id2']
            }
            var spy = sinon.spy(gaPreviewFeatures, 'zoom');
            expectGET(ids);
            gaPreviewFeatures.addBodFeatures(map, ids).then(function(feats) {
              expect(feats.length).to.be(4);
              feats.forEach(function(item) {
                expect(item.properties.layerId).to.equal(item.layerBodId);
              });
              var layer = map.getLayers().item(0);
              expect(layer).to.be.an(ol.layer.Vector);
              expect(layer.getSource().getFeatures().length).to.be(4);
              expect(spy.calledWith(map)).to.be(true);
              done();
            });
            stub.restore();
            $httpBackend.flush();
          });

      it('For geojson-layer: loads then adds new features from their ids',
          function(done) {
            var stub = sinon.stub(gaLayers, 'getLayerProperty');
            stub.withArgs('somelayer').returns(layerBodTypeGeojson);
            stub.withArgs('somelayer2').returns(layerBodTypeGeojson);
            var ids = {
              'somelayer': ['id1', 'id2'],
              'somelayer2': ['id1', 'id2']
            }
            var spy = sinon.spy(gaPreviewFeatures, 'zoom');
            expectGET(ids);
            gaPreviewFeatures.addBodFeatures(map, ids).then(function(feats) {
              expect(feats.length).to.be(4);
              feats.forEach(function(item) {
                expect(item.properties.layerId).to.equal(item.layerBodId);
              });
              var layer = map.getLayers().item(0);
              expect(layer).to.be.an(ol.layer.Vector);
              expect(layer.getSource().getFeatures().length).to.be(4);
              expect(spy.calledWith(map)).to.be(true);
              expect(map.getView().getZoom() === 8);
              done();
            });
            stub.restore();
            $httpBackend.flush();
          });

      it('Loads Features and assures zoom is enforced when specified',
          function(done) {
            var stub = sinon.stub(gaLayers, 'getLayerProperty');
            stub.withArgs('somelayer').returns(layerBodTypeWMTS);
            stub.withArgs('somelayer2').returns(layerBodTypeWMTS);
            var forceZoom = 2;
            var ids = {
              'somelayer': ['id1', 'id2'],
              'somelayer2': ['id1', 'id2']
            }
            var spy = sinon.spy(gaPreviewFeatures, 'zoom');
            expectGET(ids);
            gaPreviewFeatures.addBodFeatures(map, ids, null, forceZoom).then(function(feats) {
              expect(feats.length).to.be(4);
              feats.forEach(function(item) {
                expect(item.properties.layerId).to.equal(item.layerBodId);
              });
              var layer = map.getLayers().item(0);
              expect(layer).to.be.an(ol.layer.Vector);
              expect(layer.getSource().getFeatures().length).to.be(4);
              expect(spy.calledWith(map)).to.be(true);
              expect(spy.args[0][3] === forceZoom);
              expect(map.getView().getZoom() === forceZoom);
              done();
            });
            stub.restore();
            $httpBackend.flush();
          });

      it('execute onNextClear callback on next clear', function() {
        var onNextClear = function() {};
        var spy = sinon.spy(onNextClear);
        gaPreviewFeatures.addBodFeatures(map, {}, spy);
        expect(spy.called).to.be(false);
        gaPreviewFeatures.clear();
        expect(spy.calledOnce).to.be(true);
      });
    });

    describe('#clear()', function() {

      beforeEach(function() {
        var feat = new ol.Feature();
        feat.set('layerId', 'somelayer');
        gaPreviewFeatures.add(map, feat);
      });

      it('removes features from the source', function() {
        var layers = map.getLayers();
        var layer = layers.item(0);
        expect(layers.getLength()).to.be(1);
        expect(layer.getSource().getFeatures().length).to.be(1);
        gaPreviewFeatures.clear();
        expect(layers.getLength()).to.be(1);
        expect(layer.getSource().getFeatures().length).to.be(0);
      });

      it('removes all from the map', function() {
        var layers = map.getLayers();
        var layer = layers.item(0);
        expect(layers.getLength()).to.be(1);
        expect(layer.getSource().getFeatures().length).to.be(1);
        gaPreviewFeatures.clear(map);
        expect(layers.getLength()).to.be(0);
        expect(layer.getSource().getFeatures().length).to.be(0);
      });
    });

    describe('#highlight()/#clearHighlight()', function() {

      beforeEach(function() {
        var feat = new ol.Feature();
        feat.set('layerId', 'somelayer');
        gaPreviewFeatures.add(map, feat);
        gaPreviewFeatures.highlight(map, feat);
      });

      it('adds a feature with highlight style', function() {
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(2);
        var feat = feats[1];
        expect(feat.getStyle()).to.be(gaStyleFactory.getStyle('highlight'));
      });

      it('doesn\'t add 2 highlighted features', function() {
        gaPreviewFeatures.highlight(map, new ol.Feature());
        var feats = map.getLayers().item(0).getSource().getFeatures();
        expect(feats.length).to.be(2);
      });
    });

    describe('#zoom()', function() {
      var gaMapUtilsMock, ol3d = {};

      beforeEach(function() {
        gaMapUtilsMock = sinon.mock(gaMapUtils);
      });

      it('zooms on a feature\'s extent', function() {
        var feat = new ol.Feature(new ol.geom.LineString([[0, 0], [1966, 1966]]));
        var zoomTo = gaMapUtilsMock.expects('zoomToExtent').withArgs(map, ol3d, feat.getGeometry().getExtent());
        gaPreviewFeatures.zoom(map, ol3d, feat);
        zoomTo.verify();
      });

      it('zooms on source\'s extent if no feature defined', function() {
        gaPreviewFeatures.add(map, new ol.Feature(new ol.geom.LineString([[0, 0], [1967, 1967]])));
        var source = map.getLayers().item(0).getSource();
        var zoomTo = gaMapUtilsMock.expects('zoomToExtent').withArgs(map, ol3d, source.getExtent());
        gaPreviewFeatures.zoom(map, ol3d);
        zoomTo.verify();
      });

      it('zooms on a buffered extent if feature\'s extent is to small (MINIMAL_EXTENT_SIZE=1965)', function() {
        var feat = new ol.Feature(new ol.geom.Point([0, 0]));
        var zoomTo = gaMapUtilsMock.expects('zoomToExtent').withArgs(map, ol3d, [-982.5, -982.5, 982.5, 982.5]);
        gaPreviewFeatures.zoom(map, ol3d, feat);
        zoomTo.verify();
      });
    });
  });
});
