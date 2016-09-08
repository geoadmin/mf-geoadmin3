describe('ga_profile_service', function() {
  var gaProfile, gaUrlUtils, $rootScope, $httpBackend, gaTimeFormat, $timeout, gaGlobalOptions;

  beforeEach(function() {

    inject(function($injector) {
      gaProfile = $injector.get('gaProfile');
      gaUrlUtils = $injector.get('gaUrlUtils');
      gaTimeFormat = $injector.get('gaTimeFormatFilter');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('gaTimeFormat', function() {

    it('formats minutes into a human readable text', function() {
      expect(gaTimeFormat('foo')).to.be('-');
      expect(gaTimeFormat('123')).to.be('-');
      expect(gaTimeFormat(-78545)).to.be('-');
      expect(gaTimeFormat(0)).to.be('0min');
      expect(gaTimeFormat(49)).to.be('49min');
      expect(gaTimeFormat(60)).to.be('1h');
      expect(gaTimeFormat(652)).to.be('10h 52min');
      expect(gaTimeFormat(123)).to.be('2h 3min');
    });
  });

  describe('gaProfile', function() {
    var profileUrl = 'http://api3.geo.admin.ch/rest/services/profile.json';
    var goodCoords = [[0, 0], [1, 0], [1, 1]];
    var goodResult = [
      {dist: 0.0, alts: {COMB: 429.8}, easting: 592000.0, northing: 221750.0, domainDist: 0},
      {dist: 211.5, alts: {COMB: 429.7}, easting: 592177.5, northing: 221865.0, domainDist: 211.5}
    ];
    var goodResultDistKm = [
      {dist: 0.0, alts: {COMB: 0}, easting: 592000.0, northing: 221750.0, domainDist: 0},
      {dist: 22211.5, alts: {COMB: 1457}, easting: 592177.5, northing: 221865, domainDist: 22.2115}
    ];

    var feature = new ol.Feature(new ol.geom.LineString(goodCoords));

    var goodCoords2 = [[0, 0], [10000, 0], [1000, 1000]];
    var goodResultToFormat = [
      {dist: 0.0, alts: {}, easting: 592000.0, northing: 221750.0, domainDist: 0},
      {dist: 211.5, alts: {COMB: 1457}, easting: 592177.5, northing: 221865.0, domainDist: 211.5}
    ];
    var goodResultFormatted = [
      {dist: 0, alts: {COMB: 0}, easting: 592000, northing: 221750, domainDist: 0},
      {dist: 211.5, alts: {COMB: 1457}, easting: 592177.5, northing: 221865, domainDist: 211.5}
    ];
    var feature2 = new ol.Feature(new ol.geom.LineString(goodCoords2));

    var emptyData = [{alts: {}, dist: 0, domainDist: 0}];
    emptyData[0].alts['COMB'] = 0;

    describe('create', function() {

      it('creates an empty chart when no parameters defined', function(done) {
        var spy = sinon.spy($, 'getScript');
        gaProfile.create().then(function(profile) {
          expect(profile).to.be.an(Object);
          expect(profile.create).to.be.a(Function);
          expect(profile.update).to.be.a(Function);
          expect(profile.data).to.eql(emptyData);
          expect(spy.callCount).to.be(0);
          expect(profile.elevDiff()).to.be(0);
          expect(profile.twoElevDiff()).to.eql([0, 0]);
          expect(profile.slopeDistance()).to.be(0);
          expect(profile.elPoints()).to.eql([0, 0]);
          expect(profile.distance()).to.be(0);
          expect(profile.hikingTime()).to.be(0);
          done();
          spy.restore();
        });
        $rootScope.$digest();
      });

      it('creates a chart from a feature', function(done) {
        $httpBackend.expectPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature).then(function(profile) {
          expect(profile).to.be.an(Object);
          expect(profile.create).to.be.a(Function);
          expect(profile.update).to.be.a(Function);

          // Test properties
          expect(profile.data).to.eql(goodResult);
          expect(profile.elevDiff()).to.be(-0.10000000000002274);
          expect(profile.twoElevDiff()).to.eql([0, 0.10000000000002274]);
          expect(profile.slopeDistance()).to.be(211.50002364066063);
          expect(profile.elPoints()).to.eql([429.8, 429.7]);
          expect(profile.distance()).to.be(211.5);
          expect(profile.hikingTime()).to.be(3);

          // Test labels
          expect(profile.group.select('text.ga-profile-label-x')
              .text()).to.be('undefined [m]');
          expect(profile.group.select('text.ga-profile-label-y')
              .text()).to.be('undefined [m]');
          expect(profile.group.select('text.ga-profile-elevation-difference')
              .text()).to.be('-0.1m');
          expect(profile.group.select('text.ga-profile-elevation-up')
              .text()).to.be('0.00m');
          expect(profile.group.select('text.ga-profile-elevation-down')
              .text()).to.be('0.10m');
          expect(profile.group.select('text.ga-profile-poi-up')
              .text()).to.be('429.80m');
          expect(profile.group.select('text.ga-profile-poi-down')
              .text()).to.be('429.70m');
          expect(profile.group.select('text.ga-profile-distance')
              .text()).to.be('211.50m');
          expect(profile.group.select('text.ga-profile-slopeDist')
              .text()).to.be('211.50m');
          expect(profile.group.select('text.ga-profile-hikTime')
              .text()).to.be('3min');

          done();
        });
        $httpBackend.flush();
      });

      it('formats the data', function(done) {
        $httpBackend.expectPOST(profileUrl).respond(goodResultToFormat);
        gaProfile.create(feature2).then(function(profile) {
          expect(profile.data).to.eql(goodResultFormatted);
          done();
        });
        $httpBackend.flush();
      });

      it('display axes labels from options', function(done) {
        $httpBackend.expectPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature, {
          xLabel: 'axeX',
          yLabel: 'axeY'
        }).then(function(profile) {
          expect(profile.group.select('text.ga-profile-label-x')
              .text()).to.be('axeX [m]');
          expect(profile.group.select('text.ga-profile-label-y')
              .text()).to.be('axeY [m]');
          done();
        });
        $httpBackend.flush();
      });

      it('find map coordinates from a x coord', function(done) {
        var feature = new ol.Feature(new ol.geom.LineString(goodCoords));
        $httpBackend.expectPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature).then(function(profile) {
          expect(profile.findMapCoordinates(10)).to.eql([592000, 221750]);
          done();
        });
        $httpBackend.flush();
      });
    });

    describe('update', function() {

      it('rejects the promise if no profile defined', function(done) {
        gaProfile.update(undefined, feature).then(function() {}, function() {
          done();
        });
        $rootScope.$digest();
      });

      it('rejects the promise if no feature defined', function(done) {
        gaProfile.update({}).then(function() {}, function() {
          done();
        });
        $rootScope.$digest();
      });

      it('updates an existing profile with the new feature', function(done) {
        $httpBackend.whenPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature).then(function(profile) {

          $httpBackend.expectPOST(profileUrl).respond(goodResultToFormat);
          gaProfile.update(profile, feature2).then(function(profile) {
            expect(profile).to.be.an(Object);
            expect(profile.create).to.be.a(Function);
            expect(profile.update).to.be.a(Function);

            // Test properties
            expect(profile.data).to.eql(goodResultFormatted);
            expect(profile.elevDiff()).to.be(1457);
            expect(profile.twoElevDiff()).to.eql([1457, 0]);
            expect(profile.slopeDistance()).to.be(1472.2707801216459);
            expect(profile.elPoints()).to.eql([1457, 0]);
            expect(profile.distance()).to.be(211.5);
            expect(profile.hikingTime()).to.be(248);

            // Test labels
            expect(profile.group.select('text.ga-profile-label-x')
                .text()).to.be('undefined [m]');
            expect(profile.group.select('text.ga-profile-label-y')
                .text()).to.be('undefined [m]');
            expect(profile.group.select('text.ga-profile-elevation-difference')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-elevation-up')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-elevation-down')
                .text()).to.be('0.00m');
            expect(profile.group.select('text.ga-profile-poi-up')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-poi-down')
                .text()).to.be('0.00m');
            expect(profile.group.select('text.ga-profile-distance')
                .text()).to.be('211.50m');
            expect(profile.group.select('text.ga-profile-slopeDist')
                .text()).to.be('1.47km');
            expect(profile.group.select('text.ga-profile-hikTime')
                .text()).to.be('4h 8min');

            done();
          });
        });
        $httpBackend.flush();
      });

      it('updates an existing profile with distance in KM', function(done) {
        $httpBackend.whenPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature).then(function(profile) {

          $httpBackend.expectPOST(profileUrl).respond(goodResultDistKm);
          gaProfile.update(profile, feature2).then(function(profile) {
            expect(profile).to.be.an(Object);
            expect(profile.create).to.be.a(Function);
            expect(profile.update).to.be.a(Function);

            // Test properties
            expect(profile.data).to.eql(goodResultDistKm);
            expect(profile.elevDiff()).to.be(1457);
            expect(profile.twoElevDiff()).to.eql([1457, 0]);
            expect(profile.slopeDistance()).to.be(22259.235864018334);
            expect(profile.elPoints()).to.eql([1457, 0]);
            expect(profile.distance()).to.be(22211.5);
            expect(profile.hikingTime()).to.be(390);

            // Test labels
            expect(profile.group.select('text.ga-profile-label-x')
                .text()).to.be('undefined [km]');
            expect(profile.group.select('text.ga-profile-label-y')
                .text()).to.be('undefined [m]');
            expect(profile.group.select('text.ga-profile-elevation-difference')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-elevation-up')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-elevation-down')
                .text()).to.be('0.00m');
            expect(profile.group.select('text.ga-profile-poi-up')
                .text()).to.be('1\'457m');
            expect(profile.group.select('text.ga-profile-poi-down')
                .text()).to.be('0.00m');
            expect(profile.group.select('text.ga-profile-distance')
                .text()).to.be('22.21km');
            expect(profile.group.select('text.ga-profile-slopeDist')
                .text()).to.be('22.25km');
            expect(profile.group.select('text.ga-profile-hikTime')
                .text()).to.be('6h 30min');

            done();
          });
        });
        $httpBackend.flush();
      });

    });

    describe('d3 is undefined', function() {

      beforeEach(function() {
        window.d3 = undefined;
      });

      it('loads d3 script', function(done) {
        var d3Url = gaGlobalOptions.resourceUrl + 'lib/d3.min.js';
        var spy = sinon.spy($, 'getScript');
        var xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];
        xhr.onCreate = function(xhr) {
          requests.push(xhr);
        };
        gaProfile.create().then(function(profile) {
          expect(profile).to.be.an(Object);
          expect(profile.create).to.be.a(Function);
          expect(profile.update).to.be.a(Function);
          expect(profile.data).to.be(undefined);
          expect(spy.calledWith(d3Url)).to.be(true);
          done();
          spy.restore();
        });
        requests[0].respond(200, {'Content-Type': 'application/javascript'}, '!function(){}()');
        $rootScope.$digest();
      });
    });
  });
});
