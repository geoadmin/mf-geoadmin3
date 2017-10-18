/* eslint-disable max-len */
describe('ga_timeselector_controller', function() {

  describe('GaTimeSelectorController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaTimeSelectorController"></div>';
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

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
      loadController();
      $timeout.flush();
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

    it('set scope values', function() {
      expect(scope.options.minYear).to.be(1844);
      expect(scope.options.maxYear).to.be((new Date()).getFullYear());
      expect(scope.options.currentYear).to.be(-1);
      expect(scope.options.years).to.be.an(Array);
      expect(scope.options.years.length).to.be(scope.options.maxYear - scope.options.minYear + 1);
      scope.options.years.forEach(function(y) {
        expect(y.value).to.be.a('number');
        expect(y.available).to.be(false);
        expect(y.minor).to.be.a('boolean');
        expect(y.major).to.be.a('boolean');
      });
    });
  });
});
