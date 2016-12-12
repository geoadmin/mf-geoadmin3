describe('ga_shoprectangle_directive', function() {
  var elt, scope, parentScope, $compile, $rootScope, $timeout, gaDebounce,
      gaMapUtils, gaShop, $q;

  var loadDirective = function(active) {
    parentScope = $rootScope.$new();
    parentScope.isRectActive = active;
    parentScope.updatePrice = function() {};
    parentScope.map = new ol.Map({interactions: []});
    var tpl = '<div ga-shop-rectangle ' +
        'ga-shop-rectangle-map="map" ' +
        'ga-shop-rectangle-active="isRectActive" ' +
        'ga-shop-rectangle-update-price="updatePrice"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {});
    });

    inject(function($injector) {
      $compile = $injector.get('$compile');
      $timeout = $injector.get('$timeout');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $q = $injector.get('$q');
      gaDebounce = $injector.get('gaDebounce');
      gaMapUtils = $injector.get('gaMapUtils');
      gaShop = $injector.get('gaShop');
    });
  });

  afterEach(function() {
  });

  it('verifies html elements', function() {
    loadDirective();
    expect(elt.find('input[type=text][ng-change]').length).to.be(4);
    expect(elt.find('button[ng-click]').length).to.be(1);
    expect(elt.find('.ga-shop-rect-labels').length).to.be(1);
  });

  it('set scope values', function() {
    loadDirective();
    expect(scope.map).to.be(parentScope.map);
    expect(scope.isActive).to.be(parentScope.isActive);
    expect(scope.updatePrice).to.be(parentScope.updatePrice);
    expect(scope.dragBox).to.be.an(ol.interaction.DragBox);
    expect(scope.onInputChange).to.be.a(Function);
    expect(scope.map.getLayers().getArray().length).to.be(0);
    expect(scope.map.getInteractions().getArray().length).to.be(0);
  });

  describe('when the directive is active', function() {

    beforeEach(function() {
      loadDirective();
      var spy = sinon.spy(scope, 'onInputChange');
      parentScope.isRectActive = true;
      $rootScope.$digest();
      expect(spy.callCount).to.be(1);
    });

    it('activates/deactivates the interaction', function() {
      // The layer is a feature overlay so it is not added to the map's layers
      // collection.
      expect(scope.map.getLayers().getArray().length).to.be(0);
      expect(scope.map.getInteractions().getArray().length).to.be(1);
      expect(scope.map.getInteractions().item(0)).to.be(scope.dragBox);
      expect(scope.dragBox.getActive()).to.be(true);
      parentScope.isRectActive = false;
      $rootScope.$digest();
      expect(scope.map.getLayers().getArray().length).to.be(0);
      expect(scope.map.getInteractions().getArray().length).to.be(0);
    });

    it('destroys the scope', function() {
      scope.$destroy();
      expect(scope.map.getLayers().getArray().length).to.be(0);
      expect(scope.map.getInteractions().getArray().length).to.be(0);
    });

    it('doesn\'t update price and area on input change if area is outside switzerland', function() {
      var stubUpPrice = sinon.stub(parentScope, 'updatePrice');
      var stubUpArea = sinon.stub(gaShop, 'cut').returns($q.when(24));
      scope.east = 1;
      scope.south = 2;
      scope.north = 3;
      scope.west = 4;
      $rootScope.$digest();
      scope.onInputChange();
      $timeout.flush(300);
      expect(stubUpPrice.callCount).to.be(0);
      expect(stubUpArea.callCount).to.be(0);
    });

    it('updates price and area on input change', function() {
      var stubUpPrice = sinon.stub(parentScope, 'updatePrice');
      var stubUpArea = sinon.stub(gaShop, 'cut').returns($q.when(24));
      scope.west = 570000;
      scope.east = 630000;
      scope.south = 150000;
      scope.north = 236000;
      $rootScope.$digest();
      scope.onInputChange();
      $timeout.flush(300);
      expect(stubUpPrice.callCount).to.be(1);
      expect(stubUpPrice.calledWith('570000,150000,630000,236000', 24)).to.be(true);
      expect(stubUpArea.callCount).to.be(1);
      expect(stubUpArea.calledWith('570000,150000,630000,236000')).to.be(true);
      expect(scope.area).to.be(24000000);
    });
  });
});
