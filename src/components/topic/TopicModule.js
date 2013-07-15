(function() {
  goog.provide('ga_topic');
  goog.require('ga_topic_controller');
  goog.require('ga_topic_directive');

  angular.module('ga_topic', [
    'ga_topic_controller',
    'ga_topic_directive'
  ]);
})();
