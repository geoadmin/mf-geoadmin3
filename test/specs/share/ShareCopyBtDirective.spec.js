describe('ga_sharecopybt_directive', function() {

  describe('gaShareCopyBt', function() {
    var elt, eltBt, scope, scopeBt, parentScope, $rootScope, compile, ctrl, $timeout;

    var loadDirective = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ga-share-copy-input-group ga-share-on-before-copy="onBeforeCopy()">' +
          '<input ng-model="permalinkValue" ga-share-copy-input>' +
          '<button ga-share-copy-bt></button>' +
        '</div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
      ctrl = elt.controller('gaShareCopyInputGroup');
      eltBt = elt.find('[ga-share-copy-bt]');
      scopeBt = eltBt.isolateScope();
    };

    beforeEach(function() {

      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $timeout = $injector.get('$timeout');
      });

      $rootScope.onBeforeCopy = function() {return 'a';};
    });

    describe('on unsupported browser', function() {

      it('removes html elements', function() {
        expect(eltBt).to.be(undefined);
      });
    });

    describe('on supported browser', function() {
      var stub, stub1;

      beforeEach(function() {
        // PhantomJS doesn't support execCommand
        stub = sinon.stub(document, 'queryCommandSupported').returns(true);
        stub1 = sinon.stub(document, 'execCommand').returns(true);
        loadDirective();
      });

      afterEach(function() {
        stub.restore();
        stub1.restore();
      });

      it('creates html elements', function() {
        expect(eltBt.find('span').length).to.be(2);
      });

      it('set scope values', function() {
        expect(scopeBt.isCopied).to.be(false);
        expect(stub.calledOnce).to.be(true);
      });

      it('copy input value on click', function() {
        var spy = sinon.spy(scope, 'onBeforeCopy');
        var spyRm = sinon.spy(document.body, 'removeChild');
        eltBt.click();
        expect(stub1.calledOnce).to.be(true);
        expect(scopeBt.isCopied).to.be(true);
        expect(spy.calledOnce).to.be(true);
        expect(spy.args[0][0].input).to.be(scope.inputToCopy);
        expect(spyRm.calledOnce).to.be(true);
        $timeout.flush(5000);
        expect(scopeBt.isCopied).to.be(false);
      });
    });
  });
});

