(function() {
  goog.provide('ga_layer_metadata_popup_service');

  goog.require('ga_map_service');
  goog.require('ga_popup');
  goog.require('ga_waitcursor_service');

  var module = angular.module('ga_layer_metadata_popup_service', [
    'ga_map_service',
    'ga_popup',
    'ga_waitcursor_service',
    'pascalprecht.translate'
  ]);

  module.provider('gaLayerMetadataPopup', function() {
    this.$get = function($translate, gaWaitCursor, gaPopup, gaLayers) {
      // Keep track of existing popups
      var popups = {};

      // This service acts as a toggle. Repeated calls with
      // the same bodid will 'toggle' the popup with the
      // meta information.
      return function(bodid) {
        var popup = popups[bodid];
        if (popup) { // if the popup already exist we toggle it
          if (popup.scope.toggle) {
            popups[bodid].close();
          } else {
            popups[bodid].open();
          }
        } else {
          gaWaitCursor.add();
          gaLayers.getMetaDataOfLayer(bodid)
            .success(function(data) {
              popups[bodid] = gaPopup.create({
                title: $translate('metadata_window_title'),
                content: data,
                className: 'ga-tooltip-metadata',
                x: 400,
                y: 200,
                showPrint: true
              });
              gaWaitCursor.remove();
              popups[bodid].open();
            })
            .error(function() {
              gaWaitCursor.remove();
              //FIXME: better error handling
              var msg = 'Could not retrieve information for ' + bodid;
              alert(msg);
            });
        }
      };
    };
  });
})();
