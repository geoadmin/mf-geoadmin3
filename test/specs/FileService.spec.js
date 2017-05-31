describe('ngeo.fileService', function() {

  describe('ngeoFile', function() {
    var $httpBackend, ngeoFile, $windowMock, $q, gaUrlUtils;


    beforeEach(function() {
      inject(function($injector) {
        ngeoFile = $injector.get('ngeoFile');
        $q = $injector.get('$q');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaUrlUtilsMock = sinon.mock($injector.get('gaUrlUtils'));
      });
    });

    describe('#isValidFileSize()', function() {
      it('tests validity of a file size', function() {
        expect(ngeoFile.isValidFileSize(10000000)).to.be(true);
        expect(ngeoFile.isValidFileSize(30000000)).to.be(false);
        expect(ngeoFile.isValidFileSize('10000000')).to.be(true);
        expect(ngeoFile.isValidFileSize('30000000')).to.be(false);
        expect(ngeoFile.isValidFileSize(undefined)).to.be(true);
        expect(ngeoFile.isValidFileSize(null)).to.be(true);
        expect(ngeoFile.isValidFileSize('sdfsdfdsfsd')).to.be(true);
      });
    });

    describe('#isWmsGetCap()', function() {
      it('tests if the content fo file is a WMS GetCapabilties', function() {
        expect(ngeoFile.isWmsGetCap('<WMT_MS_Capabilities></WMT_MS_Capabilities>')).to.be(true);
        expect(ngeoFile.isWmsGetCap('<WMS_Capabilities></WMS_Capabilities>')).to.be(true);
        expect(ngeoFile.isWmsGetCap('<kml></kml>')).to.be(false);
        expect(ngeoFile.isWmsGetCap(undefined)).to.be(false);
        expect(ngeoFile.isWmsGetCap(null)).to.be(false);
        expect(ngeoFile.isWmsGetCap(212334)).to.be(false);
      });
    });

    describe('#isWmtsGetCap()', function() {
      it('tests if the content fo file is a WMTS GetCapabilties', function() {
        expect(ngeoFile.isWmtsGetCap('<Capabilities schemaLocation="wmtsGetCapabilities_response.xsd"></Capabilities>')).to.be(true);
        expect(ngeoFile.isWmtsGetCap('<Capabilities></Capabilities>')).to.be(false);
        expect(ngeoFile.isWmtsGetCap('<kml></kml>')).to.be(false);
        expect(ngeoFile.isWmtsGetCap(undefined)).to.be(false);
        expect(ngeoFile.isWmtsGetCap(null)).to.be(false);
        expect(ngeoFile.isWmtsGetCap(212334)).to.be(false);
      });
    });

    describe('#isKml()', function() {
      it('tests if the content of a file is a KML', function() {
        expect(ngeoFile.isKml('<html></html>')).to.be(false);
        expect(ngeoFile.isKml('<kml></kml>')).to.be(true);
        expect(ngeoFile.isKml(undefined)).to.be(false);
        expect(ngeoFile.isKml(null)).to.be(false);
        expect(ngeoFile.isKml(212334)).to.be(false);
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
