(function() {
  goog.provide('ga_main_controller');

  var module = angular.module('ga_main_controller', [
    'pascalprecht.translate'
  ]);

  function createMap() {
    var swissExtent = [420000, 900000, 30000, 350000];
    var swissProjection = ol.proj.configureProj4jsProjection({
      code: 'EPSG:21781',
      extent: swissExtent
    });

    var resolutions = [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5,
      2.0, 1.0, 0.5, 0.25, 0.1];

    var map = new ol.Map({
      controls: ol.control.defaults({
        attribution: false
      }),
      renderer: ol.RendererHint.CANVAS,
      view: new ol.View2D({
        projection: swissProjection,
        center: ol.extent.getCenter(swissExtent),
        resolution: 500.0,
        resolutions: resolutions
      })
    });

    return map;
  }
 
  function deviceHrefSwitcher(href, device) { 
    var mobileFlag = 'false';
    var desktopFlag = 'true';
    if (device === 'desktop') {
      mobileFlag = 'true';
      desktopFlag = 'false';
    }
    if (href.indexOf('mobile='+desktopFlag) > 0) {
      return href.replace('mobile='+desktopFlag,'mobile='+mobileFlag);
    } else {
      return href + '&mobile='+mobileFlag;
    }
  }

  /**
   * The application's main controller.
   */
  module.controller('GaMainController', ['$scope', '$rootScope', '$translate',
    'gaGlobalOptions',
    function($scope, $rootScope, $translate, gaGlobalOptions) {

      // The main controller creates the OpenLayers map object. The map object
      // is central, as most directives/components need a reference to it. So
      $scope.map = createMap();

      $scope.device = gaGlobalOptions.device;
      $scope.deviceSwitchHref = deviceHrefSwitcher(window.location.href,
        $scope.device);

      $rootScope.$on('gaTopicChange', function(event, topic) {
        $scope.topicId = topic.id;
      });

      $rootScope.$on('translationChangeSuccess', function() {
        $scope.langId = $translate.uses();
      });

      $rootScope.$on('gaPermalinkChange', function(event, permalink) {
        $scope.deviceSwitchHref = deviceHrefSwitcher(permalink, $scope.device);
      });

  }]);

})();
