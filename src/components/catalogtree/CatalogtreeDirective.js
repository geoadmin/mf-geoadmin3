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
          /* commenting the 2 lines below do not change behaviour */
          template: '',
          replace: true,
          link: function(scope, element, attrs) {
            //FIXME: It's recommended not to write to scope in
            //directives...can we do without that?
            console.log('calling link...');

            if (scope.watched == 'True') {
              scope.$watch('val', function(val, oldVal) {
                replaceElement(scope, element, val, oldVal, true);
              });
            } else if (scope.watched != 'True') {
              replaceElement(scope, element, scope.val, undefined, false);
            }
            //FIXME: don't write to scope in directive.
            //Need to find another solution for the ng-click binding
            scope.getLegend = getLegend;

            function replaceElement(sc, el, val, oldVal, watcher) {
               if (val) {
                //console.log(val.label, el.length, el.parents().length,
                //el.siblings().length, watcher);
                sc.node_type = (val.children !== undefined) ?
                         'node' : 'leaf';
                sc.selected_open = (val.selected_open != undefined) ?
                         val.selected_open : true;

                var newElement = angular.element(includes[sc.node_type]);
                //console.log(newElement[0].outerHTML);
                $compile(newElement)(sc);
                //console.log('Replacing ', el[0].outerHTML, ' with ',
                //newElement[0].outerHTML);
                el.replaceWith(newElement);
                //console.log(el[0].outerHTML);
                //console.log(newElement[0].outerHTML);
              }
            }
          },
          scope: {
            val: '=',
            parentData: '=',
            watched: '@'
          }
        };
      }]
  );

  function getLegend(bodid) {
    alert(bodid);
  }
})();
