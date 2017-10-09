describe('ga_drawstyle_controller', function() {

  describe('GaDrawStyleController', function() {

    var scope, parentScope, $compile, $rootScope, $translate, $timeout, $httpBackend,
      gaStyleFactory;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaDrawStyleController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      $translate = $injector.get('$translate');
      gaStyleFactory = $injector.get('gaStyleFactory');
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

    describe('using default options', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      it('set scope values', function() {
        var opt = scope.options;
        expect(opt.name).to.be('');
        expect(opt.description).to.be('');
        expect(opt.font).to.be(gaStyleFactory.FONT);
        expect(opt.linkTypes.length).to.be(3);
        expect(opt.colors.length).to.be(8);
        expect(opt.textSizes.length).to.be(3);
        expect(opt.iconSizes.length).to.be(3);
        expect(opt.icons.length).to.be(114);
        expect(opt.linkType).to.be(opt.linkTypes[0]);
        expect(opt.color).to.be(opt.colors[5]);
        expect(opt.textColor).to.be(opt.colors[5]);
        expect(opt.textSize).to.be(opt.textSizes[0]);
        expect(opt.icon).to.be(opt.icons[0]);
        expect(opt.iconColor).to.be(opt.colors[5]);
        expect(opt.iconSize).to.be(opt.iconSizes[2]);
        expect(scope.feature).to.be(undefined);
        expect(scope.layer).to.be(undefined);
      });

      it('set scope values on gaDrawStyleActive event', function() {
        $rootScope.$broadcast('gaDrawStyleActive', 'feat', 'layer', 'pixel');
        expect(scope.feature).to.be('feat');
        expect(scope.layer).to.be('layer');
      });
    });
  });
});
