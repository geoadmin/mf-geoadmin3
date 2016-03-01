describe('ga_wms_service', function() {

  describe('gaWms', function() {
    var gaWms;

    var getExternalWmsLayer = function(params) {
      var layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          params: params
        })
      });
      layer.id = 'WMS||The wms layer||http://foo.ch/wms||' + name;
      layer.displayInLayerManager = true;
      layer.type = 'WMS';
      layer.url = 'http://foo.ch/wms';
      return layer;
    };


    beforeEach(function() {
      inject(function($injector) {
        gaWms = $injector.get('gaWms');
      });
    });

    describe('getLegend', function() {
      it('tests with default values', function(){
        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer'
        });
        var expectedHtml = '<img src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&amp;layer=somelayer&amp;' +
            'style=default&amp;service=WMS&amp;version=1.3.0&amp;' +
            'format=image%2Fpng&amp;sld_version=1.1.0">';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = res.data;
          expect(html).to.be(expectedHtml);
        });
      });
      it('tests with custom values', function(){
        var wmsLayer = getExternalWmsLayer({
          LAYERS: 'somelayer',
          STYLE: 'layerstyle',
          VERSION: '1.1.1'
        });
        var expectedHtml = '<img src="http://foo.ch/wms?' +
            'request=GetLegendGraphic&amp;layer=somelayer&amp;' +
            'style=layerstyle&amp;service=WMS&amp;version=1.1.1&amp;' +
            'format=image%2Fpng&amp;sld_version=1.1.0">';
        gaWms.getLegend(wmsLayer).then(function(resp) {
          var html = res.data;
          expect(html).to.be(expectedHtml);
        });
      });
    });
  });
});
