describe('ga_map_service', function() {

  var layers, $httpBackend;

  beforeEach(function() {

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenJSONP('layers.json').respond({
        layers: {
          foo: {
            type: 'wmts',
            matrixSet: 'set1',
            timestamps: ['t1', 't2']
          },
          bar: {
            background: true,
            type: 'wmts',
            matrixSet: 'set2',
            timestamps: ['t3', 't4']
          }
        }
      });
    });

    inject(function($injector) {
      layers = $injector.get('gaLayers');
      layers.loadForTopic('layers.json');
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe('getOlLayerById', function() {
    it('returns layers with correct settings', function() {
      $httpBackend.expectJSONP('layers.json');
      layers.getOlLayerById('foo').then(function(layer) {
        expect(layer instanceof ol.layer.TileLayer).to.be.ok();
        var source = layer.getSource();
        expect(source instanceof ol.source.WMTS).to.be.ok();
        var tileGrid = source.getTileGrid();
        expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
        var resolutions = tileGrid.getResolutions();
        expect(resolutions.length).to.eql(27);
      });
      $httpBackend.flush();
    });
  });

  describe('getBackgroundLayers', function() {
    it('returns correct background layers information', function() {
      $httpBackend.expectJSONP('layers.json');
      layers.getBackgroundLayers().then(function(backgroundLayers) {
        expect(backgroundLayers.length).to.be(1);
        expect(backgroundLayers[0].id).to.be('bar');
      });
      $httpBackend.flush();
    });
  });

});
