/* eslint-disable max-len */
describe('ga_mapbox_style_edit_properties_directive', function() {

  describe('gaMapboxStyleEdit', function() {

    var map, elt, parentScope, $timeout, $httpBackend, $rootScope,
      $compile, scope;
    var goodConfig = [{
      id: 'foo',
      props: [
        ['paint', 'fill-color', '{color}'],
        ['paint', 'fill-color', '{size}'],
        ['layout', 'visibility', '{toggle}', 'visible', 'none']
      ]
    }];
    var goodGlStyle = {layers: [{id: 'foo'}]};

    var loadDirective = function(glStyle, config) {
      parentScope = $rootScope.$new();
      parentScope.glStyle = glStyle;
      parentScope.config = config;
      var tpl = '<div ga-mapbox-style-edit-properties="glStyle" ' +
        'ga-mapbox-style-edit-properties-config="config"></div>';
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
        expect(scope.useWidget).to.be.a(Function);
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

        glStyle = goodGlStyle;
        parentScope.glStyle = glStyle;
        parentScope.config = goodConfig;
        $rootScope.$digest();
        expect(elt.find('[ga-color]').length).to.be(1);
        expect(elt.find('[ga-size]').length).to.be(1);
        expect(elt.find('[ga-toggle]').length).to.be(1);
        expect(elt.find('label').length).to.be(4);
        expect(scope.groups.foo[0]).to.be(glStyle.layers[0]);
        expect(scope.groups.foo.length).to.be(1);
        expect(scope.group[0]).to.be(glStyle.layers[0]);
        expect(scope.group.length).to.be(1);
      });
    });

    describe('with a glStyle and a good config', function() {
      beforeEach(function() {
        loadDirective(goodGlStyle, goodConfig);
      });

      it('set scope values', function() {
        expect(scope.useWidget).to.be.a(Function);
        expect(scope.save).to.be.a(Function);
        expect(scope.getTranslateId).to.be.a(Function);
        expect(scope.group[0]).to.be(goodGlStyle.layers[0]);
        expect(scope.group.length).to.be(1);
      });

      it('display html elements', function() {
        expect(elt.find('[ga-color]').length).to.be(1);
        expect(elt.find('[ga-size]').length).to.be(1);
        expect(elt.find('[ga-toggle]').length).to.be(1);
        expect(elt.find('label').length).to.be(4);
      });

      describe('#save()', function() {
        it('triggers a gaGlStyleChanged event', function() {
          var stub = sinon.stub($rootScope, '$broadcast').withArgs('gaGlStyleChanged', goodGlStyle);
          scope.save();
          expect(stub.callCount).to.be(1);
        });
      });

      describe('#useWidget()', function() {
        it('tests if we need to use the color widget', function() {
          expect(scope.useWidget('color', goodConfig[0].props[0])).to.be(true);
          expect(scope.useWidget('size', goodConfig[0].props[0])).to.be(false);
          expect(scope.useWidget('chuba', goodConfig[0].props[0])).to.be(false);
        });

        it('tests if we need to use the size widget', function() {
          expect(scope.useWidget('size', goodConfig[0].props[1])).to.be(true);
          expect(scope.useWidget('color', goodConfig[0].props[1])).to.be(false);
          expect(scope.useWidget('chuba', goodConfig[0].props[1])).to.be(false);
        });
      });

      describe('#getTranslateId()', function() {
        it('get an id', function() {
          expect(scope.getTranslateId(goodConfig[0].props[0])).to.be('edit_fill_color');
        });
      });
    });
  });
});
