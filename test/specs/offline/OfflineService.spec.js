describe('ga_offline_service', function() {

  describe('gaOffline', function() {
    var map;
    var gaOffline, gaStorageMock, gaLayersMock, $window, gaTileGrid, gaMapUtils, gaMapUtilsMock, gaGlobalOptions, $q, $timeout, $rootScope, gaOfflineMock, $httpBackend;
    var extentKey = 'ga-offline-extent';
    var layersKey = 'ga-offline-layers';
    var opacityKey = 'ga-offline-layers-opacity';
    var timestampKey = 'ga-offline-layers-timestamp';
    var bgKey = 'ga-offline-layers-bg';
    var promptKey = 'ga-offline-prompt-db';
    var layerBodConfig = {
      timestamps: ['20141231', '20121231']
    };
    var layerBodCurrConfig = {
      timestamps: ['current', '20121231']
    };
    var layerBodTimeEnabledConfig = {
      timeEnabled: true,
      timestamps: ['20121231', '18641231']
    };

    var provideServices = function($provide) {
      $provide.value('gaTopic', {});
      $provide.value('gaLayers', {
        loadConfig: function() {
          return $q.when({});
        },
        getLayer: angular.noop,
        getLayerProperty: angular.noop
      });
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        $q = $injector.get('$q');
        $window = $injector.get('$window');
        gaOffline = $injector.get('gaOffline');
        gaOfflineMock = sinon.mock(gaOffline);
        gaStorageMock = sinon.mock($injector.get('gaStorage'));
        gaLayersMock = sinon.mock($injector.get('gaLayers'));
        gaMapUtils = $injector.get('gaMapUtils');
        gaMapUtilsMock = sinon.mock(gaMapUtils);
        gaTileGrid = $injector.get('gaTileGrid');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        $timeout = $injector.get('$timeout');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
      });
      var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
      defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);

      map = new ol.Map({
        view: new ol.View({
          projection: defaultProjection,
          center: ol.extent.getCenter(gaMapUtils.defaultExtent),
          resolution: gaMapUtils.defaultResolution,
          resolutions: gaMapUtils.viewResolutions
        })
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $timeout.verifyNoPendingTasks();
    });

    describe('#hasData()', function() {

      it('detects data', function() {
        var getItem = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns('655000,185000,665000,195000');
        var has = gaOffline.hasData();
        getItem.verify();
        expect(has).to.equal(true);
        $timeout.flush();
      });

      it('doesn\'t detect data', function() {
        var getItem = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns(undefined);
        var has = gaOffline.hasData();
        getItem.verify();
        expect(has).to.equal(false);
        $timeout.flush();
      });
    });

    describe('#isDataObsolete()', function() {

      it('returns false if there is no data stored', function() {
        gaStorageMock.expects('getItem').once().withArgs(extentKey).returns(undefined);
        var getTs = gaStorageMock.expects('getItem').never().withArgs(timestampKey);
        var obs = gaOffline.isDataObsolete();
        getTs.verify();
        expect(obs).to.be(false);
        $timeout.flush();
      });

      it('returns false if there is data but ' + timestampKey + 'is not set (old offline version)', function() {
       var getExt = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns('655000,185000,665000,195000');
       var getTs = gaStorageMock.expects('getItem').once().withArgs(timestampKey).returns(undefined);
       var obs = gaOffline.isDataObsolete();
       getExt.verify();
       getTs.verify();
       expect(obs).to.be(true);
       $timeout.flush();
      });

      describe('#isDataObsolete()', function() {
        var verif;
        beforeEach(function() {
          verif = [
            gaStorageMock.expects('getItem').once().withArgs(extentKey)
                .returns('655000,185000,665000,195000'),
            gaStorageMock.expects('getItem').once().withArgs(layersKey)
                .returns('layerBodCurrent,layerNoBod,layerBod,layerBodTimeEnabled'),
            gaLayersMock.expects('getLayer').once().withArgs('layerBodCurrent')
                .returns(layerBodCurrConfig),
            gaLayersMock.expects('getLayer').once().withArgs('layerNoBod')
                .returns(undefined),
            gaLayersMock.expects('getLayer').once().withArgs('layerBod')
                .returns(layerBodConfig),
            gaLayersMock.expects('getLayer').once().withArgs('layerBodTimeEnabled')
                .returns(layerBodTimeEnabledConfig)
          ];
        });

        it('contains an obsolete layer', function() {
          verif = verif.concat([
            gaStorageMock.expects('getItem').once().withArgs(timestampKey)
                .returns('current,,20121231,18641231')
          ]);
          expect(gaOffline.isDataObsolete()).to.be(true);
          verif.forEach(function(item) {
            item.verify();
          });
          $timeout.flush();
        });

        it('doesn\'t contains an obsolete layer', function() {
          verif = verif.concat([
            gaStorageMock.expects('getItem').once().withArgs(timestampKey)
                .returns('current,,20141231,18641231')
          ]);
          expect(gaOffline.isDataObsolete()).to.be(false);
          verif.forEach(function(item) {
            item.verify();
          });
          $timeout.flush();
        });
      });
    });

    describe('#abort()', function() {

      it('clears the storage', function() {
        var spy = sinon.spy($rootScope, '$broadcast').withArgs('gaOfflineAbort');
        var verif = [
          gaStorageMock.expects('clearTiles').once().returns($q.when()),
          gaStorageMock.expects('getItem').once().withArgs(layersKey).returns('id1,id2'),
          gaStorageMock.expects('removeItem').once().withArgs('id1'),
          gaStorageMock.expects('removeItem').once().withArgs('id2'),
          gaStorageMock.expects('removeItem').once().withArgs(extentKey),
          gaStorageMock.expects('removeItem').once().withArgs(layersKey),
          gaStorageMock.expects('removeItem').once().withArgs(opacityKey),
          gaStorageMock.expects('removeItem').once().withArgs(timestampKey),
          gaStorageMock.expects('removeItem').once().withArgs(bgKey),
        ];
        gaOffline.abort();
        $rootScope.$digest();
        verif.forEach(function(v) {
          v.verify();
        });
        expect(spy.calledOnce).to.be(true);
        $timeout.flush();
      });

      it('fails to clear the storage', function() {
        var stubAlert = sinon.stub($window, 'alert');
        var defer = $q.defer();
        defer.reject();
        var verif = [
          gaStorageMock.expects('clearTiles').once().returns(defer.promise),
        ];
        gaOffline.abort();
        $rootScope.$digest();
        verif.forEach(function(v) {
          v.verify();
        });
        expect(stubAlert.calledOnce).to.be(true);
        stubAlert.restore();
        $timeout.flush();
      });
    });

    describe('#save()', function() {

      var addCacheableTiledLayerToMap = function(id, visible, opacity, time, bg) {
        var layer = new ol.layer.Tile({
          source: new ol.source.TileImage({
            url: 'test.com/{z}/{x}/{y}.' + (bg ? 'jpeg' : 'png'),
            tileGrid: gaTileGrid.get()
          }),
          visible: visible,
          opacity: opacity
        });
        layer.id = id;
        layer.bodId = id;
        layer.invertedOpacity = 1 - opacity;
        layer.timestamps = [
          '20180909',
          '19550101',
        ];
        layer.time = time;
        map.addLayer(layer);
        return layer;
      };

      var addTooBigKmlLayerToMap = function() {
        var layer = new ol.layer.Image({
          visible: true
        });
        layer.type = 'KML';
        map.addLayer(layer);
        return layer;
      };

      var addKmlLayerToMap = function(id, kmlString) {
        var layer = new ol.layer.Vector({
          opacity: 0.1,
          visible: true,
          source: new ol.source.Vector({
            features: []
          })
        });
        layer.id = id;
        layer.type = 'KML';
        layer.invertedOpacity = 1 - layer.getOpacity();
        layer.getSource().setProperties({
          'kmlString': kmlString
        });
        map.addLayer(layer);
        return layer;
      };

      describe('fails showing an alert ', function() {

        it('if no layers in the map', function() {
          var stub = sinon.stub($window, 'alert');
          gaOffline.save(map);
          expect(stub.calledOnce).to.be(true);
          stub.restore();
          $timeout.flush();
        });

        it('if all layers are hidden', function() {
          var stub = sinon.stub($window, 'alert');
          addCacheableTiledLayerToMap('id', false);
          gaOffline.save(map);
          expect(stub.calledOnce).to.be(true);
          stub.restore();
          $timeout.flush();
        });

        it('if a KML is too big to be saved', function() {
          var stub = sinon.stub($window, 'alert');
          addTooBigKmlLayerToMap();
          gaOffline.save(map);
          expect(stub.callCount).to.be(2);
          stub.restore();
          $timeout.flush();
         });

        it('if only KMLs are saved', function() {
          var stub = sinon.stub($window, 'confirm').returns(true);
          var stubAlert = sinon.stub($window, 'alert');
          var stubAbort = sinon.stub(gaOffline, 'abort');

          var kmlContent1 = '<kml><Placemark></Placemark></kml>';
          addKmlLayerToMap('kmlId1', kmlContent1);
          gaOffline.save(map);

          expect(stub.calledOnce).to.be(true);
          stub.restore();
          expect(stubAlert.calledOnce).to.be(true);
          stubAlert.restore();
          expect(stubAbort.calledOnce).to.be(true);
          stubAbort.restore();
          $timeout.flush();
        });
      });

      it('does nothing if the user answer no to the confirm box', function() {
        var stub = sinon.stub($window, 'confirm').returns(false);
        addCacheableTiledLayerToMap('id', true);
        gaOffline.save(map);
        expect(stub.calledOnce).to.be(true);
        stub.restore();
        $timeout.flush();
      });

      it('saves 2 bod tiled layers, one which is a bg', function(done) {
        var stub = sinon.stub($window, 'confirm').returns(true);
        var stubAlert = sinon.stub($window, 'alert');
        var spy = sinon.spy($rootScope, '$broadcast');
        spy.withArgs('gaOfflineProgress');
        spy.withArgs('gaOfflineSuccess');
        var verif = [
          gaLayersMock.expects('getLayerProperty').once().withArgs('id', 'parentLayerId').returns('parentLayerId'),
          gaMapUtilsMock.expects('getMapLayerForBodId').once().withArgs(map, 'parentLayerId').returns({background: true}),
          gaLayersMock.expects('getLayerProperty').once().withArgs('bodId', 'parentLayerId').returns(undefined),
          gaStorageMock.expects('setItem').once().withArgs(layersKey, 'bodId,id'),
          gaStorageMock.expects('setItem').once().withArgs(opacityKey, '0.6,0.8'),
          gaStorageMock.expects('setItem').once().withArgs(timestampKey, '20180909,2016'),
          gaStorageMock.expects('setItem').once().withArgs(bgKey, ',true'),
          gaStorageMock.expects('clearTiles').once().returns($q.when(done())),
          gaStorageMock.expects('setItem').once().withArgs(extentKey, [655000, 185000, 665000, 195000])
        ];

        var server = sinon.fakeServer.create();
        server.respondImmediately = true;
        addCacheableTiledLayerToMap('bodId', true, '0.4');
        addCacheableTiledLayerToMap('id', true, '0.2', '2016', true);
        //try {
        gaOffline.save(map);
        // Launch requests
        $rootScope.$digest();
        $timeout.flush();
        server.restore();
        expect(stub.calledOnce).to.be(true);
        stub.restore();
        expect(stubAlert.calledOnce).to.be(true);
        stubAlert.restore();
        expect(spy.withArgs('gaOfflineProgress').callCount).to.be.greaterThan(90); // 90 to be sure we avoid timing issue it could 100 or 101 for example
        expect(spy.withArgs('gaOfflineSuccess').callCount).to.be(1);
        spy.restore();
        verif.forEach(function(v) {
          v.verify();
        });
      });

      it('saves a tiled layer and 2 KMLs layers', function() {
        var stub = sinon.stub($window, 'confirm').returns(true);
        var stubAlert = sinon.stub($window, 'alert');
        var spy = sinon.spy($rootScope, '$broadcast');
        spy.withArgs('gaOfflineProgress');
        spy.withArgs('gaOfflineSuccess');
        var kmlContent1 = '<kml><Placemark></Placemark></kml>';
        var kmlContent2 = '<kml><Folder><Placemark></Placemark></Folder></kml>';

        var verif = [
          gaStorageMock.expects('setItem').once().withArgs('kmlId1', kmlContent1),
          gaStorageMock.expects('setItem').once().withArgs('kmlId2', kmlContent2),
          gaLayersMock.expects('getLayerProperty').once().withArgs('bodId', 'parentLayerId').returns(undefined),
          gaStorageMock.expects('setItem').once().withArgs(layersKey, 'bodId,kmlId1,kmlId2'),
          gaStorageMock.expects('setItem').once().withArgs(opacityKey, '0.6,0.9,0.9'),
          gaStorageMock.expects('setItem').once().withArgs(timestampKey, '20180909,,'),
          gaStorageMock.expects('setItem').once().withArgs(bgKey, ',false,false'),
          gaStorageMock.expects('clearTiles').once().returns($q.when()),
          gaStorageMock.expects('setItem').once().withArgs(extentKey, [655000, 185000, 665000, 195000])
        ];

        var server = sinon.fakeServer.create();
        server.respondImmediately = true;
        addCacheableTiledLayerToMap('bodId', true, '0.4');
        addKmlLayerToMap('kmlId1', kmlContent1);
        addKmlLayerToMap('kmlId2', kmlContent2);
        gaOffline.save(map);

        // Launch requests
        $timeout.flush();
        server.restore();

        expect(stub.calledOnce).to.be(true);
        stub.restore();
        expect(stubAlert.calledOnce).to.be(true);
        stubAlert.restore();
        expect(spy.withArgs('gaOfflineProgress').callCount).to.be(101);
        expect(spy.withArgs('gaOfflineSuccess').callCount).to.be(1);
        spy.restore();
        verif.forEach(function(v) {
          v.verify();
        });
      });
    });

    describe('#calculateExtentToSave()', function() {
      it('returns a buffer of 5000 m', function() {
        expect(gaOffline.calculateExtentToSave([0, 0])).to.eql([-5000, -5000, 5000, 5000]);
        $timeout.flush();
      });
    });

    describe('#isSelectorActive()', function() {
      it('set values correctly on show/hide/toggle', function() {
        expect(gaOffline.isSelectorActive()).to.be(false);

        gaOffline.showSelector();
        expect(gaOffline.isSelectorActive()).to.be(true);

        gaOffline.hideSelector();
        expect(gaOffline.isSelectorActive()).to.be(false);

        gaOffline.toggleSelector();
        expect(gaOffline.isSelectorActive()).to.be(true);

        gaOffline.toggleSelector();
        expect(gaOffline.isSelectorActive()).to.be(false);
        $timeout.flush();
      });
    });

    describe('#isMenuActive()', function() {
      it('set values correctly on show/hide/toggle', function() {
        expect(gaOffline.isMenuActive()).to.be(false);

        gaOffline.showMenu();
        expect(gaOffline.isMenuActive()).to.be(true);

        gaOffline.hideMenu();
        expect(gaOffline.isMenuActive()).to.be(false);

        gaOffline.toggleMenu();
        expect(gaOffline.isMenuActive()).to.be(true);

        gaOffline.toggleMenu();
        expect(gaOffline.isMenuActive()).to.be(false);
        $timeout.flush();
      });
    });
  });
});
