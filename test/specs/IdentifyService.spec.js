describe('ga_identify_service', function() {
  var gaIdentify, $httpBackend, $rootScope, map, point, gaTime;

  var expectedDfltRequest =  'https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=0,0&geometryFormat=geojson&geometryType=esriGeometryPoint&imageDisplay=600,300,96&lang=custom&layers=all:mybodid&mapExtent=-46962910.17841229,-23481455.089206144,46962910.17841229,23481455.089206144&returnGeometry=false&tolerance=0';

  var expectedComplexRequest = 'https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=0,0&geometryFormat=geojson&geometryType=esriGeometryPoint&imageDisplay=600,300,96&lang=custom&layers=all:mybodid,bodtelayer&limit=1&mapExtent=-46962910.17841229,-23481455.089206144,46962910.17841229,23481455.089206144&returnGeometry=false&timeInstant=,2012&tolerance=28'

  var getBodLayer = function(bodId) {
    var layer = getNonBodLayer();
    layer.bodId = bodId;
    return layer;
  };

  var getBodTimeEnabledLayer = function(bodId) {
    var layer = getBodLayer(bodId);
    layer.time = '20121231';
    layer.timeEnabled = true;
    return layer;
  };

  var getNonBodLayer = function() {
    var layer = new ol.layer.Tile();
    return layer;
  };

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

    inject(function($injector, gaGlobalOptions) {
      gaIdentify = $injector.get('gaIdentify');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      gaTime = $injector.get('gaTime');
    });

    map = new ol.Map({});
    map.setSize([600, 300]);
    map.getView().fit([-20000000, -20000000, 20000000, 20000000], map.getSize());
    map.addLayer(getBodLayer('mybodid'));
    point = new ol.geom.Point([0, 0]);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('#get()', function() {

    describe('fails', function() {
      var errMsg = 'missing required parameters';
      var expectErr = function(msg, done) {
        expect(msg).to.eql('Missing required parameters');
        done();
      };

      it('if parameters are not defined', function(done) {
        gaIdentify.get().catch (function(msg) {
          expectErr(msg, done);
        });
        $rootScope.$digest();
      });

      it('if map parameter is not defined', function(done) {
        gaIdentify.get(null, map.getLayers().getArray(), point).catch (function(msg) {
          expectErr(msg, done);
        });
        $rootScope.$digest();
      });

      it('if layers arr parameter is not defined', function(done) {
        gaIdentify.get(map, null, point).catch (function(msg) {
          expectErr(msg, done);
        });
        $rootScope.$digest();
      });

      it('if geometry parameter is not defined', function(done) {
        gaIdentify.get(map, map.getLayers().getArray(), null).catch (function(msg) {
          expectErr(msg, done);
        });
        $rootScope.$digest();
      });
    });

    it('sends request with default optional parameters if not defined', function(done) {
      $httpBackend.expectGET(expectedDfltRequest).respond({});
      gaIdentify.get(map, map.getLayers().getArray(), point).then(function(msg) {
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });

    it('sends request with complex parameters', function(done) {
      map.addLayer(getNonBodLayer());
      map.addLayer(getBodTimeEnabledLayer('bodtelayer'));
      var gaTimeGet = sinon.spy(gaTime, 'get');
      $httpBackend.expectGET(expectedComplexRequest).respond({});
      gaIdentify.get(map, map.getLayers().getArray(), point, 28, false, 10000, 1).then(function(msg) {
        expect(gaTimeGet.calledOnce).to.eql(true);
        done();
      });
      $httpBackend.flush();
      $rootScope.$digest();
    });
  });
});
