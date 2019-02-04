/* eslint-disable max-len */
describe('ga_publicstorage_service', function() {

  describe('gaPublicStorage', function() {
    var endPoint = '/endpoint';
    var publicEndPoint = '/publicendpoint';
    var gaPublicStorage, $httpBackend, $rootScope,
      adminId = 'aaaaaaaaaaaaaaaaaaaaa', // length must > 20
      fileId = 'fffffffffffffffffffff', // length must > 20
      fileContent = '<kml></kml>',
      fileInfo = {
        adminId: adminId,
        fileId: fileId,
        fileUrl: 'http://public.geo.admin.ch/' + fileId
      },
      fileInfoHttps = {
        adminId: adminId,
        fileId: fileId,
        fileUrl: 'https://public.geo.admin.ch/' + fileId
      },
      serviceUrl, publicUrl;

    beforeEach(function() {
      inject(function($injector, gaGlobalOptions) {
        gaPublicStorage = $injector.get('gaPublicStorage');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        serviceUrl = gaGlobalOptions.apiUrl;
        publicUrl = gaGlobalOptions.publicUrl;
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getFilIdFromFileUrl', function() {
      it('gets file\'s id from file\'s url', function() {
        var res = gaPublicStorage.getFileIdFromFileUrl(fileInfo.fileUrl);
        expect(res).to.equal(fileId);
        res = gaPublicStorage.getFileIdFromFileUrl(fileInfoHttps.fileUrl);
        expect(res).to.equal(fileId);
      });
    });

    describe('#getFileUrlFromAdminId()', function() {
      it('gets file\'s url from adminId ', function(done) {
        var expectedUrl = serviceUrl + '/endpoint/' + adminId;
        var expectedUrl2 = publicUrl + '/publicendpoint/' + fileId;
        $httpBackend.expectGET(expectedUrl).respond({
          fileId: fileId
        });
        gaPublicStorage.getFileUrlFromAdminId(endPoint, publicEndPoint,
            adminId).then(function(url) {
          expect(url).to.be(expectedUrl2);
          done();
        });
        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    describe('#get()', function() {
      it('gets a file', function() {
        var expectedUrl = publicUrl + '/endpoint/' + fileId;
        $httpBackend.expectGET(expectedUrl).respond(fileContent);
        gaPublicStorage.get(endPoint, fileId);
        $httpBackend.flush();
      });
    });

    describe('#save()', function() {
      it('creates a file', inject(function($timeout, gaGlobalOptions) {
        $httpBackend.expectPOST(serviceUrl + '/endpoint', fileContent).respond(fileInfo);
        gaPublicStorage.save(endPoint, publicEndPoint, null, fileContent);
        $httpBackend.flush();
      }));

      it('updates a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/endpoint/' + adminId;
        $httpBackend.expectPOST(expectedUrl, fileContent, function(headers) {
          return headers['Content-Type'] === 'text/plain';
        }).respond(fileInfo);
        gaPublicStorage.save(endPoint, publicEndPoint, adminId, fileContent, 'text/plain');
        $httpBackend.flush();
      }));
    });

    describe('#del()', function() {
      it('deletes a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/endpoint/' + adminId;
        $httpBackend.expectDELETE(expectedUrl).respond({success: true});
        gaPublicStorage.del(endPoint, adminId);
        $httpBackend.flush();
      }));
    });
  });
});
