describe('ga_shop_service', function() {

  describe('gaShop', function() {
    var gaShop, gaGlobalOptions;
    var mapsheetParams = '?layer=layerBodId&product=featureId';
    var mapsheetParamsExceptTpl = '?layer={layerBodId}&featureid=featureId';
    var tileWithClipperParamsTpl = '?layer={layerBodId}&clipper={clipper}&featureid=featureId';
    var communeParams = '?layer=layerBodId&clipper=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&featureid=featureId';
    var districtParams = '?layer=layerBodId&clipper=ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill&featureid=featureId';
    var cantonParams = '?layer=layerBodId&clipper=ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&featureid=featureId';
    var rectangleParams = '?layer=layerBodId&geometry=geometry';
    var wholeParams = '?layer=layerBodId&clipper=layerBodId';
    var mapsheetExeptions = [
      'ch.swisstopo.lubis-bildstreifen',
      'ch.swisstopo.lubis-luftbilder_schwarzweiss',
      'ch.swisstopo.lubis-luftbilder_infrarot',
      'ch.swisstopo.lubis-luftbilder_farbe'
    ];
    var tileLayers = {
      'ch.swisstopo.images-swissimage.metadata': 'ch.swisstopo.swissimage-product',
      'ch.swisstopo.pixelkarte-pk25.metadata': 'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
      'ch.swisstopo.pixelkarte-pk50.metadata': 'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
      'ch.swisstopo.pixelkarte-pk100.metadata': 'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
      'ch.swisstopo.pixelkarte-pk200.metadata': 'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
    };
    var bodIds = [
      'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
      'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
      'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
      'ch.swisstopo.pixelkarte-farbe-pk200.noscale'
      //,'ch.swisstopo.digitales-hoehenmodell_25_reliefschattierung': '
    ];
    var clipper = {
      'commune': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
      'district': 'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill',
      'canton': 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
    };
    var orderTypes = ['commune', 'canton', 'district'];

    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
        $provide.value('gaLang', {
          get: function() {
            return 'custom';
          }
        });
      });

      inject(function($injector) {
        gaShop = $injector.get('gaShop');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
      });
    });

    describe('#dispatch()', function() {
      var closeSpy, openStub, clock, $window;
      var dispatchUrl;
      var dfltDispatchUrl;
      var fakeWindow = {
        close: function() {}
      };

      beforeEach(function() {
        inject(function($injector) {
          $window = $injector.get('$window');
        });
        dispatchUrl = gaGlobalOptions.shopUrl + '/custom/dispatcher';
        dfltDispatchUrl = dispatchUrl + '?layer=layerBodId';
        clock = sinon.useFakeTimers();
        openStub = sinon.stub($window, 'open');
        closeSpy = sinon.spy($window, 'close');
      });

      afterEach(function() {
        openStub.restore();
        closeSpy.restore();
        clock.restore();
      });


      it('do nothing if orderType or layerBodId are not defined', function() {
        gaShop.dispatch();
        sinon.assert.notCalled(openStub);
        sinon.assert.notCalled(closeSpy);

        gaShop.dispatch('order');
        sinon.assert.notCalled(openStub);
        sinon.assert.notCalled(closeSpy);

        gaShop.dispatch(null, 'layerBodId');
        sinon.assert.notCalled(openStub);
      });

      it('opens a new window (setting a new sessionId)', function() {
        gaShop.dispatch('orderType', 'layerBodId');
        sinon.assert.calledWith(openStub, dfltDispatchUrl, 'toposhop-' + new Date());
      });

      it('closes the previous window opened ', function() {
        openStub = openStub.returns(fakeWindow);
        var fakeCloseSpy = sinon.spy(fakeWindow, 'close');
        gaShop.dispatch('orderType', 'layerBodId');
        sinon.assert.calledOnce(openStub);

        gaShop.dispatch('orderType', 'layerBodId');
        sinon.assert.calledOnce(fakeCloseSpy);
        sinon.assert.calledTwice(openStub);
        fakeCloseSpy.restore();
      });

      it('closes the shop window then opens the new one keeping the sessionId', function() {
        var tpshopId = 'toposhop-344';
        $window.name = 'map-' + tpshopId;
        $window.opener = fakeWindow;
        var openerCloseSpy = sinon.spy($window.opener, 'close');

        gaShop.dispatch('orderType', 'layerBodId');
        sinon.assert.calledOnce(openerCloseSpy);
        sinon.assert.notCalled(closeSpy);
        sinon.assert.calledWith(openStub, dfltDispatchUrl, tpshopId);
      });

      it('opens a good mapsheet url', function() {
        gaShop.dispatch('mapsheet', 'layerBodId', 'featureId');
        sinon.assert.calledWith(openStub, dispatchUrl + mapsheetParams);
      });

      for (var m in mapsheetExeptions) {
        it('opens a good mapsheet url of exceptions', function() {
          gaShop.dispatch('mapsheet', mapsheetExeptions[m], 'featureId');
          var mapsheetParamsExcept = mapsheetParamsExceptTpl
            .replace('{layerBodId}', mapsheetExeptions[m]);
          sinon.assert.calledWith(openStub,
              dispatchUrl + mapsheetParamsExcept);
        });
      }

      for (var i in tileLayers) {
        it('opens a good tile url with clipper', function() {
          gaShop.dispatch('tile', i, 'featureId');
          var withClipperParams = tileWithClipperParamsTpl
            .replace('{layerBodId}', tileLayers[i])
            .replace('{clipper}', i);
          sinon.assert.calledWith(openStub, dispatchUrl + withClipperParams);
        });
      }

      it('opens a good commune url', function() {
        gaShop.dispatch('commune', 'layerBodId', 'featureId');
        sinon.assert.calledWith(openStub, dispatchUrl + communeParams);
      });

      it('opens a good district url', function() {
        gaShop.dispatch('district', 'layerBodId', 'featureId');
        sinon.assert.calledWith(openStub, dispatchUrl + districtParams);
      });

      it('opens a good canton url', function() {
        gaShop.dispatch('canton', 'layerBodId', 'featureId');
        sinon.assert.calledWith(openStub, dispatchUrl + cantonParams);
      });

      it('opens a good rectangle url', function() {
        gaShop.dispatch('rectangle', 'layerBodId', 'featureId', 'geometry');
        sinon.assert.calledWith(openStub, dispatchUrl + rectangleParams);
      });

      it('opens a good whole url', function() {
        gaShop.dispatch('whole', 'layerBodId', 'featureId');
        sinon.assert.calledWith(openStub, dispatchUrl + wholeParams);
      });
    });

    describe('#getPrice()', function() {
      var $httpBackend, $rootScope;
      var priceUrl;

      beforeEach(function() {
        inject(function($injector) {
          $httpBackend = $injector.get('$httpBackend');
          $rootScope = $injector.get('$rootScope');
        });
        priceUrl = gaGlobalOptions.shopUrl + '/shop-server/resources/products/price';
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('returns a promise', function(done) {
        gaShop.getPrice().catch(function() {
          done();
        });
        $rootScope.$digest();
      });

      it('send a good mapsheet url', function(done) {
        $httpBackend.expectGET(priceUrl + mapsheetParams).respond(200, {productPrice: 30});
        gaShop.getPrice('mapsheet', 'layerBodId', 'featureId').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });

      for (var i in tileLayers) {
        it('send a good tile with clipper url', function(done) {
          var withClipperParams = tileWithClipperParamsTpl
              .replace('{layerBodId}', tileLayers[i])
              .replace('{clipper}', i);
          $httpBackend.expectGET(priceUrl + withClipperParams).respond(200, {productPrice: 30});
          gaShop.getPrice('tile', i, 'featureId').then(function(price) {
            expect(price).to.eql(30);
            done();
          });
          $rootScope.$digest();
          $httpBackend.flush();
        });
      }

      it('send a good commune url', function(done) {
        $httpBackend.expectGET(priceUrl + communeParams).respond(200, {productPrice: 30});
        gaShop.getPrice('commune', 'layerBodId', 'featureId').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('send a good district url', function(done) {
        $httpBackend.expectGET(priceUrl + districtParams).respond(200, {productPrice: 30});
        gaShop.getPrice('district', 'layerBodId', 'featureId').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('send a good canton url', function(done) {
        $httpBackend.expectGET(priceUrl + cantonParams).respond(200, {productPrice: 30});
        gaShop.getPrice('canton', 'layerBodId', 'featureId').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('send a good rectangle url', function(done) {
        $httpBackend.expectGET(priceUrl + rectangleParams).respond(200, {productPrice: 30});
        gaShop.getPrice('rectangle', 'layerBodId', 'featureId', 'geometry').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });

      it('send a good whole url', function(done) {
        $httpBackend.expectGET(priceUrl + wholeParams).respond(200, {productPrice: 30});
        gaShop.getPrice('whole', 'layerBodId', 'featureId').then(function(price) {
          expect(price).to.eql(30);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });
    });

    describe('#cut()', function() {
      var $httpBackend, $rootScope;
      var url;
      var cutParams = 'layers=all:ch.swisstopo.pixelkarte-farbe-pk25.noscale&geometryType=esriGeometryEnvelope&geometry=1,3,2,1';

      beforeEach(function() {
        inject(function($injector) {
          $httpBackend = $injector.get('$httpBackend');
          $rootScope = $injector.get('$rootScope');
        });
        url = gaGlobalOptions.apiUrl + '/rest/services/all/GeometryServer/cut?';
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('irejects the promis if no geometry param', function(done) {
        gaShop.cut().then(null, function() {
          done();
        });
        $rootScope.$digest();
      });

      it('send a good cut url', function(done) {
        var layerBodId = 'ch.swisstopo.pixelkarte-farbe-pk25.noscale';
        var response = {};
        response[layerBodId] = [{
          area: '120'
        }];
        $httpBackend.expectGET(url + cutParams).respond(200, response);
        gaShop.cut('1,3,2,1', layerBodId).then(function(area) {
          expect(area).to.eql(120);
          done();
        });
        $rootScope.$digest();
        $httpBackend.flush();
      });
    });

    describe('#getClipperFromOrderType()', function() {

      it('returns the clipper associated to an orderType', function() {
        orderTypes.forEach(function(item) {
          expect(gaShop.getClipperFromOrderType(item)).to.be(clipper[item]);
        });
      });
    });
  });
});
