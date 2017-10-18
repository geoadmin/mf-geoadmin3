/* eslint-disable max-len */
describe('ga_feedback_controller', function() {

  describe('GaFeedbackController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout,
      gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaFeedbackController"></div>';
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
      expect(scope.options.useTemporaryLayer).to.be(true);
      expect(scope.options.broadcastLayer).to.be(true);
      expect(scope.options.noMoreFunctions).to.be(true);
      expect(scope.options.feedbackUrl).to.be(gaGlobalOptions.apiUrl + '/feedback');
    });
  });
});
