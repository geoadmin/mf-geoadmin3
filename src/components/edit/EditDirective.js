goog.provide('ga_edit_directive');

goog.require('ga_exportglstyle_service');

(function() {

  var module = angular.module('ga_edit_directive', [
    'ga_exportglstyle_service'
  ]);

  /**
   * This directive add a toolbar to draw feature on a map.
   * Options:
   *
   *   - broadcastLayer : send the current layer drawn through the rootScope
   *                      with the event 'gaDrawingLayer'.
   *   - useTemporaryLayer: force to use a new layer which will not be saved
   *                        automatically on s3.
   *
   */
  /*

goog.require('ga_definepropertiesforlayer_service');
goog.require('ga_event_service');
goog.require('ga_exportkml_service');
goog.require('ga_filestorage_service');
goog.require('ga_geomutils_service');
goog.require('ga_layerfilters_service');
goog.require('ga_maputils_service');
goog.require('ga_measure_service');
goog.require('ga_styles_service');

    'ga_definepropertiesforlayer_service',
    'ga_exportkml_service',
    'ga_event_service',
    'ga_filestorage_service',
    'ga_geomutils_service',
    'ga_layerfilters_service',
    'ga_maputils_service',
    'ga_measure_service',
    'ga_styles_service',
    'pascalprecht.translate'

  $translate, $rootScope, $timeout,
      gaBrowserSniffer, gaDefinePropertiesForLayer, gaDebounce, gaFileStorage,
      gaLayerFilters, gaExportKml, gaMapUtils, $document, gaMeasure,
      gaStyleFactory, gaGeomUtils, gaEvent, $window
  */
  module.directive('gaEdit', function($rootScope, $window, $translate,
      gaDebounce, gaFileStorage, gaExportGlStyle, gaGLStyle, gaLayers) {
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

        // Apply the default style to the layer.
        // TODO It`s a duplicate function from gaMapUtils from Loic.
        var reloadLayer = function(layer) {
          var config = gaLayers.getLayer(layer.id);
          var styleUrl = layer.externalStyleUrl ||
              config.styleUrl;

          layer.getLayers().forEach(function(sublayer) {
            var subConfig = gaLayers.getLayer(sublayer.id);
            if (!subConfig.sourceId) {
              return;
            }
            sublayer.externalStyleUrl = layer.externalStyleUrl;
            gaGLStyle.get(styleUrl).then(function(glStyle) {

              var sprite = glStyle.style.sprite;
              var spriteUrl = sprite && (sprite + '.png');

              $window.olms.stylefunction(
                  sublayer,
                  glStyle.style,
                  subConfig.sourceId,
                  undefined,
                  sprite, spriteUrl, ['Helvetica']);
            });
          });
        }

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
            reloadLayer(layer);
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
