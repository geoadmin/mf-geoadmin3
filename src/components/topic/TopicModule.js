goog.provide('ga_topic');
goog.require('ga_topic_directive');
goog.require('ga_topic_service');
(function() {

  angular.module('ga_topic', [
    'ga_topic_service',
    'ga_topic_directive'
  ]);
})();
