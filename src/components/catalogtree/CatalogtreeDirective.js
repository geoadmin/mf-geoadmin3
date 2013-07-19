(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', []);

  /**
   * See examples on how it can be used
   */

  module.directive('gaCatalogtree',
      ['$compile', function($compile) {
        return {
          restrict: 'A',
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            val: '='
          },
          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }
              scope.getLegend = getLegend;
              scope.toggle = toggle;
              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };
      }]
  );

  function toggle(ev) {
    this.val.selected_open = !this.val.selected_open;
    ev.preventDefault();
    ev.stopPropagation();
  };

  function getLegend(ev, bodid) {
    alert(bodid);
    ev.preventDefault();
    ev.stopPropagation();
  };
})();
