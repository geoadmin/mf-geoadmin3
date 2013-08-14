(function() {
  goog.provide('ga_translation_directive');

  var module = angular.module('ga_translation_directive', [
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  module.directive('gaTranslationSelector',
      ['$translate', '$window', 'gaPermalink',
        function($translate, $window, gaPermalink) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              options: '=gaTranslationSelectorOptions'
            },
            templateUrl: 'components/translation/partials/translation.html',
            link: function(scope, element, attrs) {
              scope.$watch('lang', function(value) {
                $translate.uses(value).then(angular.noop, function(lang) {
                  // failed to load lang from server, fallback to default code.
                  scope.lang = scope.options.fallbackCode;
                });
                gaPermalink.updateParams({lang: value});
              });

              scope.$on('gaTopicChange', function(event, topic) {
                var hasLang = false;
                angular.forEach(topic.langs, function(lang) {
                  if (lang.value === $translate.uses()) {
                    hasLang = true;
                  }
                });
                if (!hasLang) {
                  // lang not in topic, fallback to default code
                  scope.lang = scope.options.fallbackCode;
                }
                scope.options.langs = topic.langs;
              });

              scope.lang = gaPermalink.getParams().lang ||
                  ($window.navigator.userLanguage ||
                   $window.navigator.language).split('-')[0];
            }
          };
      }]);
})();
