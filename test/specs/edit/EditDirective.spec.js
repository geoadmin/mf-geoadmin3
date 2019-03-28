/* eslint-disable max-len */
describe('ga_edit_directive', function() {

  describe('gaEdit', function() {
    var map, elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, gaDebounce, gaExportGlStyle, gaGlStyleStorage, gaStorage, gaLayers,
      $window, scope, $q, gaMapUtils;

    var loadDirective = function(map, layer, active) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.layer = layer;
      parentScope.active = active;
      var tpl = '<div ga-edit ga-edit-map="map" ga-edit-options="options" ' +
                    'ga-edit-layer="layer" ga-edit-is-active="active"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {
      $provide.value('gaLayers', {
        getLayer: function() {},
        getLayerProperty: function(id, prop) {
          if (prop === 'styles') {
            return [{id: 'foo', url: 'foo.ch'}, {id: 'bar', url: 'bar.ch'}];
          }
        }
      });
      $provide.value('gaBackground', {
        get: function() {
          return {
            label: 'label'
          }
        }
      });
      /* $provide.value('gaPermalink', {
        getHref: function() {
          return 'http://permalink.com';
        },
        getParams: function() {
          return {
            'param1': 'value1'
          };
        }
      });
      $provide.value('gaBrowserSniffer', {});
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {}); */
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      $window = $injector.get('$window');
      gaDebounce = $injector.get('gaDebounce');
      gaGlStyleStorage = $injector.get('gaGlStyleStorage');
      gaExportGlStyle = $injector.get('gaExportGlStyle');
      gaStorage = $injector.get('gaStorage');
      gaLayers = $injector.get('gaLayers');
      gaMapUtils = $injector.get('gaMapUtils');
    };

    beforeEach(function() {
      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        injectServices($injector);
      });

      map = new ol.Map({});
      map.setSize([600, 300]);
      map.getView().fit([-20000000, -20000000, 20000000, 20000000]);
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

    describe('when only a map property is specified', function() {

      it('set scope values', function() {
        var fc = function() {};
        var stub = sinon.stub(gaDebounce, 'debounce').returns(fc);
        loadDirective(map);
        expect(scope.statusMsgId).to.be(undefined);
        expect(scope.canExport).to.be.a(Function);
        expect(scope.export).to.be.a(Function);
        expect(scope.reset).to.be.a(Function);
        expect(scope.canShare).to.be.a(Function);
        expect(scope.share).to.be.a(Function);
        expect(scope.map).to.be(map);
        expect(scope.layer).to.be(undefined);
        expect(scope.isActive).to.be(undefined);
        expect(scope.options).to.be(undefined);
        expect(scope.saveDebounced).to.be(fc);
        expect(stub.callCount).to.be(1);
        expect(stub.args[0][0]).to.be.a(Function);
        expect(stub.args[0][1]).to.be(2000);
        expect(stub.args[0][2]).to.be(false);
        expect(stub.args[0][3]).to.be(false);
      });

      it('display html elements', function() {
        loadDirective(map);
        expect(elt.find('[ng-if="!layer.glStyle"]').length).to.be(1);
        expect(elt.find('.ga-more').length).to.be(1);
        expect(elt.find('.ga-edit-info-save').length).to.be(1);
        expect(elt.find('.ga-edit-disclaimer').length).to.be(1);
        expect(elt.find('[disabled]').length).to.be(3);
      });

      it('watches scope.isActive property and set the default layer', function() {
        loadDirective(map);
        expect(scope.layer).to.be(undefined);
        parentScope.isActive = true;
        $rootScope.$digest();
        expect(scope.layer).to.be(map.getLayers().item(0));
      });

      /* TODO
      it('listens $destroy event', function() {
        loadDirective(map);
        parentScope.$destroy();
      });
      */
    });

    describe('when a layer without style is specified', function() {
      var sublayer, layer;

      beforeEach(function() {
        sublayer = new ol.layer.Tile({});
        sublayer.id = 'subfoo';
        sublayer.sourceId = 'fooSource';
        layer = new ol.layer.Group({
          layers: [
            sublayer
          ]
        });
        layer.id = 'foo';
      });

      it('set scope values', function() {
        loadDirective(map, layer);
        expect(scope.map).to.be(map);
        expect(scope.layer).to.be(layer);
        expect(elt.find('[ng-if="!layer.glStyle"]').length).to.be(1);
      });
    });

    describe('when a layer with a style is specified', function() {
      var sublayer, layer;
      var glStyle = {data: 'value'};
      var dataStr = '{data: "value"}';

      beforeEach(function() {
        sublayer = new ol.layer.Tile({});
        sublayer.id = 'subfoo';
        sublayer.sourceId = 'fooSource';
        layer = new ol.layer.Group({
          layers: [
            sublayer
          ]
        });
        layer.id = 'foo';
        layer.glStyle = glStyle;
      });

      it('set scope values', function() {
        loadDirective(map, layer);
        expect(scope.map).to.be(map);
        expect(scope.layer).to.be(layer);
        expect(elt.find('[ng-if="!layer.glStyle"]').length).to.be(0);
      });

      describe('#isExternalStyleUrlValid', function() {

        it('returns true', function() {
          loadDirective(map, layer);
          expect(scope.isExternalStyleUrlValid()).to.be(true);
          expect(scope.isExternalStyleUrlValid(null)).to.be(true);
          expect(scope.isExternalStyleUrlValid({})).to.be(true);
          expect(scope.isExternalStyleUrlValid({ externalStyleUrl: 'foo.ch' })).to.be(true);
          expect(scope.isExternalStyleUrlValid({ externalStyleUrl: 'http://public.dev.bgdi.ch/foo' })).to.be(true);
          expect(scope.isExternalStyleUrlValid({ externalStyleUrl: 'http://public.int.bgdi.ch/foo' })).to.be(true);
          expect(scope.isExternalStyleUrlValid({ externalStyleUrl: 'http://public.prod.bgdi.ch/foo' })).to.be(true);
          expect(scope.isExternalStyleUrlValid({ externalStyleUrl: 'https://public.geo.admin.ch/foo' })).to.be(true);
        });

        it('returns false', function() {
          loadDirective(map, layer);
          expect(scope.isExternalStyleUrlValid({
            externalStyleUrl: 'https://raw.githubusercontent.com/openmaptiles/fiord-color-gl-style/master/style.json'
          })).to.be(false);
          expect(scope.isExternalStyleUrlValid({
            externalStyleUrl: 'bar'
          })).to.be(false);
        });
      });

      describe('#saveDebounced', function() {

        it('does nothing if an glStylesAdminId or an externalStyleUrl are specifed', function() {
          loadDirective(map, layer);
          var stub = sinon.stub(gaExportGlStyle, 'create').returns($q.when());
          scope.saveDebounced(null, layer);
          expect(stub.callCount).to.be(0);
        });

        it('saves a file in the file storage from the adminId', function() {
          loadDirective(map, layer);
          layer.adminId = 'foo';
          var glStyle = { data: 'value' };

          var stub = sinon.stub(gaExportGlStyle, 'create').withArgs(glStyle).
              returns($q.when(dataStr));
          var stub2 = sinon.stub(gaGlStyleStorage, 'save').withArgs(layer.adminId, dataStr).
              returns($q.when({
                adminId: 'bar',
                fileUrl: 'groot'
              }));
          scope.saveDebounced(null, layer, glStyle);
          $timeout.flush(2000);
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.statusMsgId).to.be('edit_file_saved');
          expect(layer.adminId).to.be('bar');
          expect(layer.externalStyleUrl).to.be('groot');
        });

        it('saves a file in the file storage from a  glStyle', function() {
          loadDirective(map, layer);
          layer.externalStyleUrl = undefined;
          var stub = sinon.stub(gaExportGlStyle, 'create').withArgs(glStyle).
              returns($q.when(dataStr));
          var stub2 = sinon.stub(gaGlStyleStorage, 'save').withArgs(undefined, dataStr).
              returns($q.when({
                adminId: 'bar',
                fileUrl: 'groot'
              }));
          scope.saveDebounced(null, layer, glStyle);
          $timeout.flush(2000);
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.statusMsgId).to.be('edit_file_saved');
          expect(layer.adminId).to.be('bar');
          expect(layer.externalStyleUrl).to.be('groot');
        });
      });

      describe('#canExport', function() {

        it('returns true', function() {
          loadDirective(map, layer);
          layer.glStyle = 'foo';
          expect(scope.canExport(layer)).to.be(true);
        });

        it('returns false', function() {
          loadDirective(map, layer);
          expect(scope.canExport()).to.be(false);
          layer.glStyle = undefined;
          expect(scope.canExport(layer)).to.be(false);
        });
      });

      describe('#export', function() {
        var spy, stub, evt = {
          currentTarget: {
            attributes: {
              disabled: false
            }
          },
          preventDefault: angular.noop
        };

        beforeEach(function() {
          loadDirective(map, layer);
          layer.glStyle = glStyle;
          spy = sinon.stub(evt, 'preventDefault');
          stub = sinon.stub(gaExportGlStyle, 'createAndDownload').
              withArgs(glStyle);
        });

        afterEach(function() {
          evt.preventDefault.restore();
          gaExportGlStyle.createAndDownload.restore();
        });

        it('exports', function() {
          scope.export(evt, layer)
          expect(spy.callCount).to.be(1);
          expect(stub.callCount).to.be(1);
        });

        it('doesn\'t export', function() {
          evt.currentTarget.attributes.disabled = true;
          scope.export(evt, layer);
          expect(spy.callCount).to.be(0);
          expect(stub.callCount).to.be(0);
        });
      });

      describe('#reset', function() {
        var spy, evt = {
          currentTarget: {
            attributes: {
              disabled: false
            }
          },
          preventDefault: angular.noop
        };

        beforeEach(function() {
          loadDirective(map, layer);
          spy = sinon.stub($window, 'confirm').withArgs('edit_confirm_reset_style').returns(true);
        });

        afterEach(function() {
          $window.confirm.restore();
        });

        it('resets the style of the layer with the config.styles[0].url value', function() {
          layer.id = 'foo';
          layer.externalStyleUrl = 'fooExt';
          var glStyle = { sprite: 'value' };

          sinon.stub(gaLayers, 'getLayerProperty').
              withArgs('foo', 'styles').returns([
                {id: 'bar', url: '//bar'}
              ]).
              withArgs('subfoo', 'styles').returns([
                {id: 'bar', url: '//bar'}
              ]);
          sinon.stub(gaStorage, 'load').withArgs('http://bar').returns($q.when(glStyle));

          var stub3 = sinon.stub(gaMapUtils, 'applyGlStyleToOlLayer').withArgs(layer, glStyle).returns();
          scope.reset(evt, layer);
          expect(sublayer.externalStyleUrl).to.be(layer.externalStyleUrl);
          $rootScope.$digest();
          $rootScope.$digest();
          expect(stub3.callCount).to.be(1);

          gaStorage.load.restore();
          gaMapUtils.applyGlStyleToOlLayer.restore();
        });

        it('doesn\'t reset the style', function() {
          evt.currentTarget.attributes.disabled = true;
          scope.export(evt, layer);
          expect(spy.callCount).to.be(0);
        });
      });

      describe('#canShare', function() {

        it('returns true', function() {
          loadDirective(map, layer);
          layer.adminId = 'foo';
          expect(scope.canShare(layer)).to.be(true);
        });

        it('returns false', function() {
          loadDirective(map, layer);
          expect(scope.canExport()).to.be(false);
          expect(scope.canShare(layer)).to.be(false);
        });
      });

      describe('#share', function() {
        var stub, evt = {
          currentTarget: {
            attributes: {
              disabled: false
            }
          }
        };

        beforeEach(function() {
          loadDirective(map, layer);
          stub = sinon.stub($rootScope, '$broadcast').
              withArgs('gaShareDrawActive', layer);
        });

        afterEach(function() {
          $rootScope.$broadcast.restore();
        });

        it('broadcasts share event', function() {
          scope.share(evt, layer)
          expect(stub.callCount).to.be(1);
        });

        it('doesn\'t open share', function() {
          evt.currentTarget.attributes.disabled = true;
          scope.share(evt, layer);
          expect(stub.callCount).to.be(0);
        });
      });
    });
  });
});
