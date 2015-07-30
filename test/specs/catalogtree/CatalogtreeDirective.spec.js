describe('ga_catalogtree_directive', function() {

  var element, map, $httpBackend, $rootScope;

  var expectedUrl = 'http://catalogservice.com/catalog/sometopic?lang=somelang';
  var expectedUrl1 = 'http://catalogservice.com/catalog/sometopic2?lang=somelang';
  var expectedUrl2 = 'http://catalogservice.com/catalog/sometopic?lang=somelang2';
  var response = {
    results: {
      root: {
        children: [{
          children: [{
            layerBodId: 'foo'
          }, {
            layerBodId: 'bar',
            selectedOpen: true
          }]
        }]
      }
    }
  };

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
            bodId: bodId
          });
        }
      });
      $provide.value('gaTopic', {
        get: function() {
          return {
            id: 'sometopic',
            selectedLayers: ['bar'],
            langs: [{
              value: 'somelang',
              label: 'somelang'
            }]
          };
        }
      });
    });

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(expectedUrl).respond(response);
      $httpBackend.whenGET(expectedUrl1).respond(response);
      $httpBackend.whenGET(expectedUrl2).respond(response);
    });

    element = angular.element(
      '<div>' +
        '<div ga-catalogtree ga-catalogtree-options="options" ' +
            'ga-catalogtree-map="map">' +
        '</div>' +
      '</div>');

    inject(function(_$rootScope_, $compile, $translate) {
      $rootScope = _$rootScope_;
      $rootScope.map = map;
      $rootScope.options = {
        catalogUrlTemplate: 'http://catalogservice.com/catalog/{Topic}'
      };

      $compile(element)($rootScope);
      $httpBackend.expectGET(expectedUrl);
      $httpBackend.flush();
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*it('do nothing if it a same topic', function() {
    $rootScope.$broadcast('gaTopicChange', {id: 'sometopic'});
    $httpBackend.flush();
  });*/

  it('update the catalog when the topic change', function() {
    $rootScope.$broadcast('gaTopicChange', {id: 'sometopic2'});
    $httpBackend.expectGET(expectedUrl1);
    $httpBackend.flush();
  });

  it('update the catalog when the language change', function() {
    $rootScope.$broadcast('$translateChangeEnd', {language: 'somelang2'});
    $httpBackend.expectGET(expectedUrl2);
    $httpBackend.flush();
  });
});
