/* eslint-disable max-len */
describe('ga_layer_filter', function() {

  describe('gaLayerFilter', function() {
    var gaLayerFilters, gaLayers, gaDefinePropertiesForLayer;

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
      });

      inject(function($injector) {
        gaLayerFilters = $injector.get('gaLayerFilters');
        gaDefinePropertiesForLayer = $injector.get('gaDefinePropertiesForLayer');
        gaLayers = $injector.get('gaLayers');
      });
    });

    describe('#selected()', function() {

      it('keeps layers in the display manager', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.selected(layer)).to.be(true);
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.selected(layer)).to.be(false);
      });
    });

    describe('#selectAndVisible()', function() {

      it('keeps visible layers in the display manager', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        layer.visible = true;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(true);
        layer.visible = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
        layer.visible = true;
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
        layer.visible = false;
        expect(gaLayerFilters.selectedAndVisible(layer)).to.be(false);
      });
    });

    describe('#permalinked()', function() {

      it('keeps layers displayed in layer manager and an id', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = false;
        expect(gaLayerFilters.permalinked(layer)).to.be(false);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.permalinked(layer)).to.be(false);
        layer.id = 'foo';
        expect(gaLayerFilters.permalinked(layer)).to.be(true);
      });

      it('excludes local kml layer', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.id = 'KML||mykml';
        layer.url = 'http://mykml';
        layer.type = 'KML';
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.permalinked(layer)).to.be(true);
        layer.url = 'mylocalkml';
        expect(gaLayerFilters.permalinked(layer)).to.be(false);
      });
    });

    describe('#timeEnabled()', function() {
      var layer;

      beforeEach(function() {
        layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        layer.timeEnabled = true;
      });

      it('keeps only visible time enabled layers', function() {
        expect(gaLayerFilters.timeEnabled(layer)).to.be(true);
        layer.visible = false;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });

      it('excludes background layers', function() {
        layer.background = true;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });

      it('excludes preview layers', function() {
        layer.preview = true;
        expect(gaLayerFilters.timeEnabled(layer)).to.be(false);
      });
    });

    describe('#potentialTooltip()', function() {
      var stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'hasTooltipBodLayer');
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps visible bod layers', function() {
        stub.returns(true);
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(true);
      });

      it('excludes bod layer without tooltip', function() {
        stub.returns(false);
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
      });

      it('excludes vector layers', function() {
        stub.returns(true);
        // Not a vector layer -> no support of intersection on vector layers
        // in query tool
        var layer = new ol.layer.Vector({ source: new ol.source.Vector({}) });
        gaDefinePropertiesForLayer(layer);
        layer.bodId = 'foo';
        layer.displayInLayerManager = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.potentialTooltip(layer)).to.be(false);
      });
    });

    describe('#searchable()', function() {
      var layer, stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'getLayerProperty');
        layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps searchable and visible bod layers', function() {
        stub.returns(true);
        expect(gaLayerFilters.searchable(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.searchable(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.searchable(layer)).to.be(true);
      });

      it('excludes bod layer not searchable', function() {
        stub.returns(false);
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.searchable(layer)).to.be(false);
      });
    });

    describe('#queryable()', function() {
      var layer, stub;

      beforeEach(function() {
        stub = sinon.stub(gaLayers, 'getLayerProperty');
        layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.displayInLayerManager = true;
      });

      afterEach(function() {
        stub.restore();
      });

      it('keeps queryable and visible bod layers', function() {
        stub.returns(['attr1']);
        expect(gaLayerFilters.queryable(layer)).to.be(false);
        layer.visible = true;
        expect(gaLayerFilters.queryable(layer)).to.be(false);
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(true);
      });

      it('excludes bod layer not queryable', function() {
        stub.returns([]);
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(false);

        stub.returns();
        layer.visible = true;
        layer.bodId = 'toto';
        expect(gaLayerFilters.queryable(layer)).to.be(false);
      });
    });

    describe('#background()', function() {

      it('keeps background layers', function() {
        var layer = new ol.layer.Tile();
        gaDefinePropertiesForLayer(layer);
        layer.background = true;
        expect(gaLayerFilters.background(layer)).to.be(true);
        layer.background = false;
        expect(gaLayerFilters.background(layer)).to.be(false);
      });
    });

    describe('#realtime()', function() {

      it('keeps only realtime layers', function() {
        var layer = new ol.layer.Vector();
        gaDefinePropertiesForLayer(layer);
        expect(gaLayerFilters.realtime(layer)).to.be(false);
        layer.updateDelay = null;
        expect(gaLayerFilters.realtime(layer)).to.be(false);
        layer.updateDelay = 100;
        expect(gaLayerFilters.realtime(layer)).to.be(true);
      });
    });
  });
});
