/* eslint-disable max-len */
describe('ga_drawstylepopup_controller', function() {

  describe('GaDrawStylePopupController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaDrawStylePopupController"></div>';
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

    describe('using default options', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      it('set scope values', function() {
        var opt = scope.options;
        expect(opt.title).to.be('draw_popup_title_feature');
        expect(opt.isReduced).to.be(undefined);
        expect(opt.x).to.be(undefined);
        expect(opt.y).to.be(undefined);
        expect(scope.toggle).to.be(undefined);
      });

      it('set scope values on gaDrawStyleActive event', function() {
        $rootScope.$broadcast('gaDrawStyleActive', 'feat', 'layer', [1, 1]);
        expect(scope.toggle).to.be(true);
        expect(scope.options.isReduced).to.be(false);
        expect(scope.options.x).to.be(1);
        expect(scope.options.y).to.be(1);
      });
    });
  });
});
