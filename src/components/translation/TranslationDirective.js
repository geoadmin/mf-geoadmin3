goog.provide('ga_translation_directive');

goog.require('ga_topic_service');
goog.require('ga_translation_service');
(function() {

  var module = angular.module('ga_translation_directive', [
    'ga_translation_service'
  ]);

  module.directive('gaTranslationSelector', function($rootScope,
      gaBrowserSniffer, gaLang, gaTopic) {
    return {
      restrict: 'A',
      scope: {
        options: '=gaTranslationSelectorOptions'
      },
      templateUrl: function() {
        return 'components/translation/partials/translation' +
            ((gaBrowserSniffer.mobile) ? 'mobile' : 'desktop') + '.html';
      },
      link: function(scope, element, attrs) {
        scope.lang = gaLang.get();
        scope.langs = [];
        if (scope.options && scope.options.langs) {
          scope.langs = scope.options.langs;
        }
        scope.selectLang = function(newLang) {
          scope.lang = newLang;
        };
        scope.$watch('lang', function(newLang) {
          gaLang.set(newLang);
        });
        $rootScope.$on('$translateChangeEnd', function(event, newLang) {
          if (scope.lang != newLang.language) {
            scope.lang = newLang.language;
          }
        });

        gaTopic.loadConfig().then(function() {
          scope.$on('gaTopicChange', function(event, newTopic) {
            scope.langs = newTopic.langs;
          });

          scope.langs = gaTopic.get().langs;
        });
      }
    };
  });
})();
