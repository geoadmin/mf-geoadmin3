(function() {
  goog.provide('ga');
  goog.require('ga_attribution');
  goog.require('ga_backgroundlayerselector');
  goog.require('ga_contextmenu');
  goog.require('ga_map');
  goog.require('ga_mouseposition');
  goog.require('ga_permalinkpanel');
  goog.require('ga_print');
  goog.require('ga_scaleline');
  goog.require('ga_translation');

  var module = angular.module('ga', [
    'ga_attribution',
    'ga_backgroundlayerselector',
    'ga_contextmenu',
    'ga_map',
    'ga_mouseposition',
    'ga_permalinkpanel',
    'ga_print',
    'ga_scaleline',
    'ga_translation'
  ]);

  module.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.json'
    });

    var language = (navigator.userLanguage || navigator.language).split('-');
    $translateProvider.preferredLanguage(language[0]);
  }]);

})();
