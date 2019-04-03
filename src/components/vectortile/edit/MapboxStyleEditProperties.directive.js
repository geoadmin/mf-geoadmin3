goog.provide('ga_mapbox_style_edit_properties_directive');

(function() {

  var module = angular.module('ga_mapbox_style_edit_properties_directive', [
    'ga_background_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaMapboxStyleEditProperties', function($rootScope) {
    return {
      restrict: 'A',
      templateUrl:
        'components/vectortile/edit/partials/edit-style-properties.html',
      scope: {
        glStyle: '=gaEditGlStyle',
        config: '=gaEditGlStyleConfig'
      },
      link: function(scope, element, attrs, controller) {

        scope.$watch('glStyle', function(newGlStyle) {
          if (!newGlStyle || !scope.config || !scope.config.length) {
            return;
          }

          /**
           * Object containing list of glStyle layers to modfiy for each value
           * in config.selectableLayers.
           */
          scope.groups = [];

          scope.glStyle.layers.forEach(function(layer) {
            scope.config.forEach(function(edit) {
              var regex = new RegExp(edit.regex || edit.id);
              if (regex.test(layer.id) || regex.test(layer['source-layer'])) {
                if (!scope.groups[edit.id]) {
                  scope.groups[edit.id] = [];
                }
                scope.groups[edit.id].push(layer);
              }
            });
          });
          scope.edit = scope.config[0];
          scope.group = scope.groups[scope.edit.id];
        });

        scope.useWidget = function(widget, path) {
          var regex = new RegExp(widget);
          return regex.test(path[2]);
        }

        /**
         * @param value : Value of the glStyle property.
         * @param group : List of glStyle layers to modify
         * @param editConfig : Path the glStyle property.
         *                     Ex: ['paint', 'fill-color', '{color}']
         */
        scope.change = function(value, group, path) {
          group.forEach(function(layer, idx) {
            if (idx !== 0 && layer[path[0]] && layer[path[0]][path[1]]) {
              layer[path[0]][path[1]] = value;
            }
            // hack for background / territory
            // as territory layer needs fill-color
            // but background layer needs background-color (which is define
            // as the property to be altered by this directive without hack)
            if (layer.id === 'territory_' && path[1] === 'background-color') {
              layer[path[0]]['fill-color'] = value;
            }
          });
          scope.save();
        }

        scope.save = function() {
          $rootScope.$broadcast('gaGlStyleChanged', scope.glStyle);
        }

        scope.getTranslateId = function(e) {
          return 'edit_' + e[1].replace(/-/g, '_');
        }
      }
    };
  });
})();
