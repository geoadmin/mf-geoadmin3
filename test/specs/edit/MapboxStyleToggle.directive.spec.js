/* eslint-disable max-len */
describe('ga_toggle_directive', function() {

  describe('gaMapboxStyleToggle', function() {

    var elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, scope;

    var loadDirective = function(ngModel, ngChange, gaToggleOn, gaToggleOff) {
      parentScope = $rootScope.$new();
      parentScope.ngModel = ngModel;
      parentScope.ngChange = ngChange;
      parentScope.gaToggleOn = gaToggleOn;
      parentScope.gaToggleOff = gaToggleOff;
      var tpl = '<div ng-model="ngModel" ng-change="ngChange()" ' +
                     'ga-mapbox-style-toggle ga-toggle-on="gaToggleOn" ' +
                     'ga-toggle-off="gaToggleOff"></div>';
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
        expect(scope.ngModel).to.be(false);
        expect(scope.ngChange).to.be.a(Function);
        expect(scope.gaToggleOn).to.be(true);
        expect(scope.gaToggleOff).to.be(false);
        expect(scope.toggle).to.be.a(Function);
        expect(spy.callCount).to.be(0);
      });

      it('displays html elements', function() {
        expect(elt.find('button').length).to.be(1);
      });

      it('calls ngChange function when model changes', function() {
        scope.ngModel = 85;
        $timeout.flush();
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      describe('#toggle', function() {

        it('toggles the ngModel value', function() {
          expect(scope.ngModel).to.be(false);
          scope.toggle();
          expect(scope.ngModel).to.be(true);
          scope.toggle();
          expect(scope.ngModel).to.be(false);
        });
      });
    });

    describe('with a good ngModel and all properties set', function() {
      var ngModel = 'visible', spy = sinon.spy(function() {});

      beforeEach(function() {
        loadDirective(ngModel, spy, 'visible', 'none');
      });

      it('set scope values', function() {
        expect(scope.ngModel).to.be('visible');
        expect(scope.ngChange).to.be.a(Function);
        expect(scope.gaToggleOn).to.be('visible');
        expect(scope.gaToggleOff).to.be('none');
        expect(scope.toggle).to.be.a(Function);
        expect(spy.callCount).to.be(0);
      });

      it('displays html elements', function() {
        expect(elt.find('button').length).to.be(1);
      });

      it('calls ngChange function when model changes', function() {
        scope.ngModel = 'none';
        $timeout.flush();
        $rootScope.$digest();
        expect(spy.callCount).to.be(1);
      });

      describe('#toggle', function() {

        it('toggles the ngModel value', function() {
          expect(scope.ngModel).to.be('visible');
          scope.toggle();
          expect(scope.ngModel).to.be('none');
          scope.toggle();
          expect(scope.ngModel).to.be('visible');
        });
      });
    });
  });
});
