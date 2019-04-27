goog.provide('ga_vector_tile_layer_service');

goog.require('ga_storage_service');
goog.require('ga_translation_service');
goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_permalink_service');
goog.require('ga_mapbox_style_storage_service');
goog.require('ga_browsersniffer_service');

(function() {

  angular.module('ga_vector_tile_layer_service', [
    'ga_storage_service',
    'ga_translation_service',
    'ga_definepropertiesforlayer_service',
    'ga_permalink_service',
    'ga_mapbox_style_storage_service',
    'ga_browsersniffer_service',
    'pascalprecht.translate'
  ]).
      factory('gaVectorTileLayerService', VectorTileLayerService);

  function VectorTileLayerService($window, $q, $rootScope, $translate, gaLang,
      gaStorage, gaDefinePropertiesForLayer, gaGlobalOptions, gaPermalink,
      gaMapboxStyleStorage, gaBrowserSniffer) {
    // LayersConfig for vector
    // TODO: replace this by a fetch call on the API (TBD)
    var vectortileLayerConfig = {
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
        type: 'fill',
        props: [
          ['paint', 'fill-color', '{color}']
        ]
      }, {
        id: 'landuse',
        regex: /landuse/,
        type: 'fill',
        props: [
          ['paint', 'fill-color', '{color}']
        ]
      }, {
        id: 'hydrology',
        regex: /hydrology/,
        type: 'fill',
        props: [
          ['paint', 'fill-color', '{color}']
        ]
      }, {
        id: 'roadtraffic',
        regex: /roadtraffic/,
        type: 'line',
        props: [
          ['paint', 'line-color', '{color}'],
          ['paint', 'line-width', '{size}']
        ]
      }, {
        id: 'labels',
        regex: /labels/,
        type: 'symbol',
        props: [
          ['layout', 'visibility', '{toggle}', 'visible', 'none'],
          ['paint', 'text-color', '{color}'],
          ['layout', 'text-size', '{size}']
        ]
      }, {
        id: 'woodland',
        regex: /woodland/,
        type: 'fill',
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
    var currentStyleUrl = null;
    var currentStyle = null;

    function getCurrentStyleUrl() {
      return currentStyleUrl;
    }

    // return a promise that will resolve as soon as gaStorage service
    // has loaded the current style (or has returned it from its cache)
    function __loadCurrentStyle__() {
      return gaStorage.load(getCurrentStyleUrl());
    }

    // return a promise that will resolve when the style has been applied
    function __applyCurrentStyle__(firstCall) {
      return applyStyle(currentStyle, firstCall);
    }

    // return the current style as a JSON
    function getCurrentStyle() {
      return currentStyle;
    }

    // force reload from gaStorage and load with OLMS
    function reloadCurrentStyle() {
      __loadCurrentStyle__().then(function(style) {
        currentStyle = style;
        __applyCurrentStyle__();
      })
    }

    // keeping a reference on the layerGroup we have created to bundle all
    // layers created by ol-mapbox-style
    var olVectorTileLayers = [];
    var olMap;

    function getVectorTileLayersCount() {
      return olVectorTileLayers.length;
    }

    function getVectorTileLayers() {
      return olVectorTileLayers;
    }

    function applyStyle(style, firstCall) {
      var deferred = $q.defer();

      // we save any layer, other than OLMS layers, so that we can put them
      // back on top of the layer stack after OLMS call
      var otherLayers = [];
      var layerArray = [];
      olMap.getLayers().forEach(function(layer) {
        layerArray.push(layer);
      })
      angular.forEach(layerArray, function(layer, index) {
        if (typeof (layer.get('mapbox-source')) === 'string' &&
            layer.get('mapbox-source') !== '') {
          olMap.removeLayer(layer);
        } else {
          otherLayers.push(layer);
        }
      })
      olVectorTileLayers = [];

      $window.olms(olMap, style).then(
          function olmsSuccess(map) {

            var layerArrayAfterOlms = [];
            map.getLayers().forEach(function(layer) {
              layerArrayAfterOlms.push(layer);
            });
            for (var i = 0; i < layerArrayAfterOlms.length; i++) {
              var layer = layerArrayAfterOlms[i];
              if (layer.get('mapbox-source')) {
                layer.olmsLayer = true;
                layer.parentLayerId = getVectorLayerBodId();
                layer.id = getVectorLayerBodId();
                layer.bodId = getVectorLayerBodId();
                layer.glStyle = style;
                layer.background = true;
                layer.disable3d = true;
                layer.visible = true;
                layer.preview = false;
                // just in case it's taken by the LayerManager
                layer.displayInLayerManager = false;
                olVectorTileLayers.push(layer);
              }
            }

            // we reorder layers present before OLMS
            // call at the top of the stack so that if any BGDI
            // layer was present, it will be on top
            for (var j = 0; j < otherLayers.length; j++) {
              var anotherLayer = otherLayers[j];
              map.removeLayer(anotherLayer);
              map.addLayer(anotherLayer);
            }

            deferred.resolve(olVectorTileLayers);
          },
          function olmsError(response) {
            deferred.reject(response);
          }
      );

      return deferred.promise;
    }

    // return the LayerBodId for VectorTile from the LayersConfig
    // should be "ch.swisstopo.leichte-basiskarte.vt"
    function getVectorLayerBodId() {
      return vectortileLayerConfig.serverLayerName;
    }

    function getStyles() {
      return vectortileLayerConfig.styles;
    }

    function switchToStyleAtIndex(index) {
      var deferred = $q.defer();
      if (index >= 0 && index < vectortileLayerConfig.styles.length) {
        currentStyleUrl = vectortileLayerConfig.styles[index].url;
      }
      __loadCurrentStyle__().then(
          function loadCurrentStyleSucces(style) {
            currentStyle = style;
            __applyCurrentStyle__().then(
                function applyStyleSucces() {
                  deferred.resolve();
                },
                function applyStyleError(data) {
                  deferred.reject(data);
                }
            )
          },
          function loadCurrentStyleError(data) {
            deferred.reject(data);
          }
      )
      return deferred.promise;
    }

    function setCurrentStyle(style) {
      currentStyle = style;
      __applyCurrentStyle__();
    }

    function hideVectorTileLayers() {
      $.each(olVectorTileLayers, function(index, layer) {
        layer.setVisible(false);
      })
    }

    function showVectorTileLayers() {
      $.each(olVectorTileLayers, function(index, layer) {
        layer.setVisible(true);
      })
    }

    // This will call ol-mapbox-style (olms) on the map, with current style
    // and will then gather all layers created by this library. It will then
    // bundle them into a LayerGroup, in order to make hidding and other
    // manipulation easier throughout the application (it was the way it was
    // done before, when we were creating mapbox layers ourselves)
    function init(map) {
      olMap = map;

      if (gaBrowserSniffer.msie && gaBrowserSniffer.msie <= 11) {
        alert($translate.instant('mvt_ie11_alert'));
      }

      var deferred = $q.defer();

      var permaLinkParams = gaPermalink.getParams();

      if (permaLinkParams.glStylesAdminId) {

        gaMapboxStyleStorage.
            getFileUrlFromAdminId(permaLinkParams.glStylesAdminId).then(
                function(styleUrl) {
                  currentStyleUrl = styleUrl;
                  __loadCurrentStyle__().then(function(style) {
                    currentStyle = style;
                    __applyCurrentStyle__(true,
                        permaLinkParams.glStylesAdminId).
                        then(
                            function initSuccess() {
                              // attaching externalStyleUrl to first layer
                              if (olVectorTileLayers.length > 0) {
                                var firstLayer = olVectorTileLayers[0];
                                firstLayer.externalStyleUrl = styleUrl;
                                firstLayer.adminId =
                        permaLinkParams.glStylesAdminId;
                                firstLayer.id = getVectorLayerBodId();
                                firstLayer.background = true;
                                firstLayer.glStyle = style;
                                firstLayer.useThirdPartyData = true;
                                // activating style edit toolbox
                                $rootScope.$broadcast('gaToggleEdit',
                                    style, true);
                              }
                              gaPermalink.deleteParam('glStylesAdminId');
                              $rootScope.$broadcast('gaVectorTileInitDone');
                              deferred.resolve();
                            },
                            function initError() {
                              deferred.reject();
                            }
                        )
                  });
                }
            );

      } else {

        if (gaGlobalOptions.vectorTileCustomStyleUrl) {
          currentStyleUrl = gaGlobalOptions.vectorTileCustomStyleUrl;
        } else {
          currentStyleUrl = vectortileLayerConfig.styles[0].url;
        }

        __loadCurrentStyle__().then(function(style) {
          currentStyle = style;
          __applyCurrentStyle__(true).then(
              function initSuccess() {
                $rootScope.$broadcast('gaVectorTileInitDone');
                deferred.resolve();
              },
              function initError() {
                deferred.reject();
              }
          )
        });
      }

      return deferred.promise;
    }

    function getStyles() {
      return vectortileLayerConfig.styles;
    }

    function getCurrentStyleIndex() {
      return currentStyleIndex;
    }

    function switchToStyleAtIndex(index) {
      currentStyleIndex = index;
      pristine = false;
      __loadCurrentStyle__().then(function (style) {
        currentStyle = style;
        __applyCurrentStyle__();
      })
    }

    function setCurrentStyle(style) {
      currentStyle = style;
      __applyCurrentStyle__();
    }

    function hideVectorTileLayers() {
      $.each(olVectorTileLayers, function (index, layer) {
        layer.setVisible(false);
      })
    }

    function showVectorTileLayers() {
      $.each(olVectorTileLayers, function (index, layer) {
        layer.setVisible(true);
      })
    }

    // This will call ol-mapbox-style (olms) on the map, with current style
    // and will then gather all layers created by this library. It will then
    // bundle them into a LayerGroup, in order to make hidding and other
    // manipulation easier throughout the application (it was the way it was
    // done before, when we were creating mapbox layers ourselves)
    function init(map) {
      olMap = map;
      var deferred = $q.defer();
      __loadCurrentStyle__().then(function (style) {
        currentStyle = style;
        __applyCurrentStyle__(true).then(
          function initSuccess() {
            deferred.resolve();
          },
          function initError() {
            deferred.reject();
          }
        )
      })
      return deferred.promise;
    }

    return {
      vectortileLayerConfig: vectortileLayerConfig,
      getCurrentStyleUrl: getCurrentStyleUrl,
      getCurrentStyle: getCurrentStyle,
      setCurrentStyle: setCurrentStyle,
      getVectorLayerBodId: getVectorLayerBodId,
      getVectorTileLayers: getVectorTileLayers,
      getVectorTileLayersCount: getVectorTileLayersCount,
      reloadCurrentStyle: reloadCurrentStyle,
      getStyles: getStyles,
      switchToStyleAtIndex: switchToStyleAtIndex,
      hideVectorTileLayers: hideVectorTileLayers,
      showVectorTileLayers: showVectorTileLayers,
      init: init
    };
  };
})();
