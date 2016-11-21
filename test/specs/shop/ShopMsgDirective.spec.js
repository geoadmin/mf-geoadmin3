describe('ga_shopmsg__directive', function() {
  var elt, scope, parentScope, $compile, $rootScope, gaStorage, stubGet;
  var KEY = 'ga-shop-msg-never-show-again';

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-shop-msg></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {});
      $provide.value('$window', {
        location: window.location,
        navigator: window.navigator,
        parent: window.parent,
        document: window.document
      });
    });

    inject(function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      gaStorage = $injector.get('gaStorage');
    });

    stubGet = sinon.stub(gaStorage, 'getItem').returns(false);
  });

  afterEach(function() {
    stubGet.restore();
  });

  describe('when the page is not opened from the shop', function() {

    it('removes the element and destroy the scope', function() {
      loadDirective();
      expect(stubGet.calledOnce).to.be(true);
      expect(stubGet.calledWith(KEY)).to.be(true);
      expect(elt.parent().length).to.be(0);
      expect(scope).to.be(undefined);
    });
  });

  describe('when the page is opened from the shop', function() {

    beforeEach(function() {
      $window.name = 'map-toposhop-1015';
    });

    it('verifies html elements', function() {
      loadDirective();
      expect(elt.hasClass('modal')).to.be(true);
      expect(elt.find('.modal-header').length).to.be(1);
      expect(elt.find('.modal-body').length).to.be(1);
      expect(elt.find('.modal-footer').length).to.be(1);
      expect(elt.find('.ga-checkbox').length).to.be(1);
      expect(elt.find('input[ng-model="neverShowAgain"]').length).to.be(1);
      expect(elt.find('button[data-dismiss="modal"]').length).to.be(1);
      expect(elt.data('bs.modal')).to.be.an(Object);
    });

    it('set scope values', function() {
      loadDirective();
      expect(scope.neverShowAgain).to.be(false);
    });

    it('use local storage to store neverShowAgain value', function(done) {
      var stubSet = sinon.stub(gaStorage, 'setItem');
      loadDirective();
      expect(stubGet.calledOnce).to.be(true);
      expect(stubGet.calledWith(KEY)).to.be(true);
      expect(scope.neverShowAgain).to.be(false);
      var input = elt.find('input[ng-model="neverShowAgain"]').click();
      $rootScope.$digest();
      expect(scope.neverShowAgain).to.be(true);

      // Hide the modal
      elt.on('shown.bs.modal', function() {
        elt.modal('hide').on('hidden.bs.modal', function() {
          expect(stubSet.callCount).to.be(1);
          expect(stubSet.calledWith(KEY, true)).to.be(true);
          done();
        });
      });
    });

    it('use the neverShowAgain value in local storage and don\'t show the msg', function() {
      stubGet.returns(true);
      loadDirective();
      expect(stubGet.calledOnce).to.be(true);
      expect(stubGet.calledWith(KEY)).to.be(true);
      expect(elt.parent().length).to.be(0);
      expect(scope).to.be(undefined);
    });
  });
});
