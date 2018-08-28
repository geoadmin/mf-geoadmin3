/* eslint-disable max-len */
describe('ga_controls3d_directive', function() {
  describe('gaControls3d', function() {
    var elt, scope, parentScope, scene, ol3d, $httpBackend, $rootScope, $compile, $timeout, $document;
    // var gaHelp, gaMapUtils;
    var loadDirective = function(ol3d, isFpsActive) {
      parentScope = $rootScope.$new();
      parentScope.ol3d = ol3d;
      parentScope.isFpsActive = isFpsActive;
      var tpl = '<div ga-controls3d ga-controls3d-ol3d="ol3d" ga-controls3d-fps-active="iaFpsActive"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      $timeout.flush();
      scope = elt.isolateScope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $document = $injector.get('$document');
      $httpBackend = $injector.get('$httpBackend');
      // gaMapUtils = $injector.get('gaMapUtils');
      // gaHelp = $injector.get('gaHelp');
    };

    beforeEach(function() {

      inject(function($injector) {
        injectServices($injector);
      });

      scene = {
        camera: {
          heading: -78,
          positionCartographic: Cesium.Cartographic.ZERO,
          flyTo: function() {},
          moveStart: {
            addEventListener: function(f) {
              scene.onMoveStart = f;
            }
          },
          moveEnd: {
            addEventListener: function(f) {
              scene.onMoveEnd = f;
            }
          },
          moveForward: function() {},
          moveBackward: function() {},
          moveLeft: function() {},
          moveRight: function() {}
        },
        terrainProvider: {},
        globe: {
          ellipsoid: Cesium.Ellipsoid.WGS84
        },
        postRender: {
          addEventListener: function(f) {
            scene.onPostRender = f;
          }
        },
        canvas: {
          requestPointerLock: function() {}
        },
        screenSpaceCameraController: {
          minimumZoomDistance: 200
        }
      };

      ol3d = {
        enabled: true,
        getEnabled: function() {
          return this.enabled;
        },
        getCesiumScene: function() {
          return scene;
        }
      };
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

    it('remove the element if ol3d is not set', function() {
      loadDirective();
      expect(elt.parent().length).to.be(0);
    });

    it('creates html elements', function() {
      loadDirective(ol3d);
      expect(elt.find('.ga-tilt').length).to.be(1);
      expect(elt.find('.ga-btn').length).to.be(7);
      expect(elt.find('i').length).to.be(6);
      expect(elt.find('.ga-pegman').length).to.be(1);
      expect(elt.find('.ga-pegman-help').length).to.be(1);
      expect(elt.find('[ga-help=28]').length).to.be(1);
    });

    it('has good scope values', function() {
      loadDirective(ol3d);
      expect(scope.ol3d).to.be(ol3d);
      expect(scope.fps).to.be.an(Object);
      expect(scope.tiltUpDisabled).to.be(undefined);
      expect(scope.tiltDownDisabled).to.be(undefined);
      expect(scope.onKey).to.be.a(Function);
      expect(scope.resetTilt).to.be.a(Function);
      expect(scope.resetRotation).to.be.a(Function);
      expect(scope.rotate).to.be.a(Function);
      expect(scope.tilt).to.be.a(Function);
    });

    it('moves indicators on scene/camera events', function() {
      var spy = sinon.spy(scene.camera.moveStart, 'addEventListener');
      var spy2 = sinon.spy(scene.camera.moveEnd, 'addEventListener');
      var spy3 = sinon.spy(scene.postRender, 'addEventListener');
      loadDirective(ol3d);
      expect(spy.callCount).to.be(1);
      expect(spy2.callCount).to.be(1);
      expect(spy3.callCount).to.be(1);

      var tilt = elt.find('.ga-tilt .ga-indicator');
      var rota = elt.find('.ga-rotate .ga-indicator');

      // Globe is not moving
      var spy4 = sinon.stub(olcs.core, 'computeSignedTiltAngleOnGlobe').withArgs(scene);
      scene.onPostRender();
      expect(spy4.callCount).to.be(0);
      expect(tilt.css('transform')).to.be('');
      expect(rota.css('transform')).to.be('');
      expect(scope.tiltUpDisabled).to.be();
      expect(scope.tiltDownDisabled).to.be();

      // Globe is moving
      spy4.returns(undefined);
      scene.camera.pitch = 0;
      scene.onMoveStart();
      scene.onPostRender();
      expect(spy4.callCount).to.be(1);
      spy4.resetHistory();
      expect(tilt.css('transform')).to.be('');
      expect(rota.css('transform')).to.be('rotate(78rad)');
      expect(scope.tiltUpDisabled).to.be(true);
      expect(scope.tiltDownDisabled).to.be(false);

      // Globe is moving
      spy4.returns(-0.065230581126686);
      scene.camera.pitch = -1.5058562520094378;
      scene.onMoveStart();
      scene.onPostRender();
      expect(spy4.callCount).to.be(1);
      spy4.resetHistory();
      expect(tilt.css('transform')).to.be('rotate(-1.5055657456682106rad)');
      expect(rota.css('transform')).to.be('rotate(78rad)');
      expect(scope.tiltUpDisabled).to.be(false);
      expect(scope.tiltDownDisabled).to.be(true);

      // Globe is not moving
      scene.onMoveEnd();
      scene.onPostRender();
      expect(spy4.callCount).to.be(0);
      expect(tilt.css('transform')).to.be('rotate(-1.5055657456682106rad)');
      expect(rota.css('transform')).to.be('rotate(78rad)');
      expect(scope.tiltUpDisabled).to.be(false);
      expect(scope.tiltDownDisabled).to.be(true);
    });

    it('listens on +/- keydown events when fps is not active', function() {
      var spy = sinon.spy($document, 'on').withArgs('keydown');
      loadDirective(ol3d);
      expect(spy.args[0][1]).to.be.a(Function);

      var spy2 = sinon.spy(scene.camera, 'moveForward').withArgs(400);
      var spy3 = sinon.spy(scene.camera, 'moveBackward').withArgs(400);
      $document.trigger($.Event('keydown', {keyCode: 107}));
      expect(spy2.callCount).to.be(1);
      expect(spy3.callCount).to.be(0);

      $document.trigger($.Event('keydown', {keyCode: 109}));
      expect(spy2.callCount).to.be(1);
      expect(spy3.callCount).to.be(1);
    });

    /* it('listens on left arrow keydown event', function() {
      loadDirective(ol3d);
      var spy = sinon.stub(scope, 'rotate').callsFake(function() {});
      $document.trigger($.Event('keydown', {keyCode: 37}));
      expect(spy.callCount).to.be(1);
    });

    it('listens on right arrow keydown event', function() {
      loadDirective(ol3d);
      var spy = sinon.stub(scope, 'rotate', function() {}).withArgs(5);
      // $document.trigger($.Event('keydown', {keyCode: 39}));
      expect(spy.callCount).to.be(1);
    });

    describe('when fps is active', function() {

      beforeEach(function() {
        loadDirective(ol3d);
        scope.fps.setActive(true);
        $rootScope.$digest();
      });

      it('listens on H keydown event', function() {
        var spy = sinon.stub(gaHelp, 'open').withArgs(28);
        $document.trigger($.Event('keydown', {keyCode: 72}));
        expect(spy.callCount).to.be(1);
      });
    }); */
  });
});
