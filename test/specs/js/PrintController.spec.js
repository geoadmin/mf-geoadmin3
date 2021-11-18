/* eslint-disable max-len */
describe('ga_print_controller', function() {

  describe('GaPrintController', function() {

    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend,
      gaGlobalOptions;

    var loadController = function() {
      parentScope = $rootScope.$new();
      var tpl = '<div ng-controller="GaPrintController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
    };

    beforeEach(function() {
      inject(function($injector) {
        injectServices($injector);
      });
      loadController();
      $timeout.flush();
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

    it('set scope values', function() {
      var opt = scope.options;
      expect(opt.printPath).to.be('http://print.geo.admin.ch/print');
      expect(opt.printConfigUrl).to.be('http://print.geo.admin.ch/123456/print/info.json?url=http%3A%2F%2Fprint.geo.admin.ch%2Fprint');
      expect(opt.legendUrl).to.be(gaGlobalOptions.apiUrl + '/static/images/legends/');
      expect(opt.qrcodeUrl).to.be(gaGlobalOptions.qrcodeUrl +
          gaGlobalOptions.qrcodePath + '?url=');
      expect(opt.markerUrl).to.be(gaGlobalOptions.resourceUrl + 'img/marker.png');
      expect(opt.bubbleUrl).to.be(gaGlobalOptions.resourceUrl + 'img/bubble.png');
      expect(opt.heightMargin).to.be();
      expect(opt.widthMargin).to.be();
      expect(opt.pdfLegendList.length).to.be(16);
      opt.pdfLegendList.forEach(function(p) {
        expect(p).to.be.a('string');
      });
    });
  });
});
