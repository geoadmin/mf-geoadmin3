/* eslint-disable max-len */
describe('ga_background_service', function() {

  describe('gaBackground', function() {
    var gaBg, gaPermalink, gaTopic, deferGaLayers, deferGaTopic, map, $rootScope,
      gaPermalinkMock, $rootScopeMock, $q, gaGlStyleStorage;

    // Only vector bg and void layer are always added to the map
    var nbBgs = 2;
    var firstBgId = 'ch.swisstopo.leichte-basiskarte.vt';
    var topic1 = {
      'defaultBackground': 'ch.swisstopo.leichte-basiskarte.vt',
      'backgroundLayers': [
        'ch.swisstopo.leichte-basiskarte.vt',
        'voidLayer'
      ]
    };
    var topic2 = {
      'defaultBackground': 'ch.swisstopo.leichte-basiskarte.vt',
      'backgroundLayers': [
        'ch.swisstopo.leichte-basiskarte.vt',
        'ch.swisstopo.pixelkarte-farbe',
        'ch.swisstopo.swissimage'
      ]
    };
    var topicVoidLayer = {
      'defaultBackground': 'voidLayer',
      'backgroundLayers': [
        'ch.swisstopo.leichte-basiskarte.vt',
        'ch.swisstopo.pixelkarte-farbe',
        'ch.swisstopo.swissimage'
      ]
    };
    var topicPlConfig = {
      'defaultBackground': 'bg1',
      'plConfig': 'bgLayer=bg3',
      'backgroundLayers': [
        'bg1',
        'bg2',
        'bg3'
      ]
    };
    var topic4 = {
      'defaultBackground': 'ch.swisstopo.leichte-basiskarte.vt',
      'backgroundLayers': [
        'ch.swisstopo.pixelkarte-farbe'
      ]
    };

    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            return deferGaLayers.promise;
          },
          getLayerProperty: function() {
            return 'label';
          },
          getOlLayerById: function(id, opts) {
            var l = new ol.layer.Tile({});
            l.id = id;
            l.externalStyleUrl = opts && opts.externalStyleUrl;
            return l;
          }
        });

        $provide.value('gaTopic', {
          loadConfig: function() {
            return deferGaTopic.promise;
          },
          get: function() {}
        });

        $provide.value('gaPermalink', {
          getParams: function() {
            return {};
          },
          updateParams: function() {
          },
          deleteParam: function() {
          }
        });

      });

      inject(function($injector) {
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        gaBg = $injector.get('gaBackground');
        gaTopic = $injector.get('gaTopic');
        gaPermalink = $injector.get('gaPermalink');
        gaGlStyleStorage = $injector.get('gaGlStyleStorage');
        gaPermalinkMock = sinon.mock(gaPermalink);
        $rootScopeMock = sinon.mock($rootScope);
      });
      deferGaLayers = $q.defer();
      deferGaTopic = $q.defer();
      map = new ol.Map({});
    });

    afterEach(function() {
      gaPermalinkMock.restore();
      $rootScopeMock.restore();
    });

    describe('#init()', function() {

      describe('using a basic topic', function() {

        beforeEach(function() {
          gaTopic.get = function() {
            return topic1;
          };
        });

        it('resolves the promise when layers and topics are loaded', function(done) {
          gaBg.init(map).then(function() {
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('rejects the promise when layers loading fails', function(done) {
          gaBg.init(map).then(function() {
          }, function() {
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.reject();
          $rootScope.$digest();
        });

        it('rejects the promise when topics loading fails', function(done) {
          gaBg.init(map).then(function() {
          }, function() {
            done();
          });
          deferGaTopic.reject();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('initializes the list of background layers', function(done) {
          gaBg.init(map).then(function() {
            // no bg in topic we only add basis and voidLayer
            var bgs = gaBg.getBackgrounds();
            expect(bgs.length).to.equal(nbBgs);
            expect(bgs[0].id).to.equal(firstBgId);
            expect(bgs[0].label).to.equal('basis');
            expect(bgs[1].id).to.equal('voidLayer');
            expect(bgs[1].label).to.equal('void_layer');
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('initializes the default background from topic', function(done) {
          gaBg.init(map).then(function() {
            var bg = gaBg.get();
            expect(bg.id).to.equal(firstBgId);
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('adds a bg layer to the map', function(done) {
          gaBg.init(map).then(function() {
            var bg = gaBg.get();
            expect(bg.id).to.equal(firstBgId);

            var layer = map.getLayers().item(0);
            expect(layer.background).to.be.ok();
            expect(layer.displayInLayerManager).to.not.be.ok();

            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('doesn\'t add a bg layer if the bg selected is voidLayer', function(done) {
          gaTopic.get = function() {
            return topicVoidLayer;
          };
          gaBg.init(map).then(function() {
            var bg = gaBg.get();
            expect(bg.id).to.equal(firstBgId);

            var length = map.getLayers().getLength();
            expect(length).to.be(1);
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('updates permalink', function(done) {
          var upParams = gaPermalinkMock.expects('updateParams').withArgs({bgLayer: firstBgId}).once();
          gaBg.init(map).then(function() {
            upParams.verify();
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('deletes/updates permalink if externalStyleUrl property change', function() {
          gaBg.init(map);
          deferGaTopic.resolve();
          deferGaLayers.resolve();

          var upParams = gaPermalinkMock.expects('deleteParam').
              withArgs('bgLayer_styleUrl').once();
          $rootScope.$digest();
          upParams.verify();

          var upParams2 = gaPermalinkMock.expects('updateParams').
              withArgs({'bgLayer_styleUrl': 'myStyleFoo'}).atLeast(1);
          map.getLayers().getArray()[0].externalStyleUrl = 'myStyleFoo';
          $rootScope.$digest();
          upParams2.verify();

          upParams = gaPermalinkMock.expects('deleteParam').
              withArgs('bgLayer_styleUrl').once();
          map.getLayers().getArray()[0].externalStyleUrl = null;
          $rootScope.$digest();
          upParams.verify();
        });

        it('uses bgLayer_styleUrl permalink on load', function() {
          var p = gaPermalinkMock.expects('getParams').exactly(2).returns({
            bgLayer: firstBgId,
            bgLayer_styleUrl: 'http://myStyleBar'
          });
          gaBg.init(map);
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
          p.verify();
          expect(map.getLayers().getArray()[0].adminId).to.be(undefined);
          expect(map.getLayers().getArray()[0].externalStyleUrl).to.be('http://myStyleBar');
        });

        it('uses glStyleAdminId permalink on load', function() {
          var p = gaPermalinkMock.expects('getParams').exactly(2).returns({
            bgLayer: firstBgId,
            glStylesAdminId: 'myId'
          });
          var p2 = gaPermalinkMock.expects('deleteParam').withArgs('glStylesAdminId');
          var stub = sinon.stub(gaGlStyleStorage, 'getFileUrlFromAdminId').
              withArgs('myId').returns($q.when('http://myStyleBario'));
          gaBg.init(map);
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
          p.verify();
          p2.verify();
          expect(stub.callCount).to.be(1);
          expect(map.getLayers().getArray()[0].adminId).to.be('myId');
          expect(map.getLayers().getArray()[0].externalStyleUrl).to.be('http://myStyleBario');
        });

        it('broadcast gaBgChange event', function(done) {
          var bcast = $rootScopeMock.expects('$broadcast').withArgs('gaBgChange').once();
          gaBg.init(map).then(function() {
            bcast.verify();
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('listens gaTopicChange event', function(done) {
          var onTopicChange = $rootScopeMock.expects('$on').withArgs('gaTopicChange').once();
          gaBg.init(map).then(function() {
            onTopicChange.verify();
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('changes bg on gaTopicChange event', function(done) {
          gaBg.init(map).then(function() {
            var layers = map.getLayers();
            expect(gaBg.get().id).to.equal(firstBgId);
            expect(gaBg.getBackgrounds().length).to.equal(nbBgs);
            expect(layers.getLength()).to.equal(1);

            $rootScope.$broadcast('gaTopicChange', topic2);
            expect(gaBg.get().id).to.equal(firstBgId);
            expect(gaBg.getBackgrounds().length).to.equal(4);
            expect(layers.getLength()).to.equal(1);

            $rootScope.$broadcast('gaTopicChange', topicVoidLayer);
            // default layer is always vt layer
            expect(gaBg.get().id).to.equal(firstBgId);
            expect(gaBg.getBackgrounds().length).to.equal(4);
            expect(layers.getLength()).to.equal(1);
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });
      });

      describe('using a topic with plConfig', function() {

        beforeEach(function() {
          gaTopic.get = function() {
            return topicPlConfig;
          };
        });

        it('uses default bg from plConfig (priority over defaultBackground property)', function(done) {
          gaBg.init(map).then(function() {
            var bg = gaBg.get();
            expect(bg.id).to.equal(firstBgId);
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });

        it('initializes the default background from permalink (priority over plConfig)', function() {
          var getParams = gaPermalinkMock.expects('getParams').twice().returns({bgLayer: 'voidLayer'});
          gaBg.init(map);
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
          getParams.verify();
          var bg = gaBg.get();
          expect(bg.id).to.equal('voidLayer');
        });
      });
    });

    describe('#set()', function() {

      beforeEach(function() {
        gaTopic.get = function() {
          return topic1;
        };
        gaBg.init(map);
        deferGaTopic.resolve();
        deferGaLayers.resolve();
        $rootScope.$digest();
      });

      it('calls setBgById', function() {
        var bg = {id: 'bg1'};
        var stub = sinon.stub(gaBg, 'setById').withArgs(map, 'bg1');
        gaBg.set(map, bg);
        expect(stub.callCount).to.be(1);
      });

      it('does nothing ', function() {
        var bg = {id: 'bg1'};
        var stub = sinon.stub(gaBg, 'setById').withArgs(null, bg);
        gaBg.set(null, bg);
        expect(stub.callCount).to.be(0);
        gaBg.set(map, null);
        expect(stub.callCount).to.be(0);
      });
    });

    describe('#setById()', function() {

      beforeEach(function() {
        gaTopic.get = function() {
          return topic4;
        };
        gaBg.init(map);
        deferGaTopic.resolve();
        deferGaLayers.resolve();
        $rootScope.$digest();
      });

      it('switch bgLayer from vt to wmts then to vt', function() {
        var dfltBg = gaBg.get(); // ch.swisstopo.leichte-basiskarte.vt
        var bg = gaBg.getBackgrounds()[1]; // pixelkartefarbe
        expect(dfltBg.id).to.not.equal(bg.id);
        var bcast = $rootScopeMock.expects('$broadcast').
            withArgs('gaBgChange', bg).once();

        // from vt to wmts
        var id = 'ch.swisstopo.pixelkarte-farbe';
        var stub = sinon.stub(gaPermalink, 'updateParams').withArgs({
          bgLayer: id
        });
        var stub2 = sinon.stub(gaPermalink, 'deleteParam').withArgs(
            'bgLayer_styleUrl');
        gaBg.setById(map, id);
        expect(stub.callCount).to.be(1);
        expect(bg.olLayer).to.be.an(ol.layer.Base);
        expect(bg.olLayer.background).to.be(true);
        expect(bg.olLayer.displayInLayerManager).to.be(false);
        $rootScope.$digest();
        bcast.verify();
        expect(stub2.callCount).to.be(1);
        expect(map.getLayers().getLength()).to.be(1);
        gaPermalink.updateParams.restore();
        gaPermalink.deleteParam.restore();

        // from wmts to vt with externalStyleUrl
        id = 'ch.swisstopo.leichte-basiskarte.vt';
        bg = gaBg.getBackgrounds()[0];
        bg.olLayer.externalStyleUrl = 'foo';
        bcast = $rootScopeMock.expects('$broadcast').
            withArgs('gaBgChange', bg).once();
        stub = sinon.stub(gaPermalink, 'updateParams');
        stub2 = stub.withArgs({ bgLayer: id });
        var stub3 = stub.withArgs({ 'bgLayer_styleUrl': 'foo' });
        gaBg.setById(map, id);
        expect(stub2.callCount).to.be(1);
        expect(bg.olLayer).to.be.an(ol.layer.Base);
        expect(bg.olLayer.background).to.be(true);
        expect(bg.olLayer.displayInLayerManager).to.be(false);
        expect(bg.olLayer.externalStyleUrl).to.be('foo');
        $rootScope.$digest();
        bcast.verify();
        expect(stub3.callCount).to.be(1);
        expect(map.getLayers().getLength()).to.be(1);
        gaPermalink.updateParams.restore();

      });
    });
  });
});
