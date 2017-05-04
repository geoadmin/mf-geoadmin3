describe('ga_mapload_service', function() {

  describe('gaMapLoad', function() {
    var map, $window, gaLayerFilters, $rootScope;
    var spyInfo, spyLog;

    var getLayer = function(bodId, sourceClass) {
      var source = new sourceClass({});
      var layer = new ol.layer.Tile({
        source: source
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

      spyInfo = sinon.stub($window.console, 'info');
      spyLog = sinon.stub($window.console, 'log');


      map = new ol.Map({});
      $rootScope.map = map;

    });

    afterEach(function() {
      spyInfo.restore();
      spyLog.restore();
    });


    describe('#init()', function() {

      it('displays a console messages when a background WMTS source is added', function() {
        gaMapLoad.init($rootScope);
        var layer = getLayer('first test', ol.source.WMTS);
        var source = layer.getSource();
        map.addLayer(layer);
        $rootScope.$digest();
        source.dispatchEvent('tileloadstart');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(0);
        source.dispatchEvent('tileloadend');
        expect(spyInfo.callCount).to.be(2);
        expect(spyLog.callCount).to.be(1);
      });
    });

    describe('all', function() {

      it('waits for last loaded tile until all messages are displayed', function() {
        gaMapLoad.init($rootScope);
        var layer = getLayer('id', ol.source.TileWMS);
        var source = layer.getSource();
        map.addLayer(layer);
        $rootScope.$digest();
        source.dispatchEvent('tileloadstart');
        source.dispatchEvent('tileloadstart');
        source.dispatchEvent('tileloadstart');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(0);
        source.dispatchEvent('tileloadend');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(0);
        source.dispatchEvent('tileloadend');
        source.dispatchEvent('tileloadend');
        expect(spyInfo.callCount).to.be(2);
        expect(spyLog.callCount).to.be(1);
      });
    });

    describe('2 layers', function() {

      it('waits for all layers loaded', function() {
        gaMapLoad.init($rootScope);
        var l1 = getLayer('id1', ol.source.WMTS);
        var l2 = getLayer('id2', ol.source.ImageWMS);
        var s1 = l1.getSource();
        var s2 = l2.getSource();
        map.addLayer(l1);
        map.addLayer(l2);
        $rootScope.$digest();
        s1.dispatchEvent('tileloadstart');
        s1.dispatchEvent('tileloadstart');
        s2.dispatchEvent('imageloadstart');
        s2.dispatchEvent('imageloadstart');
        s2.dispatchEvent('imageloadstart');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(0);
        s2.dispatchEvent('imageloadend');
        s2.dispatchEvent('imageloadend');
        s1.dispatchEvent('tileloadend');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(0);
        s2.dispatchEvent('imageloadend');
        expect(spyInfo.callCount).to.be(1);
        expect(spyLog.callCount).to.be(1);
        s1.dispatchEvent('tileloadend');
        expect(spyInfo.callCount).to.be(2);
        expect(spyLog.callCount).to.be(2);
      });


    });
  });
});
