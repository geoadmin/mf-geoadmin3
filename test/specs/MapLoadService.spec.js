describe.only('ga_mapload_service', function() {

  describe('gaMapLoad', function() {
    var map, $window, gaLayerFilters, $rootScope;

    var getBg = function(bodId) {
      var layer = new ol.layer.Tile({
        source: new ol.source.WMTS({})
      });
      layer.id = bodId;
      layer.bodId = bodId;
      layer.displayInLayerManager = true;
      layer.visible = true;
      layer.background = true;
      return layer;
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
        $provide.value('gaLayers', {
          get: function() {}
        });

      });

      inject(function($injector) {
        gaMapLoad = $injector.get('gaMapLoad');
        $window = $injector.get('$window');
        gaLayerFilters = $injector.get('gaLayerFilters');
        $rootScope = $injector.get('$rootScope');
      });

      map = new ol.Map({});
      $rootScope.map = map;

    });


    describe('#init()', function() {

      it('displays a console messages when a background WMTS source is added', function() {
        gaMapLoad.init($rootScope);
        var spyInfo = sinon.spy($window.console, 'info');
        var spyLog = sinon.spy($window.console, 'log');
        var layer = getBg('id');
        var source = layer.getSource();
        map.addLayer(layer);
        $rootScope.$digest();
        source.dispatchEvent('tileloadstart');
        source.dispatchEvent('tileloadend');

        expect(spyInfo.callCount).to.be(2);
        expect(spyLog.callCount).to.be(1);
      });
    });
  });
});
