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
    // LayersConfig for vector
    // TODO: replace this by a fetch call on the API (TBD)
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

    // keeping track of the current style index to be able to return
    // it on demand (see styles array above in the layersConfig)
    var currentStyleIndex = 0;
    function getCurrentStyleUrl() {
      return vectortileLayer.styles[currentStyleIndex].url;
    }
    function getCurrentStyle() {
      return gaStorage.load(getCurrentStyleUrl());
    }

    // keeping a reference on the layerGroup we have created to bundle all
    // layers created by ol-mapbox-style
    var olVectorTileLayer;

    // This will call ol-mapbox-style (olms) on the map, with current style
    // and will then gather all layers created by this library. It will then
    // bundle them into a LayerGroup, in order to make hidding and other
    // manipulation easier throughout the application (it was the way it was
    // done before, when we were creating mapbox layers ourselves)
    function init(map) {

      // get a promise ready for return
      var deferred = $q.defer();

      // load current style with gaStorage service (this enables caching)
      getCurrentStyle().then(
          function getCurrentStyleSuccess(style) {

            // let olms do the dirty work of creating Layers in OpenLayers
            $window.olms(map, style).then(
                function olmsSuccess(map) {

                  // gather all layers created by olms into a LayerGroup
                  var groupLayer = new ol.layer.Group({
                    opacity: 1
                  });

                  var subLayers = [];
                  map.getLayers().forEach(function(layer) {
                    // if properties mapbox-source is defined, then it's a layer
                    // made by olms
                    if (layer.get('mapbox-source')) {
                      layer.olmsLayer = true;
                      layer.parentLayerId = vectortileLayer.serverLayerName;
                      // just in case it's taken by the LayerManager
                      layer.displayInLayerManager = false;
                      subLayers.push(layer);
                    }
                  });

                  // we remove all olms layers from the map (we will get
                  // them back through the LayerGroup)
                  $.each(subLayers, function(index, subLayer) {
                    map.removeLayer(subLayer);
                  })
                  groupLayer.setLayers(new ol.Collection(subLayers));

                  // mimicing LayersService output
                  gaDefinePropertiesForLayer(groupLayer);
                  groupLayer.bodId = vectortileLayer.serverLayerName;
                  groupLayer.displayInLayerManager = false;

                  // adding newly created groupLayer
                  // and resolving pending promise
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

    // return the LayerGroup created in #init()
    function getOlLayer() {
      return olVectorTileLayer;
    }

    // return the LayerBodId for VectorTile from the LayersConfig
    // should be "ch.swisstopo.leichte-basiskarte.vt"
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
