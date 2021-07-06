/* eslint-disable max-len */
describe('ga_tooltip_controller', function() {

  describe('GaTooltipController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend, gaGlobalOptions, gaWindow;

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
      gaWindow = $injector.get('gaWindow');
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

    describe('on normal device', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      it('set scope values', function() {
        expect(scope.options.tolerance).to.be(10);
        expect(scope.options.htmlUrlTemplate).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup');
      });
    });

    describe('on small device', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        sinon.stub(gaWindow, 'isWidth').withArgs('<=s').returns(true);
        loadController();
      });

      it('set scope values', function() {
        expect(scope.options.tolerance).to.be(20);
        expect(scope.options.htmlUrlTemplate).to.be(gaGlobalOptions.apiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup');
      });
    });
  });
});
