/* eslint-disable max-len */
describe('ga_opaquelayers_service', function() {

  describe('gaOpaqueLayersManager', function() {
    var map, gaOpaque, $rootScope, gaDefinePropertiesForLayer;

    var addLayerToMap = function(bodId) {
      var layer = new ol.layer.Tile();
      gaDefinePropertiesForLayer(layer);
      layer.bodId = bodId;
      map.addLayer(layer);
      return layer;
    };

    beforeEach(function() {

      module(function($provide) {

        $provide.value('gaLayers', {
          loadConfig: function() {},
          getLayer: function(id) {
            var type = id.replace('somelayer', '');
            return {
              id: 'opaque',
              opaque: (id === 'opaque'),
              type: type
            };
          },
          getConfig3d: function(config) {
            return config;
          }
        });

        $provide.value('gaTopic', {
          loadConfig: function() {}
        });

        $provide.value('gaDebounce', {
          debounce: function(func) {
            return func;
          }
        });
      });

      inject(function($injector) {
        gaOpaque = $injector.get('gaOpaqueLayersManager');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
        $rootScope = $injector.get('$rootScope');
      });

      map = new ol.Map({});
      $rootScope.map = map;
      $rootScope.globals = {is3dActive: false};
      gaOpaque($rootScope);
    });

    describe('in 2d', function() {

      it('adds non-opaque layer', function() {
        var layer = addLayerToMap('somelayer');
        $rootScope.$digest();
        expect(layer.hiddenByOther).to.not.be.ok();
      });

      it('adds opaque layer', function() {
        var layer = addLayerToMap('somelayerwms');
        $rootScope.$digest();
        addLayerToMap('opaque');
        $rootScope.$digest();
        expect(layer.hiddenByOther).to.not.be.ok();
      });
    });

    describe('in 3d', function() {

      beforeEach(function() {
        $rootScope.globals.is3dActive = true;
        $rootScope.$digest();
      });

      it('adds non-opaque layer', function() {
        var layer1 = addLayerToMap('somelayerwms');
        var layer2 = addLayerToMap('somelayerwmts');
        var layer3 = addLayerToMap('somelayeraggregate');
        var layer4 = addLayerToMap('somelayer');
        $rootScope.$digest();
        expect(layer1.hiddenByOther).to.not.be.ok();
        expect(layer2.hiddenByOther).to.not.be.ok();
        expect(layer3.hiddenByOther).to.not.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
      });

      it('adds opaque layer', function() {
        var layer1 = addLayerToMap('somelayerwms');
        var layer2 = addLayerToMap('somelayerwmts');
        var layer3 = addLayerToMap('somelayeraggregate');
        var layer4 = addLayerToMap('somelayer');
        $rootScope.$digest();

        var opLayer = addLayerToMap('opaque');
        $rootScope.$digest();
        expect(layer1.hiddenByOther).to.be.ok();
        expect(layer2.hiddenByOther).to.be.ok();
        expect(layer3.hiddenByOther).to.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();
      });

      it('adds opaque layer then change visibility/opacity', function() {
        var layer1 = addLayerToMap('somelayerwms');
        var layer2 = addLayerToMap('somelayerwmts');
        var layer3 = addLayerToMap('somelayeraggregate');
        var layer4 = addLayerToMap('somelayer');
        var opLayer = addLayerToMap('opaque');
        $rootScope.$digest();
        expect(layer1.hiddenByOther).to.be.ok();
        expect(layer2.hiddenByOther).to.be.ok();
        expect(layer3.hiddenByOther).to.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();

        // Change visibility
        opLayer.visible = false;
        expect(layer1.hiddenByOther).to.not.be.ok();
        expect(layer2.hiddenByOther).to.not.be.ok();
        expect(layer3.hiddenByOther).to.not.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();

        // Change visibility
        opLayer.visible = true;
        expect(layer1.hiddenByOther).to.be.ok();
        expect(layer2.hiddenByOther).to.be.ok();
        expect(layer3.hiddenByOther).to.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();

        // Change opacity
        opLayer.invertedOpacity = 0.1;
        expect(layer1.hiddenByOther).to.not.be.ok();
        expect(layer2.hiddenByOther).to.not.be.ok();
        expect(layer3.hiddenByOther).to.not.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();

        // Change visibility
        opLayer.invertedOpacity = 0;
        expect(layer1.hiddenByOther).to.be.ok();
        expect(layer2.hiddenByOther).to.be.ok();
        expect(layer3.hiddenByOther).to.be.ok();
        expect(layer4.hiddenByOther).to.not.be.ok();
        expect(opLayer.hiddenByOther).to.not.be.ok();
      });
    });
  });
});
