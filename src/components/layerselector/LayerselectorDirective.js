goog.provide('ga_layerselector_directive');

(function() {

  var module = angular.module('ga_layerselector_directive', [
    'pascalprecht.translate'
  ]);

  module.directive('gaLayerselector', function($translate,
      gaContextProposalService, gaTopic) {
    return {
      restrict: 'A',
      templateUrl: 'components/layerselector/partials/layerselector.html',
      scope: {
        map: '=gaLayerselectorMap',
        options: '=gaLayerselectorOptions'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        scope.options.layersOnly = true;
        gaContextProposalService.topLayersForTopic(gaTopic.get(), 10).then(
            function(topLayers) {
          scope.layers = topLayers;
        });
      }
    };
  });
})();

