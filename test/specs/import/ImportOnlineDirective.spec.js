/* eslint-disable max-len */
describe('ga_importonline_directive', function() {

  describe('gaImportOnline', function() {

    var elt = {remove: function() {}}, scope, parentScope, $q, $rootScope, $compile, $timeout, gaFile, $httpBackend;

    var options = {
      servers: [{
        url: 'https://wms.geo.admin.ch/'
      }, {
        url: 'http://ogc.heig-vd.ch/mapserver/wms?'
      }],
      handleFileContent: function() { return $q.when({}); }
    };

    var loadDirective = function(options) {
      parentScope = $rootScope.$new();
      parentScope.options = options;
      var tpl = $('<div><div ga-import-online ga-import-online-options="options"></div></div>');
      elt = $compile(tpl)(parentScope).find('[ga-import-online]');
      $rootScope.$digest();
      $timeout.flush();
      scope = elt.isolateScope();
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      gaFile = $injector.get('gaFile');
    };

    beforeEach(function() {

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
      elt.remove();
    });

    it('removes the element if no options provided', function() {
      loadDirective();
      expect(elt.parent().length).to.be(0);
    });

    it('removes the element if handleFileContent function is not provided', function() {
      loadDirective({test: 'foo'});
      expect(elt.parent().length).to.be(0);
    });

    it('removes the element if handleFileContent is not a function', function() {
      loadDirective({handleFileContent: 'foo'});
      expect(elt.parent().length).to.be(0);
    });

    it('creates html elements', function() {
      loadDirective(options);
      expect(elt.parent().length).to.be(1);
      expect(elt.find('form input[ng-model=fileUrl]').length).to.be(2);
      expect(elt.find('.tabbable-footer button').length).to.be(1);
    });

    it('has good scope values', function() {
      loadDirective(options);
      expect(scope.options).to.be(options);
      expect(scope.handleFileContent).to.be(scope.options.handleFileContent);
      expect(scope.fileUrl).to.be();
      expect(scope.userMessage).to.be('connect');
      expect(scope.progress).to.be(0);
      expect(scope.loading).to.be(false);
      expect(scope.handleFileUrl).to.be.a(Function);
      expect(scope.cancel).to.be.a(Function);
      expect(scope.isValid).to.be.a(Function);
    });

    describe('typeahead beahvior', function() {

      beforeEach(function() {
        loadDirective(options);
        $(document.body).append(elt);
      });

      afterEach(function() {
        elt.remove();
      });

      it('loads typeahead', function() {
        var input = elt.find('input[name=url]');
        var data = input.data('ttTypeahead');
        expect(data.minLength).to.be(0);
        expect(data.menu.datasets.length).to.be(1);
        var ds = data.menu.datasets[0];
        expect(ds.limit).to.be(500);
        expect(ds.name).to.be('wms');
        var obj = {callback: function() {}};
        var spy = sinon.spy(obj, 'callback');

        // Find a wms in the list
        ds.source('eig', obj.callback);
        expect(spy.args[0][0]).to.eql([options.servers[1]]);

        // Return all the list
        ds.source(null, obj.callback);
        expect(spy.args[1][0]).to.eql(options.servers);
      });

      it('set fileUrl on typeahead:selected evt', function() {
        var input = elt.find('input[name=url]');
        var spy = sinon.stub(scope, 'handleFileUrl');
        var spy2 = sinon.spy(scope, '$applyAsync');
        expect(scope.fileUrl).to.be();
        input.trigger('typeahead:selected', options.servers[1]);
        expect(scope.fileUrl).to.be(options.servers[1].url);
        expect(spy.callCount).to.be(1);
        expect(spy2.callCount).to.be(1);
      });

      it('shows/hides the servers list on mousedown', function() {
        var taElt = elt.find('input[name=url]');
        var taMenu = elt.find('.tt-menu');
        var btOpen = elt.find('.ga-import-open');
        var evt = $.Event('mousedown');
        var spy = sinon.spy(evt, 'preventDefault');
        taElt.typeahead('val', 'foo');
        expect(taMenu.css('display')).to.be('none');
        expect(taElt.typeahead('val')).to.be('foo');

        // Hide the menu and clear the input
        btOpen.trigger(evt);
        expect(taElt.typeahead('val')).to.be('');
        expect(taMenu.css('display')).to.be('block');
        expect(spy.callCount).to.be(1);

        btOpen.trigger(evt);
        expect(taMenu.css('display')).to.be('none');
        expect(spy.callCount).to.be(2);
      });
    });

    describe('on $translateChangeEnd event', function() {

      it('reload the fileUrl only if a lang parameter exists', function() {
        var stub = sinon.stub(scope, 'handleFileUrl');
        scope.fileUrl = undefined;
        $rootScope.$broadcast('$translateChangeEnd');
        expect(stub.callCount).to.be(0);

        scope.fileUrl = 'http://wms.ch';
        scope.$broadcast('$translateChangeEnd');
        expect(stub.callCount).to.be(0);

        scope.fileUrl = 'http://wms.ch?lang=';
        scope.$broadcast('$translateChangeEnd');
        expect(stub.callCount).to.be(1);
      });
    });

    describe('#cancel()', function() {

      beforeEach(function() {
        loadDirective(options);
      });

      it('set progress to 0', function() {
        scope.progress = 18;
        scope.cancel();
        expect(scope.progress).to.be(0);
      });

      it('resolves the canceler', function() {
        scope.canceler = $q.defer();
        var spy = sinon.spy(scope.canceler, 'resolve');
        scope.cancel();
        expect(spy.callCount).to.be(1);
        expect(scope.canceler).to.be(null);
      });
    });

    describe('#isValid', function() {

      beforeEach(function() {
      });

      it('returns true is no options defined', function() {
        var opt = angular.extend({
          isValidUrl: undefined
        }, options);
        loadDirective(opt);
        expect(scope.isValid()).to.be(true);
      });

      it('returns the result of the function define din options', function() {
        var opt = angular.extend({
          isValidUrl: function() {
            return 'bar';
          }
        }, options);
        loadDirective(opt);
        expect(scope.isValid()).to.be('bar');
      });
    });

    describe('#handleFileUrl', function() {

      it('doesn\'t transform the fileUrl before loading', function() {
        var opt = angular.extend({
          transformUrl: undefined
        }, options);
        loadDirective(opt);
        scope.fileUrl = 'http://wms.ch';
        var spy = sinon.spy($q, 'when').withArgs(scope.fileUrl);
        var spy2 = sinon.stub(gaFile, 'load').withArgs(scope.fileUrl);
        var spy3 = sinon.spy($timeout, 'cancel');
        scope.handleFileUrl();
        expect(spy.callCount).to.be(1);
        $timeout.flush();
        expect(spy2.callCount).to.be(1);
        expect(spy3.callCount).to.be(1);
        expect(scope.canceler.promise).to.be.a(Object);
        expect(scope.loading).to.be(true);
        expect(scope.userMessage).to.be('uploading_file');
      });

      it('transforms the fileUrl before loading', function() {
        var opt = angular.extend({
          transformUrl: function() {
            return $q.when('bar');
          }
        }, options);
        loadDirective(opt);
        var spy = sinon.stub(gaFile, 'load').withArgs('bar');
        var spy2 = sinon.spy($timeout, 'cancel');
        scope.handleFileUrl();
        $timeout.flush();
        expect(spy.callCount).to.be(1);
        expect(spy2.callCount).to.be(1);
        expect(scope.canceler.promise).to.be.a(Object);
        expect(scope.loading).to.be(true);
        expect(scope.userMessage).to.be('uploading_file');
      });

      it('loads a file then handle file content successfully', function(done) {

        loadDirective(options);
        scope.fileUrl = 'http://wms.ch';

        var content = '<wms></wm<>';
        var stub = sinon.stub(gaFile, 'load').withArgs(scope.fileUrl).returns($q.resolve(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: scope.fileUrl
        }).returns($q.resolve({message: 'finish'}));

        scope.handleFileUrl().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.canceler).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('finish');
          done();
        });
        $timeout.flush();
      });

      it('loads a file then fails to handle file content', function(done) {

        loadDirective(options);
        scope.fileUrl = 'http://wms.ch';

        var content = '<wms></wm<>';
        var stub = sinon.stub(gaFile, 'load').withArgs(scope.fileUrl).returns($q.resolve(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: scope.fileUrl
        }).returns($q.reject({message: 'fail'}));

        scope.handleFileUrl().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.canceler).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('fail');
          done();
        });
        $timeout.flush();
      });

      it('fails to loads a file', function(done) {

        loadDirective(options);
        scope.fileUrl = 'http://wms.ch';

        var stub = sinon.stub(gaFile, 'load').withArgs(scope.fileUrl).returns($q.reject({message: 'fails'}));
        var stub2 = sinon.stub(scope, 'handleFileContent');

        scope.handleFileUrl().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(0);
          expect(scope.canceler).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('fails');
          done();
        });
        $timeout.flush();
      });
    });
  });
});
