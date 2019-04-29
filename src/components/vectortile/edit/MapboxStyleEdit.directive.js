goog.provide('ga_mapbox_style_edit_directive');

goog.require('ga_export_mapbox_style_service');
goog.require('ga_mapbox_style_storage_service');
goog.require('ga_debounce_service');
goog.require('ga_mvt_service');
goog.require('ga_background_service');
goog.require('ga_urlutils_service');
goog.require('ga_layers_service');

(function() {

  var module = angular.module('ga_mapbox_style_edit_directive', [
    'ga_export_mapbox_style_service',
    'ga_mapbox_style_storage_service',
    'ga_debounce_service',
    'ga_mvt_service',
    'ga_background_service',
    'ga_urlutils_service',
    'ga_layers_service',
    'ga_vector_tile_layer_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleEdit', function($rootScope, $window,
      $translate, gaMvt, gaDebounce, gaMapboxStyleStorage, gaExportMapboxStyle,
      gaBackground, gaUrlUtils, gaLayers, gaVectorTileLayerService) {
    return {
      restrict: 'A',
      templateUrl: 'components/vectortile/edit/partials/edit-style.html',
      scope: {
        map: '=gaMapboxStyleEditMap',
        options: '=gaMapboxStyleEditOptions',
        style: '=gaMapboxStyleEditStyle',
        isActive: '=gaMapboxStyleEditActive'
      },
      link: function(scope, element, attrs, controller) {
        // Test if the url comes from the layers config or from another place.
        // Returns true if the url comes from the layers config.
        // Returns true if the url comes from public.XXX storage.
        // Returns false otherwise.
        scope.isExternalStyleUrlValid = function() {
          var currentSyleUrl = gaVectorTileLayerService.getCurrentStyleUrl();
          var styleUrls = gaVectorTileLayerService.vectortileLayerConfig.styles.
              map(function(style) {
                return style.url;
              });
          return (styleUrls.indexOf(currentSyleUrl) !== -1) ||
            gaUrlUtils.isPublicValid(currentSyleUrl);
        }

        /// /////////////////////////////////
        // create/update the file on s3
        /// /////////////////////////////////
        var save = function(evt, style) {
          scope.statusMsgId = 'edit_file_saving';

          gaExportMapboxStyle.create(style).then(function(dataString) {

            if (!dataString) {
              return;
            }

            // Get the id to use by the glStyleStorage, if no id
            // the service will create a new one.
            var id = gaVectorTileLayerService.getVectorLayerBodId();
            gaMapboxStyleStorage.save(null, dataString).then(function(data) {
              scope.statusMsgId = 'edit_file_saved';

              // If a file has been created we set the correct id to the
              // layer
              if (data.adminId 
                  && gaVectorTileLayerService.getVectorTileLayersCount() > 0) {
                var layer = gaVectorTileLayerService.getVectorTileLayers()[0];
                layer.adminId = data.adminId;
                layer.externalStyleUrl = data.fileUrl;
                layer.useThirdPartyData = true;
              }
            }
            );
          });
        };
        scope.saveDebounced = gaDebounce.debounce(save, 2000, false, false);

        /// ////////////////////////////////
        // More... button functions
        /// ////////////////////////////////

        scope.canExportOrShare = function() {
          return gaVectorTileLayerService.getVectorTileLayersCount() > 0
          && gaVectorTileLayerService.getVectorTileLayers()[0].externalStyleUrl
        };

        scope.export = function(evt, style) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          gaExportMapboxStyle.createAndDownload(style);
          evt.preventDefault();
        };

        // Apply the default style to the layer.
        scope.reset = function(evt, style) {
          if (evt.currentTarget.attributes &&
              evt.currentTarget.attributes.disabled) {
            return;
          }
          var str = $translate.instant('edit_confirm_reset_style');
          if ($window.confirm(str)) {
            // Delete the file on server ?
            // layer.externalStyleUrl = undefined;
            // gaMvt.reload(layer, scope.map);
          }
        };

        /// /////////////////////////////////
        // Show share modal
        /// /////////////////////////////////
        scope.canShare = function(style) {
          return gaVectorTileLayerService.getVectorTileLayersCount() > 0
            && gaVectorTileLayerService.getVectorTileLayers()[0].externalStyleUrl;
        };
        scope.share = function(evt, style) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          var fakeLayer = {
            id: gaVectorTileLayerService.getVectorLayerBodId(),
            // externalStyleUrl: 
          }
          $rootScope.$broadcast('gaShareDrawActive', style);
        };

        scope.getBgLabelId = function() {
          var bg = gaBackground.get();
          return bg ? bg.label : '';
        };

        scope.$on('gaGlStyleChanged', function(evt, glStyle) {
          if (!scope.isActive) {
            return;
          }

          gaVectorTileLayerService.setCurrentStyle(glStyle);
          scope.saveDebounced({}, glStyle);
        });
      }
    };
  });
})();
