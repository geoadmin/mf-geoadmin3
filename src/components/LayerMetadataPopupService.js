goog.provide('ga_layermetadatapopup_service');

goog.require('ga_map_service');
goog.require('ga_popup');
goog.require('ga_wms_service');

(function() {

  var module = angular.module('ga_layermetadatapopup_service', [
    'ga_map_service',
    'ga_popup',
    'ga_wms_service',
    'pascalprecht.translate'
  ]);

  module.provider('gaLayerMetadataPopup', function() {
    this.$get = function($translate, $rootScope, $sce, $q, gaPopup, gaLayers,
        gaMapUtils, gaWms, gaLang, $window) {
      var popupContent = '<div ng-bind-html="options.result.html"></div>';

      // Called to update the content
      var updateContent = function(popup, layer) {
        var promise;
        if (layer.bodId) {
          promise = gaLayers.getMetaDataOfLayer(layer.bodId);
        } else if (gaMapUtils.isExternalWmsLayer(layer)) {
          promise = gaWms.getLegend(layer);
        }
        return promise.then(function(resp) {
          popup.scope.options.result.html = $sce.trustAsHtml(resp.data);
          popup.scope.options.lang = gaLang.get();
        }, function() {
          popup.scope.options.lang = undefined;
          // FIXME: better error handling
          $window.alert('Could not retrieve information for ' + layer.id);
        });
      };

      var updateContentLang = function(popup, layer, newLang, open) {
        if ((open || popup.scope.toggle) &&
            popup.scope.options.lang != newLang) {
          return updateContent(popup, layer);
        }
        return $q.when();
      };

      var LayerMetadataPopup = function() {
        var popups = {};

        var create = function(layer) {
          var result = {html: ''},
            popup;

          // We assume popup does not exist yet
          popup = gaPopup.create({
            title: $translate.instant('metadata_window_title'),
            destroyOnClose: false,
            content: popupContent,
            result: result,
            className: 'ga-tooltip-metadata ga-popup-tablet-full',
            x: 400,
            y: 200,
            showPrint: true
          });
          popups[layer.id] = popup;

          // Open popup only on success
          updateContent(popup, layer).then(function() {
            popup.open();
          });

          $rootScope.$on('$translateChangeEnd', function(evt, newLang) {
            updateContentLang(popup, layer, newLang);
          });
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
              updateContentLang(popup, layer, gaLang.get(), true)
                  .then(function() {
                    popup.open();
                  });
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
