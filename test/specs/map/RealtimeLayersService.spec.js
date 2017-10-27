/* eslint-disable max-len */
describe('ga_realtimelayers_service', function() {

  describe('gaRealtimeLayersManager', function() {
    var $q, map, gaRealtime, $rootScope, $httpBackend, $timeout, gaDefinePropertiesForLayer, clock, gaLang, gaVector;
    var dataUrl = 'https://data.geo.admin.ch/some/some_custom.json';
    var jsonData1 = {
      'features': [{
        'type': 'Feature',
        'id': '1',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        },
        'properties': {
          'descr': ''
        }
      }],
      'mapname': 'some',
      'timestamp': 'atimestamp',
      'type': 'FeatureCollection'
    };
    var jsonData2 = {
      'mapname': 'some',
      'timestamp': 'atimestamp2',
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'id': '1',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        },
        'properties': {
          'descr': ''
        }
      }, {
        'type': 'Feature',
        'id': '2',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        },
        'properties': {
          'descr': ''
        }
      }]
    };
    var addRealtimeLayerToMap = function(bodId) {
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          format: new ol.format.GeoJSON()
        })
      });
      gaDefinePropertiesForLayer(layer);
      layer.bodId = bodId;
      layer.updateDelay = 1000;
      layer.geojsonUrl = 'https://data.geo.admin.ch/' + bodId + '/' + bodId + '_' + gaLang.get() + '.json';
      layer.timestamps = ['2004'];
      map.addLayer(layer);
      return layer;
    };

    var addRealtimeKMLLayerToMap = function(id) {
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          format: new ol.format.KML()
        })
      });
      gaDefinePropertiesForLayer(layer);
      layer.id = 'KML||' + id + '.kml';
      layer.updateDelay = 1000;
      layer.url = 'https://data.geo.admin.ch/' + id + '.kml';
      map.addLayer(layer);
      return layer;
    };

    var addRealtimeGPXLayerToMap = function(id) {
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          format: new ol.format.KML()
        })
      });
      gaDefinePropertiesForLayer(layer);
      layer.id = 'GPX||' + id + '.gpx';
      layer.updateDelay = 1000;
      layer.url = 'https://foo.bar.ch/' + id + '.gpx';
      map.addLayer(layer);
      return layer;
    };

    var addPreviewRealtimeLayerToMap = function(bodId) {
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector()
      });
      gaDefinePropertiesForLayer(layer);
      layer.bodId = bodId;
      layer.preview = true;
      layer.updateDelay = 1000;
      layer.geojsonUrl = 'https://data.geo.admin.ch/' + bodId + '/' + bodId + '_custom.json';
      map.addLayer(layer);
      return layer;
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {},
          getLayerProperty: function(bodId, b) {
            return 'https://data.geo.admin.ch/' + bodId + '/' + bodId + '_' + gaLang.get() + '.json';
          },
          getLayerPromise: function() {
            return $q.when();
          }
        });
        var lang = 'custom';
        $provide.value('gaLang', {
          get: function() {
            return lang;
          },
          set: function(l) {
            lang = l;
            $rootScope.$broadcast('gaLayersTranslationChange');
          }
        });

      });

      inject(function($injector) {
        gaRealtime = $injector.get('gaRealtimeLayersManager');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
        $q = $injector.get('$q');
        gaVector = $injector.get('gaVector');
        gaLang = $injector.get('gaLang');
      });

      map = new ol.Map({});
      clock = sinon.useFakeTimers();
      gaRealtime(map);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      clock.restore();
    });

    it('doesn\'t get json data when the layer is added', function() {
      addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
    });

    it('transforms json data when projection is not defined', function() {
      $httpBackend.expectGET('https://data.geo.admin.ch/some/some_custom.json').respond({
        'features': [{
          'type': 'Feature',
          'geometry': {
            'coordinates': [24, 56],
            'type': 'Point'
          },
          'id': '2009',
          'properties': {}
        }],
        'type': 'FeatureCollection'
      });
      addRealtimeLayerToMap('some');
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
      $httpBackend.verifyNoOutstandingRequest();
      $timeout.flush();
      $httpBackend.flush();
      var feats = map.getLayers().item(0).getSource().getFeatures();
      expect(feats.length).to.be(1);
      var coord = feats[0].getGeometry().getCoordinates();
      expect(coord).to.eql([2671667.7790385657, 7558415.656081782]);
    });

    it('transforms json data when projection is defined', function() {
      $httpBackend.expectGET('https://data.geo.admin.ch/some/some_custom.json').respond({
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:21781'
          }
        },
        'features': [{
          'type': 'Feature',
          'geometry': {
            'coordinates': [600000, 200000],
            'type': 'Point'
          },
          'id': '2009',
          'properties': {}
        }],
        'type': 'FeatureCollection'
      });
      addRealtimeLayerToMap('some');
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
      $httpBackend.verifyNoOutstandingRequest();
      $timeout.flush();
      $httpBackend.flush();
      var feats = map.getLayers().item(0).getSource().getFeatures();
      expect(feats.length).to.be(1);
      var coord = feats[0].getGeometry().getCoordinates();
      expect(coord).to.eql([828064.7732897887, 5934093.187456297]);
    });

    it('reads KML data', function() {
      var data = '<kml><Document><Placemark><Point><coordinates>24, 56</coordinates></Point></Placemark></Document></kml>';
      var spy = sinon.spy(gaVector, 'readFeatures').withArgs(data, map.getView().getProjection());
      $httpBackend.expectGET('https://data.geo.admin.ch/some.kml').respond(data);
      var l = addRealtimeKMLLayerToMap('some');
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
      $httpBackend.verifyNoOutstandingRequest();
      $timeout.flush();
      $httpBackend.flush();
      var feats = map.getLayers().item(0).getSource().getFeatures();
      expect(feats.length).to.be(1);
      var coord = feats[0].getGeometry().getCoordinates();
      expect(coord).to.eql([2671667.7790385657, 7558415.656081782, 0]);
      expect(spy.callCount).to.be(1);
      expect(l.getSource().getProperties().rawData).to.be(data);
    });

    it('reads GPX data using proxified url', function() {
      var data = '<gpx><wpt lat="56" lon="24"><name>Toûno</name><type>summit</type></wpt></gpx>';
      var spy = sinon.spy(gaVector, 'readFeatures').withArgs(data, map.getView().getProjection());
      $httpBackend.expectGET('http://proxy.geo.admin.ch/https/foo.bar.ch%2Fsome.gpx').respond(data);
      var l = addRealtimeGPXLayerToMap('some');
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
      $httpBackend.verifyNoOutstandingRequest();
      $timeout.flush();
      $httpBackend.flush();
      var feats = map.getLayers().item(0).getSource().getFeatures();
      expect(feats.length).to.be(1);
      var coord = feats[0].getGeometry().getCoordinates();
      expect(coord).to.eql([2671667.7790385657, 7558415.656081782]);
      expect(spy.callCount).to.be(1);
      expect(l.getSource().getProperties().rawData).to.be(data);
    });

    it('broadcasts a gaNewLayerTimestamp event', function() {
      var spy = sinon.spy($rootScope, '$broadcast');
      var layer = addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      expect(spy.calledWith('gaNewLayerTimestamp', layer.timestamps[0])).to.be(true);
    });

    it('reloads the data after a delay', function(done) {
      addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      $rootScope.$digest();
      var layer = map.getLayers().item(0);
      expect(layer.getSource().getFeatures().length).to.be(0);

      var spy = sinon.spy($rootScope, '$broadcast');
      $httpBackend.expectGET(dataUrl).respond(jsonData2);
      $timeout(function() {
        $httpBackend.flush();
        expect(spy.calledWith('gaNewLayerTimestamp', jsonData2.timestamp)).to.be(true);
        expect(layer.getSource().getFeatures().length).to.be(2);
        expect(layer.getSource().getFeatures()[0].getGeometry().getCoordinates()).to.eql([0, -7.081154551613622e-10]);
        done();
      }, layer.updateDelay);

      clock.tick(layer.updateDelay);
      $timeout.flush();
      $httpBackend.flush();
    });

    it('broadcasts an empty gaNewLayerTimestamp event on layer remove and deactivate the delay', function(done) {
      addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      $rootScope.$digest();
      var layer = map.getLayers().item(0);
      expect(layer.getSource().getFeatures().length).to.be(0);

      var spy = sinon.spy($rootScope, '$broadcast');
      map.removeLayer(layer);
      $rootScope.$digest();
      expect(spy.calledWith('gaNewLayerTimestamp', '')).to.be(true);
      $timeout(function() {
        expect(map.getLayers().getLength()).to.be(0);
        done();
      }, layer.updateDelay);

      clock.tick(layer.updateDelay);
      $timeout.flush();
    });

    it('doesn\'t register update interval for preview layer', function(done) {
      var spy = sinon.spy($rootScope, '$broadcast');
      addPreviewRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      $rootScope.$digest();
      var layer = map.getLayers().item(0);
      expect(layer.getSource().getFeatures().length).to.be(0);
      expect(spy.callCount).to.be(0);

      // No $httpBackend errors means no layer's update
      $timeout(function() {
        done();
      }, layer.updateDelay);
      clock.tick(layer.updateDelay);
      $timeout.flush();
    });

    it('reloads the data on translation change', function() {
      addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      $rootScope.$digest();
      var layer = map.getLayers().item(0);
      expect(layer.getSource().getFeatures().length).to.be(0);

      var newLang = 'custom2';
      dataUrl = dataUrl.replace('_custom', '_' + newLang);
      $httpBackend.expectGET(dataUrl).respond(jsonData1);
      gaLang.set('custom2');
      expect(layer.geojsonUrl).to.equal(dataUrl);
      $httpBackend.flush();
      $rootScope.$digest();
    });
  });
});
