describe('ga_map_service', function() {

  describe('gaLayers', function() {
    var layers, $httpBackend;

    var expectedUrl = 'http://example.com/sometopic?' +
        'lang=somelang&callback=JSON_CALLBACK';

    beforeEach(function() {

      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenJSONP(expectedUrl).respond({
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
        layers.loadForTopic('sometopic', 'somelang');
      });
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    describe('getOlLayerById', function() {
      it('returns layers with correct settings', function() {
        $httpBackend.expectJSONP(expectedUrl);
        $httpBackend.flush();
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
        $httpBackend.expectJSONP(expectedUrl);
        $httpBackend.flush();
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
        $httpBackend.expectJSONP(expectedUrl);
        $httpBackend.flush();
        var layer = layers.getOlLayerById('foo');
        expect(layer.getOpacity()).to.be(1);
        expect(layer.opacity).to.be("1");
        layer.opacity = 0.5;
        expect(layer.getOpacity()).to.be(0.5);
        expect(layer.opacity).to.be("0.5");
        layer.opacity = 1;
        expect(layer.getOpacity()).to.be(1);
        expect(layer.opacity).to.be("1");
      });
    });

    describe('getBackgroundLayers', function() {
      it('returns correct background layers information', function() {
        $httpBackend.expectJSONP(expectedUrl);
        $httpBackend.flush();
        var backgroundLayers = layers.getBackgroundLayers();
        expect(backgroundLayers.length).to.be(1);
        expect(backgroundLayers[0].id).to.be('bar');
      });
    });
  });

});
