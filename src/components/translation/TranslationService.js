goog.provide('ga_translation_service');

goog.require('ga_permalink_service');

(function() {

  var module = angular.module('ga_translation_service', [
    'ga_permalink_service'
  ]);

  /**
   * Lang manager
   */
  module.provider('gaLang', function() {
    this.$get = function($window, $rootScope, $translate, gaPermalink,
        gaGlobalOptions) {
      var lang = gaPermalink.getParams().lang ||
          ($window.navigator.userLanguage ||
          $window.navigator.language).split('-')[0];

      if (gaGlobalOptions.languages.indexOf(lang) === -1) {
        lang = gaGlobalOptions.translationFallbackCode;
      }

      // Load translations via $translate service
      var loadTranslations = function(newLang) {
        if (newLang !== $translate.use()) {
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
      loadTranslations(lang);

      var Lang = function() {

        this.set = function(newLang) {
          loadTranslations(newLang);
        };

        this.get = function() {
          return $translate.use() || lang;
        };

        this.getNoRm = function() {
          return $translate.use() === 'rm' ?
            gaGlobalOptions.translationFallbackCode : this.get();
        };
      };
      return new Lang();
    };
  });
})();
