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

    var ZOOM_OFFSET = 3;

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

    function __applyCurrentStyle__() {
      applyStyle(currentStyle);
    }

    // return the current style as a JSON
    function getCurrentStyle() {
      return currentStyle;
    }

    // keeping a reference on the layer we have created with Mapbox
    var mbLayer = null;
    var olMap;

    function getVectorTileLayer() {
      return mbLayer;
    }

    function applyStyle(style) {
      if (mbLayer) {
        mbLayer.setStyle(style);
        mbLayer.glStyle = style;
      } else {
        var mbMap = new $window.mapboxgl.Map({
          style: style,
          attributionControl: false,
          boxZoom: false,
          center: style.center,
          container: olMap.getTargetElement(),
          doubleClickZoom: false,
          dragPan: false,
          dragRotate: false,
          interactive: false,
          keyboard: false,
          pitchWithRotate: false,
          scrollZoom: false,
          touchZoomRotate: false,
          zoom: olMap.getView().getZoom() + ZOOM_OFFSET
        });
        mbLayer = new ol.layer.Layer({
          render: function(frameState) {
            var canvas = mbMap.getCanvas();
            var view = olMap.getView();

            var visible = mbLayer.getVisible();
            canvas.style.display = visible ? 'block' : 'none';

            var opacity = mbLayer.getOpacity();
            canvas.style.opacity = opacity;

            // adjust view parameters in mapbox
            var rotation = frameState.viewState.rotation;
            if (rotation) {
              mbMap.rotateTo(-rotation * 180 / Math.PI, {
                animate: false
              });
            }
            var center = ol.proj.toLonLat(view.getCenter(),
                                          view.getProjection());
            var zoom = view.getZoom() + ZOOM_OFFSET;
            mbMap.jumpTo({
              center: center,
              zoom: zoom,
              animate: false
            });

            // cancel the scheduled update & trigger synchronous redraw
            // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
            // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPBOX
            if (mbMap._frame) {
              mbMap._frame.cancel();
              mbMap._frame = null;
            }
            mbMap._render();

            return canvas;
          }
        });
        mbLayer.getFeaturesScreenPosition = function(screenPosition) {
          return mbMap.queryRenderedFeatures(screenPosition);
        };
        mbLayer.setStyle = function(style) {
          mbMap.setStyle(style);
        };
        // useful for BackgroundService
        mbLayer.mapboxLayer = true;
        // mimicing LayersService output
        mbLayer.parentLayerId = getVectorLayerBodId();
        mbLayer.id = getVectorLayerBodId();
        mbLayer.bodId = getVectorLayerBodId();
        mbLayer.glStyle = style;
        mbLayer.background = true;
        mbLayer.disable3d = true;
        mbLayer.visible = true;
        mbLayer.preview = false;
        // just in case it's taken by the LayerManager
        mbLayer.displayInLayerManager = false;
        olMap.addLayer(mbLayer);
      }
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
            __applyCurrentStyle__();
            deferred.resolve();
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
      if (mbLayer) {
        mbLayer.setVisible(false);
        mbLayer.visible = false;
      }
    }

    function showVectorTileLayers() {
      if (mbLayer) {
        mbLayer.setVisible(true);
        mbLayer.visible = true;
      }
    }

    // This will call create a custom layer on the map, that will add Mapbox
    // renderer as a OL layer.
    function init(map) {
      olMap = map;

      if (gaBrowserSniffer.msie && gaBrowserSniffer.msie <= 11) {
        alert($translate.instant('mvt_ie11_alert'));
      }

      var deferred = $q.defer();

      var permaLinkParams = gaPermalink.getParams();

      if (permaLinkParams.glStylesAdminId) {

        gaMapboxStyleStorage.
            getFileUrlFromAdminId(permaLinkParams.glStylesAdminId).
            then(
                function loadStyleSuccess(styleUrl) {
                  currentStyleUrl = styleUrl;
                  __loadCurrentStyle__().then(function(style) {
                    currentStyle = style;
                    __applyCurrentStyle__();
                    // attaching externalStyleUrl to mapbox layer
                    if (mbLayer) {
                      mbLayer.externalStyleUrl = styleUrl;
                      mbLayer.adminId = permaLinkParams.glStylesAdminId;
                      mbLayer.id = getVectorLayerBodId();
                      mbLayer.background = true;
                      mbLayer.glStyle = style;
                      mbLayer.useThirdPartyData = true;
                      // activating style edit toolbox
                      $rootScope.$broadcast('gaToggleEdit', style, true);
                    }
                    gaPermalink.deleteParam('glStylesAdminId');
                    $rootScope.$broadcast('gaVectorTileInitDone');
                    deferred.resolve();
                  });
                },
                function loadStyleError(error) {
                  deferred.reject(error);
                }
            );

      } else {

        if (gaGlobalOptions.vectorTileCustomStyleUrl) {
          currentStyleUrl = gaGlobalOptions.vectorTileCustomStyleUrl;
        } else {
          currentStyleUrl = vectortileLayerConfig.styles[0].url;
        }

        __loadCurrentStyle__().
            then(
                function loadCurrentStyleSucces(style) {
                  currentStyle = style;
                  __applyCurrentStyle__();
                  $rootScope.$broadcast('gaVectorTileInitDone');
                  deferred.resolve();
                },
                function loadCurrentStyleError(error) {
                  deferred.reject(error);
                }
            );
      }

      return deferred.promise;
    }

    function getFeatures(screenPosition) {
      if (mbLayer) {
        return mbLayer.getFeaturesScreenPosition(screenPosition);
      } else {
        return [];
      }
    }

    return {
      vectortileLayerConfig: vectortileLayerConfig,
      getCurrentStyleUrl: getCurrentStyleUrl,
      getCurrentStyle: getCurrentStyle,
      setCurrentStyle: setCurrentStyle,
      getVectorLayerBodId: getVectorLayerBodId,
      getVectorTileLayer: getVectorTileLayer,
      getStyles: getStyles,
      switchToStyleAtIndex: switchToStyleAtIndex,
      hideVectorTileLayers: hideVectorTileLayers,
      showVectorTileLayers: showVectorTileLayers,
      getFeatures: getFeatures,
      init: init
    };
  };
})();
