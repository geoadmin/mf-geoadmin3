/* eslint-disable max-len */
describe('ga_editglstyle_directive', function() {

  describe('gaEditGlStyle', function() {

    var map, elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, scope;
    var goodConfig = {
      selectableLayers: ['foo'],
      'foo': [
        ['paint', 'fill-color', '{color}']
      ]
    };
    var goodGlStyle = {layers: [{id: 'foo'}]};

    var loadDirective = function(glStyle, config) {
      parentScope = $rootScope.$new();
      parentScope.glStyle = glStyle;
      parentScope.config = config;
      var tpl = '<div ga-edit-gl-style="glStyle" ga-edit-gl-style-config="config"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {};

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
    };

    beforeEach(function() {
      module(function($provide) {
        provideServices($provide);
      });

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

    describe('when no properties is specified', function() {

      it('set scope values', function() {
        loadDirective();
        expect(scope.useColorSelector).to.be.a(Function);
        expect(scope.save).to.be.a(Function);
        expect(scope.getTranslateId).to.be.a(Function);
        expect(scope.selectableLayers).to.be(undefined);
        expect(scope.selectedLayer).to.be(undefined);
      });

      it('display html elements', function() {
        loadDirective(map);
        expect(elt.find('option').length).to.be(1);
        expect(elt.find('label').length).to.be(1);
      });

      it('watches scope.glStyle property and set the default layer', function() {
        loadDirective();
        var glStyle = {};
        expect(scope.glStyle).to.be(undefined);
        parentScope.glStyle = glStyle;
        $rootScope.$digest();
        expect(scope.glStyle).to.be(glStyle);
        expect(elt.find('label').length).to.be(1);
        expect(scope.selectableLayers).to.be(undefined);

        glStyle = goodGlStyle;
        parentScope.glStyle = glStyle;
        parentScope.config = goodConfig;
        $rootScope.$digest();
        expect(elt.find('[ga-color]').length).to.be(1);
        expect(elt.find('label').length).to.be(2);
        expect(scope.selectableLayers[0]).to.be(glStyle.layers[0]);
        expect(scope.selectableLayers.length).to.be(1);
        expect(scope.selectedLayer).to.be(glStyle.layers[0]);
      });
    });

    describe('with a glStyle and a good config', function() {
      beforeEach(function() {
        loadDirective(goodGlStyle, goodConfig);
      });

      it('set scope values', function() {
        expect(scope.useColorSelector).to.be.a(Function);
        expect(scope.save).to.be.a(Function);
        expect(scope.getTranslateId).to.be.a(Function);
        expect(scope.selectableLayers[0]).to.be(goodGlStyle.layers[0]);
        expect(scope.selectableLayers.length).to.be(1);
        expect(scope.selectedLayer).to.be(goodGlStyle.layers[0]);
      });

      it('display html elements', function() {
        expect(elt.find('[ga-color]').length).to.be(1);
        expect(elt.find('label').length).to.be(2);
      });

      describe('#save()', function() {
        it('triggers a gaGlStyleChanged event', function() {
          var stub = sinon.stub($rootScope, '$broadcast').withArgs('gaGlStyleChanged', goodGlStyle);
          scope.save();
          expect(stub.callCount).to.be(1);
        });
      });

      describe('#useColorSelector()', function() {
        it('tests if we need to use the color widget', function() {
          expect(scope.useColorSelector(goodConfig.foo[0])).to.be(true);
        });
      });

      describe('#getTranslateId()', function() {
        it('get an id', function() {
          expect(scope.getTranslateId(goodConfig.foo[0])).to.be('edit_fill_color');
        });
      });
    });
  });
});
