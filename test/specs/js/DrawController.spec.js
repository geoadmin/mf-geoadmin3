describe('ga_draw_controller', function() {

  describe('GaDrawController', function() {

    var scope, parentScope, $compile, $rootScope, $timeout, $httpBackend, $translate,
        gaGlobalOptions, gaStyleFactory;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaDrawController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $translate = $injector.get('$translate');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
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
        expect(opt.broadcastLayer).to.be(false);
        expect(opt.useTemporaryLayer).to.be(false);
        expect(opt.translate).to.be($translate);
        expect(opt.color.name).to.be('red');
        expect(opt.textColor.name).to.be('red');
        expect(opt.textSize.label).to.be('small_size');
        expect(opt.icon.id).to.be('marker');
        expect(opt.iconColor.name).to.be('red');
        expect(opt.iconSize.label).to.be('big_size');
        expect(opt.font).to.be(gaStyleFactory.FONT);
        expect(opt.tools.length).to.be(4);
        opt.tools.forEach(function(tool) {
          expect(tool.id).to.be.a('string');
          expect(tool.cssClass).to.be.a('string');
          expect(tool.drawOptions).to.be.an(Object);
          expect(tool.drawOptions.type).to.be.a('string');
          expect(tool.drawOptions.style).to.be.a(Function);
          expect(tool.style).to.be.a(Function);
          expect(tool.activeKey).to.be.a('string');
          expect(tool.title).to.be.a('string');
        });
        expect(opt.selectStyleFunction).to.be.a(Function);
      });

      it('set scope values on gaPopupFocusChange event', function() {
        expect(scope.options.hasPopupFocus).to.be(undefined);
        $rootScope.$broadcast('gaPopupFocusChange', true);
        expect(scope.options.hasPopupFocus).to.be(true);
      });
    });
  });
});

