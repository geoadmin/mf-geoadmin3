describe('ga_tooltip_controller', function() {7;

  describe('GaTooltipController', function() {

    var scope, parentScope, $compile, $rootScope, $timeout, $httpBackend, gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaTooltipController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
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

    describe('on non-touch device', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      it('set scope values', function() {
        expect(scope.options.tolerance).to.be(15);
        expect(scope.options.htmlUrlTemplate).to.be(gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup');
      });
    });
  });
});

