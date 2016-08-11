describe('ga_what3words', function() {

  var gaWhat3Words;

  describe('does not send requests', function() {
    beforeEach(function() {
      inject(function($injector) {
        gaWhat3Words = $injector.get('gaWhat3Words');
      });
    });

    it('if w3w string is emoty', function() {
      res = gaWhat3Words.getCoordinate('');
      expect(res).to.eql(null);
    });

    it('if w3w string is not valid', function() {
      res = gaWhat3Words.getCoordinate('dummy');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate('dummy.wer.D');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate('.dummy.w.w');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate(' dummy.w.wd');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate('dummy.w.w.');
      expect(res).to.eql(null);
      // at least 3 charachters
      res = gaWhat3Words.getCoordinate('dummy.we.wewerw');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate('du.wesd.wewerw');
      expect(res).to.eql(null);
      res = gaWhat3Words.getCoordinate('dummy.wasdfe.we');
      expect(res).to.eql(null);

    });


  });
  describe('send requests', function() {

    var $httpBackend, $rootScope;
    var testUrl = 'dummy.test.url.com/v2/forward?addr=first.c%C3%B6rrect.t%C3%A8st&key=testkey';

    beforeEach(function() {

      module(function($provide) {
        $provide.value('gaTopic', {
          get: function() {}
        });
        $provide.value('gaLang', {
          get: function() {
            return 'custom';
          }
        });
      });

      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaWhat3Words = $injector.get('gaWhat3Words');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('gets coordinates', function(done) {
      $httpBackend.expectGET(testUrl).respond({geometry: {lat: 51.484463, lng: -0.195405}});
      var res = gaWhat3Words.getCoordinate('first.cörrect.tèst').then(function(resp) {
        expect(resp.data.geometry.lat).to.eql(51.484463);
        expect(resp.data.geometry.lng).to.eql(-0.195405);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });
  });
});
