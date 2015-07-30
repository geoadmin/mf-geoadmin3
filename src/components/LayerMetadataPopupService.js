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
    this.$get = function($translate, $rootScope, $sce, gaPopup, gaLayers) {
      var popupContent = '<div ng-bind-html="options.result.html"></div>';

      var LayerMetadataPopup = function() {
        var popups = {};

        var create = function(bodid) {
          var result = {html: ''},
              popup;

          // Called to update the content
          var updateContent = function() {
            return gaLayers.getMetaDataOfLayer(bodid).success(function(data) {
              result.html = $sce.trustAsHtml(data);
            }).error(function() {
              //FIXME: better error handling
              alert('Could not retrieve information for ' + bodid);
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
          popups[bodid] = popup;

          // Open popup only on success
          updateContent().then(function() {
            popup.open();
          });

          $rootScope.$on('$translateChangeEnd', updateContent);
        };

        this.toggle = function(bodid) {
          var popup = popups[bodid];
          if (popup) { // if the popup already exist we toggle it
            if (popup.scope.toggle) {
              popup.close();
            } else {
              popup.open();
            }
          } else {
            create(bodid);
          }
        };
      };

      return new LayerMetadataPopup();
    };
  });
})();
