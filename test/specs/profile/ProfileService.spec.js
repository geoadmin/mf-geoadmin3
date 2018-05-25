/* eslint-disable max-len */
describe('ga_profile_service', function() {
  var gaProfile, $q, $rootScope, $http, $httpBackend, gaTimeFormat, gaGlobalOptions, gaGeomUtils;

  beforeEach(function() {

    inject(function($injector) {
      gaProfile = $injector.get('gaProfile');
      gaTimeFormat = $injector.get('gaTimeFormatFilter');
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      gaGeomUtils = $injector.get('gaGeomUtils');
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

    describe('#create()', function() {

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

      it('returns empty profile if feature\'s geometry can\'t be handle', function(done) {
        var p = [];
        [
          new ol.geom.Point(),
          new ol.geom.MultiPoint([[0, 0]]),
          new ol.geom.MultiLineString(),
          new ol.geom.MultiPolygon(),
          new ol.geom.MultiLineString([[[0, 0]], [[1, 1]]]),
          new ol.geom.GeometryCollection([new ol.geom.Point([0, 0])])
        ].forEach(function(geom) {
          var feat = new ol.Feature(geom);
          p.push(gaProfile.create(feat));
        });
        $q.all(p).then(function(resps) {
          resps.forEach(function(resp) {
            expect(resp.data.length).to.be(1);
            expect(resp.data[0].dist).to.be(0);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('creates a chart from a feature', function(done) {
        $httpBackend.expectPOST(profileUrl).respond(goodResult);
        var spy = sinon.spy(gaGeomUtils, 'simplify');
        gaProfile.create(feature).then(function(profile) {
          expect(spy.callCount).to.be(1);
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
          done();
        });
        $httpBackend.flush();
      });

      it('creates a chart using complex results', function(done) {
        $.get('base/test/data/profile.json', function(response) {
          $httpBackend.expectPOST(profileUrl).respond(response);
          var spy = sinon.spy(gaGeomUtils, 'simplify');
          gaProfile.create(feature).then(function(profile) {
            expect(spy.callCount).to.be(1);
            expect(profile).to.be.an(Object);
            expect(profile.create).to.be.a(Function);
            expect(profile.update).to.be.a(Function);

            // Test properties
            expect(profile.elevDiff()).to.be(767.3000000000001);
            expect(profile.twoElevDiff()).to.eql([12132.300000000001, 11365.000000000002]);
            expect(profile.slopeDistance()).to.be(227034.6111158946);
            expect(profile.elPoints()).to.eql([3424.7, 403.5]);
            expect(profile.distance()).to.be(224261.2);
            expect(profile.hikingTime()).to.be(4603);
            done();
          });
          $httpBackend.flush();
        });
      });

      it('send correct POST parameters', function() {
        $httpBackend.expectPOST(profileUrl).respond(goodResultToFormat);
        var spy = sinon.spy($http, 'post');
        gaProfile.create(feature);
        expect(spy.callCount).to.be(1);
        expect(spy.args[0][1]).to.be('geom=%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B0.0%2C0.0%5D%2C%5B1.0%2C0.0%5D%2C%5B1.0%2C1.0%5D%5D%7D&elevation_models=COMB&offset=0');
        var config = spy.args[0][2];
        expect(config.cache).to.be(true);
        expect(config.timeout).to.be.a(Object);
        expect(config.headers['Content-Type']).to.be('application/x-www-form-urlencoded');
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
        var spy = sinon.spy(gaGeomUtils, 'simplify');
        gaProfile.create(feature, {
          xLabel: 'axeX',
          yLabel: 'axeY'
        }).then(function(profile) {
          expect(spy.callCount).to.be(1);
          expect(profile.group.select('text.ga-profile-label-x').
              text()).to.be('axeX [m]');
          expect(profile.group.select('text.ga-profile-label-y').
              text()).to.be('axeY [m]');
          done();
        });
        $httpBackend.flush();
      });

      it('find map coordinates from a x coord in m', function(done) {
        var feature = new ol.Feature(new ol.geom.LineString(goodCoords));
        $httpBackend.expectPOST(profileUrl).respond(goodResult);
        gaProfile.create(feature).then(function(profile) {
          expect(profile.findMapCoordinates(-1)).to.eql([592000, 221750]);
          expect(profile.findMapCoordinates(0)).to.eql([592000, 221750]);
          expect(profile.findMapCoordinates(1)).to.eql([592000.8392434989, 221750.54373522458]);
          expect(profile.findMapCoordinates(200)).to.eql([592167.8486997637, 221858.74704491728]);
          expect(profile.findMapCoordinates(212)).to.eql([592177.5, 221865]);
          done();
        });
        $httpBackend.flush();
      });

      it('find map coordinates from a x coord in km', function(done) {
        var feature = new ol.Feature(new ol.geom.LineString(goodCoords));
        $httpBackend.expectPOST(profileUrl).respond(goodResultDistKm);
        gaProfile.create(feature).then(function(profile) {
          expect(profile.findMapCoordinates(-1)).to.eql([592000, 221750]);
          expect(profile.findMapCoordinates(0)).to.eql([592000, 221750]);
          expect(profile.findMapCoordinates(1)).to.eql([592007.9913558292, 221755.17749814285]);
          expect(profile.findMapCoordinates(20)).to.eql([592159.8271165837, 221853.54996285707]);
          expect(profile.findMapCoordinates(23)).to.eql([592177.5, 221865]);
          done();
        });
        $httpBackend.flush();
      });
    });

    describe('#update()', function() {

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
        var spy = sinon.stub($, 'getScript').returns($q.when());
        gaProfile.create().then(function(profile) {
          expect(profile).to.be.an(Object);
          expect(profile.create).to.be.a(Function);
          expect(profile.update).to.be.a(Function);
          expect(profile.data).to.be(undefined);
          expect(spy.args[0][0]).to.be(d3Url);
          done();
          spy.restore();
        });
        $rootScope.$digest();
      });
    });
  });
});
