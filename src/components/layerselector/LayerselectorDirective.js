(function() {
  goog.provide('ga_layerselector_directive');

  var module = angular.module('ga_layerselector_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaLayerselector', function($translate) {

    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/layerselector/partials/layerselector.html',
      scope: {
        map: '=gaLayerselectorMap',
        options: '=gaLayerselectorOptions'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        scope.advancedMode = false;
        scope.currentTopic = 'ech';
        scope.focused = false;
        scope.options.blockSwisssearch = true;
        scope.options.layersOnly = true;
      }
    };
  });
})();

