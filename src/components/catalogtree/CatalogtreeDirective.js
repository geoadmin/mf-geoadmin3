(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', []);


  module.directive('gaCatalogtree',
      ['$compile', '$log', function($compile, $log) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            scope.$watch('val', function(val, oldVal) {
              if (val) {
                val.node_type = (scope.val.children !== 'undefined') ?
                         'node' : 'leaf';
                val.selected_open = (val.selected_open != undefined) ?
                         val.selected_open : true;
                if (val.node_type == 'node') {
                   var template =
                   '<div class="ga-catalogtree-{{val.node_type}}"' +
                   'ng-click="val.selected_open = !val.selected_open">' +
                   '{{val.label}}</span></div>' +
                   '<ul ng-show="val.selected_open">' +
                   '  <li class="ga-catalogtree-node" ' +
                   'ng-repeat="item in val.children">' +
                   '     <span ga-catalogtree val="item" ' +
                   'parent-data="val.children"></span>' +
                   '  </li>' +
                   '</ul>';
                } else {
                  var template = '<div ' +
                   'class="ga-catalogtree-{{val.node_type}}">' +
                   '{{val.label}}' +
                   '<i class="icon-info-sign" ' +
                   'ng-click="getLegend(val.bod_layer_id)"></i></div>';
                }
                var newElement = angular.element(template);
                $compile(newElement)(scope);
                element.replaceWith(newElement);
              }
            },
            function getLegend(bodid) {
              alert(bodid);
            }
            );
          },
          scope: {
            val: '=',
            parentData: '='
          }
        };
      }]
  );
})();
