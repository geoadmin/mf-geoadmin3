describe('ga_sharecopyinput_directive', function() {

  describe('gaShareCopyInput', function() {
    var elt, eltInput, scope, scopeInput, parentScope, $rootScope, compile, ctrl;

    var loadDirective = function(placmt) {
      parentScope = $rootScope.$new();
      var tpl = '<div ga-share-copy-input-group ga-share-on-before-copy="onBeforeCopy()">' +
          '<input ga-share-copy-input ga-tooltip-placement="' + (placmt || '') + '">' +
          '<button ga-share-copy-bt></button>' +
        '</div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
      ctrl = elt.controller('gaShareCopyInputGroup');
      eltInput = elt.find('[ga-share-copy-input]');
      scopeInput = eltInput.isolateScope();
    };

    beforeEach(function() {

      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $translate = $injector.get('$translate');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      });

      $rootScope.onBeforeCopy = function() {return 'a';};
    });

    describe('on mobile', function() {

      beforeEach(function() {
        gaBrowserSniffer.mobile = true;
        loadDirective();
      });

      it('doesn\'t add tootltip', function() {
        expect(eltInput.data('bs-tooltip')).to.be(undefined);
      });
    });

    describe('on other devices', function() {

      beforeEach(function() {
        gaBrowserSniffer.mobile = false;
      });

      it('verifies html elements', function() {
        loadDirective();
        expect(eltInput.attr('readonly')).to.be('readonly');
      });

      it('adds tooltip', function() {
        loadDirective();
        var data = eltInput.data('bs.tooltip');
        expect(data).not.to.be(undefined);
        expect(data.options.placement).to.be('bottom');
        expect(data.options.trigger).to.be('focus');
        expect(data.options.title).to.be.a(Function);
      });

      it('uses placement attribute', function() {
        loadDirective('top');
        var data = eltInput.data('bs.tooltip');
        expect(data.options.placement).to.be('top');
      });

      // TO FIX: Focus tests doesn't work on Phantomjs
      /*it('selects content on focus', function() {
        loadDirective();
        var spySel = sinon.spy(eltInput[0], 'setSelectionRange');
        eltInput.focus();
        expect(spySel.calledWith(0, 9999)).to.be(true);
      });*/
    });
  });
});

