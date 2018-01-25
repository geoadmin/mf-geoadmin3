/* eslint-disable max-len */
describe('ga_shop_directive', function() {

  describe('gaShop', function() {
    var elt, scope, parentScope, $compile, $rootScope, gaLayers, map,
      $timeout, $httpBackend, gaShop, gaIdentify, gaPreviewFeatures, olFeature, $q;

    var loadDirective = function(map, feature, clipperGeometry) {
      var layerId, flush = false;
      if (feature instanceof ol.Feature) {
        layerId = feature.get('layerId');
      } else if (feature && feature.layerBodId && (!feature.properties || feature.properties.available !== false)) {
        layerId = feature.layerBodId;
      }
      if (feature && layerId) {
        flush = true;
        $httpBackend.expectGET('http://shop.bgdi.ch/shop-server/resources/products/price?layer=' + layerId).respond({});
      }
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.feature = feature;
      parentScope.clipperGeometry = clipperGeometry;
      var tpl = $('<div ga-shop ga-shop-map="map" ga-shop-feature="feature" ga-shop-clipper-geometry=""></div>');
      $(document.body).append(tpl); // To test if the elt is removed by the directive.
      elt = $compile(tpl[0])(parentScope);
      $rootScope.$digest();
      if (flush) {
        $httpBackend.flush();
      }
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {
        getLayer: function(id) {
          return {
            shop: ['kantone', 'bezirke', 'rectangle']
          };
        },
        getOlLayerById: function() {}
      });
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaLayers = $injector.get('gaLayers');
      gaShop = $injector.get('gaShop');
      gaIdentify = $injector.get('gaIdentify');
      gaPreviewFeatures = $injector.get('gaPreviewFeatures');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        injectServices($injector);
      });

      map = new ol.Map({});
      olFeature = new ol.Feature({layerId: 'layerBodId'});
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('detaches the element', function() {

      it('if no feature defined', function() {
        loadDirective(map);
        expect(elt.parent().length).to.be(0);
      });

      it('if no layer found for this feature', function() {
        sinon.stub(gaLayers, 'getLayer').returns(undefined);
        loadDirective(map, new ol.Feature());
        expect(elt.parent().length).to.be(0);
      });

      it('if the layer is not shopable', function() {
        sinon.stub(gaLayers, 'getLayer').returns({});
        loadDirective(map, new ol.Feature());
        expect(elt.parent().length).to.be(0);
      });

      it('if the layer has an empty shop configuration', function() {
        sinon.stub(gaLayers, 'getLayer').returns({
          shop: []
        });
        loadDirective(map, new ol.Feature());
        expect(elt.parent().length).to.be(0);
      });
    });

    it('verifies html element', function() {
      loadDirective(map, olFeature);
      expect(elt.parent().length).to.be(1);
      expect(elt.find('.ga-shop-available').length).to.be(1);
      expect(elt.find('[ga-shop-rectangle]').length).to.be(1);
      expect(elt.find('.ga-order-bt').length).to.be(1);
    });

    it('set scope values', function() {
      loadDirective(map, olFeature);
      expect(scope.clipperFeatures).to.be.an('object');
      expect(scope.showRectangle).to.be(false);
      expect(scope.price).to.be();
      expect(scope.layerBodId).to.be('layerBodId');
      expect(scope.feature).to.be(olFeature);
      expect(scope.notAvailable).to.be(undefined);
      expect(scope.getClipperFeatureLabel).to.be.a(Function);
      expect(scope.order).to.be.a(Function);
      expect(scope.onChangeOrderType).to.be.a(Function);
      expect(scope.addPreview).to.be.a(Function);
      expect(scope.orderTypes).to.eql(['kantone', 'bezirke', 'rectangle']);
    });

    it('set scope.layerBodId if feature is not an ol.Feature', function() {
      loadDirective(map, {layerBodId: 'someBodId'});
      expect(scope.layerBodId).to.be('someBodId');
    });

    it('set a non ol feature as available by default', function() {
      loadDirective(map, {layerBodId: 'layerBodId', properties: {}});
      expect(scope.feature.properties.available).to.be(true);
    });

    it('set a non ol feature as unavailable', function() {
      sinon.stub(gaLayers, 'getLayer').returns({
        shop: ['kantone']
      });
      loadDirective(map, {
        layerBodId: 'layerBodId',
        properties: {
          available: false
        }
      });
      scope.orderTypes = ['kantone'];
      expect(scope.feature.properties.available).to.be(false);
      expect(scope.notAvailable).to.be(true);
    });

    it('changes rectangle ordertype to default one on gaShopOrderTypeChange event', function() {
      loadDirective(map, {
        layerBodId: 'layerBodId',
        properties: {
          available: true
        }
      });
      scope.orderType = 'rectangle';

      var spy = sinon.spy(scope, 'onChangeOrderType');
      $rootScope.$broadcast('gaShopOrderTypeChange', {});
      expect(scope.orderType).to.be('kantone');
      expect(spy.args[0][1]).to.be(true);
    });

    it('doesn\'t change rectangle ordertype to default one on gaShopOrderTypeChange event coming from the same scope', function() {
      loadDirective(map, {layerBodId: 'layerBodId',
        properties: {
          available: true
        }});
      scope.orderType = 'rectangle';

      var spy = sinon.spy(scope, 'onChangeOrderType');
      $rootScope.$broadcast('gaShopOrderTypeChange', scope);
      expect(scope.orderType).to.be('rectangle');
      expect(spy.callCount).to.be(0);
    });

    describe('#order()', function() {
      var spy;
      beforeEach(function() {
        spy = sinon.spy(gaShop, 'dispatch');
      });

      it('does nothing orderType is not set', function() {
        loadDirective(map, olFeature);
        scope.orderType = null;
        scope.order();
        expect(spy.callCount).to.be(0);
      });

      it('dispatches with minimal parameters', function() {
        loadDirective(map, olFeature);
        scope.order();
        expect(spy.args[0][0]).to.be('kantone');
        expect(spy.args[0][1]).to.be('layerBodId');
        expect(spy.args[0][2]).to.be(undefined);
        expect(spy.args[0][3]).to.be(undefined);
        expect(spy.args[0][4]).to.be(map.getView().getProjection());
      });

      it('dispatches with all parameters', function() {
        loadDirective(map, olFeature);
        scope.geometry = '-100,-100,100,100';
        scope.clipperFeatures = {
          kantone: {
            featureId: 'foo'
          }
        };
        scope.order();
        expect(spy.args[0][0]).to.be('kantone');
        expect(spy.args[0][1]).to.be('layerBodId');
        expect(spy.args[0][2]).to.be('foo');
        expect(spy.args[0][3]).to.be('-100,-100,100,100');
        expect(spy.args[0][4]).to.be(map.getView().getProjection());
      });
    });

    describe('#onChangeOrderType()', function() {
      var spy, spy2, spy3, spy4, spy5;

      beforeEach(function() {
        loadDirective(map, olFeature);
        expect(scope.orderType).to.be('kantone');
        spy = sinon.spy($rootScope, '$broadcast');
        spy2 = sinon.spy(gaPreviewFeatures, 'clearHighlight');
        spy3 = sinon.spy(gaPreviewFeatures, 'remove');
        spy4 = sinon.spy(scope, 'updatePrice');
        spy5 = sinon.spy(scope, 'addPreview');
      });

      it('changes orderType', function() {
        scope.onChangeOrderType('bezirke');
        expect(scope.orderType).to.be('bezirke');
        expect(spy.args[0][0]).to.be('gaShopOrderTypeChange');
        expect(spy.args[0][1]).to.be(scope);
        expect(spy2.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][1]).to.be(null);
        expect(spy4.callCount).to.be(1);
        expect(spy5.callCount).to.be(0);
      });

      it('changes orderType silently', function() {
        scope.onChangeOrderType('bezirke', true);
        expect(scope.orderType).to.be('bezirke');
        expect(spy.callCount).to.be(0);
        expect(spy2.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][1]).to.be(null);
        expect(spy4.callCount).to.be(1);
        expect(spy5.callCount).to.be(0);
      });

      it('changes to an orderType with a clipper and a clipperFeature', function() {
        sinon.stub(gaShop, 'getClipperFromOrderType').returns('bar');
        scope.clipperFeatures = {
          'bezirke': {
            type: 'Feature',
            geometry: {
              coordinates: [-100, 100],
              type: 'Point'
            }
          }
        }
        scope.onChangeOrderType('bezirke');
        expect(scope.orderType).to.be('bezirke');
        expect(spy.args[0][0]).to.be('gaShopOrderTypeChange');
        expect(spy.args[0][1]).to.be(scope);
        expect(spy2.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][0]).to.be(scope.map);
        expect(spy3.args[0][1]).to.be(null);
        expect(spy4.callCount).to.be(1);
        expect(spy5.callCount).to.be(1);
      });

      describe('with a clipper and no clipperFeature', function() {
        var stub3, layer;

        beforeEach(function() {

          layer = new ol.layer.Tile();
          sinon.stub(gaShop, 'getClipperFromOrderType').returns('bar');
          sinon.stub(gaLayers, 'getOlLayerById').withArgs('bar').returns(layer);
          stub3 = sinon.stub(gaIdentify, 'get');
        });

        it('changes the orderType but identify request returns nothing', function(done) {
          var defer = $q.defer();
          var p = defer.promise;
          stub3.returns(p);
          scope.onChangeOrderType('bezirke');
          expect(scope.orderType).to.be('bezirke');
          expect(spy.args[0][0]).to.be('gaShopOrderTypeChange');
          expect(spy.args[0][1]).to.be(scope);
          expect(spy2.args[0][0]).to.be(scope.map);
          expect(spy3.args[0][0]).to.be(scope.map);
          expect(spy3.args[0][1]).to.be(null);
          expect(stub3.args[0][0]).to.be(scope.map);
          expect(stub3.args[0][1]).to.eql([layer]);
          expect(stub3.args[0][2]).to.be(scope.clipperGeometry);
          expect(stub3.args[0][3]).to.be(1);
          expect(stub3.args[0][4]).to.be(true);
          expect(stub3.args[0][5]).to.be(null);

          p.then(function() {
            expect(spy4.callCount).to.be(0);
            expect(spy5.callCount).to.be(0);
            done();
          });

          defer.resolve({
            data: {
              results: []
            }
          });

          $timeout.flush();
        });

        it('changes the orderType then identify request returns a list of results', function(done) {
          var feat = {
            featureId: 'foo2',
            layerBodId: 'bar2',
            type: 'Feature',
            geometry: {
              coordinates: [-100, 100],
              type: 'Point'
            }
          };
          var defer = $q.defer();
          var p = defer.promise;
          stub3.returns(p);
          scope.feature = feat;
          scope.onChangeOrderType('bezirke');
          expect(scope.orderType).to.be('bezirke');
          expect(spy.args[0][0]).to.be('gaShopOrderTypeChange');
          expect(spy.args[0][1]).to.be(scope);
          expect(spy2.args[0][0]).to.be(scope.map);
          expect(spy3.args[0][0]).to.be(scope.map);
          expect(spy3.args[0][1]).to.be(null);
          expect(stub3.args[0][0]).to.be(scope.map);
          expect(stub3.args[0][1]).to.eql([layer]);
          expect(stub3.args[0][2]).to.be(scope.clipperGeometry);
          expect(stub3.args[0][3]).to.be(1);
          expect(stub3.args[0][4]).to.be(true);
          expect(stub3.args[0][5]).to.be(null);

          p.then(function() {
            expect(spy4.callCount).to.be(1);
            expect(spy5.callCount).to.be(1);
            expect(scope.clipperFeatures['bezirke']).to.be(feat);
            done();
          });

          defer.resolve({
            data: {
              results: [{
                featureId: 'foo',
                layerBodId: 'bar'
              }, feat]
            }
          });
          $timeout.flush();
        });
      });
    });

    describe('#addPreview()', function() {

      beforeEach(function() {
        loadDirective(map, olFeature);
      });

      it('adds a preview feature to the map', function() {
        var stub = sinon.stub(gaPreviewFeatures, 'add');
        scope.clipperFeatures.kantone = {
          type: 'Feature',
          geometry: {
            coordinates: [-100, 100],
            type: 'Point'
          }
        };
        scope.addPreview();
        expect(stub.args[0][0]).to.be(map);
        expect(stub.args[0][1]).to.be.a(ol.Feature);
      });
    });

    describe('#updatePrice()', function() {
      var spy;

      beforeEach(function() {
        loadDirective(map, olFeature);
        spy = sinon.stub(gaShop, 'getPrice').returns($q.when(54));
      });

      describe('when orderType is not rectangle', function() {

        beforeEach(function() {
          scope.clipperFeatures = {
            kantone: {
              featureId: 'foo'
            }
          };
        });

        it('get the price', function() {
          scope.price = null;
          scope.updatePrice();
          expect(spy.args[0][0]).to.be('kantone');
          expect(spy.args[0][1]).to.be('layerBodId');
          expect(spy.args[0][2]).to.be('foo');
          expect(spy.args[0][3]).to.be(undefined);
          expect(spy.args[0][4]).to.be(map.getView().getProjection());
          $timeout.flush();
          expect(scope.price).to.be(54);
        });

        it('set the price to null because geometry is defined', function() {
          scope.price = 67;
          scope.updatePrice('-100,-100,100,100');
          expect(spy.callCount).to.be(0);
          $timeout.flush();
          expect(scope.price).to.be(null);
        });
      });

      describe('when orderType is rectangle', function() {

        beforeEach(function() {
          scope.orderType = 'rectangle';
          scope.clipperFeatures = {
            rectangle: {
              featureId: 'foo'
            }
          };
        });

        it('set price if scope.geometry and cutArea are set', function() {
          scope.geometry = '-1,-1,1,1';
          scope.updatePrice(null, 1);
          expect(spy.args[0][0]).to.be('rectangle');
          expect(spy.args[0][1]).to.be('layerBodId');
          expect(spy.args[0][2]).to.be('foo');
          expect(spy.args[0][3]).to.be(scope.geometry);
          expect(spy.args[0][4]).to.be(map.getView().getProjection())
          $timeout.flush();
          expect(scope.price).to.be(54);
        });

        it('set price if geometry and cutArea are set', function() {
          expect(scope.geometry).to.be(undefined);
          scope.updatePrice('-1,-1,1,1', 1);
          expect(scope.geometry).to.be('-1,-1,1,1');
          expect(spy.args[0][0]).to.be('rectangle');
          expect(spy.args[0][1]).to.be('layerBodId');
          expect(spy.args[0][2]).to.be('foo');
          expect(spy.args[0][3]).to.be(scope.geometry);
          expect(spy.args[0][4]).to.be(map.getView().getProjection())
          $timeout.flush();
          expect(scope.price).to.be(54);
        });

        it('set the price to null', function() {
          scope.price = 67;
          scope.updatePrice();
          $timeout.flush();
          expect(scope.price).to.be(null);
        });
      });
    });
  });
});
