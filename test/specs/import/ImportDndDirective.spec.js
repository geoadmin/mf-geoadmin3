/* eslint-disable max-len */
describe('ga_importdnd_directive', function() {

  describe('gaImportDnd', function() {

    var elt = {remove: function() {}}, scope, parentScope, $q, $rootScope, $compile, $timeout, gaFile, $httpBackend, $document, $window;

    var options = {
      handleFileContent: function() {
        return $q.when({});
      },
      isValidUrl: function(str) {
        return /http/.test(str);
      }
    };

    var loadDirective = function(options) {
      parentScope = $rootScope.$new();
      parentScope.options = options;
      var tpl = $('<div><div ga-import-dnd ga-import-dnd-options="options"></div></div>');
      elt = $compile(tpl)(parentScope).find('[ga-import-dnd]');
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
      $document = $injector.get('$document');
      $window = $injector.get('$window');
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
      expect(elt.find('div').length).to.be(1);
    });

    it('has good scope values', function() {
      loadDirective(options);
      expect(scope.options).to.be(options);
      expect(scope.handleFileContent).to.be(scope.options.handleFileContent);
    });

    describe('events on drop zone and document', function() {
      var emptyEvt;
      
      beforeEach(function() {
        loadDirective(options);
        $(document.body).append(elt);
        emptyEvt = {
          originalEvent: {
            dataTransfer: {}
          },
          stopPropagation: function() {},
          preventDefault: function() {}
        };
      });

      afterEach(function() {
        elt.remove();
      });

      it('hides the dropzone on click/dragleave/drop', function() {
        [
          'click',
          'dragleave',
          'drop'
        ].forEach(function(evt) {
          elt[0].style.display = 'block';
          expect(elt.css('display')).to.be('block');
          elt.trigger($.Event(evt, emptyEvt));
          expect(elt.css('display')).to.be('none');
        });
      });

      it('stops event on dragover/dragleave/drop', function() {
        var spy = sinon.spy(emptyEvt, 'stopPropagation');
        var spy2 = sinon.spy(emptyEvt, 'preventDefault');
        [
          'dragover',
          'dragleave',
          'drop'
        ].forEach(function(evt) {
          elt.trigger($.Event(evt, emptyEvt));
          expect(spy.callCount).to.be(1);
          expect(spy2.callCount).to.be(1);
          spy.resetHistory();
          spy2.resetHistory();
        });
      });

      it('displays the drop zone on dragenter event when the dragged objeczt is usable', function() {
        var spy = sinon.spy(emptyEvt, 'stopPropagation');
        var spy2 = sinon.spy(emptyEvt, 'preventDefault');
        
        // dont' display the drop zone because bad data are dragged
        $document.trigger($.Event('dragenter', emptyEvt));
        expect(elt.css('display')).to.be('none');
        expect(spy.callCount).to.be(1);
        expect(spy2.callCount).to.be(1);
         
        // display the drop zone because good and bad data are dragged
        emptyEvt.originalEvent.dataTransfer.types = [
          'xml',
          'files',
          'text/plain',
          'html'
        ];
        $document.trigger($.Event('dragenter', emptyEvt));
        expect(elt.css('display')).to.be('table');
        expect(spy.callCount).to.be(2);
        expect(spy2.callCount).to.be(2);
      });

      it('blocks dragging of all elements on dragstart', function() {
        expect($._data(document).events.dragstart[0].handler()).to.be(false);
      });


      it('removes events on scope destroy', function() {
        var evts = $._data(document).events;
        expect(evts.dragenter.length).to.be(1);
        expect(evts.dragstart.length).to.be(1);
        scope.$destroy();
        expect(evts.dragenter).to.be();
        expect(evts.dragstart).to.be();
      });

      it('doesn\'t read if no files or an empty files array is dropped', function() {
        var stub = sinon.stub(gaFile, 'read').returns($q.when());
        // No files
        emptyEvt.originalEvent.dataTransfer.files = undefined;
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.verifyNoPendingTasks();
        expect(stub.callCount).to.be(0);
        
        //Empty array
        emptyEvt.originalEvent.dataTransfer.files = [];
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.verifyNoPendingTasks();
        expect(stub.callCount).to.be(0);
      });

      it('reads a file dropped', function() {
        var file = {size: 34};
        var file2 = {size: 78};
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.files = [file, file2]
        var stub = sinon.stub(gaFile, 'read').withArgs(file).returns($q.when(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, file);
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.flush();
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
      });
 
      it('reads a valid url dropped', function() {
        var url = 'http://valid';
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.types = ['text/plain'];
        emptyEvt.originalEvent.dataTransfer.getData = function() {
          return url;
        }
        var stub = sinon.stub(gaFile, 'load').withArgs(url).returns($q.when(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: url
        });
        var stub3 = sinon.stub($window, 'alert').withArgs('invalid_urlnonvalid');
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.flush();
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
        expect(stub3.callCount).to.be(0);
        $window.alert.restore();
      });
      
      it('transforms the url before reading when a valid url is dropped', function() {
        var trsUrl = 'http://otherurl';
        scope.options.transformUrl = function() {
          return $q.when(trsUrl);
        };
        var url = 'http://valid';
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.types = ['text/plain'];
        emptyEvt.originalEvent.dataTransfer.getData = function() {
          return url;
        }
        var stub = sinon.stub(gaFile, 'load').withArgs(trsUrl).returns($q.when(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: trsUrl
        });
        var stub3 = sinon.stub($window, 'alert').withArgs('invalid_urlnonvalid');
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.flush();
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
        expect(stub3.callCount).to.be(0);
        $window.alert.restore();
        scope.options.transformUrl = undefined;
      });
      
      it('displays an alert message when a non valid url dropped', function() {
        var url = 'nonvalid';
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.types = ['text/plain'];
        emptyEvt.originalEvent.dataTransfer.getData = function() {
          return url;
        }
        var stub = sinon.stub(gaFile, 'load').withArgs(url).returns($q.when(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: url
        });
        var stub3 = sinon.stub($window, 'alert').withArgs('invalid_urlnonvalid');
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.verifyNoPendingTasks();
        expect(stub.callCount).to.be(0);
        expect(stub2.callCount).to.be(0);
        expect(stub3.callCount).to.be(1);
        $window.alert.restore();
      });
      
      it('displays an alert if something fails during reading of an url', function() {
        var url = 'http://valid';
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.types = ['text/plain'];
        emptyEvt.originalEvent.dataTransfer.getData = function() {
          return url;
        }
        var stub = sinon.stub(gaFile, 'load').withArgs(url).returns($q.reject({message: 'fail'}));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: url
        });
        var stub3 = sinon.stub($window, 'alert').withArgs('fail');
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.flush();
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(0);
        expect(stub3.callCount).to.be(1);
        $window.alert.restore();
      });
 
      it('displays an alert if something fails during parsing of an url', function() {
        var url = 'http://valid';
        var content = '<kml></kml>';
        emptyEvt.originalEvent.dataTransfer.types = ['text/plain'];
        emptyEvt.originalEvent.dataTransfer.getData = function() {
          return url;
        }
        var stub = sinon.stub(gaFile, 'load').withArgs(url).returns($q.resolve(content));
        var stub2 = sinon.stub(scope, 'handleFileContent').withArgs(content, {
          url: url
        }).returns($q.reject({message: 'fail2'}));
        var stub3 = sinon.stub($window, 'alert').withArgs('fail2');
        elt.trigger($.Event('drop', emptyEvt));
        $timeout.flush();
        expect(stub.callCount).to.be(1);
        expect(stub2.callCount).to.be(1);
        expect(stub3.callCount).to.be(1);
        $window.alert.restore();
      });
    });
  });
});
