describe('ga_realtimelayers_service', function() {

  describe('gaRealtimeLayersManager', function() {
    var $q, map, gaRealtime, $rootScope, $httpBackend, $timeout, gaLayerFilters, gaMapUtils, gaGlobalOptions, clock, gaLang;
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
        source: new ol.source.Vector()
      });
      gaDefinePropertiesForLayer(layer);
      layer.bodId = bodId;
      layer.updateDelay = 1000;
      layer.geojsonUrl = 'https://data.geo.admin.ch/' + bodId + '/' + bodId + '_' + gaLang.get() + '.json';
      layer.timestamps = ['2004'];
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
        gaLayerFilters = $injector.get('gaLayerFilters');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaMapUtils = $injector.get('gaMapUtils');
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
      var layer = addRealtimeLayerToMap('some');
      $httpBackend.verifyNoOutstandingRequest();
      expect(map.getLayers().item(0).getSource().getFeatures().length).to.be(0);
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
        done();
      }, layer.updateDelay);

      clock.tick(layer.updateDelay);
      $timeout.flush(); $;
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
