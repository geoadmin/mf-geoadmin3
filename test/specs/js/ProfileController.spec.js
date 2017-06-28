describe('ga_profile_controller', function() {7;

  describe('GaProfileController', function() {

    var scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
        gaBrowserSniffer, gaGlobalOptions, gaPrint;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaProfileController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      gaPrint = $injector.get('gaPrint');
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
        expect(scope.options.xLabel).to.be('profile_x_label');
        expect(scope.options.yLabel).to.be('profile_y_label');
        expect(scope.options.margin.top).to.be(6);
        expect(scope.options.margin.right).to.be(20);
        expect(scope.options.margin.bottom).to.be(30);
        expect(scope.options.margin.left).to.be(60);
        expect(scope.options.elevationModel).to.be(gaGlobalOptions.defaultElevationModel);
        expect(scope.print).to.be.a(Function);
      });

      it('set scope values on gaProfileActive event', function() {
        var feat = {};
        var layer = {};
        expect(scope.feature).to.be(undefined);
        expect(scope.layer).to.be(undefined);
        $rootScope.$broadcast('gaProfileActive', feat, layer);
        expect(scope.feature).to.be(feat);
        expect(scope.layer).to.be(layer);
      });
    });
  });
});

