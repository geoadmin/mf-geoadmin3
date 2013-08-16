(function() {
  goog.provide('ga_catalogtree_directive');

  var module = angular.module('ga_catalogtree_directive', [
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogtree',
      ['$compile', 'gaLayers', 'gaPopup',
      function($compile, gaLayers, gaPopup) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/catalogtree/partials/catalogtree.html',
          scope: {
            root: '=gaCatalogtreeRoot',
            map: '=gaCatalogtreeMap'
          }
        };
      }]
  );
})();

