/* eslint-disable max-len */
describe('ga_slider_directive', function() {

  describe('gaSlider', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout;
    // var $window, $q, $document, $sce, gaDebounce;

    var loadDirective = function(currentYear, options, ol3d) {
      parentScope = $rootScope.$new();
      parentScope.currentYear = currentYear;
      parentScope.options = options;
      var tpl = '<div ga-slider floor="{{options.minYear}}" ceiling="{{options.maxYear}}" ' +
          'ng-model="currentYear" ga-data="options.years" ga-redraw="options.isRedraw" ' +
          'ga-keyboard-events="options.isKeyboardEvents" ga-magnetize="options.isMagnetize" ' +
          'ga-input-text="' + (options || {}).isInputText + '" ga-unfit-to-bar="options.isUnfitToBar" ' +
          'translate2="options.translate2"></div>';
      elt = $compile(tpl)(parentScope);
      $(document.body).append(elt);
      $rootScope.$digest();
      scope = elt.isolateScope();
      $timeout.flush();
    };

    var provideServices = function($provide) {
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      /*
      $q = $injector.get('$q');
      $sce = $injector.get('$sce');
      $document = $injector.get('$document');
      $window = $injector.get('$window');
      gaDebounce = $injector.get('gaDebounce');
      */
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
      elt.remove();

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    it('verifies html elements', function() {
      loadDirective();
      expect(elt.find('> div').length).to.be(1);
      expect(elt.find('.ga-slider-pointer').length).to.be(1);
      expect(elt.find('.ga-slider-bar').length).to.be(1);
      expect(elt.find('> div > span').length).to.be(5);
    });

    it('set scope values', function() {
      loadDirective();
      expect(scope.useMagnetize).to.be(false);
      expect(scope.isValid).to.be.a(Function);
      expect(scope.onInputChange).to.be.a(Function);
      expect(scope.assignDivisionStyle).to.be.a(Function);
      expect(scope.translate2).to.be.a(Function);
      expect(scope.precision).to.be(0);
      expect(scope.step).to.be(1);
      expect(isNaN(scope.diff)).to.be(true);
      expect(isNaN(scope.floor)).to.be(true);
      expect(isNaN(scope.ceiling)).to.be(true);
      expect(scope.unfitToBar).to.be();
      expect(isNaN(scope.ngModel)).to.be(true);
      expect(scope.ngModelLow).to.be();
      expect(scope.ngModelHigh).to.be();
      expect(scope.dataList).to.be();
      expect(scope.redraw).to.be();
      expect(scope.useKeyboardEvents).to.be();
    });

    it('set scope values from options (true)', function() {
      var opt = {
        minYear: 1800,
        maxYear: 2018,
        years: [1800, 1846, 1995, 2018],
        translate2: function() { return 'foo'; },
        isRedraw: true,
        isKeyboardEvents: true,
        isMagnetize: true,
        isInputText: true,
        unfitToBar: true
      };
      loadDirective(1995, opt);
      expect(scope.useMagnetize).to.be(true);
      expect(scope.isValid).to.be.a(Function);
      expect(scope.onInputChange).to.be.a(Function);
      expect(scope.assignDivisionStyle).to.be.a(Function);
      expect(scope.translate2).to.be.a(Function);
      expect(scope.translate2()).to.be('foo');
      expect(scope.precision).to.be(0);
      expect(scope.step).to.be(1);
      expect(isNaN(scope.diff)).to.be(true);
      expect(scope.floor).to.be(1800);
      expect(scope.ceiling).to.be(2018);
      expect(scope.unfitToBar).to.be();
      expect(scope.ngModel).to.be(1995);
      expect(scope.ngModelLow).to.be();
      expect(scope.ngModelHigh).to.be();
      expect(scope.dataList).to.eql(opt.years);
      expect(scope.redraw).to.be(true);
      expect(scope.useKeyboardEvents).to.be(true);
    });

    it('set scope values from options (false)', function() {
      var opt = {
        minYear: 1800,
        maxYear: 2018,
        years: [1800, 1846, 1995, 2018],
        isRedraw: false,
        isKeyboardEvents: false,
        isMagnetize: false,
        isInputText: false,
        unfitToBar: false
      };
      loadDirective(1995, opt);
      expect(scope.useMagnetize).to.be(false);
      expect(scope.isValid).to.be.a(Function);
      expect(scope.onInputChange).to.be.a(Function);
      expect(scope.assignDivisionStyle).to.be.a(Function);
      expect(scope.translate2).to.be.a(Function);
      expect(scope.precision).to.be(0);
      expect(scope.step).to.be(1);
      expect(isNaN(scope.diff)).to.be(true);
      expect(scope.floor).to.be(1800);
      expect(scope.ceiling).to.be(2018);
      expect(scope.unfitToBar).to.be();
      expect(scope.ngModel).to.be(1995);
      expect(scope.ngModelLow).to.be();
      expect(scope.ngModelHigh).to.be();
      expect(scope.dataList).to.eql(opt.years);
      expect(scope.redraw).to.be(false);
      expect(scope.useKeyboardEvents).to.be(false);
    });

  });
});
