/* eslint-disable max-len */
describe('ga_importlocal_directive', function() {

  describe('gaImportLocal', function() {

    var elt = {remove: function() {}}, scope, parentScope, $q, $rootScope, $compile, $timeout, gaFile, $httpBackend;

    var options = {
      handleFileContent: function() { return $q.when({}); }
    };

    var loadDirective = function(options) {
      parentScope = $rootScope.$new();
      parentScope.options = options;
      var tpl = $('<div><div ga-import-local ga-import-local-options="options"></div></div>');
      elt = $compile(tpl)(parentScope).find('[ga-import-local]');
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
      expect(elt.find('input[type=file]').length).to.be(1);
      expect(elt.find('button').length).to.be(2);
      expect(elt.find('.tabbable-footer button').length).to.be(1);
    });

    it('has good scope values', function() {
      loadDirective(options);
      expect(scope.options).to.be(options);
      expect(scope.handleFileContent).to.be(scope.options.handleFileContent);
      expect(scope.files).to.be();
      expect(scope.fileSize).to.be();
      expect(scope.fileReader).to.be(null);
      expect(scope.userMessage).to.be('load_local_file');
      expect(scope.progress).to.be(0);
      expect(scope.loading).to.be(false);
      expect(scope.handleFile).to.be.a(Function);
      expect(scope.cancel).to.be.a(Function);
      expect(scope.isValid).to.be.a(Function);
    });

    describe('user interactions', function() {

      beforeEach(function() {
        loadDirective(options);
        $(document.body).append(elt);
      });

      afterEach(function() {
        elt.remove();
      });

      it('click on browse button triggers click on input file', function(done) {
        elt.find('input[type="file"]').click(function() {
          done();
        });
        elt.find('button.ga-import-browse').click();
      });

      it('click on input text triggers click on input file', function(done) {
        elt.find('input[type="file"]').click(function() {
          done();
        });
        elt.find('input.form-control[type=text][readonly]').click();
      });

      it('on change event of the input file', function() {
        expect(scope.files).to.be();
        var file = {};
        var ipt = elt.find('input[type=file]');
        ipt.trigger($.Event('change', {target: {}}));
        expect(scope.files).to.be();

        ipt.trigger($.Event('change', {target: {files: []}}));
        expect(scope.files).to.be();

        ipt.trigger($.Event('change', {target: {files: [file]}}));
        expect(scope.files).to.eql([file]);
      });

      it('launch handleFile if the file is dropped', function() {
        var spy = sinon.spy(scope, 'handleFile');
        var file = {size: 89};
        scope.isDropped = true;
        scope.files = [file, {size: 90}];
        expect(scope.file).to.be();
        expect(scope.fileSize).to.be();
        $rootScope.$digest();
        expect(scope.file).to.be(file);
        expect(scope.fileSize).to.be(89);
        expect(spy.callCount).to.be(1);
      });
    });

    describe('#cancel()', function() {

      beforeEach(function() {
        loadDirective(options);
      });

      it('does nothing', function() {
        scope.fileReader = null;
        scope.cancel();
        expect(scope.fileReader).to.be(null);
      });

      it('abort the fileReader', function() {
        scope.fileReader = {abort: angular.noop};
        var spy = sinon.spy(scope.fileReader, 'abort');
        scope.cancel();
        expect(spy.callCount).to.be(1);
        expect(scope.fileReader).to.be(null);
      });
    });

    describe('#isValid', function() {

      beforeEach(function() {
        loadDirective(options);
      });

      it('returns true is no file defined', function() {
        expect(scope.isValid()).to.be(true);
      });

      it('returns the value of isValidFileSize', function() {
        var file = {
          size: 'bar'
        };
        sinon.stub(gaFile, 'isValidFileSize').withArgs(file.size).returns('foo');
        expect(scope.isValid(file)).to.be('foo');
      });
    });

    describe('#handleFile', function() {

      it('does nothing if no file defined', function(done) {
        loadDirective(options);
        var spy = sinon.spy(gaFile, 'read');
        scope.file = undefined;
        scope.handleFile().then(function() {
          expect(spy.callCount).to.be(0);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('load_local_file');
          expect(scope.fileReader).to.be(null);
          done();
        });
        $timeout.flush();
      });

      it('changes the message when reading', function() {
        loadDirective(options);
        var spy = sinon.stub(gaFile, 'read').returns($q.when());
        scope.file = {};
        scope.handleFile();
        expect(spy.callCount).to.be(1);
        expect(scope.loading).to.be(true);
        expect(scope.userMessage).to.be('reading_file');
      });

      it('changes the message when parsing', function() {

        loadDirective(options);
        scope.file = {};

        var content = '<wms></wm<>';
        sinon.stub(gaFile, 'read').withArgs(scope.file).returns({
          then: function(func) {
            var a = func(content);
            expect(scope.userMessage).to.be('parsing_file');
            return a;
          }
        });
        scope.handleFile();
      });

      it('set FileReader on notify', function() {

        loadDirective(options);
        scope.file = {};

        var defer = $q.defer();
        sinon.stub(gaFile, 'read').withArgs(scope.file).returns(defer.promise)
        scope.handleFile();
        expect(scope.fileReader).to.be(null);
        defer.notify({target: 'foo'});
        $timeout.flush();
        expect(scope.fileReader).to.be('foo');
        defer.notify({target: 'bar'});
        $timeout.flush();
        expect(scope.fileReader).to.be('foo');
      });

      it('loads a file then handle file content successfully', function(done) {

        loadDirective(options);
        scope.file = {};

        var content = '<wms></wm<>';
        var stub = sinon.stub(gaFile, 'read').withArgs(scope.file).returns($q.resolve(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, scope.file).returns($q.resolve({message: 'finish'}));

        scope.handleFile().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.fileReader).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('finish');
          done();
        });
        $timeout.flush();
      });

      it('loads a file then fails to handle file content', function(done) {

        loadDirective(options);
        scope.file = {};

        var content = '<wms></wm<>';
        var stub = sinon.stub(gaFile, 'read').withArgs(scope.file).returns($q.resolve(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, scope.file).returns($q.reject({message: 'fail'}));

        scope.handleFile().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(1);
          expect(scope.fileReader).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('fail');
          done();
        });
        $timeout.flush();
      });

      it('fails to loads a file', function(done) {

        loadDirective(options);
        scope.file = {};

        var stub = sinon.stub(gaFile, 'read').withArgs(scope.file).returns($q.reject({message: 'fails'}));
        var stub2 = sinon.stub(scope, 'handleFileContent');

        scope.handleFile().then(function() {
          expect(stub.callCount).to.be(1);
          expect(stub2.callCount).to.be(0);
          expect(scope.fileReader).to.be(null);
          expect(scope.loading).to.be(false);
          expect(scope.userMessage).to.be('fails');
          done();
        });
        $timeout.flush();
      });
    });
  });
});
