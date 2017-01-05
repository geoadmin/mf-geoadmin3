describe('ga_sharedraw_directive', function() {
  var elt, modal, parentScope, scope, $rootScope, $compile, gaPermalink, gaUrlUtils, $q;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-share-draw></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
    modal = elt.find('.modal');
  };

  beforeEach(function() {

    inject(function($injector) {
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      gaPermalink = $injector.get('gaPermalink');
      gaUrlUtils = $injector.get('gaUrlUtils');
    });
  });

  it('verifies html elements', function() {
    loadDirective();
    expect(modal.length).to.be(1);
    expect(elt.find('.modal-header').length).to.be(1);
    expect(elt.find('.modal-body').length).to.be(1);
    expect(elt.find('[ng-model="userShareUrl"]').length).to.be(1);
    expect(elt.find('[ng-model="adminShareUrl"]').length).to.be(1);
    expect(elt.find('[ga-share-copy-input-group]').length).to.be(2);
    expect(elt.find('[ga-share-copy-input]').length).to.be(2);
    expect(elt.find('button[data-dismiss="modal"]').length).to.be(1);
  });

  it('doesn\'t set scope values', function() {
    loadDirective();
    expect(scope.userShareUrl).to.be(undefined);
    expect(scope.adminShareUrl).to.be(undefined);
  });

  describe('on gaShareDrawActive event', function() {
    var params = {id: 'foo', adminId: 'bar'};
    var shortenHref = 'http://shortentest.com';
    var shortenAdminHref = 'http://shortenadmintest.com';

    beforeEach(function() {
      loadDirective();
    });

    it('does nothing if adminId not present', function() {
      var spy = sinon.spy(gaUrlUtils, 'shorten');
      $rootScope.$broadcast('gaShareDrawActive', {});
      expect(spy.callCount).to.be(0);
      expect(modal.data('bs.modal')).to.be(undefined);
    });

    it('shows the modal', function(done) {
      $rootScope.$broadcast('gaShareDrawActive', params);
      modal.on('shown.bs.modal', function() {
        done();
      });
      expect(modal.data('bs.modal')).to.be.an(Object);
    });

    it('generates shorten urls', function() {
      var href = 'http://test.com?layers=foo';
      var adminHref = 'http://test.com?layers=&adminId=bar';
      var permaStub = sinon.stub(gaPermalink, 'getHref').returns(href);
      var stub = sinon.stub(gaUrlUtils, 'shorten');
      stub.withArgs(href).returns($q.when(shortenHref));
      stub.withArgs(adminHref).returns($q.when(shortenAdminHref));
      $rootScope.$broadcast('gaShareDrawActive', params);
      permaStub.restore();
      $rootScope.$digest();
      expect(scope.userShareUrl).to.be(shortenHref);
      expect(scope.adminShareUrl).to.be(shortenAdminHref);
      stub.restore();
    });

    it('remove encoded layer\'s id from permalink', function() {
      var href = 'http://test.com?layers=lala,f%20oo';
      var adminHref = 'http://test.com?layers=lala&adminId=bar';
      var permaStub = sinon.stub(gaPermalink, 'getHref').returns(href);
      var stub = sinon.stub(gaUrlUtils, 'shorten');
      stub.withArgs(href).returns($q.when(shortenHref));
      stub.withArgs(adminHref).returns($q.when(shortenAdminHref));
      $rootScope.$broadcast('gaShareDrawActive', {id: 'f oo', adminId: params.adminId});
      permaStub.restore();
      $rootScope.$digest();
      expect(scope.userShareUrl).to.be(shortenHref);
      expect(scope.adminShareUrl).to.be(shortenAdminHref);
      stub.restore();
    });
  });
});

