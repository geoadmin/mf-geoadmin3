goog.provide('ga_vector_tile_feedback_modal_directive');

goog.require('ga_translation_service');

(function() {
  var module = angular.module('ga_vector_tile_feedback_modal_directive', [
    'ga_translation_service'
  ]);

  module.directive('gaVectorTileFeedbackModal', function($rootScope, gaLang) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/vectortile/feedback/partials' +
          '/vectorfeedbackmodal.html',
      scope: {},
      link: function(scope, elt) {
        var urlTemplate = 'https://findmind.ch/c/vectorsimple{lang}';
        scope.url = urlTemplate.replace('{lang}', gaLang.getNoRm());
        $rootScope.$on('$translateChangeEnd', function() {
          scope.url = urlTemplate.replace('{lang}', gaLang.getNoRm());
        });

        function preventDefault(e) {
          e.preventDefault();
        }

        function disableScroll() {
          document.body.addEventListener('touchmove', preventDefault,
              { passive: false });
        }
        function enableScroll() {
          document.body.removeEventListener('touchmove', preventDefault,
              { passive: false });
        }
        elt.on('shown.bs.modal', function() {
          disableScroll();
        })

        elt.on('hidden.bs.modal', function() {
          enableScroll();
        })
      }
    };
  });
})();
