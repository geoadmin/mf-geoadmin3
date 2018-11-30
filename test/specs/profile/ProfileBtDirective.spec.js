/* eslint-disable max-len */
describe('ga_profilebt_directive', function() {

  describe('gaPorfileBt', function() {
    var elt, scope, parentScope, $compile, $rootScope, gaGeomUtils, $timeout;
    var feature = new ol.Feature(new ol.geom.LineString([[0, 0], [0, 1]]));

    var loadDirective = function(feature) {
      parentScope = $rootScope.$new();
      parentScope.feature = feature;
      var tpl = '<div ga-profile-bt="feature"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      gaGeomUtils = $injector.get('gaGeomUtils');
    };

    beforeEach(function() {
      inject(injectServices);
    });

    afterEach(function() {
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    it('has no child if no feature defined', function() {
      loadDirective();
      expect(elt.find('a').length).to.be(0);
      $timeout.flush();
    });

    it('has no child if feature is not valid', function() {
      loadDirective(new ol.Feature(new ol.geom.Point([0, 0])));
      expect(elt.find('a').length).to.be(0);
      $timeout.flush();
    });

    it('verifies html elements', function() {
      loadDirective(feature);
      expect(elt.find('a').length).to.be(1);
      $timeout.flush();
    });

    it('set scope values', function() {
      loadDirective();
      expect(scope.togglePopup).to.be.a(Function);
      expect(scope.isValid).to.be.a(Function);
    });

    describe('#togglePopup()', function() {
      it('broadcasts gaProfileActive event', function() {
        var spy = sinon.spy($rootScope, '$broadcast').withArgs('gaProfileActive', feature);
        loadDirective();
        scope.togglePopup(feature);
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      })
    });

    describe('#isValid()', function() {
      var spy;
      beforeEach(function() {
        spy = sinon.spy(gaGeomUtils, 'multiGeomToSingleGeom');
      });

      it('returns true', function() {
        loadDirective();
        [
          new ol.geom.LineString([[0, 0], [0, 1]]),
          new ol.geom.LinearRing([0, 0], 2),
          new ol.geom.Polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]]),
          new ol.geom.MultiLineString([[[0, 0]]]),
          new ol.geom.MultiLineString([[[0, 0]], [[0, 0]]]),
          new ol.geom.GeometryCollection([new ol.geom.MultiLineString([[[0, 0]]])])
        ].forEach(function(geom) {
          var feat = new ol.Feature(geom);
          spy.withArgs(geom);
          expect(scope.isValid(feat)).to.be(true);
          expect(spy.callCount).to.be.above(0);
        });
      });

      it('returns false', function() {
        loadDirective();
        [
          new ol.geom.Point([0, 0]),
          new ol.geom.MultiPoint([[0, 0]]),
          new ol.geom.MultiPolygon([]),
          new ol.geom.MultiLineString([[[0, 0]], [[1, 1]]]),
          new ol.geom.GeometryCollection([new ol.geom.Point([0, 0])])
        ].forEach(function(geom) {
          var feat = new ol.Feature(geom);
          spy.withArgs(geom);
          expect(scope.isValid(feat)).to.be(false);
          expect(spy.callCount).to.be.above(0);
        });
      })
    });
  });
});
