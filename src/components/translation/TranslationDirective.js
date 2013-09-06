(function() {
  goog.provide('ga_translation_directive');

  var module = angular.module('ga_translation_directive', [
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  module.directive('gaTranslationSelector',
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

              function hasLang(langs) {
                for (var i = 0; i < langs.length; i++) {
                  if (langs[i].value === $translate.uses()) {
                    return true;
                  }
                }
                return false;
              };

              scope.$on('gaTopicChange', function(event, topic) {
                if (!hasLang(topic.langs)) {
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
      });
})();
