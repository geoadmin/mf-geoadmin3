describe('ga_profilepopup_controller', function() {7;

  describe('GaProfilePopupController', function() {

    var scope, parentScope, $compile, $rootScope, $timeout, $httpBackend;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaProfilePopupController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
    };

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on modern browser', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      afterEach(function() {
        $timeout.flush();
      });

      it('set scope values', function() {
        expect(scope.options.title).to.be('draw_popup_title_measure');
        expect(scope.options.position).to.be('fixed');
      });

      it('set scope values on gaProfileActive event', function() {
        var feat = {};
        var layer = {};
        var spy = sinon.spy(function() {});
        expect(scope.toggle).to.be(undefined);
        expect(scope.options.isReduced).to.be(undefined);

        $rootScope.$broadcast('gaProfileActive', feat, layer, spy);
        expect(scope.toggle).to.be(true);
        expect(scope.options.isReduced).to.be(false);
        expect(spy.callCount).to.be(0);
        $rootScope.$digest();

        // Calls callback when popup is closing
        scope.toggle = false;
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
        expect(spy.getCall(0).args[0]).to.be(feat);
      });
    });
  });
});

