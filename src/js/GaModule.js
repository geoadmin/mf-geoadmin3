(function() {
  goog.provide('ga');


  goog.require('ga_attribution');
  goog.require('ga_backgroundlayerselector');
  goog.require('ga_contextmenu');
  goog.require('ga_importkml');
  goog.require('ga_map');
  goog.require('ga_mouseposition');
  goog.require('ga_permalinkpanel');
  goog.require('ga_scaleline');
  goog.require('ga_topic');
  goog.require('ga_translation');
  goog.require('ga_feedback');

  goog.require('ga_modal_directive');
  goog.require('ga_draggable_directive');
  
  goog.require('ga_importkml_controller');
  goog.require('ga_map_controller');
  goog.require('ga_mouseposition_controller');
  goog.require('ga_permalinkpanel_controller');
  goog.require('ga_print_controller');
  goog.require('ga_translation_controller');
  goog.require('ga_topic_controller');
  goog.require('ga_feedback_controller');

  var module = angular.module('ga', [
    'ga_attribution',
    'ga_backgroundlayerselector',
    'ga_contextmenu',
    'ga_importkml',
    'ga_map',
    'ga_mouseposition',
    'ga_permalinkpanel',
    'ga_scaleline',
    'ga_topic',
    'ga_translation',
    'ga_feedback',
    'ga_modal_directive',
    'ga_draggable_directive',
    'ga_importkml_controller',
    'ga_map_controller',
    'ga_mouseposition_controller',
    'ga_permalinkpanel_controller',
    'ga_print_controller',
    'ga_translation_controller',
    'ga_topic_controller',
    'ga_feedback_controller'
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
