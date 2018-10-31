goog.provide('ga_edit_directive');

goog.require('ga_debounce_service');
goog.require('ga_exportglstyle_service');
goog.require('ga_filestorage_service');
goog.require('ga_glstyle_service');
goog.require('ga_layers_service');
goog.require('ga_maputils_service');
goog.require('ga_mvt_service');

(function() {

  var module = angular.module('ga_edit_directive', [
    'ga_exportglstyle_service',
    'ga_filestorage_service',
    'ga_debounce_service',
    'ga_glstyle_service',
    'ga_layers_service',
    'ga_maputils_service',
    'ga_mvt_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaEdit', function($rootScope, $window, $translate, gaMvt,
      gaDebounce, gaFileStorage, gaExportGlStyle, gaGlStyle, gaLayers,
      gaMapUtils) {
    return {
      restrict: 'A',
      templateUrl: 'components/edit/partials/edit.html',
      scope: {
        map: '=gaEditMap',
        options: '=gaEditOptions',
        layer: '=gaEditLayer',
        isActive: '=gaEditActive'
      },
      link: function(scope, element, attrs, controller) {

        /// /////////////////////////////////
        // create/update the file on s3
        /// /////////////////////////////////
        var save = function(evt, layer) {
          if (!layer.adminId && !layer.externalStyleUrl) {
            return;
          }
          scope.statusMsgId = 'edit_file_saving';
          var id = layer.adminId || gaFileStorage.getFileIdFromFileUrl(
              layer.externalStyleUrl);
          gaExportGlStyle.create(layer).then(function(dataString) {
            gaFileStorage.save(id, dataString || '{}', 'application/json').then(
                function(data) {

                  scope.statusMsgId = 'edit_file_saved';

                  // If a file has been created we set the correct id to the
                  // layer
                  if (data.adminId && data.adminId !== layer.adminId) {
                    layer.adminId = data.adminId;
                    layer.externalStyleUrl = data.fileUrl;
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
          return !!(layer && layer.externalStyleUrl);
        };

        scope.export = function(evt, layer) {
          if (evt.currentTarget.attributes.disabled) {
            return;
          }
          gaExportGlStyle.createAndDownload(layer);
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
            gaMvt.reload(layer);
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

        var activate = function() {
          if (!scope.layer) {
            // TODO: watch a collection, takes the first vector tile.
            scope.layer = scope.map.getLayers().item(0);
          }
        };

        var deactivate = function() {
        };

        scope.$watch('isActive', function(active) {
          if (active) {
            activate();
          } else {
            deactivate();
          }
        });
        scope.$on('destroy', function() {
          deactivate();
        })
      }
    };
  });
})();
