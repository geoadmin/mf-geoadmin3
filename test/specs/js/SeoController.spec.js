/* eslint-disable max-len */
describe('ga_seo_controller', function() {

  describe('GaSeoController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaSeoController"></div>';
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
      expect(opt.htmlUrlTemplate).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup');
      expect(opt.searchUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/ech/SearchServer');
      expect(opt.identifyUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/all/MapServer/identify');
    });
  });
});
