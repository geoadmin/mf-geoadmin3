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
    this.$get = function($document, $translate, $rootScope, $sce,
        gaPopup, gaLayers) {
      var popupContent = '<div ng-bind-html=' +
          '"options.results[options.bodid]"></div>';

      var LayerMetadataPopup = function() {
        var popups = {};
        var results = {};
        var waitClass = 'ga-metadata-popup-wait';
        var bodyEl = angular.element($document[0].body);

        this.get = function(bodid) {
          bodyEl.addClass(waitClass);
          gaLayers.getMetaDataOfLayer(bodid)
            .success(function(data) {
              var popup = popups[bodid];
              bodyEl.removeClass(waitClass);
              results[bodid] = $sce.trustAsHtml(data);
              if (!popup) {
                popups[bodid] = gaPopup.create({
                  title: $translate('metadata_window_title'),
                  destroyOnClose: false,
                  content: popupContent,
                  bodid: bodid,
                  results: results,
                  className: 'ga-tooltip-metadata',
                  x: 400,
                  y: 200,
                  showPrint: true
                });
                popups[bodid].open();
              }
            })
            .error(function() {
              bodyEl.removeClass(waitClass);
              //FIXME: better error handling
              var msg = 'Could not retrieve information for ' + bodid;
              alert(msg);
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
            this.get(bodid);
          }
        };

        this.refresh = function() {
          var that = this;
          var keys = [];
          var n = 0;
          for (var k in popups) keys.push(k);
          var recursiveFetch = function(n) {
            if (n < keys.length) {
              var bodid = keys[n];
              var popup = popups[bodid];
              that.get(bodid);
              recursiveFetch(n + 1);
            }
          };
          recursiveFetch(0);
        };
      };

      var metadataPopup = new LayerMetadataPopup();

      $rootScope.$on('$translateChangeEnd', function() {
        metadataPopup.refresh();
      });

      return metadataPopup;
    };
  });
})();
