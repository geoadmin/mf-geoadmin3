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
           template:
               '<select ng-model="lang" ' +
                   'ng-options="l.value as l.label for l in ' +
                       'options.langs" class="input-small">' +
               '</select>',
          link: function(scope, element, attrs) {
            scope.$watch('lang', function(value) {
              $translate.uses(value).then(angular.noop, function(lang) {
                // failed to load lang from server, fallback to default code.
                scope.lang = scope.options.fallbackCode;
              });
              gaPermalink.updateParams({lang: value});
            });

            scope.lang = gaPermalink.getParams().lang ||
                ($window.navigator.userLanguage ||
                 $window.navigator.language).split('-')[0];
          }
        };
      }]);
})();
