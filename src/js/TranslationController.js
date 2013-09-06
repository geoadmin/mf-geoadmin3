(function() {
  goog.provide('ga_translation_controller');

  var module = angular.module('ga_translation_controller', []);

  module.controller('GaTranslationController',
      function($scope) {

        $scope.options = {
          langs: [
            {label: 'DE', value: 'de'},
            {label: 'FR', value: 'fr'},
            {label: 'IT', value: 'it'},
            {label: 'RM', value: 'rm'},
            {label: 'EN', value: 'en'}
          ],
          fallbackCode: 'de'
        };

      });

})();
