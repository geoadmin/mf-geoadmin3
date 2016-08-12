describe('ga_permalinkfeatures_service', function() {

  describe('gaPermalinkFeaturesManager', function() {
    var map, gaPermFeat, gaPermalink, gaLayers, gaPreviewFeatures, $rootScope;

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            var defer = $q.defer();
            defer.resolve();
            return defer.promise;
          },
          getLayer: function(id) {
            return (id == 'somelayer') ? {} : undefined;
          },
          getOlLayerById: function(bodId) {
            var layer = new ol.layer.Tile();
            layer.bodId = bodId;
            layer.displayInLayerManager = true;
            return layer;
          }
        });

        $provide.value('gaPreviewFeatures', {
          addBodFeatures: function() {
            var defer2 = $q.defer();
            defer2.resolve([new ol.Feature(), new ol.Feature()]);
            return defer2.promise;
          }
        });
      });

      inject(function($injector) {
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        gaLayers = $injector.get('gaLayers');
        gaPermalink = $injector.get('gaPermalink');
        gaPreviewFeatures = $injector.get('gaPreviewFeatures');
      });

      map = new ol.Map({});
    });

    describe('without features defined in permalink', function() {

      beforeEach(function() {
        gaPermalink.getParams = function() {
          return {};
        };

        inject(function($injector) {
          gaPermFeat = $injector.get('gaPermalinkFeaturesManager');
        });

        gaPermFeat(map);
      });

      it('broadcast an event', function() {
        var spy = sinon.spy($rootScope, '$broadcast');
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.equal(0);
        expect(spy.calledWith('gaPermalinkFeaturesAdd')).to.equal(true);
      });
    });

    describe('with features defined in permalink', function() {

      beforeEach(function() {
        gaPermalink.getParams = function() {
          return {
            somelayer: 'featureid1,featureid2'
          };
        };

        inject(function($injector) {
          gaPermFeat = $injector.get('gaPermalinkFeaturesManager');
        });

        gaPermFeat(map);
      });

      it('adds the feature\'s layer', function() {
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.equal(1);
      });

      it('doesn\'t add the feature\'s layer if it is already on the map', function() {
        map.addLayer(gaLayers.getOlLayerById('somelayer'));
        expect(map.getLayers().getLength()).to.equal(1);
        var spy = sinon.spy(map, 'addLayer');
        $rootScope.$digest();
        expect(spy.callCount).to.equal(0);
        expect(map.getLayers().getLength()).to.equal(1);
      });

      it('adds a preview feature', function() {
        var spy = sinon.spy(gaPreviewFeatures, 'addBodFeatures');
        $rootScope.$digest();
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.be(map);
        expect(spy.args[0][1]['somelayer'].length).to.equal(2);
        expect(spy.args[0][2]).to.be.a(Function);
      });

      it('remove the feature from permalink when we remove the layer', function() {
        var spy = sinon.spy(gaPermalink, 'deleteParam');
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.equal(1);
        map.getLayers().remove(map.getLayers().item(0));
        expect(spy.calledWith('somelayer')).to.equal(true);
      });
    });

    describe('with features and features\'s layer defined in permalink', function() {

      beforeEach(function() {
        gaPermalink.getParams = function() {
          return {
            layers: 'somelayer',
            somelayer: 'featureid1,featureid2'
          };
        };

        inject(function($injector) {
          gaPermFeat = $injector.get('gaPermalinkFeaturesManager');
        });

        gaPermFeat(map);
      });

      it('doesn\'t add the feature\'s layer', function() {
        expect(map.getLayers().getLength()).to.equal(0);
        var spy = sinon.spy(map, 'addLayer');
        $rootScope.$digest();
        expect(spy.callCount).to.equal(0);
      });
    });

    describe('with features and showTooltip defined in permalink', function() {

      beforeEach(function() {
        gaPermalink.getParams = function() {
          return {
            showTooltip: 'true',
            somelayer: 'featureid1,featureid2'
          };
        };

        inject(function($injector) {
          gaPermFeat = $injector.get('gaPermalinkFeaturesManager');
        });

        gaPermFeat(map);
      });

      it('broadcast a tooltip event', function() {
        var spy = sinon.spy($rootScope, '$broadcast');
        $rootScope.$digest();
        expect(map.getLayers().getLength()).to.equal(1);
        expect(spy.calledWith('gaTriggerTooltipRequest')).to.equal(true);
        var param = spy.args[1][1];
        expect(param.features.length).to.be(2);
        expect(param.onCloseCB).to.be.a(Function);
        expect(param.nohighlight).to.be(true);
        var spy2 = sinon.spy(gaPermalink, 'deleteParam');
        param.onCloseCB();
        expect(spy2.calledWith('showTooltip')).to.equal(true);
      });
    });
  });
});
