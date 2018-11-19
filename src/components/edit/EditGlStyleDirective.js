goog.provide('ga_editglstyle_directive');

(function() {

  var module = angular.module('ga_editglstyle_directive', [
    'ga_background_service'
  ]);

  /**
   * This directive add an interface where you can modify a glStyle.
   */
  module.directive('gaEditGlStyle', function($rootScope) {
    return {
      restrict: 'A',
      templateUrl: 'components/edit/partials/edit-glstyle.html',
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
            if (idx !== 0) {
              layer[path[0]][path[1]] = value;
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
