/* eslint-disable max-len */
describe('ga_mapbox_style_edit_font_size_directive', function() {

  describe('gaSize', function() {

    var elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, scope;

    var loadDirective = function(ngModel, ngChange, min, max, step) {
      parentScope = $rootScope.$new();
      parentScope.ngModel = ngModel;
      parentScope.ngChange = ngChange;
      parentScope.min = min;
      parentScope.max = max;
      parentScope.step = step;
      var tpl = '<div ng-model="ngModel" ng-change="ngChange()" ' +
                     'ga-mapbox-style-edit-font-size ga-size-min="{{min}}" ' +
                     ' ga-size-max="{{max}}" ga-size-step="{{step}}"></div>';
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

    describe('with a null ngModel', function() {
      var ngModel = null, spy = sinon.spy(function() {});

      beforeEach(function() {
        loadDirective(ngModel, spy);
      });

      it('set scope values', function() {
        expect(scope.ngModel).to.be(0);
        expect(scope.ngChange).to.be.a(Function);
        expect(scope.min).to.be(0);
        expect(scope.max).to.be(50);
        expect(scope.step).to.be(5);
        expect(scope.minus).to.be.a(Function);
        expect(scope.plus).to.be.a(Function);
        expect(scope.toGoodValue).to.be.a(Function);
        expect(spy.callCount).to.be(0);
      });

      it('displays html elements', function() {
        expect(elt.find('input').length).to.be(1);
        expect(elt.find('[role="button"]').length).to.be(2);
      });

      it('calls ngChange function when model changes', function() {
        scope.ngModel = 85;
        $timeout.flush();
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      describe('#toGoodValue', function() {

        it('returns an interpretable value', function() {
          expect(scope.toGoodValue('-1')).to.be(0);
          expect(scope.toGoodValue(-100)).to.be(0);
          expect(scope.toGoodValue()).to.be(0);
          expect(scope.toGoodValue(51)).to.be(50);
          expect(scope.toGoodValue(null)).to.be(0);
          expect(scope.toGoodValue(parseFloat('jjkhj'))).to.be(0);
        });
      });

      describe('#minus', function() {

        it('returns the current value minus the step value', function() {
          scope.minus();
          expect(scope.ngModel).to.be(0);
        });
      });

      describe('#plus', function() {

        it('returns the current value plus the step value', function() {
          scope.plus();
          expect(scope.ngModel).to.be(5);
        });
      });
    });

    describe('with a good ngModel and all properties set', function() {
      var ngModel = 12.2, spy = sinon.spy(function() {});

      beforeEach(function() {
        loadDirective(ngModel, spy, 5, 30, 2);
      });

      it('set scope values', function() {
        expect(scope.ngModel).to.be(12.2);
        expect(scope.ngChange).to.be.a(Function);
        expect(scope.min).to.be(5);
        expect(scope.max).to.be(30);
        expect(scope.step).to.be(2);
        expect(scope.minus).to.be.a(Function);
        expect(scope.plus).to.be.a(Function);
        expect(scope.toGoodValue).to.be.a(Function);
        expect(spy.callCount).to.be(0);
      });

      it('displays html elements', function() {
        expect(elt.find('input').length).to.be(1);
        expect(elt.find('[role="button"]').length).to.be(2);
      });

      it('calls ngChange function when model changes', function() {
        scope.ngModel = 85;
        $timeout.flush();
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      describe('#toGoodValue', function() {

        it('returns an interpretable value', function() {
          expect(scope.toGoodValue('-1')).to.be(5);
          expect(scope.toGoodValue(-100)).to.be(5);
          expect(scope.toGoodValue()).to.be(12.2);
          expect(scope.toGoodValue(51)).to.be(30);
          expect(scope.toGoodValue(null)).to.be(12.2);
          expect(scope.toGoodValue(parseFloat('jjkhj'))).to.be(12.2);
        });
      });

      describe('#minus', function() {

        it('set the current value minus the step value', function() {
          scope.minus();
          expect(scope.ngModel).to.be(10.2);
        });
      });

      describe('#plus', function() {

        it('set the current value plus the step value', function() {
          scope.plus();
          expect(scope.ngModel).to.be(14.2);
        });
      });
    });
  });
});
