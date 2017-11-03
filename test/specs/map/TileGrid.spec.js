/* eslint-disable max-len */
describe('ga_tilegrid_service', function() {

  describe('gaTileGrid', function() {
    var gaTileGrid;
    var orig = [2420000, 1350000];
    var dfltRes = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250,
      2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5,
      2.5, 2, 1.5, 1, 0.5];
    var wmsRes = dfltRes.concat([0.25, 0.1]);
    var getMatrixIds = function(res) {
      return $.map(res, function(r, i) { return i + ''; });
    };

    describe('#get()', function() {

      beforeEach(function() {
        inject(function($injector) {
          gaTileGrid = $injector.get('gaTileGrid');
        });
      });

      it('creates a WMTS tilegrid with default values', function() {
        var tg = gaTileGrid.get();
        expect(tg).to.be.an(ol.tilegrid.WMTS);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(dfltRes));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(dfltRes);
      });

      it('creates a WMS tilegrid with default values', function() {
        var tg = gaTileGrid.get(undefined, undefined, 'wms');
        expect(tg).to.be.an(ol.tilegrid.TileGrid);
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(wmsRes);
      });

      it('uses resolutions specified in parameter', function() {
        var res = [5, 2, 1];
        var tg = gaTileGrid.get(res);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(res));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(res, undefined, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);
      });

      it('uses minResolution specified in parameter', function() {
        var initRes = [15, 10, 5, 2, 1, 0.5];
        var minRes = 2;
        var res = [15, 10, 5, 2];
        var tg = gaTileGrid.get(initRes.concat([]), minRes);
        expect(tg.getMatrixIds()).to.eql(getMatrixIds(res));
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(initRes, minRes, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(res);

        tg = gaTileGrid.get(undefined, undefined, 'wms');
        expect(tg.getTileSize()).to.be(512);
        expect(tg.getOrigin()).to.eql(orig);
        expect(tg.getResolutions()).to.eql(wmsRes);
      });
    });
  });
});
