/* eslint-disable max-len */
describe('ga_mapbox_style_color_picker_directive', function() {

  describe('gaMapboxStyleColorPicker', function() {

    var elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, scope;

    var loadDirective = function(ngModel, ngChange) {
      parentScope = $rootScope.$new();
      parentScope.ngModel = ngModel;
      parentScope.ngChange = ngChange;
      var tpl = '<div ng-model="ngModel" ng-change="ngChange()" ' +
        'ga-mapbox-style-color-picker></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {};

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
    };

    beforeEach(function() {
      module(function($provide) {
        provideServices($provide);
      });

      inject(function($injector) {
        injectServices($injector);
      });
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

    describe('with a ngModel', function() {
      var ngModel = null, spy = sinon.spy(function() {});

      beforeEach(function() {
        loadDirective(ngModel, spy);
      });

      it('set scope values', function() {
        expect(scope.ngModel).to.be(ngModel);
        expect(scope.ngChange).to.be.a(Function);
        expect(scope.colors.length).to.be(12);
        expect(scope.useInputColorSelector).to.be(true);
        expect(scope.toHexString).to.be.a(Function);
        expect(spy.callCount).to.be(0);
      });

      it('displays html elements', function() {
        expect(elt.find('input').length).to.be(1);
      });

      it('calls ngChange function when model changes', function() {
        scope.ngModel = 'lala';
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      describe('#toHexString', function() {

        it('returns hex string', function() {
          expect(scope.toHexString('hsl(40%,20%, 10%)')).to.be('#141f18');
        });
      });
    });
  });
});
