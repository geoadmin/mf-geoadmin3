/* eslint-disable max-len */
describe('ga_search_service', function() {

  describe('gaSearchGetcoordinate', function() {
    var extent = [2420000, 1030000, 2900000, 1350000];
    var $timeout, $rootScope, $httpBackend, $q, getCoordinate, gaReframe;

    beforeEach(function() {
      inject(function($injector, gaGlobalOptions) {
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        getCoordinate = $injector.get('gaSearchGetCoordinate');
        gaReframe = $injector.get('gaReframe');
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

    describe('supports EPSG:2056 coordinate', function() {
      var coord2056 = [2600123.12, 1200345];
      var spy;

      beforeEach(function() {
        spy = sinon.stub(gaReframe, 'get03To95');
      });

      it('without separator', function(done) {
        getCoordinate(extent, '2600123.12 1200345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(0);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by comma', function(done) {
        getCoordinate(extent, '2600123.12,1200345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(0);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by apostrophe', function(done) {
        getCoordinate(extent, '2\'600\'123.12 1\'200\'345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(0);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by spaces', function(done) {
        getCoordinate(extent, '2600 123.12 1200 345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(0);
          done();
        });
        $rootScope.$digest();
      });

      it('returns undefined if outside EPSG:2056 extent', function(done) {
        spy.returns($q.when([2600000, 1020000]));
        getCoordinate(extent, '600000 20000').then(function(position) {
          expect(position).to.be();
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('supports EPSG:21781 coordinate', function() {
      var coord21781 = [600123.12, 200345];
      var coord2056 = [2600123.12, 1200345];
      var spy;

      beforeEach(function() {
        spy = sinon.stub(gaReframe, 'get03To95').withArgs(coord21781).resolves(coord2056);
      });

      it('without separator', function(done) {
        getCoordinate(extent, '600123.12 200345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(1);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by comma', function(done) {
        getCoordinate(extent, '600123.12,200345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(1);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by apostrophe', function(done) {
        getCoordinate(extent, '600\'123.12 200\'345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(1);
          done();
        });
        $rootScope.$digest();
      });

      it('separated by spaces', function(done) {
        getCoordinate(extent, '600 123.12 200 345').then(function(position) {
          expect(position).to.eql(coord2056);
          expect(spy.callCount).to.eql(1);
          done();
        });
        $rootScope.$digest();
      });

      it('returns undefined if outside EPSG:2056 extent', function(done) {
        gaReframe.get03To95.restore();
        spy = sinon.stub(gaReframe, 'get03To95').withArgs([600000, 20000]).resolves([2600000, 1020000]);
        getCoordinate(extent, '600000 20000').then(function(position) {
          expect(position).to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });
    });

    it('supports latitude and longitude as decimal (lon/lat)', function(done) {
      getCoordinate(extent, '6.96948 46.9712').then(function(position) {
        expect(position).to.eql([2564298.937, 1202343.701]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as decimal (lat/lon)', function(done) {
      getCoordinate(extent, '46.9712 6.96948').then(function(position) {
        expect(position).to.eql([2564298.937, 1202343.701]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test D,D)', function(done) {
      getCoordinate(extent, '7° E 46° N').then(function(position) {
        expect(position).to.eql([2566016.05, 1094366.859]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test DM,D)', function(done) {
      getCoordinate(extent, '7° 1\' E 46° N').then(function(position) {
        expect(position).to.eql([2567307.273, 1094359.756]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test DMS,D)', function(done) {
      getCoordinate(extent, '7° 1\' 25.0\'\' E 46° N').then(function(position) {
        expect(position).to.eql([2567845.283, 1094356.877]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test DMS,DM)', function(done) {
      getCoordinate(extent, '7° 1\' 25.0\'\' E 46° 1\' N').then(function(position) {
        expect(position).to.eql([2567855.114, 1096209.641]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test DMS,DM)', function(done) {
      getCoordinate(extent, '7° 1\' 25.0\'\' E 46° 1\' 25.0\'\' N').then(function(position) {
        expect(position).to.eql([2567859.21, 1096981.625]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports latitude and longitude as DMS (test DMS,DMS)', function(done) {
      getCoordinate(extent, '46° 1\' 25.0\'\' N 7° 1\' 25.0\'\' E').then(function(position) {
        expect(position).to.eql([2567859.21, 1096981.625]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports MGRS and USGS grid 32TLT8100', function(done) {
      getCoordinate(extent, '32TLT8100').then(function(position) {
        expect(position).to.eql([2600319.427, 1199594.862]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports MGRS and USGS grid 32TLT 8 0', function(done) {
      getCoordinate(extent, '32TLT 81 00').then(function(position) {
        expect(position).to.eql([2600319.427, 1199594.862]);
        done();
      });
      $rootScope.$digest();
    });

    it('supports MGRS and USGS grid 32TLT', function(done) {
      getCoordinate(extent, '32TLT').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });

    it('checks the swiss extent WGS84 DMS', function(done) {
      getCoordinate(extent, '10° E 50° N').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });

    it('checks the swiss extent MGRS', function(done) {
      getCoordinate(extent, '16SGL01948253 ').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });

    it('works only in north east (test north west)', function(done) {
      getCoordinate(extent, '10° W 50° N').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });

    it('works only in north east (test south west)', function(done) {
      getCoordinate(extent, '10° W 50° S').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });

    it('works only in north east (test south east)', function(done) {
      getCoordinate(extent, '10° E 50° S').then(function(position) {
        expect(position).to.be(undefined);
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('gaSearchLabels', function() {
    var labelsService;

    beforeEach(function() {
      inject(function($injector) {
        labelsService = $injector.get('gaSearchLabels');
      });
    });

    describe('#highlight()', function() {

      it('Empty Strings', function() {
        var res = labelsService.highlight('', 'something');
        expect(res).to.eql('');
        res = labelsService.highlight('tt aa ww', '');
        expect(res).to.eql('tt aa ww');
      });

      it('Special words', function() {
        var testString = 'Das ist ein Span und class teststring';
        var res = labelsService.highlight(testString, 'span');
        expect(res).to.eql('Das ist ein <span class="ga-search-highlight">Span</span> und class teststring');
        res = labelsService.highlight(testString, 'Class');
        expect(res).to.eql('Das ist ein Span und <span class="ga-search-highlight">class</span> teststring');
      });

      it('Single Replacement', function() {
        var testString = 'Das ist ein Test, um <b>fettes</b> zu';
        var cl = 'ga-search-highlight';
        var res = labelsService.highlight(testString, 'ist', cl);
        expect(res).to.eql('Das <span class="' + cl + '">ist</span> ein Test, um <b>fettes</b> zu');
        res = labelsService.highlight(testString, 'test', cl);
        expect(res).to.eql('Das ist ein <span class="' + cl + '">Test</span>, um <b>fettes</b> zu');
      });

      it('Multi Replacement', function() {
        var testString = 'Das da ist das';
        var res = labelsService.highlight(testString, 'das');
        expect(res).to.eql('<span class="ga-search-highlight">Das</span> da ist <span class="ga-search-highlight">das</span>');
      });

      it('Multiple Words', function() {
        var testString = 'Wollen wir das heute?';
        var res = labelsService.highlight(testString, 'wir heute');
        expect(res).to.eql('Wollen <span class="ga-search-highlight">wir</span> das <span class="ga-search-highlight">heute</span>?');
      });

      it('Do Not highlight bold tags', function() {
        var testString = 'Was <b> ist das bloss </b> oder';
        var res = labelsService.highlight(testString, 'b');
        expect(res).to.eql('Was <b> ist das <span class="ga-search-highlight">b</span>loss </b> oder');
        res = labelsService.highlight(testString, '<b');
        expect(res).to.eql('Was <b> ist das bloss </b> oder');
        res = labelsService.highlight(testString, '<b>');
        expect(res).to.eql('Was <b> ist das bloss </b> oder');
        res = labelsService.highlight(testString, '/b');
        expect(res).to.eql('Was <b> ist das bloss </b> oder');
        res = labelsService.highlight(testString, '</b>');
        expect(res).to.eql('Was <b> ist das bloss </b> oder');
      });

      it('Should ignore regexp special characters', function() {
        var testString = 'Das sin.d ein * pa*r ^reg$exp charachters';
        var res = labelsService.highlight(testString, 'dummy');
        expect(res).to.eql('Das sin.d ein * pa*r ^reg$exp charachters');
        res = labelsService.highlight(testString, 'pa*r');
        expect(res).to.eql('Das sin.d ein * <span class="ga-search-highlight">pa*r</span> ^reg$exp charachters');
        res = labelsService.highlight(testString, '.');
        expect(res).to.eql('Das sin<span class="ga-search-highlight">.</span>d ein * pa*r ^reg$exp charachters');
      });

      it('Should correctly highlight border cases', function() {
        var testString = 'Dast <b>ist</b> ein Test';
        var res = labelsService.highlight(testString, 'ist');
        expect(res).to.eql('Dast <b><span class="ga-search-highlight">ist</span></b> ein Test');
        testString = 'Dast <b>ist </b> ein Test';
        res = labelsService.highlight(testString, 'ist');
        expect(res).to.eql('Dast <b><span class="ga-search-highlight">ist</span> </b> ein Test');
        testString = 'Dast <b> ist</b> ein Test';
        res = labelsService.highlight(testString, 'ist');
        expect(res).to.eql('Dast <b> <span class="ga-search-highlight">ist</span></b> ein Test');
        testString = 'Dast <b><</b> ein Test';
        res = labelsService.highlight(testString, '<');
        expect(res).to.eql('Dast <b><span class="ga-search-highlight"><</span></b> ein Test');
        testString = 'Dast <b>></b> ein Test';
        res = labelsService.highlight(testString, '>');
        expect(res).to.eql('Dast <b><span class="ga-search-highlight">></span></b> ein Test');
      });
    });

    describe('#cleanLabel()', function() {
      it('cleans label', function() {
        var testString = 'test<b>test</b>test<i>test</i>test<b></b><i></i><B></B><I></I>';
        expect(labelsService.cleanLabel(testString)).to.be('testtesttesttesttest');
      });
    });
  });

  describe('gaSearchTokenAnalyser', function() {

    var tokenAnalyser;
    var res;

    beforeEach(function() {
      inject(function($injector) {
        tokenAnalyser = $injector.get('gaSearchTokenAnalyser');
      });
    });

    describe('#run()', function() {
      it('Empty Strings', function() {
        res = tokenAnalyser.run('');
        expect(res.query).to.eql('');
        expect(res.parameters.length).to.eql(0);
      });

      it('No token', function() {
        res = tokenAnalyser.run('dummy');
        expect(res.query).to.eql('dummy');
        expect(res.parameters.length).to.eql(0);
      });

      it('Incomplete Token', function() {
        // A complete toke is of the form 'token: value'
        // Multiple spaces between colon and value are allowed
        res = tokenAnalyser.run('dummy limit:  ');
        expect(res.query).to.eql('dummy limit:  ');
        expect(res.parameters.length).to.eql(0);
      });

      it('Token at start', function() {
        res = tokenAnalyser.run('limit: 1');
        expect(res.query).to.eql('');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1');
        // add some spaces
        res = tokenAnalyser.run(' limit:  1q ');
        expect(res.query).to.eql(' ');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1q');
        // add query
        res = tokenAnalyser.run(' limit:  1 myquery');
        expect(res.query).to.eql(' myquery');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1');
      });

      it('Token at end', function() {
        res = tokenAnalyser.run('text limit:  1q');
        expect(res.query).to.eql('text');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1q');

        res = tokenAnalyser.run('text limit:  1q ');
        expect(res.query).to.eql('text ');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1q');

      });

      it('Token in the middle', function() {
        res = tokenAnalyser.run('text limit:  1q has');
        expect(res.query).to.eql('text has');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1q');

        res = tokenAnalyser.run('text  limit:  1q  has');
        expect(res.query).to.eql('text  has');
        expect(res.parameters.length).to.eql(1);
        expect(res.parameters[0]).to.eql('limit=1q');

      });

      it('Multiple Tokens', function() {
        res = tokenAnalyser.run('limit: sd origins: 44');
        expect(res.query).to.eql('');
        expect(res.parameters.length).to.eql(2);
        expect(res.parameters[0]).to.eql('limit=sd');
        expect(res.parameters[1]).to.eql('origins=44');

        res = tokenAnalyser.run('origins: 44 limit: sd');
        expect(res.query).to.eql('');
        expect(res.parameters.length).to.eql(2);
        expect(res.parameters[0]).to.eql('limit=sd');
        expect(res.parameters[1]).to.eql('origins=44');

        res = tokenAnalyser.run('origins: 44 query text limit: sd then this');
        expect(res.query).to.eql(' query text then this');
        expect(res.parameters.length).to.eql(2);
        expect(res.parameters[0]).to.eql('limit=sd');
        expect(res.parameters[1]).to.eql('origins=44');
      });
    });
  });
});
