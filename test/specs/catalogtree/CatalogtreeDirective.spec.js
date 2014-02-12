describe('ga_catalogtree_directive', function() {

  var element, map, $httpBackend;

  var expectedUrl = 'http://catalogservice.com/catalog/sometopic?lang=en';

  beforeEach(function() {
    map = new ol.Map({});

    module(function($provide) {
      $provide.value('gaLayers', {
        loadForTopic: function() {
        },
        getLayer: function() {
          return {};
        },
        getLayerProperty: function(key) {
        },
        getOlLayerById: function(bodId) {
          return new ol.layer.Tile({
            bodId: bodId,
            source: new ol.source.OSM()
          });
        }
      });
    });

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(expectedUrl).respond({
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
      $rootScope.$broadcast('gaLayersChange',
          {labelsOnly: false, topicId: 'sometopic'});
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('sends the catalog request', function() {
    $httpBackend.expectGET(expectedUrl);
    $httpBackend.flush();
  });

  describe('layers already in the map', function() {

    beforeEach(inject(function(gaLayers) {
      var layer = gaLayers.getOlLayerById('foo');
      map.addLayer(layer);
    }));

    it('adds layers specified in permalink', function() {
      $httpBackend.expectGET(expectedUrl);
      $httpBackend.flush();
      var layers = map.getLayers();
      var numLayers = layers.getLength();
      expect(numLayers).to.equal(1);
      expect(layers.getAt(0).get('bodId')).to.equal('foo');
    });
  });

});
