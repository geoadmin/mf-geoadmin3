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

    var Mapbox = /* @__PURE__ */(function(Layer) {
      function Mapbox(options) {
        var baseOptions = Object.assign({}, options);
        Layer.call(this, baseOptions);

        this.baseOptions = baseOptions;

        /**
         * @private
         * @type boolean
         */
        this.loaded = false;

        this.initMap();
      }

      if (Layer) Mapbox.prototype = Layer;
      Mapbox.prototype = Object.create(Layer && Layer.prototype);
      Mapbox.prototype.constructor = Mapbox;

      Mapbox.prototype.initMap = function initMap() {
        var map = this.map_;
        var view = map.getView();
        var transformToLatLng = ol.proj.getTransform(
            view.getProjection(), 'EPSG:4326');
        var center = transformToLatLng(view.getCenter());

        this.centerLastRender = view.getCenter();
        this.zoomLastRender = view.getZoom();
        this.centerLastRender = view.getCenter();
        this.zoomLastRender = view.getZoom();

        var options = Object.assign(this.baseOptions, {
          attributionControl: false,
          boxZoom: false,
          center: center,
          container: map.getTargetElement(),
          doubleClickZoom: false,
          dragPan: false,
          dragRotate: false,
          interactive: false,
          keyboard: false,
          pitchWithRotate: false,
          scrollZoom: false,
          touchZoomRotate: false,
          zoom: view.getZoom() + ZOOM_OFFSET
        });

        this.mbmap = new $window.mapboxgl.Map(options);
        this.mbmap.on('load', function() {
          this.mbmap.getCanvas().remove();
          this.loaded = true;
          this.map_.render();
          [
            'mapboxgl-control-container'
          ].forEach(function(className) {
            return document.getElementsByClassName(className)[0].remove();
          });
        }.bind(this));

        this.mbmap.on('render', function() {
          // Reset offset
          if (this.centerNextRender) {
            this.centerLastRender = this.centerNextRender;
          }
          if (this.zoomNextRender) {
            this.zoomLastRender = this.zoomNextRender;
          }
          this.updateRenderedPosition([0, 0], 1);
        }.bind(this));

      };

      /**
       *
       * @inheritDoc
       */
      Mapbox.prototype.render = function render(frameState) {
        var map = this.map_;
        var view = map.getView();
        var transformToLatLng = ol.proj.getTransform(view.getProjection(),
            'EPSG:4326');

        this.centerNextRender = view.getCenter();
        var lastRender = map.getPixelFromCoordinate(this.centerLastRender);
        var nextRender = map.getPixelFromCoordinate(this.centerNextRender);
        var centerOffset = [lastRender[0] - nextRender[0], lastRender[1] -
           nextRender[1]];
        this.zoomNextRender = view.getZoom();
        var zoomOffset = Math.pow(2, this.zoomNextRender - this.zoomLastRender);
        this.updateRenderedPosition(centerOffset, zoomOffset);

        var rotation = frameState.viewState.rotation;
        if (rotation) {
          this.mbmap.rotateTo(-rotation * 180 / Math.PI, {
            animate: false
          });
        }

        // Re-render mbmap
        var center = transformToLatLng(this.centerNextRender);
        var zoom = view.getZoom() + ZOOM_OFFSET;
        this.mbmap.jumpTo({
          center: center,
          zoom: zoom
        });
        return this.mbmap.getCanvas();
      };

      Mapbox.prototype.updateRenderedPosition =
      function updateRenderedPosition(centerOffset, zoomOffset) {
        var style = this.mbmap.getCanvas().style;
        style.left = Math.round(centerOffset[0]) + 'px';
        style.top = Math.round(centerOffset[1]) + 'px';
        style.transform = 'scale(' + zoomOffset + ')';
      };

      Mapbox.prototype.setVisible = function setVisible(visible) {
        Layer.prototype.setVisible.call(this, visible);

        var canvas = this.mbmap.getCanvas();
        canvas.style.display = visible ? 'block' : 'none';
      };

      Mapbox.prototype.setOpacity = function setOpacity(opacity) {
        Layer.prototype.setOpacity.call(this, opacity);
        var canvas = this.mbmap.getCanvas();
        canvas.style.opacity = opacity;
      };

      Mapbox.prototype.setZIndex = function setZIndex(zindex) {
        Layer.prototype.setZIndex.call(this, zindex);
        var canvas = this.mbmap.getCanvas();
        canvas.style.zIndex = zindex;
      };

      Mapbox.prototype.setStyle = function setStyle(style) {
        this.mbmap.setStyle(style);
      }

      /**
       * @inheritDoc
       */
      Mapbox.prototype.getSourceState = function getSourceState() {
        return this.loaded ? 'ready' : 'undefined';
      };

      Mapbox.prototype.setMap = function setMap(map) {
        this.map_ = map;
      };

      return Mapbox;
    }(ol.layer.BaseTile));

    $window.mapboxgl.Map.prototype._setupContainer =
    function _setupContainer() {
      var container = this._container;
      container.classList.add('mapboxgl-map');

      var canvasContainer = this._canvasContainer = container.firstChild;
      this._canvas = document.createElement('canvas');
      canvasContainer.insertBefore(this._canvas, canvasContainer.firstChild);
      this._canvas.style.position = 'absolute';
      this._canvas.addEventListener('webglcontextlost',
          this._contextLost, false);
      this._canvas.addEventListener('webglcontextrestored',
          this._contextRestored, false);
      this._canvas.setAttribute('tabindex', '0');
      this._canvas.setAttribute('aria-label', 'Map');
      this._canvas.className = 'mapboxgl-canvas';

      var dimensions = this._containerDimensions();
      this._resizeCanvas(dimensions[0], dimensions[1]);

      this._controlContainer = canvasContainer;
      var controlContainer = this._controlContainer =
        document.createElement('div');
      controlContainer.className = 'mapboxgl-control-container';
      container.appendChild(controlContainer);

      var positions = this._controlPositions = {};
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
          function(positionName) {
            var elem = document.createElement('div');
            elem.className = 'mapboxgl-ctrl-' + positionName;
            controlContainer.appendChild(elem);
            positions[positionName] = elem;
          });
    };

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
        mbLayer = new Mapbox({
          map: olMap,
          container: olMap.getTarget(),
          style: style
        });
        // mimicing LayersService output
        mbLayer.olmsLayer = true;
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
      }
    }

    function showVectorTileLayers() {
      if (mbLayer) {
        mbLayer.setVisible(true);
      }
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
      init: init
    };
  };
})();
