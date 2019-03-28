/* eslint-disable max-len */
describe('ga_edit_controller', function() {

  describe('GaEditController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      $translate;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaEditController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {
        getLayer: function() {
          return {}
        }
      });
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $translate = $injector.get('$translate');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
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

        module(function($provide) {
          provideServices($provide);
        });

        inject(function($injector) {
          injectServices($injector);
        });
        loadController();
      });

      it('set scope values', function() {
        var opt = scope.options;
        expect(scope.layer).to.be(undefined);
        expect(opt).to.be.an(Object);
        expect(opt.translate).to.be($translate);
        expect(scope.globals).to.be.an(Object);
      });

      it('set scope values on gaToggleEdit event', function() {
        var layer = new ol.layer.Tile({});
        $rootScope.$broadcast('gaToggleEdit', layer);
        $rootScope.$digest();
        expect(scope.layer).to.be(layer);
        expect(scope.globals.isEditActive).to.be(true);
        expect(scope.globals.pulldownShown).to.be(true);
        $rootScope.$broadcast('gaToggleEdit', layer, true);
        $rootScope.$digest();
        expect(scope.layer).to.be(layer);
        expect(scope.globals.isEditActive).to.be(true);
        expect(scope.globals.pulldownShown).to.be(true);
        $rootScope.$broadcast('gaToggleEdit', layer);
        $rootScope.$digest();
        expect(scope.layer).to.be(layer);
        expect(scope.globals.isEditActive).to.be(false);
        expect(scope.globals.pulldownShown).to.be(false);
        expect(scope.globals.pulldownShown).to.be(false);
      });

      it('set scope values on gaBgChange event', function() {
        var layer = new ol.layer.Tile({});
        expect(scope.layer).to.be(undefined);
        $rootScope.$broadcast('gaBgChange', {olLayer: layer});
        $rootScope.$digest();
        expect(scope.layer).to.be(layer);
        $rootScope.$broadcast('gaBgChange', {});
        $rootScope.$digest();
        expect(scope.layer).to.be(undefined);
        $rootScope.$broadcast('gaBgChange', {olLayer: layer});
        $rootScope.$digest();
        expect(scope.layer).to.be(layer);
        $rootScope.$broadcast('gaBgChange');
        $rootScope.$digest();
        expect(scope.layer).to.be(undefined);
      });
    });
  });
});
