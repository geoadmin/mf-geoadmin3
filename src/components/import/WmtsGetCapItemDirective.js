goog.provide('ga_wmtsgetcapitem_directive');

(function() {

  var module = angular.module('ga_wmtsgetcapitem_directive', []);

  module.controller('GaWmtsGetCapItemDirectiveController', function($scope) {
    var options = $scope.options;

    // Add preview layer
    $scope.addPreviewLayer = function(evt, getCapLayer) {
      evt.stopPropagation();
      options.layerHovered = getCapLayer;
      if (getCapLayer.isInvalid) {
        return;
      }
      options.addPreviewLayer($scope.map, getCapLayer);
    };

    // Remove preview layer
    $scope.removePreviewLayer = function(evt) {
      evt.stopPropagation();
      options.layerHovered = null;
      options.removePreviewLayer($scope.map);
    };

    // Select the layer clicked
    $scope.toggleLayerSelected = function(evt, getCapLayer) {
      evt.stopPropagation();

      options.layerSelected = options.layerSelected &&
          options.layerSelected.Title === getCapLayer.Title ?
        null : getCapLayer;
    };
  });

  module.directive('gaWmtsGetCapItem', function($compile) {

    // Zoom to layer extent
    var zoomToLayerExtent = function(scope, layer, map) {
      var extent = layer.extent;
      if (scope.options.transformExtent) {
        extent = scope.options.transformExtent(layer.extent);
      }
      var view = map.getView();
      var mapSize = map.getSize();
      if (extent) {
        view.fit(extent, mapSize);
      }
    };

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/wmts-get-cap-item.html',
      controller: 'GaWmtsGetCapItemDirectiveController',
      compile: function(elt) {
        var contents = elt.contents().remove();
        var compiledContent = void 0;
        return function(scope, elt) {
          if (!compiledContent) {
            compiledContent = $compile(contents);
          }
          compiledContent(scope, function(clone, scope) {
            elt.append(clone);
          });

          var headerGroup = elt.find('> .ga-header-group');
          headerGroup.find('.fa-zoom-in').on('click', function(evt) {
            evt.stopPropagation();
            zoomToLayerExtent(scope, scope.layer, scope.map);
          });
        };
      }
    };
  });
})();
