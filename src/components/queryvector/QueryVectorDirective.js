goog.provide('ga_query_vector_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_vector_tile_layer_service');

(function() {
  var module = angular.module('ga_query_vector_directive', [
    'ga_browsersniffer_service'
  ]);

  var registerPointerMove = function(scope, map, overlay, mobile,
      gaVectorTileLayerService) {
    var evtType = mobile ? 'singleclick' : 'pointermove';
    return map.on(evtType, function(evt) {
      var coord = evt.coordinate;
      overlay.setPosition(coord);
      var features = gaVectorTileLayerService.getFeaturesUnderMousePointer();
      if (features) {
        var flatFeatures = [];
        features.forEach(function(feature) {
          var flatProperties = [];
          var properties = feature.properties;
          var keys = Object.keys(properties);
          angular.forEach(keys, function(key) {
            flatProperties.push([key, properties[key]]);
          });
          flatFeatures.push(flatProperties);
        });
        scope.$apply(function() {
          scope.flatFeatures = flatFeatures;
        });
      } else {
        // Hide popup if no features are found
        overlay.setPosition(undefined);
      }
    });
  };

  var registerMouseOut = function(map, overlay) {
    return map.getViewport().addEventListener('mouseout', function() {
      overlay.setPosition(undefined);
    });
  };

  module.directive('gaQueryVector', function($rootScope, gaBrowserSniffer,
      gaVectorTileLayerService) {
    return {
      restrict: 'A',
      templateUrl: 'components/queryvector/partials/queryvector.html',
      replace: true,
      scope: {
        map: '=gaQueryVectorMap'
      },
      link: function(scope, elt) {
        scope.flatFeatures = [];

        var mobile = gaBrowserSniffer.mobile;
        var pointerMoveListeners = [];
        var map = scope.map;
        var popup = elt.find('div.ga-query-vector-popup');
        var overlay = new ol.Overlay({
          element: popup.prevObject[0],
          autoPan: mobile
        });

        map.addOverlay(overlay);

        var activate = function() {
          pointerMoveListeners.push(
              registerPointerMove(scope, map, overlay, mobile,
                  gaVectorTileLayerService));
          pointerMoveListeners.push(registerMouseOut(map, overlay));
        };

        var deactivate = function() {
          while (pointerMoveListeners.length > 0) {
            var l = pointerMoveListeners.pop();
            ol.Observable.unByKey(l);
          }
          overlay.setPosition(undefined);
        };

        $rootScope.$on('gaToggleInspectMode', function(e, active) {
          if (active) {
            activate();
          } else {
            deactivate();
          }
        });
      }
    };
  });
})();
