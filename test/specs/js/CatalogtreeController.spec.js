describe('ga_catalogtree_controller', function() {

  describe('GaCatalogtreeController', function() {

    var scope, parentScope, $compile, $rootScope, gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaCatalogtreeController"></div>';
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
      expect(scope.options.catalogUrlTemplate).to.be('http://api3.geo.admin.ch/123456/rest/services/{Topic}/CatalogServer');
    });
  });
});

