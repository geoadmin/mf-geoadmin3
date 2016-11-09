describe('ga_sharecopyinputgroup_directive', function() {

  describe('gaShareCopyInputGroup', function() {
    var elt, eltBt, scope, scopeBt, parentScope, $rootScope, compile, ctrl;

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
    };

    beforeEach(function() {

      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
      });

      $rootScope.onBeforeCopy = function() {return 'a';};
      loadDirective();
    });

    it('set scope values', function() {
      expect(scope.inputToCopy.length).to.be(1);
      expect(scope.onBeforeCopy()).to.be('a');
    });

    it('set controller values', function() {
      var spy = sinon.spy(scope, 'onBeforeCopy');
      expect(ctrl.getInputToCopy()).to.be(scope.inputToCopy);
      expect(ctrl.onBeforeCopy()).to.be('a');
      expect(spy.calledOnce).to.be(true);
      expect(spy.args[0][0].input).to.be(scope.inputToCopy);
    });
  });
});

