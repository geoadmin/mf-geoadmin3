describe('ga_networkstatus_service', function() {

  describe('httpInterceptor', function() {
    var httpI, gaDebounce, gaNetworkStatus, $q, gaWaitCursor, $timeout;
    var url = 'http://dummy.ch';

    beforeEach(function() {
      inject(function($injector) {
         httpI = $injector.get('httpInterceptor');
         gaDebounce = $injector.get('gaDebounce');
         gaNetworkStatus = $injector.get('gaNetworkStatus');
         $q = $injector.get('$q');
         gaWaitCursor = $injector.get('gaWaitCursor');
         $http = $injector.get('$http');
         $httpBackend = $injector.get('$httpBackend');
         $timeout = $injector.get('$timeout');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('has been added to the interceptors list', function(done) {
      var spy = sinon.spy(httpI, 'request');
      $httpBackend.expectGET(url).respond({});
      $http.get(url).then(function(response) {
        expect(response.config).to.be.an(Object);
        expect(spy.callCount).to.be(1);
        done();
        spy.restore();
      });
      $httpBackend.flush();
    });

    it('overrides all the functions', function() {
      expect(httpI.request).to.be.a(Function);
      expect(httpI.requestError).to.be.a(Function);
      expect(httpI.response).to.be.a(Function);
      expect(httpI.responseError).to.be.a(Function);
    });

    describe('#request()', function() {

      it('intercepts a request', function() {
        var spy = sinon.spy(gaWaitCursor, 'increment');
        var config = {status: 200};
        var res = httpI.request(config);
        expect(res).to.be(config);
        expect(spy.callCount).to.be(1);
        spy.restore();
      });
    });

    describe('#requestError()', function() {

      it('intercepts a request error', function() {
        var spy = sinon.spy(gaWaitCursor, 'decrement');
        var p = httpI.requestError('404');
        expect(p).to.eql({'$$state': {status: 2, value: '404'}});
        expect(spy.callCount).to.be(1);
        spy.restore();
      });
    });

    describe('#response()', function() {

      it('intercepts a response', function() {
        var spy = sinon.spy(gaWaitCursor, 'decrement');
        var p = httpI.response('response');
        expect(p).to.eql('response');
        expect(spy.callCount).to.be(1);
        spy.restore();
      });
    });

    describe('#responseError()', function() {

      it('intercepts a response error', function() {
        var spyCheck = sinon.spy(gaNetworkStatus, 'check');
        var spy = sinon.spy(gaWaitCursor, 'decrement');
        var p = httpI.responseError('404');
        expect(p).to.eql({'$$state': {status: 2, value: '404'}});
        expect(spy.callCount).to.be(1);
        expect(spyCheck.callCount).to.be(0);
        $timeout.flush(3000);
        expect(spyCheck.callCount).to.be(1);
        spy.restore();
      });
    });
  });

  describe('gaNetworkStatus', function() {
    var $document, $rootScope, $window, gaBrowserSniffer, gaGlobalOptions,
        gaNetworkStatus, $timeout;
    var mock;

    var expectStatusChange = function(offline) {
      mock.expects('$broadcast').withExactArgs('gaNetworkStatusChange', offline);
      mock.expects('$digest').once();
    };


    var injectNs = function() {
      inject(function($injector) {
        $window = $injector.get('$window');
        $document = $injector.get('$document');
        $timeout = $injector.get('$timeout');
        $rootScope = $injector.get('$rootScope');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaNetworkStatus = $injector.get('gaNetworkStatus');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
      });

      mock = sinon.mock($rootScope);
    };

    describe('is not used on desktop', function() {
      var spy;

      beforeEach(function() {

        module(function($provide) {
          $provide.value('gaBrowserSniffer', {
            mobile: false
          });
        });
        spy = sinon.spy($, 'ajax');
        injectNs();
      });

      afterEach(function() {
        spy.restore();
      });

      it('does nothing', function() {
        expect(gaNetworkStatus.offline).to.be(false);
        expect(gaNetworkStatus.check).to.be.a(Function);
        gaNetworkStatus.check();
        expect(spy.callCount).to.be(0);
      });
    });

    describe('when it\'s online at start', function() {
      var spy, spyAjax;

      beforeEach(function() {

        module(function($provide) {
          $provide.value('gaBrowserSniffer', {
            mobile: true
          });
        });
        spyAjax = sinon.spy($, 'ajax');
        injectNs();
        spy = sinon.spy(gaNetworkStatus, 'check');
      });

      afterEach(function() {
        spyAjax.restore();
        spy.restore();
      });

      it('doesn\'t send a request at start', function() {
        expect(gaNetworkStatus.offline).to.be(false);
        expect(spyAjax.callCount).to.be(0);
      });

      it('checks status on applicationCache error event', function() {
        $window.applicationCache.dispatchEvent(new Event('error'));
        expect(spy.callCount).to.be(1);
      });

      it('checks status on window online event', function() {
        $window.dispatchEvent(new Event('online'));
        expect(spy.callCount).to.be(1);
      });

      it('changes status on window offline event', function() {
        expectStatusChange(true);
        $window.dispatchEvent(new Event('offline'));
        expect(spy.callCount).to.be(0);
        expect(gaNetworkStatus.offline).to.be(true);
        mock.verify();
      });

      it('catches ajax request error', function() {
        $document[0].dispatchEvent(new Event('ajaxError'));
        expect(spy.callCount).to.be(1);
      });
    });

    describe('when it\'s offline at start', function() {
      var spyAjax;

      beforeEach(function() {

        module(function($provide) {
          $provide.value('$window', {
            navigator: {
              onLine: false
            },
            addEventListener: function() {}
          });
          $provide.value('gaBrowserSniffer', {
            mobile: true
          });
        });
        spyAjax = sinon.spy($, 'ajax');
        injectNs();
      });

      afterEach(function() {
        spyAjax.restore();
      });

      it('sends a request to test the network', function() {
        expect(gaNetworkStatus.offline).to.be(true);
        expect(spyAjax.callCount).to.be(1);
      });
    });

    describe('#check()', function() {
      var spyAjax;

      beforeEach(function() {

        module(function($provide) {
          $provide.value('$window', {
            navigator: {
              onLine: false
            },
            addEventListener: function() {}
          });
          $provide.value('gaBrowserSniffer', {
            mobile: true
          });
        });
        spyAjax = sinon.spy($, 'ajax');
        injectNs();
      });

      afterEach(function() {
        spyAjax.restore();
      });

      it('sends a request to test the network', function() {
        gaNetworkStatus.check();
        var arg = spyAjax.args[0][0];
        expect(arg.method).to.be('GET');
        expect(arg.url).to.be('http://localhost:8081/checker');
        expect(arg.timeout).to.be(1000);
        expect(arg.success).to.be.a(Function);
        expect(arg.error).to.be.a(Function);
      });

      it('changes the status when the checker is reachable', function() {
        gaNetworkStatus.check();
        var arg = spyAjax.args[0][0];
        expectStatusChange(false);
        arg.success();
        mock.verify();
      });

      it('changes the status when the checker is not reachable 3 times', function() {
        gaNetworkStatus.check();
        gaNetworkStatus.offline = false;

        var arg = spyAjax.args[0][0];
        expectStatusChange(true);
        arg.error();
        arg.error();
        arg.error();
        mock.verify();
      });

      it('sends a request after a delay', function() {
        gaNetworkStatus.check(1000);
        expect(spyAjax.callCount).to.be(1);
        $timeout.flush(500);
        expect(spyAjax.callCount).to.be(1);
        $timeout.flush(500);
        expect(spyAjax.callCount).to.be(2);
      });

      it('cancels the first of 2 delayed calls', function() {
        expect(spyAjax.callCount).to.be(1);
        gaNetworkStatus.check(1000);
        $timeout.flush(500);
        expect(spyAjax.callCount).to.be(1);
        gaNetworkStatus.check(1000);
        $timeout.flush(1000);
        expect(spyAjax.callCount).to.be(2);
      });
    });
  });
});
