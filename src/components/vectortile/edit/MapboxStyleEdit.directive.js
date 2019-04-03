goog.provide('ga_mapbox_stye_edit_directive');

goog.require('ga_background_service');
goog.require('ga_debounce_service');
goog.require('ga_exportglstyle_service');
goog.require('ga_filestorage_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_mvt_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_mapbox_stye_edit_directive', [
    'ga_exportglstyle_service',
    'ga_glstylestorage_service',
    'ga_debounce_service',
    'ga_maputils_service',
    'ga_mvt_service',
    'ga_background_service',
    'ga_urlutils_service',
    'ga_layers_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleEdit', function($rootScope, $window,
      $translate, gaMvt, gaDebounce, gaGlStyleStorage, gaExportGlStyle,
      gaMapUtils, gaBackground, gaUrlUtils, gaLayers) {
    return {
      restrict: 'A',
      templateUrl: 'components/vectortile/edit/partials/edit-style.html',
      scope: {
        map: '=gaEditMap',
        options: '=gaEditOptions',
        layer: '=gaEditLayer',
        isActive: '=gaEditActive'
      },
      link: function(scope, element, attrs, controller) {

        // Test if the url comes from the layers config or from another place.
        // Returns true if the url comes from the layers config.
        // Returns true if the url comes from public.XXX storage.
        // Returns false otherwise.
        scope.isExternalStyleUrlValid = function(layer) {
          if (!layer || !layer.externalStyleUrl) {
            return true;
          }
          var styleUrls = (gaLayers.getLayerProperty(layer.id, 'styles') ||
              []).map(function(style) {
            return style.url;
          });
          return (styleUrls.indexOf(layer.externalStyleUrl) !== -1) ||
            gaUrlUtils.isPublicValid(layer.externalStyleUrl);
        }

        /// /////////////////////////////////
        // create/update the file on s3
        /// /////////////////////////////////
        var save = function(evt, layer, glStyle) {
          scope.statusMsgId = 'edit_file_saving';

          gaExportGlStyle.create(glStyle).then(function(dataString) {

            if (!dataString) {
              return;
            }

            // Get the id to use by the glStyleStorage, if no id
            // the service will create a new one.
            var id = layer.adminId;
            gaGlStyleStorage.save(id, dataString).then(function(data) {
              scope.statusMsgId = 'edit_file_saved';

              // If a file has been created we set the correct id to the
              // layer
              if (data.adminId) {
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

        scope.canExport = function(layer) {
          return !!(layer && layer.glStyle);
        };

        scope.export = function(evt, layer) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          gaExportGlStyle.createAndDownload(layer.glStyle);
          evt.preventDefault();
        };

        // Apply the default style to the layer.
        scope.reset = function(evt, layer) {
          if (evt.currentTarget.attributes &&
              evt.currentTarget.attributes.disabled) {
            return;
          }
          var str = $translate.instant('edit_confirm_reset_style');
          if ($window.confirm(str)) {
            // Delete the file on server ?
            layer.externalStyleUrl = undefined;
            gaMvt.reload(layer, scope.map);
          }
        };

        /// /////////////////////////////////
        // Show share modal
        /// /////////////////////////////////
        scope.canShare = function(layer) {
          return !!(layer && layer.adminId);
        };
        scope.share = function(evt, layer) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          $rootScope.$broadcast('gaShareDrawActive', layer);
        };

        scope.getBgLabelId = function() {
          var bg = gaBackground.get();
          return bg ? bg.label : '';
        };

        scope.$on('gaGlStyleChanged', function(evt, glStyle) {
          if (!scope.isActive) {
            return;
          }

          gaMapUtils.applyGlStyleToOlLayer(scope.layer, glStyle);
          gaMapUtils.setGlBackground(scope.map, glStyle);
          scope.saveDebounced({}, scope.layer, glStyle);
        });
      }
    };
  });
})();
