/* eslint-disable max-len */
describe('ga_filestorage_service', function() {

  describe('gaFileStorage', function() {
    var gaFileStorage, $httpBackend,
      adminId = 'aaaaaaaaaaaaaaaaaaaaa', // length must > 20
      fileId = 'fffffffffffffffffffff', // length must > 20
      fileContent = '<kml></kml>',
      blob = new Blob([fileContent]),
      form = new FormData(),
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
      serviceUrl;
    form.append('kml', blob)
    form.append('author', 'toto')

    beforeEach(function() {
      inject(function($injector, gaGlobalOptions) {
        gaFileStorage = $injector.get('gaFileStorage');
        $httpBackend = $injector.get('$httpBackend');
        serviceUrl = gaGlobalOptions.storageUrl;
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
        var expectedUrl = serviceUrl + '/kml/files/' + fileId;
        $httpBackend.expectGET(expectedUrl).respond(fileContent);
        gaFileStorage.get(fileId);
        $httpBackend.flush();
      });
    });

    describe('#save()', function() {
      it('creates a file', inject(function($timeout, gaGlobalOptions) {
        $httpBackend.expectPOST(serviceUrl + '/api/kml/admin', form).respond(fileInfo);
        gaFileStorage.save(undefined, undefined, fileContent);
        $httpBackend.flush();
      }));

      it('updates a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/api/kml/admin/' + fileId;
        $httpBackend.expectPUT(expectedUrl, form).respond(fileInfo);
        gaFileStorage.save(fileId, adminId, fileContent);
        $httpBackend.flush();
      }));
    });

    describe('#del()', function() {
      it('deletes a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/api/kml/admin/' + adminId;
        $httpBackend.expectDELETE(expectedUrl).respond({success: true});
        gaFileStorage.del(adminId);
        $httpBackend.flush();
      }));
    });
  });
});
