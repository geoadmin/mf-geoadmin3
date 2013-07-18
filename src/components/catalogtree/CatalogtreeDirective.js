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

  var bfirst = true;

  module.directive('gaCatalogtree',
      ['$compile', '$log', '$templateCache', '$timeout',
          function($compile, $log, $templateCache, $timeout) {
            var rootElement = undefined,
                rootScope = undefined,
                scopeRegistry = {};
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
              rootElement = rootElement || element;
              rootScope = rootScope || scope;
              //console.log('setup watching');
              scope.$watch('val', function(val, oldVal) {
                if (!bfirst) {
                  console.log('bail...');
                  return;
                }
                if (bfirst && val) {
                  bfirst = false;
                }
                console.log('watcher');
                //console.log(scopeRegistry);
                for (id in scopeRegistry) {
                  if (id != rootScope.$id &&
                    scopeRegistry.hasOwnProperty(id)) {
                    scopeRegistry[id].$destroy();
                  }
                }
                scopeRegistry = {};

                rootElement.empty();

                replaceElement(rootScope, rootElement, val, oldVal, true);
                /*
                $timeout( function () {
                  console.log('timeout...');
                  pendingwatch = false;
                  replaceElement(rootScope, rootElement, val, oldVal, true);
                }, 10);
                */
                //console.log('watcher end');
              });
            } else if (scope.watched != 'True') {
              replaceElement(scope, element, scope.val, undefined, false);
            }
            //FIXME: don't write to scope in directive.
            //Need to find another solution for the ng-click binding
            scope.getLegend = getLegend;

            function replaceElement(sc, el, val, oldVal, watcher) {
               //console.log('replace...');
               if (val) {
                 //console.log('val valid');
                //console.log(val.label, el.length, el.parents().length,
                //el.siblings().length, watcher);
                scopeRegistry[sc.$id] = sc;
                sc.node_type = (val.children !== undefined) ?
                         'node' : 'leaf';
                sc.selected_open = (val.selected_open != undefined) ?
                         val.selected_open : true;

                var newElement = angular.element(includes[sc.node_type]);
                $compile(newElement)(sc);
                if (watcher) {
                  el.append(newElement);
                } else {
                  el.replaceWith(newElement);
                }
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
