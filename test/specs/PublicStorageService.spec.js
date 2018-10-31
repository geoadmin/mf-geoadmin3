/* eslint-disable max-len */
describe('ga_publicstorage_service', function() {

  describe('gaPublicStorage', function() {
    var endPoint = '/endpoint';
    var gaPublicStorage, $httpBackend,
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
        serviceUrl = gaGlobalOptions.apiUrl;
        publicUrl = gaGlobalOptions.publicUrl;
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getFilIdFromFileUrl', function() {
      it('gets file\'s id from file\'s url', inject(function() {
        var res = gaPublicStorage.getFileIdFromFileUrl(fileInfo.fileUrl);
        expect(res).to.equal(fileId);
        res = gaPublicStorage.getFileIdFromFileUrl(fileInfoHttps.fileUrl);
        expect(res).to.equal(fileId);
      }));
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
        gaPublicStorage.save(endPoint, null, fileContent);
        $httpBackend.flush();
      }));

      it('updates a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/endpoint/' + adminId;
        $httpBackend.expectPOST(expectedUrl, fileContent, function(headers) {
          return headers['Content-Type'] === 'text/plain';
        }).respond(fileInfo);
        gaPublicStorage.save(endPoint, adminId, fileContent, 'text/plain');
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
