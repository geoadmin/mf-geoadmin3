describe('ga_reframe_service', function() {
  var $rootScope, $httpBackend, $q, gaReframe, lv03tolv95Url, lv95tolv03Url;

  var buildUrl = function(baseUrl, coords) {
    return baseUrl + '?easting=' + coords[0] + '&northing=' + coords[1];
  };

  describe('gaReframeService', function() {

    beforeEach(function() {
      inject(function($injector, gaGlobalOptions) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        gaReframe = $injector.get('gaReframe');
        lv03tolv95Url = gaGlobalOptions.lv03tolv95Url;
        lv95tolv03Url = gaGlobalOptions.lv95tolv03Url;
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('transforms coordinates using the reframe service from LV03 to LV95',
        function(done) {
      var coordinates = [620116.6, 142771.3];
      var url = buildUrl(lv03tolv95Url, coordinates);
      var response = [2620116.600000524, 1142771.299843073];
      $httpBackend.expectGET(url).respond({ c: response });

      gaReframe.get03To95(coordinates).then(function(coords) {
        expect(coords).to.eql(response.c);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });

    it('transforms coordinates using the reframe service from LV95 to LV03',
        function(done) {
      var coordinates = [2620116.600000524, 1142771.299843073];
      var url = buildUrl(lv95tolv03Url, coordinates);
      var response = [620116.600001048, 142771.2996861463];
      $httpBackend.expectGET(url).respond({ c: response });

      gaReframe.get95To03(coordinates).then(function(coords) {
        expect(coords).to.eql(response.c);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });

    it('falls back on proj4js on error for LV03 to LV95', function(done) {
      var coordinates = [620116.6, 142771.3];
      var url = buildUrl(lv03tolv95Url, coordinates);
      $httpBackend.expectGET(url).respond(404);

      gaReframe.get03To95(coordinates).then(function(coords) {
        expect(coords).to.eql([2620116.600000524, 1142771.299843073]);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });

    it('falls back on proj4js on error for LV95 to LV03', function(done) {
      var coordinates = [2620116.600000524, 1142771.299843073];
      var url = buildUrl(lv95tolv03Url, coordinates);
      $httpBackend.expectGET(url).respond(404);

      gaReframe.get95To03(coordinates).then(function(coords) {
        expect(coords).to.eql([620116.600001048, 142771.2996861463]);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });

    it('can cancel an lv95 to lv03 request via the timeout parameter', function(done) {
      var coordinates = [2620116.600000524, 1142771.299843073];
      var url = buildUrl(lv95tolv03Url, coordinates);
      $httpBackend.expectGET(url).respond(200);
      var canceler = $q.defer();
      gaReframe.get95To03(coordinates, canceler.promise).then(angular.noop, function() {
        done();
      });
      canceler.resolve();
      $rootScope.$digest();
    });

    it('can cancel an lv03 to lv95 request via the timeout parameter', function(done) {
      var coordinates = [2620116.600000524, 1142771.299843073];
      var url = buildUrl(lv03tolv95Url, coordinates);
      $httpBackend.expectGET(url).respond(200);
      var canceler = $q.defer();
      gaReframe.get03To95(coordinates, canceler.promise).then(angular.noop, function() {
        done();
      });
      canceler.resolve();
      $rootScope.$digest();
    });
  });
});
