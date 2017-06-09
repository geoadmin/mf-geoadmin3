describe('ga_contextpopup_controller', function() {

  describe('GaContextPopupController', function() {

    var scope, parentScope, $compile, $rootScope, gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaContextPopupController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
    };

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
      loadController();
    });

    it('set scope values', function() {
      expect(scope.options.heightUrl).to.be('http://api3.geo.admin.ch/rest/services/height');
      expect(scope.options.qrcodeUrl).to.be('http://api3.geo.admin.ch/qrcodegenerator');
    });
  });
});

