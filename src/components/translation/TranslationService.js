goog.provide('ga_translation_service');

goog.require('ga_permalink_service');
goog.require('ga_topic_service');
(function() {

  var module = angular.module('ga_translation_service', [
    'ga_permalink_service',
    'ga_topic_service'
  ]);

  /**
   * Lang manager
   */
  module.provider('gaLang', function() {
    this.$get = function($window, $rootScope, $translate, gaPermalink,
        gaGlobalOptions, gaTopic) {
      var lang = gaPermalink.getParams().lang ||
          ($window.navigator.userLanguage ||
          $window.navigator.language).split('-')[0];

      if (gaGlobalOptions.languages.indexOf(lang) === -1) {
        lang = gaGlobalOptions.translationFallbackCode;
      }

      // Verify if a language is supported by the current topic
      var isLangSupportedByTopic = function(lang, topic) {
        if (!topic) {
          return true;
        }
        var langs = gaTopic.get().langs;
        return (langs.indexOf(lang) != -1);
      };

      // Load translations via $translate service
      var loadTranslations = function(newLang, newTopic) {
        if (!isLangSupportedByTopic(newLang, newTopic)) {
          newLang = gaGlobalOptions.translationFallbackCode;
        }
        if (newLang != $translate.use()) {
          lang = newLang;
          $translate.use(lang).then(function() {
            $rootScope.$broadcast('gettextLanguageChanged');
          }, function() {
            // failed to load lang from server, fallback to default code.
            loadTranslations(gaGlobalOptions.translationFallbackCode);
          })['finally'](function() {
            gaPermalink.updateParams({lang: lang});
          });
        }
      };
      loadTranslations(lang, gaTopic.get());

      // Switch the language if the not available for the new topic;
      $rootScope.$on('gaTopicChange', function(event, newTopic) {
        loadTranslations(lang, newTopic);
      });

      var Lang = function() {

        this.set = function(newLang) {
          loadTranslations(newLang, gaTopic.get());
        };

        this.get = function() {
          return $translate.use() || lang;
        };

        this.getNoRm = function() {
          var langNoRM = $translate.use() == 'rm' ?
              gaGlobalOptions.translationFallbackCode : $translate.use();
          return langNoRM || lang;
        };
      };
      return new Lang();
    };
  });
})();
