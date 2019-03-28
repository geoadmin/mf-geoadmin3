/* eslint-disable max-len */
describe('ga_definepropertiesforlayer_service', function() {

  describe('gaDefinePropertiesForLayer', function() {
    var gaDefine, layer;

    var expectLinkedToLayer = function(olLayer, prop) {
      olLayer.set(prop, 'test');
      expect(olLayer[prop]).to.be('test');
      olLayer[prop] = 'test2';
      expect(olLayer.get(prop)).to.be('test2');
    };

    beforeEach(function() {

      inject(function($injector) {
        gaDefine = $injector.get('gaDefinePropertiesForLayer');
      });

      layer = new ol.layer.Tile();
    });

    it('verifies properties linked to a layer\'s property', function() {
      gaDefine(layer);

      var properties = [
        'bodId',
        'label',
        'url',
        'altitudeMode',
        'timeBehaviour',
        'timeEnabled',
        'timestamps',
        'altitudeMode'
      ];

      properties.forEach(function(prop) {
        expect(layer[prop]).to.be(layer.get(prop));
        expectLinkedToLayer(layer, prop);
      });
    });

    it('verifies writability and default values of properties added', function() {
      // Use for test of userVisible property
      layer.setVisible(false);
      gaDefine(layer);

      var properties = [
        'altitudeMode',
        'background',
        'displayInLayerManager',
        'useThirdPartyData',
        'preview',
        'geojsonUrl',
        'updateDelay',
        'userVisible'
      ];

      var dfltValues = [
        'clampToGround',
        false,
        true,
        false,
        false,
        null,
        null,
        layer.getVisible()
      ];

      properties.forEach(function(prop, i) {
        expect(layer[prop]).to.be(dfltValues[i]);
        layer[prop] = 'test';
        expect(layer[prop]).to.be('test');
      });
    });

    it('verifies visible property', function() {
      var prop = 'visible';
      gaDefine(layer);

      expect(layer[prop]).to.be(layer.userVisible);

      layer[prop] = true;
      layer.hiddenByOther = false;
      expect(layer.visible).to.be(layer.getVisible());

      layer[prop] = false;
      layer.hiddenByOther = true;
      expect(layer.visible).to.be(layer.getVisible());

      layer[prop] = true;
      layer.hiddenByOther = true;
      expect(layer.visible).to.be(!layer.getVisible());

      layer[prop] = false;
      layer.hiddenByOther = false;
      expect(layer.visible).to.be(layer.getVisible());
    });

    it('verifies hiddenByOther property', function() {
      var prop = 'hiddenByOther';
      gaDefine(layer);

      expect(layer[prop]).to.be(layer.get(prop));
      expectLinkedToLayer(layer, prop);

      layer.userVisible = false;
      layer[prop] = false;
      expect(layer.visible).to.be(false);
      expect(layer.getVisible()).to.be(false);

      layer.userVisible = true;
      layer[prop] = false;
      expect(layer.visible).to.be(true);
      expect(layer.getVisible()).to.be(true);

      layer.userVisible = false;
      layer[prop] = true;
      expect(layer.visible).to.be(false);
      expect(layer.getVisible()).to.be(false);

      layer.userVisible = true;
      layer[prop] = true;
      expect(layer.visible).to.be(true);
      expect(layer.getVisible()).to.be(false);
    });

    it('verifies invertedOpacity property', function() {
      var prop = 'invertedOpacity';
      gaDefine(layer);

      expect(layer.getOpacity()).to.be.a('number');
      expect(layer.getOpacity()).to.be(1);
      expect(layer[prop]).to.be.a('number');
      expect(layer[prop]).to.be(0);

      layer.setOpacity(0.2);
      expect(layer[prop]).to.be.a('number');
      expect(layer[prop]).to.be(0.8);

      layer.invertedOpacity = 0.3;
      expect(layer.getOpacity()).to.be.a('number');
      expect(layer.getOpacity()).to.be(0.7);
    });

    it('verifies id property', function() {
      var prop = 'id';
      gaDefine(layer);
      layer.bodId = 'bodId';
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be('bodId');
      expectLinkedToLayer(layer, prop);
    });

    it('verifies adminId property', function() {
      var prop = 'adminId';
      gaDefine(layer);
      layer.bodId = 'bodId';
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      expectLinkedToLayer(layer, prop);
    });

    it('verifies time property', function() {
      var prop = 'time';

      // WMTS
      var layer = new ol.layer.Tile({
        source: new ol.source.WMTS({})
      });
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be('test');
      expect(layer.getSource().getDimensions().Time).to.be('test');
      // If the value hasn't change don't set the dimension
      layer.getSource().updateDimensions({Time: 'test2'});
      expect(layer[prop]).to.be('test2');

      // If the value hasn't change,  don't set the dimension
      var spy = sinon.spy(layer.getSource(), 'updateDimensions');
      layer[prop] = 'test2';
      expect(spy.callCount).to.be(0);
      spy.restore();

      // ImageWMS && TileWMS
      var layers = [
        new ol.layer.Tile({
          source: new ol.source.ImageWMS({})
        }),
        new ol.layer.Tile({
          source: new ol.source.TileWMS({})
        })
      ];
      layers.forEach(function(layer) {
        gaDefine(layer);
        expect(layer.get(prop)).to.be(undefined);
        expect(layer[prop]).to.be(undefined);
        layer[prop] = 'test';
        expect(layer.get(prop)).to.be('test');
        expect(layer.getSource().getParams().TIME).to.be('test');
        layer.getSource().updateParams({TIME: 'test3'});
        expect(layer[prop]).to.be('test3');

        // If the value hasn't change,  don't set the dimension
        var spy = sinon.spy(layer.getSource(), 'updateParams');
        layer[prop] = 'test3';
        expect(spy.callCount).to.be(0);

        // Verifies the TIME parameter is correctly deleted from the object when
        // it is set to undefined.
        layer[prop] = undefined;
        expect(layer.getSource().getParams().hasOwnProperty('TIME')).to.be(false);
        expect(spy.callCount).to.be(1);
        spy.restore();
      });

      // Base layer
      layer = new ol.layer.Tile({});
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be('test');

      // Layer group
      layer = new ol.layer.Group({});
      gaDefine(layer);
      expect(layer.get(prop)).to.be(undefined);
      expect(layer[prop]).to.be(undefined);
      layer[prop] = 'test';
      expect(layer.get(prop)).to.be(undefined);
    });

    it('verifies getCesiumXXX property', function() {
      var props = [
        'getCesiumDataSource',
        'getCesiumImageryProvider',
        'getCesiumTileset3d'
      ];
      gaDefine(layer);
      props.forEach(function(prop) {
        expect(layer.get(prop)).to.be(undefined);
        expect(layer[prop]).to.be.a(Function);
        expectLinkedToLayer(layer, prop);
      });
    });
  });
});
