goog.provide('ga_translation_controller');
(function() {

  var module = angular.module('ga_translation_controller', []);

  module.controller('GaTranslationController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          langs: ['de', 'fr', 'it', 'rm', 'en']
        };
      });
})();
