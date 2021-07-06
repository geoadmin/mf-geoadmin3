/* eslint-disable max-len */
describe('ga_search_controller', function() {

  describe('GaSearchController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      gaGlobalOptions;

    var loadController = function(map) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
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
      loadController();
      $timeout.flush();

      var opt = scope.options;
      expect(opt.searchUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/SearchServer?');
      expect(opt.featureUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}?');
    });

    it('set scope values if map is defined', function() {
      loadController(new ol.Map({}));
      $timeout.flush();

      var opt = scope.options;
      expect(opt.searchUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/SearchServer?sr=3857&');
      expect(opt.featureUrl).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}?sr=3857&');
    });
  });
});
