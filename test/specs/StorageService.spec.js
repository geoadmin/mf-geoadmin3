describe('ga_storage_service', function() {

  describe('gaStorage', function() {
    var gaStorage, $window, gaBrowserSniffer, $q, $rootScope;
    var base64 = 'data:image/gif;base64,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';

    var injectSt = function() {
      inject(function($injector) {
        $window = $injector.get('$window');
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaStorage = $injector.get('gaStorage');
      });
    };

    describe('localStorage is not supported', function() {
      beforeEach(function() {

        module(function($provide) {
          $provide.value('$window', {
            localStorage: undefined
          });

          $provide.value('gaBrowserSniffer', {});
        });

        injectSt();
      });

      it('creates empty functions', function() {
        expect(gaStorage.getItem).to.be(angular.noop);
        expect(gaStorage.setItem).to.be(angular.noop);
        expect(gaStorage.removeItem).to.be(angular.noop);
      });
    });

    describe('on desktop', function() {
      beforeEach(function() {

        module(function($provide) {
          $provide.value('gaBrowserSniffer', {
            mobile: false
          });
        });

        injectSt();
      });

      describe('#init()', function() {

        it('doesn\'t inititalize', function() {
          var spy = sinon.spy($window.localforage, 'config');
          gaStorage.init();
          expect(spy.called).to.be(false);
          spy.restore();
        });
      });
    });

   describe('on mobile', function() {

      beforeEach(function() {
        module(function($provide) {
          $provide.value('gaBrowserSniffer', {
            mobile: true
          });
        });

        injectSt();
      });

     describe('#init()', function() {

        it('initializes localforage db', function() {
          var spy = sinon.spy($window.localforage, 'config');
          gaStorage.init();
          expect(spy.calledOnce).to.be(true);
          var arg = spy.firstCall.args[0];
          expect(arg.name).to.be('map.geo.admin.ch');
          expect(arg.storeName).to.be('ga');
          expect(arg.size).to.be(52377600);
          expect(arg.version).to.be('1.0');
          expect(arg.description).to.be('Storage for map.geo.admin.ch');
          spy.restore();
        });

        it('initializes localforage db for ie', function() {
          gaBrowserSniffer.msie = 9;
          var spy = sinon.spy($window.localforage, 'config');
          gaStorage.init();
          expect(spy.calledOnce).to.be(true);
          expect(spy.firstCall.args[0].version).to.be(1);
          spy.restore();
        });

        it('initializes only one time', function() {
          gaBrowserSniffer.msie = 9;
          var spy = sinon.spy($window.localforage, 'config');
          gaStorage.init();
          gaStorage.init();
          expect(spy.calledOnce).to.be(true);
          spy.restore();
        });
      });

      describe('#getItem()', function() {

        it('gets an item from localStorage', function() {
          var spy = sinon.spy($window.localStorage, 'getItem');
          gaStorage.setItem('key', 'test');
          expect(gaStorage.getItem('key')).to.be('test');
          expect(spy.calledWithExactly('key'));
          spy.restore();
        });

        it('returns a boolean if the string value returned is true or false', function() {
          gaStorage.setItem('key', true);
          expect(gaStorage.getItem('key')).to.be(true);
          gaStorage.setItem('key', false);
          expect(gaStorage.getItem('key')).to.be(false);
          gaStorage.setItem('key', 'True');
          expect(gaStorage.getItem('key')).to.be(true);
          gaStorage.setItem('key', 'foo');
          expect(gaStorage.getItem('key')).to.be('foo');
        });

        it('returns a string even if the value is a boolean', function() {
          var spy = sinon.spy($window.localStorage, 'getItem');
          gaStorage.setItem('key', 'true');
          expect(gaStorage.getItem('key', String)).to.eql(new String(true));
          expect(spy.calledWithExactly('key'));
          spy.restore();
        });
      });

      describe('#setItem()', function() {

        it('sets an item in localStorage', function() {
          var spy = sinon.spy($window.localStorage, 'setItem');
          gaStorage.setItem('key', 'test');
          expect(spy.calledWithExactly('key', 'test'));
          expect(gaStorage.getItem('key')).to.be('test');
          spy.restore();
        });
      });

      describe('#removeItem()', function() {

        it('removes an item in localStorage', function() {
          var spy = sinon.spy($window.localStorage, 'removeItem');
          gaStorage.setItem('key', 'test');
          expect(gaStorage.getItem('key')).to.be('test');
          gaStorage.removeItem('key');
          expect(spy.calledWithExactly('key'));
          expect(gaStorage.getItem('key')).to.be(null);
          spy.restore();
        });
      });

      describe('#getTile()', function() {
        var stub;

        beforeEach(function() {
          stub = sinon.stub($window.localforage, 'getItem');
        });

        afterEach(function() {
          stub.restore();
        });

        it('resolves the promise directly if the db is not initialized', function(done) {
          gaStorage.getTile('key').then(function() {
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(false);
        });

        it('gets no data from db and rejects the promise', function(done) {
          stub.rejects('TypeError');
          gaStorage.init();
          gaStorage.getTile('key').catch(function(err) {
            expect(err).to.eql({name: 'TypeError'});
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
          expect(stub.firstCall.args[0]).to.be('key');
        });

        it('gets data from db and resolves the promise', function(done) {
          stub.resolves(base64);
          gaStorage.init();
          gaStorage.getTile('key').then(function(arg1) {
            expect(arg1).to.be(base64);
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
          expect(stub.firstCall.args[0]).to.be('key');
        });
      });

      describe('#setTile()', function() {
        var stub;

        beforeEach(function() {
          stub = sinon.stub($window.localforage, 'setItem');
        });

        afterEach(function() {
          stub.restore();
        });

        it('compresses then adds data to the storage', function(done) {
          stub.resolves(base64);
          gaStorage.setTile('key', base64).then(function(data) {
            expect(data).to.be(base64);
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
          expect(stub.firstCall.args[0]).to.be('key');
          expect(stub.firstCall.args[1].indexOf(String.fromCharCode(9731))).to.be(0);
        });

        it('fails to adds data to the storage', function(done) {
          stub.rejects('TypeError');
          gaStorage.setTile('key', base64).catch(function(err) {
            expect(err).to.eql({name: 'TypeError'});
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
          expect(stub.firstCall.args[0]).to.be('key');
          expect(stub.firstCall.args[1].indexOf(String.fromCharCode(9731))).to.be(0);
        });
      });

      describe('#clearTiles()', function() {
        var stub;

        beforeEach(function() {
          stub = sinon.stub($window.localforage, 'clear');
        });

        afterEach(function() {
          stub.restore();
        });

        it('cleans the db', function(done) {
          stub.resolves();
          gaStorage.clearTiles().then(function() {
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
        });

        it('fails to clean the db', function(done) {
          stub.rejects('TypeError');
          gaStorage.clearTiles().catch(function(err) {
            expect(err).to.eql({name: 'TypeError'});
            done();
          });
          $rootScope.$apply();
          expect(stub.calledOnce).to.be(true);
        });
      });
    });
  });
});
