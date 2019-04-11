/* eslint-disable max-len */
describe('ga_glstylestorage_service', function() {

  describe('gaMapboxStyleStorage', function() {
    var gaMapboxStyleStorage, $httpBackend,
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
        gaMapboxStyleStorage = $injector.get('gaMapboxStyleStorage');
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
        var res = gaMapboxStyleStorage.getFileIdFromFileUrl(fileInfo.fileUrl);
        expect(res).to.equal(fileId);
        res = gaMapboxStyleStorage.getFileIdFromFileUrl(fileInfoHttps.fileUrl);
        expect(res).to.equal(fileId);
      }));
    });

    describe('#get()', function() {
      it('gets a file', function() {
        var expectedUrl = publicUrl + '/gl-styles/' + fileId;
        $httpBackend.expectGET(expectedUrl).respond(fileContent);
        gaMapboxStyleStorage.get(fileId);
        $httpBackend.flush();
      });
    });

    describe('#save()', function() {
      it('creates a file', inject(function($timeout, gaGlobalOptions) {
        $httpBackend.expectPOST(serviceUrl + '/gl-styles', fileContent).respond(fileInfo);
        gaMapboxStyleStorage.save(null, fileContent);
        $httpBackend.flush();
      }));

      it('updates a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/gl-styles/' + adminId;
        $httpBackend.expectPOST(expectedUrl, fileContent, function(headers) {
          return headers['Content-Type'] === 'application/json';
        }).respond(fileInfo);
        gaMapboxStyleStorage.save(adminId, fileContent);
        $httpBackend.flush();
      }));
    });

    describe('#del()', function() {
      it('deletes a file', inject(function($timeout) {
        var expectedUrl = serviceUrl + '/gl-styles/' + adminId;
        $httpBackend.expectDELETE(expectedUrl).respond({success: true});
        gaMapboxStyleStorage.del(adminId);
        $httpBackend.flush();
      }));
    });
  });
});
