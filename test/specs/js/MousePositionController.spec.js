describe('ga_mouseposition_controller', function() {

  describe('GaMousePositionController', function() {

    var scope, parentScope, $compile, $rootScope, $window, $q, $document, $timeout, $httpBackend,
        $translate, gaMeasure;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaMousePositionController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $document = $injector.get('$document');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      $translate = $injector.get('$translate');
      gaMeasure = $injector.get('gaMeasure');
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
      expect(scope.mousePositionProjections.length).to.be(5);
      scope.mousePositionProjections.forEach(function(mp) {
        expect(mp.value).to.be.a('string');
        expect(mp.label).to.be.a('string');
        expect(mp.format).to.be.a(Function);
        expect(mp.format([0, 1])).to.be.a('string');
        expect(mp.format([6, 1])).to.be.a('string');
        expect(mp.format([14, 1])).to.be.a('string');
      });
      expect(scope.options.projection).to.be(scope.mousePositionProjections[0]);
    });
  });
});
