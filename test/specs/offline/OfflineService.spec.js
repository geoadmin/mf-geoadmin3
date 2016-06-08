describe('ga_offline_service', function() {
  var map;
  var gaOffline, gaStorageMock, gaLayersMock;
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
    timestamps: ['20121231','18641231']
  };

  beforeEach(function() {
    inject(function($injector, gaGlobalOptions) {
      gaOffline = $injector.get('gaOffline');
      gaStorageMock = sinon.mock($injector.get('gaStorage'));
      gaLayersMock = sinon.mock($injector.get('gaLayers'));
    });
    map = new ol.Map({});
  });
  
  describe('hasData', function() {

    it('detects data', function() {
      var getItem = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns('655000,185000,665000,195000');
      var has = gaOffline.hasData();
      getItem.verify();
      expect(has).to.equal(true);
    });

    it('doesn\'t detect data', function() {
      var getItem = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns(undefined);
      var has = gaOffline.hasData();
      getItem.verify();
      expect(has).to.equal(false);
    });
  });   

  describe('isDataObsolete', function() {

    it('returns false if there is no data stored', function() {
      gaStorageMock.expects('getItem').once().withArgs(extentKey).returns(undefined);
      var getTs = gaStorageMock.expects('getItem').never().withArgs(timestampKey);
      var obs = gaOffline.isDataObsolete();
      getTs.verify();
      expect(obs).to.be(false);
    });
    
    it('returns false if there is data but ' + timestampKey + 'is not set (old offline version)', function() {
     var getExt = gaStorageMock.expects('getItem').once().withArgs(extentKey).returns('655000,185000,665000,195000');
     var getTs = gaStorageMock.expects('getItem').once().withArgs(timestampKey).returns(undefined);
     var obs = gaOffline.isDataObsolete();
     getExt.verify();
     getTs.verify();
     expect(obs).to.be(true);
    });
    
    describe('detects obsolences from data stored', function() {
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
      });
    });
  });

  describe('calculateExtentToSave', function() {
    it('returns a buffer of 5000 m', function() {
      expect(gaOffline.calculateExtentToSave([0,0])).to.eql([-5000,-5000, 5000, 5000]);
    }); 
  });

  describe('isSelectorActive', function() {
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
    });
  });

  describe('isMenuActive', function() {
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
    });
  });

});
