describe('ga_layer_metadata_popup_service', function() {
  var gaLayerMetadataPopup,
      gaLang, gaLayers, $http,
      $httpBackend, $q,
      $rootScope,
      $translate;

  var getBodLayer = function(bodId) {
    var layer = new ol.layer.Tile();
    layer.id = bodId;
    layer.bodId = bodId;
    layer.displayInLayerManager = true;
    return layer;
  };

  var getExternalWmsLayer = function(name) {
    var layer = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        params: {LAYERS: name}
      })
    });
    layer.id = 'WMS||The wms layer||http://foo.ch/wms||' + name;
    layer.displayInLayerManager = true;
    layer.type = 'WMS';
    layer.url = 'http://foo.ch/wms';
    return layer;
  };

  var getMetaDataUrl = function(bodId) {
     return 'http://legendservice.com/all/' + bodId + '?lang=' + gaLang.get();
  }

  var getWmsHtmlLegend = function(olLayer) {
    return '<img src="' + olLayer.url + '/' +
        olLayer.getSource().getParams()['LAYERS'] + '">';
  }

  beforeEach(function() {
    module(function($provide) {
      $provide.value('gaLang', new (function() {
        var lang = 'somelang';
        this.get = function() {
          return lang;
        };
        this.set = function(newLang) {
          lang = newLang;
          $translate.use(newLang);
        };
      })());
      $provide.value('gaLayers', new (function() {
        this.getMetaDataOfLayer = function(bodId) {
          return $http.get(getMetaDataUrl(bodId));
        };
        this.getOlLayerById = function(bodId) {
          return getBodLayer(bodId);
        };
      })());
      $provide.value('gaWms', new (function() {
        this.getLegend = function(olLayer) {
          var defer = $q.defer();
          defer.resolve({data: getWmsHtmlLegend(olLayer)});
          return defer.promise;
        };
      })());
    });

    inject(function($injector) {
      gaLayerMetadataPopup = $injector.get('gaLayerMetadataPopup');
      gaLayers = $injector.get('gaLayers');
      gaLang = $injector.get('gaLang');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $translate = $injector.get('$translate');
      $q = $injector.get('$q');
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('creates a legend popup for a bod layer with the right content', function() {

    // Show the legend of the first bod layer (using bodId)
    $httpBackend.whenGET(getMetaDataUrl('somelayer')).respond('<div>Some raw html</div>');
    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();
    $httpBackend.flush();

    // Verify the html
    var popupLegend = $('.ga-tooltip-metadata');
    var popupContent = '<div>Some raw html</div>';
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.parents().length).to.be(2);
    expect(popupLegend.css('display')).to.be('block');
    expect(popupLegend.find('.ga-popup-content').html().indexOf(popupContent) > -1).to.be(true);

    // Hide the legend of the first bod layer
    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('none');

    // Show the legend of the first bod layer
    gaLayerMetadataPopup.toggle('somelayer');
    $rootScope.$digest();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(1);
    expect(popupLegend.css('display')).to.be('block');

    // Show the legend of the second bod layer (using an olLayer)
    var someNewLayer = getBodLayer('somenewlayer');
    $httpBackend.whenGET(getMetaDataUrl('somenewlayer')).respond('<div>Some new raw html</div>');
    gaLayerMetadataPopup.toggle(someNewLayer);
    $rootScope.$digest();
    $httpBackend.flush();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(2);

    // Change the language
    gaLang.set('someotherlang');
    $httpBackend.whenGET(getMetaDataUrl('somelayer')).respond('<div>Some translated raw html</div>');
    $httpBackend.whenGET(getMetaDataUrl('somenewlayer')).respond('<div>Some translated new raw html</div>');
    $rootScope.$digest();
    $httpBackend.flush();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(2);

    // Hide legend of the 2 bod layers for next test
    gaLayerMetadataPopup.toggle('somelayer');
    gaLayerMetadataPopup.toggle(someNewLayer);
  });

  it('creates a legend popup for a external wms layer with the right content', function() {
    var wmsLayer = getExternalWmsLayer('somewmslayer');
    var newWmsLayer = getExternalWmsLayer('somenewwmslayer');

    // Show the legend of the first wms layer
    gaLayerMetadataPopup.toggle(wmsLayer);
    $rootScope.$digest();

    // Verify the html
    var popupLegend = $('.ga-tooltip-metadata');
    var popupContent = getWmsHtmlLegend(wmsLayer);
    expect(popupLegend.length).to.be(3); // 2 from the first test
    expect(popupLegend.parents().length).to.be(2);
    expect($(popupLegend[2]).css('display')).to.be('block');
    expect($(popupLegend[2]).find('.ga-popup-content').html().indexOf(popupContent) > -1).to.be(true);

    // Hide the legend of the first wms layer
    gaLayerMetadataPopup.toggle(wmsLayer);
    $rootScope.$digest();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(3);
    expect($(popupLegend[2]).css('display')).to.be('none');

    // Show the legend of the first wms layer
    gaLayerMetadataPopup.toggle(wmsLayer);
    $rootScope.$digest();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    expect(popupLegend.length).to.be(3);
    expect($(popupLegend[2]).css('display')).to.be('block');

    // Show the legend of the 2nd wms layer
    gaLayerMetadataPopup.toggle(newWmsLayer);
    $rootScope.$digest();

    // Verify the html
    popupLegend = $('.ga-tooltip-metadata');
    popupContent = getWmsHtmlLegend(newWmsLayer);
    expect(popupLegend.length).to.be(4);
    expect($(popupLegend[3]).find('.ga-popup-content').html().indexOf(popupContent) > -1).to.be(true);
  });
});
