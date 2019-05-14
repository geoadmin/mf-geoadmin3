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
            if (!gaVectorTileLayerService.getVectorTileLayer()) {
              return;
            }

            var mapboxLayer = gaVectorTileLayerService.getVectorTileLayer();

            // Get the id to use by the glStyleStorage, if no id
            // the service will create a new one.
            var id = mapboxLayer.adminId;
            gaMapboxStyleStorage.save(id, dataString).then(function(data) {
              scope.statusMsgId = 'edit_file_saved';

              // If a file has been created we set the correct id to the
              // layer
              if (data.adminId && mapboxLayer) {
                mapboxLayer.adminId = data.adminId;
                mapboxLayer.externalStyleUrl = data.fileUrl;
                mapboxLayer.useThirdPartyData = true;
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
          return gaVectorTileLayerService.getVectorTileLayer() &&
            gaVectorTileLayerService.getVectorTileLayer().externalStyleUrl
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
            gaVectorTileLayerService.switchToStyleAtIndex(0);
          }
        };

        /// /////////////////////////////////
        // Show share modal
        /// /////////////////////////////////
        scope.canShare = function(style) {
          return gaVectorTileLayerService.getVectorTileLayer() &&
            gaVectorTileLayerService.getVectorTileLayer().externalStyleUrl;
        };
        scope.share = function(evt, style) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          var mapboxLayer = gaVectorTileLayerService.getVectorTileLayer();
          var fakeLayer = {
            id: gaVectorTileLayerService.getVectorLayerBodId(),
            externalStyleUrl: mapboxLayer.externalStyleUrl,
            adminId: mapboxLayer.adminId,
            glStyle: style
          }
          $rootScope.$broadcast('gaShareDrawActive', fakeLayer);
        };

        scope.getBgLabelId = function() {
          var bg = gaBackground.get();
          return bg ? bg.label : '';
        };

        scope.$on('gaGlStyleChanged', function(evt, glStyle) {
          if (!scope.isActive) {
            return;
          }

          scope.saveDebounced({}, glStyle);
          gaVectorTileLayerService.setCurrentStyle(glStyle);
        });
      }
    };
  });
})();
