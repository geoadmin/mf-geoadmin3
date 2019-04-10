/* eslint-disable max-len */
describe('ga_export_mapbox_style_service', function() {

  describe('gaExportMapboxStyle', function() {
    var $window, $httpBackend, gaBrowserSniffer, gaExportMapboxStyle,
      gaGlobalOptions, clock, $rootScope;
    var $windowMock;
    var t = new Date('2016-01-15T10:00:00.000Z').getTime();
    var tFormatted = window.moment(t).format('YYYYMMDDhhmmss');
    var fileName = 'map.geo.admin.ch_GLSTYLE_' + tFormatted + '.json';
    var glStyle = { property: 'value' };

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$window', {
          location: {
            href: '',
            search: {
              substring: function() {}
            }
          },
          open: function() {},
          navigator: window.navigator,
          addEventListener: function() {},
          document: window.document,
          parent: window.parent,
          moment: window.moment
        });
      });

      inject(function($injector) {
        $window = $injector.get('$window');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        $windowMock = sinon.mock($window);
        gaExportMapboxStyle = $injector.get('gaExportMapboxStyle');
      });
      clock = sinon.useFakeTimers(t);
    });

    afterEach(function() {
      clock.restore();
      $windowMock.restore();
    });

    describe('#create()', function() {

      it('does nothing if glStyle is udnefined', function(done) {
        gaExportMapboxStyle.create().then(function(str) {
          expect(str).to.be(undefined);
          done();
        });
        $rootScope.$digest();
      });

      it('creates a string from a glStyle', function(done) {
        gaExportMapboxStyle.create(glStyle).then(function(str) {
          expect(str).to.be('{"property":"value"}');
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('#createAndDownload()', function() {

      it('does nothing if glStyle is udnefined', function() {
        gaExportMapboxStyle.createAndDownload();
        $rootScope.$digest();
      });

      describe('using download service', function() {
        var dlUrl, fileUrl, open;

        var expectations = function(winLocation) {
          $httpBackend.whenPOST(dlUrl).respond({'url': fileUrl});
          $httpBackend.expectPOST(dlUrl, {
            kml: '{"property":"value"}',
            filename: fileName
          });

          gaExportMapboxStyle.createAndDownload(glStyle);
          $rootScope.$digest();
          $httpBackend.flush();
          open.verify();
          expect($window.location).to.be(winLocation);
        };

        beforeEach(function() {
          dlUrl = gaGlobalOptions.apiUrl + '/downloadkml';
          fileUrl = gaGlobalOptions.apiUrl + '/kml/' + fileName;
        });

        afterEach(function() {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        });

        it('on IE 9', function() {
          gaBrowserSniffer.msie = 9;
          gaBrowserSniffer.safari = false;
          gaBrowserSniffer.blob = true;
          open = $windowMock.expects('open').once().withArgs(fileUrl).returns({});
          expectations($window.location);
        });

        it('on Safari', function() {
          gaBrowserSniffer.msie = false;
          gaBrowserSniffer.safari = true;
          gaBrowserSniffer.blob = true;
          open = $windowMock.expects('open').never();
          expectations(fileUrl);
        });

        it('on browser where Blob is not supported', function() {
          gaBrowserSniffer.msie = false;
          gaBrowserSniffer.safari = false;
          gaBrowserSniffer.blob = false;
          open = $windowMock.expects('open').never();
          expectations(fileUrl);
        });
      });

      it('using Blob and saveAs', function() {
        $window.saveAs = function() {};
        gaBrowserSniffer.safari = false;
        gaBrowserSniffer.blob = true;
        var spySaveAs = sinon.spy($window, 'saveAs');
        gaExportMapboxStyle.createAndDownload(glStyle);
        $rootScope.$digest();
        expect(spySaveAs.calledOnce).to.be.ok();
        expect(spySaveAs.args[0][1]).to.be(fileName);
        expect(spySaveAs.args[0][0]).to.be.a(Blob);
      });
    });
  });
});
