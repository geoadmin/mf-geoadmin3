(function() {
  goog.provide('ga_translation_directive');

  var module = angular.module('ga_translation_directive', [
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  module.directive('gaTranslation',
      ['$translate', 'gaPermalink', function($translate, gaPermalink) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            scope.$watch('lang', function(value) {
              $translate.uses(value).then(angular.noop, function(lang) {
                // failed to load lang from server, fallback to german.
                scope.lang = 'de';
              });
              gaPermalink.updateParams({lang: value});
            });

            var params = gaPermalink.getParams();
            scope.lang = params.lang ?
                params.lang : $translate.preferredLanguage();
          }
        };
      }]);
})();
