describe('ga_importkml__directive', function() {
  var scope, element, map, urlTab, localFileTab, loadKmlBt, tabsContainer,
      tabContents, formLocalFile, formUrl, inputFile, inputFileUrl, tabsLi;
  
  beforeEach(inject(function($injector, $rootScope, $compile) {
    map = new ol.Map({});
    map.setSize([600,300]);
    map.getView().getView2D().fitExtent([-20000000, -20000000, 20000000, 20000000],
        map.getSize()); 
    
    element = angular.element(
        '<div ga-import-kml ga-import-kml-map="map" ' +
             'ga-import-kml-options="options">' +
        '</div>');
    $rootScope.map = map;
    $rootScope.options = {
      proxyUrl: 'http://admin.ch/ogcproxy?url=',
      maxFileSize: 20000000,
      validationServiceUrl: 'http://www.kmlvalidator.org/validate.htm'
    };
    $compile(element)($rootScope);

    scope = element.scope();
    $rootScope.$digest();
  
    // Get HTML elements  
    tabsContainer = element.find('.tabbable');
    tabContents = tabsContainer.find('.tab-content > div'); 
    tabsLi = tabsContainer.find('.nav-tabs > li');
    loadKmlBt = element.find('button[type=button][ng-click="loadKML()"]');
    localFileTab = $(tabContents[0]);
    urlTab = $(tabContents[1]);
    formLocalFile = localFileTab.find('form[method=POST][target=_BLANK][action="' +
        $rootScope.options.validationServiceUrl +
        '"][enctype="multipart/form-data"]');
    formUrl = urlTab.find('form[method=POST][target=_BLANK][action="' +
        $rootScope.options.validationServiceUrl +
        '"]');
    inputFile = formLocalFile.find('input[type=file][name=file]');
    inputFileUrl = formUrl.find('input[type=url][name=url][ng-model=fileUrl]');
  }));

  it('verifies html elements', function() {
    expect(loadKmlBt.length).to.be(1);
    expect(tabsContainer.length).to.be(1);
    expect(tabsLi.length).to.be(2);
    expect(tabContents.length).to.be(2);
    expect(formLocalFile.length).to.be(1);
    expect(inputFile.length).to.be(1); 
    expect(formLocalFile.find('input[type=hidden][name=type][value=direct-input]').length).to.be(1); 
    expect(formLocalFile.find('input[type=text][readonly]').length).to.be(1); 
    expect(formLocalFile.find('button').length).to.be(1);
    expect(formUrl.length).to.be(1);
    expect(inputFileUrl.length).to.be(1); 
    expect(formUrl.find('input[type=hidden][name=type][value=uri]').length).to.be(1); 
  });

  describe('load KML from an URL', function() {
    var $httpBackend;
    var expectedKmlUrl = 'http://admin.ch/ogcproxy?url=http%3A%2F%2Fgeo.admin.ch%2Ftest.kml';
    var fileUrlTest = 'http://geo.admin.ch/test.kml';
    var fileContent = '<?xml version=\'1.0\' encoding="UTF-8" standalone="no" ?>' +
        '<kml xmlns="http://www.opengis.net/kml/2.2"' + 
            ' xmlns:gx="http://www.google.com/kml/ext/2.2"' +
            ' xmlns:kml="http://www.opengis.net/kml/2.2"' + 
            ' xmlns:atom="http://www.w3.org/2005/Atom">' +
          '<Placemark id="Point">' +
            '<name>Swiss Miniatur</name>' +
            '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>Point</p></body></html>]]></description>' +
            '<styleUrl>#listing_A</styleUrl>' +
            '<Point>' +
              '<coordinates>9.1,46.8,0</coordinates>' +
            '</Point>' +
          '</Placemark>' +
          '<Placemark id="LineString">' +
            '<name>Swiss Miniatur</name>' +
            '<description><![CDATA[<!DOCTYPE html><html><head></head><body><p>LineString</p></body></html>]]></description>' +
            '<styleUrl>#listing_A</styleUrl>' +
            '<LineString>' +
              '<coordinates>' +
                '8.5,46.2,0 9.8,46.2,0 9.8,47.4,0 8.5,47.4,0' +
              '</coordinates>' +
            '</LineString>' +
          '</Placemark>' +
        '</kml>';

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(expectedKmlUrl).respond(fileContent);
      $httpBackend.expectGET(expectedKmlUrl);
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
