/* eslint-disable max-len */
describe('ga_search_controller', function() {

  describe('GaSearchController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaSearchController"></div>';
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
      var opt = scope.options;
      expect(opt.searchUrl).to.be(gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/SearchServer?');
      expect(opt.featureUrl).to.be(gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}');
    });
  });
});
