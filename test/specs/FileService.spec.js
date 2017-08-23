/* eslint-disable max-len */
describe('ngeo.fileService', function() {

  describe('ngeoFile', function() {
    var ngeoFile;

    beforeEach(function() {
      inject(function($injector) {
        ngeoFile = $injector.get('ngeoFile');
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
        expect(ngeoFile.isWmsGetCap('<gpx></gpx>')).to.be(false);
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
        expect(ngeoFile.isWmtsGetCap('<gpx></gpx>')).to.be(false);
        expect(ngeoFile.isWmtsGetCap(undefined)).to.be(false);
        expect(ngeoFile.isWmtsGetCap(null)).to.be(false);
        expect(ngeoFile.isWmtsGetCap(212334)).to.be(false);
      });
    });

    describe('#isKml()', function() {
      it('tests if the content of a file is a KML', function() {
        expect(ngeoFile.isKml('<html></html>')).to.be(false);
        expect(ngeoFile.isKml('<kml></kml>')).to.be(true);
        expect(ngeoFile.isKml('<gpx></gpx>')).to.be(false);
        expect(ngeoFile.isKml(undefined)).to.be(false);
        expect(ngeoFile.isKml(null)).to.be(false);
        expect(ngeoFile.isKml(212334)).to.be(false);
      });
    });

    describe('#isGpx()', function() {
      it('tests if the content fo file is a GPX', function() {
        expect(ngeoFile.isGpx('<html></html>')).to.be(false);
        expect(ngeoFile.isGpx('<kml></kml>')).to.be(false);
        expect(ngeoFile.isGpx('<gpx></gpx>')).to.be(true);
        expect(ngeoFile.isGpx(undefined)).to.be(false);
        expect(ngeoFile.isGpx(null)).to.be(false);
        expect(ngeoFile.isGpx(212334)).to.be(false);
      });
    });

    describe('#read()', function() {
      it('reads a file and extract the content as string', function() {
      });
    });

    describe('#load()', function() {
      it('loads a file from a url', function() {
      });
    });
  });
});
