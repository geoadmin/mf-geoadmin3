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

    $translate.uses('somelang');
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
    gaLayerMetadataPopup('somelayer');
    $rootScope.$digest();
    $httpBackend.flush();

    var popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.parents().length).to.be(2);
    expect(popupLegend.css('display')).to.be('block');
    expect(popupLegend.find('.ga-popup-content').html()).to.be('<div class="ng-scope">Some raw html</div>');

    gaLayerMetadataPopup('somelayer');
    $rootScope.$digest();

    // We don't create a new one because we have the same id
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('none');

    //With a new url -> request and a new popup
    gaLayerMetadataPopup('somelayer');
    $rootScope.$digest();

    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('block');

    var newExpectedUrlLegend = 'http://legendservice.com/sometopic/somenewlayer?lang=somelang';
    $httpBackend.whenGET(newExpectedUrlLegend).respond('<div>Some new raw html</div>');
    gaLayerMetadataPopup('somenewlayer');
    $rootScope.$digest();
    $httpBackend.flush();

    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(2);
  });
});
