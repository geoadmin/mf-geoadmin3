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
    this.$get = function(gaWaitCursor, $translate, $rootScope, $sce,
        gaPopup, gaLayers) {
      var popupContent = '<div ng-bind-html="options.result.html"></div>';

      var LayerMetadataPopup = function() {
        var popups = {};

        var create = function(bodid) {
          var result = {html: ''},
              popup;

          // Called to update the content
          var updateContent = function(init) {

            var handleResult = function() {
              gaWaitCursor.remove();
              if (init) {
                popup.open();
              }
            };

            gaWaitCursor.add();
            gaLayers.getMetaDataOfLayer(bodid)
              .success(function(data) {
                result.html = $sce.trustAsHtml(data);
                handleResult();
              })
              .error(function() {
                handleResult();
                //FIXME: better error handling
                var msg = 'Could not retrieve information for ' + bodid;
                alert(msg);
              });
          };

          //We assume popup does not exist yet
          popup = gaPopup.create({
            title: $translate('metadata_window_title'),
            destroyOnClose: false,
            content: popupContent,
            result: result,
            className: 'ga-tooltip-metadata',
            x: 400,
            y: 200,
            showPrint: true
          });
          popups[bodid] = popup;

          updateContent(true);

          $rootScope.$on('$translateChangeEnd', function() {
            updateContent(false);
          });

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
