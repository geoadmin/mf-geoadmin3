(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', []);

  var partials = {
    node: 'components/catalogtree/partials/node.html',
    leaf: 'components/catalogtree/partials/leaf.html'
  };

  module.directive('gaCatalogtree',
      ['$compile', '$log', '$templateCache',
          function($compile, $log, $templateCache) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            scope.$watch('val', function(val, oldVal) {
              if (val) {
                val.node_type = (scope.val.children !== 'undefined') ?
                         'node' : 'leaf';
                val.selected_open = (val.selected_open != undefined) ?
                         val.selected_open : true;

                //var templateTemp = $templateCache.get(
                //    partials[val.node_type]);

                //FIXME: temporary only
                //does not work:
                var templateTemp = $templateCache.get(
                    'components/permalinkpanel/partials/permalinkpanel.html');
                console.log(templateTemp);
                //does work:
                $templateCache.put('test.html', '<div>Test</div>');
                templateTemp = $templateCache.get('test.html');
                console.log(templateTemp);
                //end of fix
                //
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
