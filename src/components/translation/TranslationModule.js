goog.provide('ga_translation');
goog.require('ga_translation_directive');
goog.require('ga_translation_service');
(function() {

  angular.module('ga_translation', [
    'ga_translation_directive',
    'ga_translation_service'
  ]);
})();
