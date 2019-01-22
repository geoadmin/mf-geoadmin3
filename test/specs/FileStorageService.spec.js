/* eslint-disable max-len */
describe('ga_filestorage_service', function() {

  describe('gaFileStorage', function() {
    var gaFileStorage, $httpBackend,
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
        gaFileStorage = $injector.get('gaFileStorage');
        $httpBackend = $injector.get('$httpBackend');
        serviceUrl = gaGlobalOptions.apiUrl + '/files';
        publicUrl = gaGlobalOptions.publicUrl;
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getFilIdFromFileUrl', function() {
      it('gets file\'s id from file\'s url', inject(function() {
        var res = gaFileStorage.getFileIdFromFileUrl(fileInfo.fileUrl);
        expect(res).to.equal(fileId);
        res = gaFileStorage.getFileIdFromFileUrl(fileInfoHttps.fileUrl);
        expect(res).to.equal(fileId);
      }));
    });

    describe('#get()', function() {
      it('gets a file', function() {
        var expectedUrl = publicUrl + '/' + fileId;
        $httpBackend.expectGET(expectedUrl).respond(fileContent);
        gaFileStorage.get(fileId);
        $httpBackend.flush();
      });
    });

    describe('#save()', function() {
      it('creates a file', inject(function($timeout, gaGlobalOptions) {
        $httpBackend.expectPOST(serviceUrl, fileContent).respond(fileInfo);
        gaFileStorage.save(null, fileContent);
        $httpBackend.flush();
      }));

      it('updates a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/' + adminId;
        $httpBackend.expectPOST(expectedUrl, fileContent, function(headers) {
          return headers['Content-Type'] === 'application/vnd.google-earth.kml+xml';
        }).respond(fileInfo);
        gaFileStorage.save(adminId, fileContent);
        $httpBackend.flush();
      }));
    });

    describe('#del()', function() {
      it('deletes a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/' + adminId;
        $httpBackend.expectDELETE(expectedUrl).respond({success: true});
        gaFileStorage.del(adminId);
        $httpBackend.flush();
      }));
    });
  });
});
