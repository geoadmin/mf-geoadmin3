/* eslint-disable max-len */
describe('ga_exportglstyle_service', function() {

  describe('gaExportGlStyle', function() {
    var $window, $httpBackend, gaBrowserSniffer, gaExportGlStyle,
      gaGlobalOptions, clock, gaGlStyle, $rootScope;
    var $windowMock, $q;
    var t = new Date('2016-01-15T10:00:00.000Z').getTime();
    var tFormatted = window.moment(t).format('YYYYMMDDhhmmss');
    var fileName = 'map.geo.admin.ch_GLSTYLE_' + tFormatted + '.json';

    var layer = {
      externalStyleUrl: 'http://foo.ch'
    };

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
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        gaBrowserSniffer = $injector.get('gaBrowserSniffer');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        $windowMock = sinon.mock($window);
        gaExportGlStyle = $injector.get('gaExportGlStyle');
        gaGlStyle = $injector.get('gaGlStyle');
      });

      clock = sinon.useFakeTimers(t);
    });

    afterEach(function() {
      clock.restore();
      $windowMock.restore();
    });

    describe('#create()', function() {

      it('creates a string from an url', function(done) {
        sinon.stub(gaGlStyle, 'get').returns($q.when({
          style: {
            property: 'value'
          }
        }));
        gaExportGlStyle.create(layer).then(function(str) {
          expect(str).to.be('{"property":"value"}');
          done();
        });
        $rootScope.$digest();
      });
    });

    describe('#createAndDownload()', function() {

      describe('using download service', function() {
        var dlUrl, fileUrl, open;

        var expectations = function(winLocation) {

          sinon.stub(gaGlStyle, 'get').returns($q.when({
            style: {
              property: 'value'
            }
          }));
          $httpBackend.whenPOST(dlUrl).respond({'url': fileUrl});
          $httpBackend.expectPOST(dlUrl, {
            kml: '{"property":"value"}',
            filename: fileName
          });

          gaExportGlStyle.createAndDownload(layer);
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
        sinon.stub(gaExportGlStyle, 'create').returns($q.when('{"data": "obj"}'));
        gaExportGlStyle.createAndDownload(layer);
        $rootScope.$digest();
        expect(spySaveAs.calledOnce).to.be.ok();
        expect(spySaveAs.args[0][1]).to.be(fileName);
        expect(spySaveAs.args[0][0]).to.be.a(Blob);
        gaExportGlStyle.create.restore();
      });
    });
  });
});
