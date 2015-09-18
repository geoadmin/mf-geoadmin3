goog.provide('ga_layer_metadata_popup_service');

goog.require('ga_map_service');
goog.require('ga_popup');
(function() {

  var module = angular.module('ga_layer_metadata_popup_service', [
    'ga_map_service',
    'ga_popup',
    'pascalprecht.translate'
  ]);

  module.provider('gaLayerMetadataPopup', function() {
    this.$get = function($translate, $rootScope, $sce, gaPopup, gaLayers,
        gaMapUtils, gaWms) {
      var popupContent = '<div ng-bind-html="options.result.html"></div>';

      var LayerMetadataPopup = function() {
        var popups = {};

        var create = function(layer) {
          var result = {html: ''},
              popup;

          // Called to update the content
          var updateContent = function() {
            var promise;
            if (layer.bodId) {
              promise = gaLayers.getMetaDataOfLayer(layer.bodId);
            } else if (gaMapUtils.isExternalWmsLayer(layer)) {
              promise = gaWms.getLegend(layer);
            }
            return promise.then(function(resp) {
              result.html = $sce.trustAsHtml(resp.data);
            }, function() {
              //FIXME: better error handling
              alert('Could not retrieve information for ' + layer.id);
            });
          };

          //We assume popup does not exist yet
          popup = gaPopup.create({
            title: $translate.instant('metadata_window_title'),
            destroyOnClose: false,
            content: popupContent,
            result: result,
            className: 'ga-tooltip-metadata',
            x: 400,
            y: 200,
            showPrint: true
          });
          popups[layer.id] = popup;

          // Open popup only on success
          updateContent().then(function() {
            popup.open();
          });

          $rootScope.$on('$translateChangeEnd', updateContent);
        };

        this.toggle = function(olLayerOrBodId) {
          var layer = olLayerOrBodId;
          if (angular.isString(layer)) {
            layer = gaLayers.getOlLayerById(layer);
          }
          var popup = popups[layer.id];
          if (popup) { // if the popup already exist we toggle it
            if (popup.scope.toggle) {
              popup.close();
            } else {
              popup.open();
            }
          } else {
            create(layer);
          }
        };
      };

      return new LayerMetadataPopup();
    };
  });
})();
