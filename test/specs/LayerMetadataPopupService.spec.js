describe('ga_layer_metadata_popup_service', function() {
  var gaLayerMetadataPopup,
      $httpBackend,
      $rootScope,
      $translate;

  beforeEach(inject(function($injector) {
    gaLayerMetadataPopup = $injector.get('gaLayerMetadataPopup');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    $translate = $injector.get('$translate');

    var expectedUrlLayersConfig = 'http://example.com/sometopic?lang=somelang';
    $httpBackend.whenGET(expectedUrlLayersConfig).respond({});

    $translate.use('somelang');
    $rootScope.$broadcast('gaTopicChange', { id: 'sometopic' });
    $rootScope.$digest();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('creates a legend popup with the right content', function() {
    $httpBackend.flush();

    var expectedUrlLegend = 'http://legendservice.com/sometopic/somelayer?lang=somelang';
    $httpBackend.whenGET(expectedUrlLegend).respond('<div>Some raw html</div>');
    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();
    $httpBackend.flush();

    var popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.parents().length).to.be(2);
    expect(popupLegend.css('display')).to.be('block');
    var popupContent = '<div>Some raw html</div>';
    expect(popupLegend.find('.ga-popup-content').html().indexOf(popupContent) > -1).to.be(true);

    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();

    // We don't create a new one because we have the same id
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('none');

    //With a new url -> request and a new popup
    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();

    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('block');

    expectedUrlLegend = 'http://legendservice.com/sometopic/somenewlayer?lang=somelang';
    $httpBackend.whenGET(expectedUrlLegend).respond('<div>Some new raw html</div>');
    gaLayerMetadataPopup.toggle('somenewlayer');
    $rootScope.$digest();
    $httpBackend.flush();

    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(2);

    // 2 popups so far, on translation end -> 2 new requests
    var expectedUrlLayersConfig = 'http://example.com/sometopic?lang=someotherlang';
    $httpBackend.whenGET(expectedUrlLayersConfig).respond({});
    $translate.use('someotherlang');

    expectedUrlLegend = 'http://legendservice.com/sometopic/somelayer?lang=someotherlang';
    $httpBackend.whenGET(expectedUrlLegend).respond('<div>Some translated raw html</div>');
    expectedUrlLegend = 'http://legendservice.com/sometopic/somenewlayer?lang=someotherlang';
    $httpBackend.whenGET(expectedUrlLegend).respond('<div>Some translated new raw html</div>');
    $rootScope.$digest();
    $httpBackend.flush();

    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(2);
  });
});
