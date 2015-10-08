goog.provide('ga_main_controller');

goog.require('ga_background_service');
goog.require('ga_map');
goog.require('ga_networkstatus_service');
goog.require('ga_storage_service');
goog.require('ga_topic_service');
(function() {


  var module = angular.module('ga_main_controller', [
    'pascalprecht.translate',
    'ga_map',
    'ga_networkstatus_service',
    'ga_storage_service',
    'ga_background_service',
    'ga_topic_service'
  ]);

  /**
   * The application's main controller.
   */
  module.controller('GaMainController', function($rootScope, $scope, $timeout,
      $translate, $window, $document, gaBrowserSniffer, gaHistory,
      gaFeaturesPermalinkManager, gaLayersPermalinkManager, gaMapUtils,
      gaRealtimeLayersManager, gaNetworkStatus, gaPermalink, gaStorage,
      gaGlobalOptions, gaBackground, gaTime, gaLayers, gaTopic) {

    var createMap = function() {
      var toolbar = $('#zoomButtons')[0];
      var defaultProjection = ol.proj.get(gaGlobalOptions.defaultEpsg);
      defaultProjection.setExtent(gaGlobalOptions.defaultEpsgExtent);

      var map = new ol.Map({
        controls: ol.control.defaults({
          attribution: false,
          rotate: false,
          zoomOptions: {
            target: toolbar,
            zoomInLabel: '',
            zoomOutLabel: '',
            zoomInTipLabel: '',
            zoomOutTipLabel: ''
          }
        }),
        interactions: ol.interaction.defaults({
          altShiftDragRotate: true,
          touchRotate: false,
          keyboard: false
        }).extend([
          new ol.interaction.DragZoom()
        ]),
        renderer: 'canvas',
        view: new ol.View({
          projection: defaultProjection,
          center: ol.extent.getCenter(gaMapUtils.defaultExtent),
          extent: gaMapUtils.defaultExtent,
          resolution: gaMapUtils.defaultResolution,
          resolutions: gaMapUtils.viewResolutions
        }),
        logo: false
      });

      var dragClass = 'ga-dragging';
      var viewport = $(map.getViewport());
      map.on('dragstart', function() {
        viewport.addClass(dragClass);
      });
      map.on('dragend', function() {
        viewport.removeClass(dragClass);
      });

      return map;
    };

    var rotateOnEnable = true;

    // Url of ol3cesium library
    var ol3CesiumLibUrl = gaGlobalOptions.resourceUrl + 'lib/ol3cesium.js';

    var intParam = function(name, defaultValue) {
      var params = gaPermalink.getParams();
      return parseInt(params[name] || defaultValue, 10);
    };

    // Create the cesium viewer with basic layers
    var loadCesiumViewer = function(map, enabled) {
      var tileCacheSize = intParam('tileCacheSize', '100');
      var maximumScreenSpaceError = intParam('maximumScreenSpaceError', '2');
      window.minimumRetrievingLevel = intParam('minimumRetrievingLevel', '6');
      var cesiumViewer = new olcs.OLCesium({
        map: map,
        createSynchronizers: function(map, scene) {
           return [
             new ga.GaRasterSynchronizer(map, scene),
             new olcs.VectorSynchronizer(map, scene)
           ];
        }
      });
      var globe = cesiumViewer.getCesiumScene().globe;
      globe.baseColor = Cesium.Color.WHITE;
      globe.tileCacheSize = tileCacheSize;
      globe.maximumScreenSpaceError = maximumScreenSpaceError;
      cesiumViewer.setEnabled(enabled);
      var scene = cesiumViewer.getCesiumScene();
      scene.globe.depthTestAgainstTerrain = true;
      scene.terrainProvider =
          gaLayers.getCesiumTerrainProviderById(gaGlobalOptions.defaultTerrain);
      enableOl3d(cesiumViewer, enabled);
      return cesiumViewer;
    };

    var enableOl3d = function(ol3d, enable) {
      var scene = ol3d.getCesiumScene();
      var camera = scene.camera;
      var bottom = olcs.core.pickBottomPoint(scene);
      var transform = Cesium.Matrix4.fromTranslation(bottom);
      if (enable) {
        // 2d -> 3d transition
        ol3d.setEnabled(true);
        var angle = Cesium.Math.toRadians(50);
        // This guard is used because the rotation is in conflict
        // with the permalink driven initilisation of the view in
        // the map directive. It's ... clumsy.
        if (rotateOnEnable) {
          olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform);
        }
        rotateOnEnable = true;
      } else {
        // 3d -> 2d transition
        var angle = olcs.core.computeAngleToZenith(scene, bottom);
        olcs.core.rotateAroundAxis(camera, -angle, camera.right, transform, {
          callback: function() {
            ol3d.setEnabled(false);
            var view = ol3d.getOlMap().getView();
            var resolution = view.getResolution();
            var rotation = view.getRotation();

            view.setResolution(view.constrainResolution(resolution));
            view.setRotation(view.constrainRotation(rotation));
          }
        });
      }
    };

    // Determines if the window has a height <= 550
    var isWindowTooSmall = function() {
      return ($($window).height() <= 550);
    };
    var dismiss = 'none';

    $scope.ol3d = undefined;

    // The main controller creates the OpenLayers map object. The map object
    // is central, as most directives/components need a reference to it.
    $scope.map = createMap();

    if (gaGlobalOptions.dev3d && gaBrowserSniffer.webgl) {
      $scope.map.on('change:target', function(event) {
        if (!!$scope.map.getTargetElement()) {
          $scope.$watch('globals.is3dActive', function(active) {
            if (active && !$scope.ol3d) {
              if (!$window.olcs) {
                // lazy load cesium library
                $.getScript(ol3CesiumLibUrl, function() {
                  $scope.$applyAsync(function() {
                    $scope.ol3d = loadCesiumViewer($scope.map, active);
                  });
                });
              } else {
                // cesium library is already loaded
                $scope.ol3d = loadCesiumViewer($scope.map, active);
              }
            } else if ($scope.ol3d) {
              enableOl3d($scope.ol3d, active);
            }
          });
        }
      });
      gaLayers.loadConfig().then(function() {
        var params = gaPermalink.getParams();
        if (params.lon !== undefined && params.lat !== undefined) {
          rotateOnEnable = false;
          $scope.globals.is3dActive = true;
        }
      });
    }

    // We add manually the keyboard interactions to have the possibility to
    // specify a condition
    var keyboardPan = new ol.interaction.KeyboardPan({
      condition: function() {
        return (!gaTime.get());
      }
    });
    $scope.map.addInteraction(keyboardPan);
    $scope.map.addInteraction(new ol.interaction.KeyboardZoom());

    // Start managing global time parameter, when all permalink layers are
    // added.
    gaTime.init($scope.map);

    // Load the background if the "bgLayer" parameter exist.
    gaBackground.init($scope.map);

    // Activate the "layers" parameter permalink manager for the map.
    gaLayersPermalinkManager($scope.map);

    // Activate the "features" permalink manager for the map.
    gaFeaturesPermalinkManager($scope.map);

    gaRealtimeLayersManager($scope.map);

    var initWithPrint = /print/g.test(gaPermalink.getParams().widgets);
    var initWithFeedback = /feedback/g.test(gaPermalink.getParams().widgets);
    var initWithDraw = /draw/g.test(gaPermalink.getParams().widgets) ||
        !!(gaPermalink.getParams().adminId);
    gaPermalink.deleteParam('widgets');

    var onTopicChange = function(event, topic) {
      $scope.topicId = topic.id;

      // iOS 7 minimal-ui meta tag bug
      if (gaBrowserSniffer.ios) {
        $window.scrollTo(0, 0);
      }
      if (topic.activatedLayers.length) {
        $scope.globals.selectionShown = true;
        $scope.globals.catalogShown = false;
      } else if (topic.selectedLayers.length) {
        $scope.globals.catalogShown = true;
        $scope.globals.selectionShown = false;
      }
    };
    gaTopic.loadConfig().then(function() {
      $scope.topicId = gaTopic.get().id;

      if (initWithPrint) {
        $scope.globals.printShown = true;
      } else if (initWithFeedback) {
        $scope.globals.feedbackPopupShown = initWithFeedback;
      } else if (initWithDraw) {
        $scope.globals.isDrawActive = initWithDraw;
      } else {
        onTopicChange(null, gaTopic.get());
      }
      $rootScope.$on('gaTopicChange', onTopicChange);
    });

    $rootScope.$on('$translateChangeEnd', function() {
      $scope.langId = $translate.use();
      var descr = $translate.instant('page_description');
      var title = $translate.instant('page_title');
      $('meta[name=description]').attr('content', descr);
      $('meta[property="og:description"]').attr('content', descr);
      $('meta[name="twitter:description"]').attr('content', descr);
      $('meta[itemprop="description"]').attr('content', descr);
      $('meta[name="application-name"]').attr('content', title);
    });

    $scope.time = gaTime.get();
    $rootScope.$on('gaTimeChange', function(event, time) {
      $scope.time = time; // Used in embed page
    });

    // Create switch device url
    var switchToMobile = '' + !gaBrowserSniffer.mobile;
    $scope.host = {url: $window.location.host}; // only use in embed.html
    $scope.toMainHref = gaPermalink.getMainHref();
    $scope.deviceSwitcherHref = gaPermalink.getHref({mobile: switchToMobile});
    $rootScope.$on('gaPermalinkChange', function() {
      $scope.toMainHref = gaPermalink.getMainHref();
      $scope.deviceSwitcherHref = gaPermalink.getHref({mobile: switchToMobile});
    });

    $scope.globals = {
      dev3d: gaGlobalOptions.dev3d,
      searchFocused: !gaBrowserSniffer.mobile,
      homescreen: false,
      tablet: gaBrowserSniffer.mobile && !gaBrowserSniffer.phone,
      phone: gaBrowserSniffer.phone,
      touch: gaBrowserSniffer.touchDevice,
      webkit: gaBrowserSniffer.webkit,
      ios: gaBrowserSniffer.ios,
      offline: gaNetworkStatus.offline,
      embed: gaBrowserSniffer.embed,
      pulldownShown: !(gaBrowserSniffer.mobile || $($window).width() <= 1024),
      printShown: false,
      catalogShown: false,
      selectionShown: false,
      feedbackPopupShown: false,
      isShareActive: false,
      isDrawActive: false,
      isFeatureTreeActive: false,
      isSwipeActive: false,
      is3dActive: false
    };

    // Deactivate all tools when draw is opening
    $scope.$watch('globals.isDrawActive', function(active) {
      if (active) {
        $scope.globals.feedbackPopupShown = false;
        $scope.globals.isFeatureTreeActive = false;
        $scope.globals.isSwipeActive = false;
      }
    });
    $rootScope.$on('gaNetworkStatusChange', function(evt, offline) {
      $scope.globals.offline = offline;
    });

    $timeout(function() {
      $scope.globals.homescreen = gaBrowserSniffer.ios &&
        !gaBrowserSniffer.iosChrome &&
        !(gaStorage.getItem('homescreen') == dismiss) &&
        !$window.navigator.standalone;
      $scope.$watch('globals.homescreen', function(newVal) {
        if (newVal == true) {
          return;
        }
        gaStorage.setItem('homescreen', dismiss);
      });
    }, 2000);

    // Try to manage the menu correctly when height is too small,
    // only on desktop.
    if (!gaBrowserSniffer.mobile) {


      // Exit Draw mode when pressing ESC or BAckspace button
      $document.keydown(function(evt) {
        if (evt.which == 8) {
          if (!/^(input|textarea)$/i.test(evt.target.tagName)) {
            evt.preventDefault();
          } else {
            return;
          }
        }
        if ((evt.which == 8 || evt.which == 27) &&
          $scope.globals.isDrawActive) {
          $scope.globals.isDrawActive = false;
          $scope.$digest();
        }
      });

      // Browser back button management
      $scope.$watch('globals.isDrawActive', function(isActive) {
        if (isActive && gaHistory) {
          gaHistory.replaceState({
            isDrawActive: false
          }, '', gaPermalink.getHref());

          gaHistory.pushState(null, '', gaPermalink.getHref());
        }
      });
      $window.onpopstate = function(evt) {
        // When we go to full screen evt.state is null
        if (evt.state && evt.state.isDrawActive === false) {
          $scope.globals.isDrawActive = false;
          gaPermalink.refresh();
          $scope.$digest();
        }
      };

      $($window).on('resize', function() {
        if (isWindowTooSmall()) {
          if ($scope.globals.catalogShown) {
            $scope.$applyAsync(function() {
              $scope.globals.catalogShown = false;
            });
          }
        }
      });

      // Hide a panel clicking on its heading
      var hidePanel = function(id) {
        if ($('#' + id).hasClass('in')) {
          $('#' + id + 'Heading').click();
        }
      };

      var hideAccordionPanels = function() {
        hidePanel('share');
        hidePanel('print');
        hidePanel('tools');
      };

      $('#catalog').on('shown.bs.collapse', function() {
        // Close accordion
        hideAccordionPanels();

        if (isWindowTooSmall()) {
          // Close selection
          hidePanel('selection');
        }
      });

      $('#selection').on('shown.bs.collapse', function() {
        // Close accordion
        hideAccordionPanels();

        if (isWindowTooSmall()) {
          // Close catalog
          hidePanel('catalog');
        }
      });
    }

    // An appcache update is available.
    if ($window.applicationCache) { // IE9
      $window.applicationCache.addEventListener('updateready', function(e) {
        $window.location.reload();
      });
    }
  });
})();

