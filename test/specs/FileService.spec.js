describe('ga_file_service', function() {

  describe('gaFile', function() {
    var $httpBackend, gaFile, $window, $q, gaUrlUtils;


    beforeEach(function() {
      inject(function($injector) {
        gaFile = $injector.get('gaFile');
        $q = $injector.get('$q');
        $window = $injector.get('$window');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaUrlUtilsMock = sinon.mock($injector.get('gaUrlUtils'));
      });
    });


    describe('#isValidFileSize()', function() {
      it('tests validity of a file size', function() {
        expect(gaFile.isValidFileSize(10000000)).to.be(true);
        expect(gaFile.isValidFileSize(30000000)).to.be(false);
        expect(gaFile.isValidFileSize('10000000')).to.be(true);
        expect(gaFile.isValidFileSize('30000000')).to.be(false);
        expect(gaFile.isValidFileSize(undefined)).to.be(true);
        expect(gaFile.isValidFileSize(null)).to.be(true);
        expect(gaFile.isValidFileSize('sdfsdfdsfsd')).to.be(true);
      });
    });

    describe('#isWmsGetCap()', function() {
      it('tests if the content fo file is a WMS GetCapabilties', function() {
        expect(gaFile.isWmsGetCap('<WMT_MS_Capabilities></WMT_MS_Capabilities>')).to.be(true);
        expect(gaFile.isWmsGetCap('<WMS_Capabilities></WMS_Capabilities>')).to.be(true);
        expect(gaFile.isWmsGetCap('<kml></kml>')).to.be(false);
        expect(gaFile.isWmsGetCap(undefined)).to.be(false);
        expect(gaFile.isWmsGetCap(null)).to.be(false);
        expect(gaFile.isWmsGetCap(212334)).to.be(false);
      });
    });

    /*describe('#isWmtsGetCap()', function() {
      it('tests if the content fo file is a WMS GetCapabilties', function() {
        expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
        expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
        expect(gaKml.isValidFileContent(undefined)).to.be(false);
        expect(gaKml.isValidFileContent(null)).to.be(false);
        expect(gaKml.isValidFileContent(212334)).to.be(false);
      });
    });*/

    describe('#isKml()', function() {
      it('tests if the content of a file is a KML', function() {
        expect(gaFile.isKml('<html></html>')).to.be(false);
        expect(gaFile.isKml('<kml></kml>')).to.be(true);
        expect(gaFile.isKml(undefined)).to.be(false);
        expect(gaFile.isKml(null)).to.be(false);
        expect(gaFile.isKml(212334)).to.be(false);
      });
    });

    /*describe('#isGpx()', function() {
      it('tests if the content fo file is a WMS GetCapabilties', function() {
        expect(gaKml.isValidFileContent('<html></html>')).to.be(false);
        expect(gaKml.isValidFileContent('<kml></kml>')).to.be(true);
        expect(gaKml.isValidFileContent(undefined)).to.be(false);
        expect(gaKml.isValidFileContent(null)).to.be(false);
        expect(gaKml.isValidFileContent(212334)).to.be(false);
      });
    });*/

    describe('#read()', function() {
      it('reads a file and extract the contentas string', function() {
      });
    });

    describe('#load()', function() {
      it('loads a file from a url', function() {
      });
    });
  });
});
