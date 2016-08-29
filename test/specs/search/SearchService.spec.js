describe('ga_search_service', function() {

  describe('gaSearchGetcoordinate', function() {
    var extent = [420000, 30000, 900000, 350000];
    var getCoordinate;

    beforeEach(function() {
      inject(function($injector) {
        getCoordinate = $injector.get('gaSearchGetCoordinate');
      });
    });

    it('supports CH1903 coordinate', function() {
      expect(getCoordinate(extent, '600000 200000')).to.eql([600000, 200000]);
    });

    it('separated by comma', function() {
      expect(getCoordinate(extent, '600000,200000')).to.eql([600000, 200000]);
    });

    it('containing apostrphoe CH1903 coordinate', function() {
      expect(getCoordinate(extent, '600\'000.12 200\'000.23')).to.eql([600000.12, 200000.23]);
    });

    it('supports CH1903+ coordinate', function() {
      expect(getCoordinate(extent, '2600000 1200000')).to.eql([600000, 200000]);
    });

    it('old school CH1903 coordinate', function() {
      expect(getCoordinate(extent, '600 123 200 345')).to.eql([600123, 200345]);
    });

    it('old school CH1903+ coordinate', function() {
      expect(getCoordinate(extent, '2600 987.2 1200 556.5')).to.eql([600987.2, 200556.5]);
    });

    it('supports latitude and longitude as decimal', function() {
      expect(getCoordinate(extent, '6.96948 46.9712')).to.eql([564298.937, 202343.701]);
      expect(getCoordinate(extent, '46.9712 6.96948')).to.eql([564298.937, 202343.701]);
    });

    it('supports latitude and longitude as DMS', function() {
      expect(getCoordinate(extent, '7° E 46° N')).to.eql([566016.05, 94366.859]);
      expect(getCoordinate(extent, '7° 1\' E 46° N')).to.eql([567307.273, 94359.756]);
      expect(getCoordinate(extent, '7° 1\' 25.0\'\' E 46° N')).to.eql([567845.283, 94356.877]);
      expect(getCoordinate(extent, '7° 1\' 25.0\'\' E 46° 1\' N')).to.eql([567855.114, 96209.641]);
      expect(getCoordinate(extent, '7° 1\' 25.0\'\' E 46° 1\' 25.0\'\' N')).to.eql([567859.21, 96981.625]);
      expect(getCoordinate(extent, '46° 1\' 25.0\'\' N 7° 1\' 25.0\'\' E')).to.eql([567859.21, 96981.625]);
    });

    it('checks the swiss extent', function() {
      expect(getCoordinate(extent, '1600000 1200000')).to.be(undefined);
      expect(getCoordinate(extent, '10° E 50° N')).to.be(undefined);
    });

    it('works only in north east', function() {
      expect(getCoordinate(extent, '10° W 50° N')).to.be(undefined);
      expect(getCoordinate(extent, '10° W 50° S')).to.be(undefined);
      expect(getCoordinate(extent, '10° E 50° S')).to.be(undefined);
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
        var testString = '';
        var res = labelsService.highlight('', 'something');
        expect(res).to.eql('');
        res = labelsService.highlight('tt aa ww', '');
        expect(res).to.eql('tt aa ww');
      });

      it('Special words', function() {
        var testString = 'Das ist ein Span und class teststring';
        var res = labelsService.highlight(testString, 'span');
        expect(res).to.eql('Das ist ein <span class="ga-search-highlight">Span</span> und class teststring');
        var res = labelsService.highlight(testString, 'Class');
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
    var testQuery;
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
        //A complete toke is of the form 'token: value'
        //Multiple spaces between colon and value are allowed
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
