(function() {
  goog.provide('ga_main_controller');

  goog.require('ga_map');

  var module = angular.module('ga_main_controller', [
    'pascalprecht.translate',
    'ga_map'
  ]);

  function createMap() {
    var swissExtent = [420000, 30000, 900000, 350000];
    var swissProjection = ol.proj.configureProj4jsProjection({
      code: 'EPSG:21781',
      extent: swissExtent
    });

    var resolutions = [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5,
      2.0, 1.0, 0.5, 0.25, 0.1];
 
    var map = new ol.Map({
      controls: ol.control.defaults({
        attribution: false,
        rotate: false,
        zoomOptions: {
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
      view: new ol.View2D({
        projection: swissProjection,
        center: ol.extent.getCenter(swissExtent),
        extent: swissExtent,
        resolution: 500.0,
        resolutions: resolutions
      }),
      ol3Logo: false
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
  }

  /**
   * The application's main controller.
   */
module.controller('GaMainController',
  function($scope, $rootScope, $translate, $timeout, $window,  gaPermalink,
    gaBrowserSniffer, gaLayersPermalinkManager, 
    gaFeaturesPermalinkManager) {
     
      // Determines if the window has a height <= 550
      var isWindowTooSmall = function() {
        return ($($window).height() <= 550);
      };

      var mobile = (gaBrowserSniffer.mobile) ? 'false' : 'true',
        dismiss = 'none';

      // The main controller creates the OpenLayers map object. The map object
      // is central, as most directives/components need a reference to it.
      $scope.map = createMap();
      
      // We add manually the keyboard interactions to have the possibility to
      // specify a condition
      var keyboardPan = new ol.interaction.KeyboardPan({
        condition: function() {
          return (!$scope.globals.isTimeSelectorActive);
        }
      });
      $scope.map.addInteraction(keyboardPan);
      $scope.map.addInteraction(new ol.interaction.KeyboardZoom());

      // Activate the "layers" parameter permalink manager for the map.
      gaLayersPermalinkManager($scope.map);

      // Activate the "features" permalink manager for the map.
      gaFeaturesPermalinkManager($scope.map);

      $rootScope.$on('gaTopicChange', function(event, topic) {
        $scope.topicId = topic.id;
        var showCatalog = topic.showCatalog ? 'show' : 'hide';
        if (gaBrowserSniffer.mobile ||
            isWindowTooSmall()) {
          showCatalog = 'hide';
        }
        $rootScope.$broadcast('catalogCollapse', showCatalog);
      });

      $rootScope.$on('$translateChangeEnd', function() {
        $scope.langId = $translate.uses();
        $('meta[name=description]').attr('content', $translate('page_description'));
      });

      $rootScope.$on('gaTimeSelectorChange', function(event, year) {
        $scope.time = year;
      });

      $scope.deviceSwitcherHref = gaPermalink.getHref({ mobile: mobile });
      $rootScope.$on('gaPermalinkChange', function() {
        $scope.deviceSwitcherHref = gaPermalink.getHref({ mobile: mobile });
      });

      $scope.globals = {
        searchFocused: false,
        homescreen: false,
        tablet: gaBrowserSniffer.mobile && !gaBrowserSniffer.phone,
        touch: gaBrowserSniffer.touchDevice,
        webkit: gaBrowserSniffer.webkit
      };

      $timeout(function() {
        $scope.globals.homescreen = gaBrowserSniffer.ios &&
          !gaBrowserSniffer.iosChrome &&
          !($window.localStorage.getItem('homescreen') == dismiss) &&
          !$window.navigator.standalone;
        $scope.$watch('globals.homescreen', function(newVal) {
          if (newVal == true) {
            return;
          }
          $window.localStorage.setItem('homescreen', dismiss);
        });
      }, 2000);
     
      // Try to manage the menu correctly when height is too small,
      // only on desktop.
      if (!gaBrowserSniffer.mobile) {
      
        $($window).on('resize', function() {
          if(isWindowTooSmall()) {
            $rootScope.$broadcast('catalogCollapse', 'hide');
          }
        });
        
        // Hide a panel clicking on its heading    
        var hidePanel = function(id) {
          if (!$('#' + id ).hasClass('collapse')) {
            $('#' + id + 'Heading').click();
          }
        }

        var hideAccordionPanels = function() {
          hidePanel('share')
          hidePanel('print')
          hidePanel('tools')
        }

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
     
      // When a menu of accordion (tools, share, print) is shown, the others
      // panels (catalog and selection) are collapsed but their headings
      // haven't the 'collapsed' css applied. So we force it.
      $('#catalog').on('hidden.bs.collapse', function() {
        $('#catalogHeading').addClass('collapsed');
      });
    
      $('#selection').on('hidden.bs.collapse', function() {
        $('#selectionHeading').addClass('collapsed');
      });
  });

})();
