goog.provide('ga_vector_tile_layer_service');

goog.require('ga_storage_service');
goog.require('ga_translation_service');
goog.require('ga_definepropertiesforlayer_service');

(function() {

  angular.module('ga_vector_tile_layer_service', [
    'ga_storage_service',
    'ga_translation_service',
    'ga_definepropertiesforlayer_service'
  ]).
      factory('gaVectorTileLayerService',
          ['$window', '$q', 'gaLang', 'gaStorage', 'gaDefinePropertiesForLayer',
            VectorTileLayerService]);

  function VectorTileLayerService($window, $q, gaLang, gaStorage,
      gaDefinePropertiesForLayer) {
    var vectortileLayer = {
      type: 'aggregate',
      background: true,
      serverLayerName: 'ch.swisstopo.leichte-basiskarte.vt',
      attribution: '' +
        '<a target="_blank" href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
        '<a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ' +
        '<a target="_blank" href="https://www.swisstopo.admin.ch/' + gaLang.getNoRm() + '/home.html">swisstopo</a>',
      styles: [{
        id: 'default',
        url: 'https://vectortiles.geo.admin.ch/gl-styles/ch.swisstopo.leichte-basiskarte.vt/v006/style.json'
      }, {
        id: 'color',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-vintage.vt_v006.json'
      }, {
        id: 'grey',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-grey.vt_v006.json'
      }, {
        id: 'lsd',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-lsd.vt_v006.json'
      }],
      edits: [{
        id: 'settlement',
        regex: /settlement/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'landuse',
        regex: /landuse/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'hydrology',
        regex: /hydrology/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'roadtraffic',
        regex: /roadtraffic/,
        props: [
          ['paint', 'line-color', '{color}'],
          ['paint', 'line-width', '{size}']
        ]

      }, {
        id: 'labels',
        regex: /labels/,
        props: [
          ['layout', 'visibility', '{toggle}', 'visible', 'none'],
          ['paint', 'text-color', '{color}'],
          ['layout', 'text-size', '{size}']
        ]
      }, {
        id: 'woodland',
        regex: /woodland/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]
      }, {
        id: 'territory',
        regex: /territory|background/,
        props: [
          ['paint', 'background-color', '{color}']
        ]
      }]
    };
    var currentStyleIndex = 0;
    function getCurrentStyleUrl() {
      return vectortileLayer.styles[currentStyleIndex].url;
    }
    function getCurrentStyle() {
      return gaStorage.load(getCurrentStyleUrl());
    }
    var olVectorTileLayer;
    function init(map) {
      var deferred = $q.defer();
      getCurrentStyle().then(
          function getCurrentStyleSuccess(style) {
            $window.olms(map, style).then(
                function olmsSuccess(map) {
                  var groupLayer = new ol.layer.Group({
                    opacity: 1
                  });
                  var subLayers = [];
                  map.getLayers().forEach(function(layer) {
                    if (layer.get('mapbox-source')) {
                      layer.olmsLayer = true;
                      layer.parentLayerId = vectortileLayer.serverLayerName;
                      layer.displayInLayerManager = false;
                      subLayers.push(layer);
                    }
                  });
                  $.each(subLayers, function(index, subLayer) {
                    map.removeLayer(subLayer);
                  })
                  groupLayer.setLayers(new ol.Collection(subLayers));
                  gaDefinePropertiesForLayer(groupLayer);
                  groupLayer.bodId = vectortileLayer.serverLayerName;
                  groupLayer.displayInLayerManager = false;
                  map.addLayer(groupLayer);
                  olVectorTileLayer = groupLayer;
                  deferred.resolve(olVectorTileLayer);
                },
                function olmsError(response) {
                  deferred.reject(response);
                }
            );
          },
          function getCurrentStyleError(response) {
            deferred.reject(response);
          }
      )
      return deferred.promise;
    }
    function getOlLayer() {
      return olVectorTileLayer;
    }
    function getVectorLayerBodId() {
      return vectortileLayer.serverLayerName;
    }
    return {
      getCurrentStyleUrl: getCurrentStyleUrl,
      getOlLayer: getOlLayer,
      getVectorLayerBodId: getVectorLayerBodId,
      init: init
    };
  };
})();
