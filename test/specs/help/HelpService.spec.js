describe('ga_help_service', function() {

  describe('gaHelp', function() {
    var gaHelp, $httpBackend, gaLang, $rootScope;
    var url = 'https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyDT7wmEx97gAG5OnPwKyz2PnCx3yT4j7C0&sql=select+*+from+1Tx2VSM1WHZfDXzf8rweRLG1kd23AA4aw8xnZ_3c+where+col0%3D31+and+col5%3D{lang}&callback=JSON_CALLBACK';
    var frUrl = url.replace('{lang}', '\'fr\'');
    var deUrl = url.replace('{lang}', '\'de\'');

    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaLang', {
          get: function() {
            return 'fr';
          },
          getNoRm: function() {
            return 'fr';
          }
        });
      });

      inject(function($injector) {
        gaHelp = $injector.get('gaHelp');
        gaLang = $injector.get('gaLang');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#get()', function() {

      it('gets help from id', function(done) {
        $httpBackend.expectJSONP(frUrl).respond({columns: [], rows: []});

        gaHelp.get('31').then(function(data) {
          expect(data.columns).to.be.an(Array);
          expect(data.rows).to.be.an(Array);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('gets help from cache the 2nd time', function(done) {
        $httpBackend.expectJSONP(frUrl).respond({columns: [], rows: []});
        gaHelp.get('31');
        $httpBackend.flush();
        $rootScope.$digest();

        gaHelp.get('31').then(function(data) {
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });

      it('gets help in de when lang is rm', function(done) {
        gaLang.getNoRm = function() { return 'de'; };
        $httpBackend.expectJSONP(deUrl).respond({columns: [], rows: []});
        gaHelp.get('31').then(function() {
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
    });
  });
});
