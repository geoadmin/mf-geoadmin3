/* eslint-disable max-len */
describe('ga_background_service', function() {

  describe('gaBackground', function() {
    var gaBg, gaPermalink, gaTopic, deferGaLayers, deferGaTopic, map, $rootScope,
      gaPermalinkMock, $rootScopeMock, $q, $timeout;

    var nbBgs = 4;
    var firstBgId = 'omt.vt';
    var topic1 = {
      'defaultBackground': 'bg1',
      'backgroundLayers': [
        'bg2',
        'bg1'
      ]
    };
    var topic2 = {
      'defaultBackground': 'bg3',
      'backgroundLayers': [
        'bg1',
        'bg2',
        'bg3'
      ]
    };
    var topicVoidLayer = {
      'defaultBackground': 'voidLayer',
      'backgroundLayers': [
        'bg1',
        'bg2',
        'bg3'
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
            var l = new ol.layer.Layer({});
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
        gaPermalinkMock = sinon.mock(gaPermalink);
        $rootScopeMock = sinon.mock($rootScope);
        $timeout = $injector.get('$timeout');
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
            var bgs = gaBg.getBackgrounds();
            expect(bgs.length).to.equal(nbBgs);
            expect(bgs[0].id).to.equal(firstBgId);
            expect(bgs[0].label).to.equal('OpenMapTiles');
            expect(bgs[1].id).to.equal('ch.swisstopo.wandern.vt');
            expect(bgs[1].label).to.equal('wandern');
            expect(bgs[2].id).to.equal('ch.swisstopo.leichte-basiskarte.vt');
            expect(bgs[2].label).to.equal('basis');
            expect(bgs[3].id).to.equal('ch.swisstopo.hybridkarte.vt');
            expect(bgs[3].label).to.equal('hybrid');
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
          var upParams = gaPermalinkMock.expects('deleteParam').withArgs('bgLayer_styleUrl').once();
          $rootScope.$digest();
          upParams.verify();
          var upParams2 = gaPermalinkMock.expects('updateParams').withArgs({'bgLayer_styleUrl': 'myStyleFoo'}).atLeast(1);
          map.getLayers().getArray()[0].externalStyleUrl = 'myStyleFoo';
          $rootScope.$digest();
          upParams2.verify();
          upParams = gaPermalinkMock.expects('deleteParam').withArgs('bgLayer_styleUrl').once();
          map.getLayers().getArray()[0].externalStyleUrl = null;
          $rootScope.$digest();
          upParams.verify();
        });

        it('uses bgLayer_styleUrl permalink on load', function() {
          var p = gaPermalinkMock.expects('getParams').thrice().returns({
            bgLayer: firstBgId, bgLayer_styleUrl: 'http://myStyleBar'
          });
          gaBg.init(map);
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
          p.verify();
          expect(map.getLayers().getArray()[0].externalStyleUrl).to.be('http://myStyleBar');
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
            expect(gaBg.getBackgrounds().length).to.equal(nbBgs);
            expect(layers.getLength()).to.equal(1);

            $rootScope.$broadcast('gaTopicChange', topicVoidLayer);
            expect(gaBg.get().id).to.equal(firstBgId);
            expect(gaBg.getBackgrounds().length).to.equal(nbBgs);
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

        it('initializes the default background from permalink (priority over plConfig)', function(done) {
          var getParams = gaPermalinkMock.expects('getParams').thrice().returns({bgLayer: 'voidLayer'});
          gaBg.init(map).then(function() {
            getParams.verify();
            var bg = gaBg.get();
            expect(bg.id).to.equal(firstBgId);
            done();
          });
          deferGaTopic.resolve();
          deferGaLayers.resolve();
          $rootScope.$digest();
        });
      });
    });
  });
});
