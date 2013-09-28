describe('ga_catalogtree_directive', function() {

  var element, map, $httpBackend;

  var expectedUrl = 'http://catalogservice.com/catalog/sometopic?' +
      'callback=JSON_CALLBACK&lang=en';

  beforeEach(function() {
    map = new ol.Map({});

    module(function($provide) {
      $provide.value('gaLayers', {
        loadForTopic: function() {
        },
        getLayer: function() {
          return {};
        },
        getOlLayerById: function(id) {
          return new ol.layer.Tile({
            id: id,
            source: new ol.source.OSM()
          });
        }
      });
    });

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenJSONP(expectedUrl).respond({
        results: {
          root: {
            children: [{
              children: [{
                idBod: 'foo'
              }, {
                idBod: 'bar',
                selectedOpen: true
              }]
            }]
          }
        }
      });
    });

    element = angular.element(
      '<div>' +
        '<div ga-catalogtree ga-catalogtree-options="options" ' +
            'ga-catalogtree-map="map">' +
        '</div>' +
      '</div>');

    inject(function($rootScope, $compile, $translate) {

      $rootScope.map = map;
      $rootScope.options = {
        catalogUrlTemplate: 'http://catalogservice.com/catalog/{Topic}'
      };

      $compile(element)($rootScope);
      $rootScope.$digest();

      $translate.uses('en');
      $rootScope.$broadcast('gaTopicChange', {id: 'sometopic'});
      $rootScope.$broadcast('gaLayersChange');
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('sends the catalog request', function() {
    $httpBackend.expectJSONP(expectedUrl);
    $httpBackend.flush();
  });

  it('adds preselected layers', function() {
    $httpBackend.expectJSONP(expectedUrl);
    $httpBackend.flush();
    var layers = map.getLayers();
    var numLayers = layers.getLength();
    expect(numLayers).to.equal(1);
    expect(layers.getAt(0).get('id')).to.equal('bar');
  });

});
