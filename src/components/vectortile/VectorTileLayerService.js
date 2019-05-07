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

    var Mapbox = /*@__PURE__*/(function (Layer) {
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

    var mbLayer = null;

    function addMapboxLayer() {
      if (!mbLayer) {
        mbLayer = new Mapbox({
          map: olMap,
          container: olMap.getTarget(),
          style: getCurrentStyle()
        });
        olMap.addLayer(mbLayer);
      }
    }

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
      __loadCurrentStyle__().then(function(style) {
        currentStyle = style;
        __applyCurrentStyle__();
      })
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
      var deferred = $q.defer();
      __loadCurrentStyle__().then(function(style) {
        currentStyle = style;
        addMapboxLayer();
        deferred.resolve();
        // __applyCurrentStyle__(true).then(
        //   function initSuccess() {
        //     deferred.resolve();
        //   },
        //   function initError() {
        //     deferred.reject();
        //   }
        // )
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
