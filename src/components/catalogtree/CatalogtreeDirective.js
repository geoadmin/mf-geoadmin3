(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', []);

  //FIXME: even these snippets should be in partials
  var includes = {
    node: '<div ng-include src="\'components/catalogtree/' +
          'partials/node.html\'"></div>',
    leaf: '<div ng-include src="\'components/catalogtree/' +
          'partials/leaf.html\'"></div>'
  };

  module.directive('gaCatalogtree',
      ['$compile', '$log', '$templateCache',
          function($compile, $log, $templateCache) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            //FIXME: It's recommended not to write to scope in
            //directives...can we do without that?
            scope.$watch('val', function(val, oldVal) {
              if (val) {
                scope.node_type = (val.children !== undefined) ?
                         'node' : 'leaf';
                scope.selected_open = (val.selected_open != undefined) ?
                         val.selected_open : true;

                var newElement = angular.element(includes[scope.node_type]);
                $compile(newElement)(scope);
                element.replaceWith(newElement);
              }
            }
            );
            //FIXME: don't write to scope in directive.
            //Need to find another solution for the ng-click binding
            scope.getLegend = getLegend;
          },
          scope: {
            val: '=',
            parentData: '='
          }
        };
      }]
  );

  function getLegend(bodid) {
    alert(bodid);
  }
})();
