(function() {
  goog.provide('ga_layer_metadata_popup_service');

  goog.require('ga_map_service');
  goog.require('ga_popup');

  var module = angular.module('ga_layer_metadata_popup_service', [
    'ga_map_service',
    'ga_popup',
    'pascalprecht.translate'
  ]);

  module.provider('gaLayerMetadataPopup', function() {
    this.$get = ['$translate', 'gaPopup', 'gaLayers',
        function($translate, gaPopup, gaLayers) {
          return function(bodid) {
            gaLayers.getMetaDataOfLayer(bodid)
            .success(function(data) {
              gaPopup.create({
                title: $translate('metadata_window_title'),
                content: data,
                x: 400,
                y: 200
              }).open();
            })
            .error(function() {
              //FIXME: better error handling
              var msg = 'Could not retrieve information for ' + bodid;
              alert(msg);
            });
          };
    }];
  });
})();
