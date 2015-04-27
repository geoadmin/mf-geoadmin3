describe('ga_file_storage_service', function() {
  var gaFileStorage, $httpBackend,
      adminId = 'aaaaaaaaaaaaaaaaaaaaa', // length must > 20
      fileId = 'fffffffffffffffffffff', // length must > 20
      fileContent = '<kml></kml>',
      fileInfo = {
        adminId: adminId,
        fileId: fileId,
        fileUrl: 'http://public.geo.admin.ch/' + fileId,
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
  
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('gets a file', inject(function() {
    var expectedUrl = publicUrl + '/' + fileId;
    $httpBackend.expectGET(expectedUrl).respond(fileContent);
    gaFileStorage.get(fileId);
    $httpBackend.flush();
  })); 
  
  it('creates a file', inject(function($timeout, gaGlobalOptions) {
    var expectedUrl = serviceUrl;
    $httpBackend.expectPOST(serviceUrl, fileContent).respond(fileInfo);
    gaFileStorage.save(null, fileContent);
    $httpBackend.flush();
  }));  
  
  it('updates a file', inject(function($timeout) {
    var expectedUrl = serviceUrl + '/' + adminId;
    $httpBackend.expectPOST(expectedUrl, fileContent, function(headers) {
      return headers['Content-Type'] == 'text/plain';
    }).respond(fileInfo);
    gaFileStorage.save(adminId, fileContent, 'text/plain');
    $httpBackend.flush();
  }));
   
  it('deletes a file', inject(function($timeout) {
    var expectedUrl = serviceUrl + '/' + adminId;
    $httpBackend.expectDELETE(expectedUrl).respond({success: true});
    gaFileStorage.del(adminId);
    $httpBackend.flush();
  }));
});
