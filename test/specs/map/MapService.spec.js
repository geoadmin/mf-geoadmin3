describe('ga_map_service', function() {

  var layers, $httpBackend;

  beforeEach(function() {

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'layers.json').respond({
        tileInfo: {
          origin: {
            x: 1,
            y: 2
          },
          cols: 512,
          rows: 512,
          lods: [{
            resolution: 512,
            level: 0
          }, {
            resolution: 256,
            level: 1
          }]
        },
        layers: [{
          idBod: 'foo',
          attributes: {
            format: 'image/png',
            layerType: 'wmts',
            tileMatrixSet: 'aSet',
            timestamps: ['t1', 't2']
          }
        }]
      });
    });

    inject(function($injector) {
      layers = $injector.get('gaLayers');
    });
  });

  describe('getLayerById', function() {
    it('returns layers with correct settings', function() {
        $httpBackend.expectGET('layers.json');
        layers.getLayerById('foo').then(function(layer) {
          expect(layer instanceof ol.layer.TileLayer).to.be.ok();
          var source = layer.getSource();
          expect(source instanceof ol.source.WMTS).to.be.ok();
          var tileGrid = source.getTileGrid();
          expect(tileGrid instanceof ol.tilegrid.WMTS).to.be.ok();
          var resolutions = tileGrid.getResolutions();
          expect(resolutions).to.eql([512, 256]);
          var origin = tileGrid.getOrigin();
          expect(origin).to.eql([1, 2]);
          var matrixIds = tileGrid.getMatrixIds();
          expect(matrixIds).to.eql(['0', '1']);
        });
        $httpBackend.flush();
      });
  });

});
