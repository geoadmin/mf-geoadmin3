/* eslint-disable max-len */
describe('ga_height_service', function() {

  describe('gaHeight', function() {
    var gaHeight, $httpBackend, $rootScope, map, $timeout, $q;
    var req = 'http://api3.geo.admin.ch/rest/services/height?easting=2100000&elevation_model=COMB&northing=1200000&sr=2056';

    beforeEach(function() {

      inject(function($injector, gaGlobalOptions) {
        gaHeight = $injector.get('gaHeight');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
        $q = $injector.get('$q');
      });

      map = new ol.Map({
        view: new ol.View({
          projection: ol.proj.get('EPSG:2056')
        })
      });
      map.setSize([600, 300]);
      map.getView().fit([-20000000, -20000000, 20000000, 20000000]);
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

    describe('#get()', function() {

      describe('fails', function() {
        var expectErr = function(msg, done) {
          expect(msg).to.eql('Missing required parameters');
          done();
        };

        it('if parameters are not defined', function(done) {
          gaHeight.get().catch(function(msg) {
            expectErr(msg, done);
          });
          $rootScope.$digest();
        });

        it('if map parameter is not defined', function(done) {
          gaHeight.get(null, [0, 0]).catch(function(msg) {
            expectErr(msg, done);
          });
          $rootScope.$digest();
        });

        it('if coord parameter is not defined', function(done) {
          gaHeight.get(map, null).catch(function(msg) {
            expectErr(msg, done);
          });
          $rootScope.$digest();
        });

        it('rejects the promise', function(done) {
          $httpBackend.expectGET(req).respond(404, '');
          gaHeight.get(map, [2100000, 1200000]).then(null, function() {
            done();
          });
          $httpBackend.flush();
        });
      });

      it('sends request with all parameters', function(done) {
        $httpBackend.expectGET(req).respond({height: '300.0'});
        gaHeight.get(map, [2100000, 1200000]).then(function(height) {
          expect(height).to.be(300);
          done();
        });
        $httpBackend.flush();
      });

      it('caches the request', function(done) {
        $httpBackend.expectGET(req).respond({height: '300.0'});
        gaHeight.get(map, [2100000, 1200000]).then(function(height) {
          expect(height).to.be(300);
          gaHeight.get(map, [2100000, 1200000]).then(function(height) {
            done();
          });
        });
        $httpBackend.flush();
      });

      it('cancels the request', function(done) {
        $httpBackend.expectGET(req).respond({height: '300.0'});
        var canceler = $q.defer();
        gaHeight.get(map, [2100000, 1200000], canceler.promise).then(null, function() {
          done();
        });
        canceler.resolve();
        $rootScope.$digest();
      });
    });
  });
});
