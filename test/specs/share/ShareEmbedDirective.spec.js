describe('ga_shareembed_directive', function() {
  var elt, modal, parentScope, scope, $rootScope, $compile, gaPermalink, $window, $timeout;

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-share-embed></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
    modal = elt.find('.modal');
  };
var $sce;
  beforeEach(function() {
    inject(function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $sce = $injector.get('$sce');
      $timeout = $injector.get('$timeout');
      gaPermalink = $injector.get('gaPermalink');
    });
  });
  afterEach(function() {
    modal.modal('hide');
    $rootScope.$digest();
  });

  it('verifies html elements', function() {
    loadDirective();
    expect(modal.length).to.be(1);
    expect(elt.find('.modal-header').length).to.be(1);
    expect(elt.find('.modal-body').length).to.be(1);
    expect(elt.find('button[data-dismiss="modal"]').length).to.be(1);
    expect(elt.find('select[ng-model="iframeSize"]').length).to.be(1);
    expect(elt.find('input[ng-model="iframeWidth"]').length).to.be(1);
    expect(elt.find('input[ng-model="iframeHeight"]').length).to.be(1);
    expect(elt.find('[ga-share-copy-input-group][ga-share-on-before-copy]').length).to.be(1);
    expect(elt.find('[ga-share-copy-input]').length).to.be(1);
  });

  it('set scope values', function() {
    loadDirective();
    expect(scope.iframeSizes.length).to.be(4);
    expect(scope.iframeSize).to.be(scope.iframeSizes[0].value);
    expect(scope.iframeWidth).to.be(400);
    expect(scope.iframeHeight).to.be(300);
    expect(scope.contentWidth).to.eql({'max-width': '440px'});
    expect(scope.embedValue).to.be(undefined);
    expect(scope.loadIframe).to.be(undefined);
    expect(scope.updateEmbedValueFromIframe).to.be.a(Function);
  });

  it('listens gaShareEmbedActive event', function(done) {
    var embedHref = 'https://' + window.location.host + '/embed.html';
    var stub = sinon.stub(gaPermalink, 'getEmbedHref').returns(embedHref);
    loadDirective();
    $rootScope.$broadcast('gaShareEmbedActive');
    modal.on('shown.bs.modal', function() {
      done();
    });
    expect(scope.embedValue).to.be(embedHref);
    expect(modal.data('bs.modal')).to.be.an(Object);
    stub.restore();
  });

  it('loads/hides iframe when the popup is shown/hidden', function(done) {
    loadDirective();
    modal.modal('show');
    modal.on('shown.bs.modal', function() {
      $rootScope.$digest();
      expect(scope.loadIframe).to.be(true);
      modal.modal('hide');
    });
    modal.on('hidden.bs.modal', function() {
      $rootScope.$digest();
      expect(scope.loadIframe).to.be(false);
      done();
    });
  });

  it('opens window on click on preview link', function(done) {
    var stub = sinon.stub($window, 'open');
    loadDirective();

    scope.embedValue = 'http://test.com';
    var a = modal.find('.form-inline a');
    a.click(function() {
      expect(stub.calledWith(scope.embedValue, 'embed', 'width=400, height=300')).to.be(true);
      stub.restore();
      done();
    });
    a.click();
  });

  it('forbids window\'s width or height less than 200', function() {
    loadDirective();

    scope.iframeSize = scope.iframeSizes[3];
    $rootScope.$digest();
    var inputs = modal.find('.form-inline input');
    var width = $(inputs[0]);
    var height = $(inputs[1]);

    scope.iframeWidth = 100;
    $rootScope.$digest();
    expect(width.val()).to.be('100');
    width.blur();
    $timeout.flush();
    expect(scope.iframeWidth).to.be(200);
    scope.iframeHeight = 100;
    $rootScope.$digest();
    expect(height.val()).to.be('100');
    height.blur();
    $timeout.flush();
    expect(scope.iframeHeight).to.be(200);
  });
});

