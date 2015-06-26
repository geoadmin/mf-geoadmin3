goog.provide('ga_profile');

goog.require('ga_profile_directive');
goog.require('ga_profile_service');
(function() {

  angular.module('ga_profile', [
    'ga_profile_directive',
    'ga_profile_service'
  ]);
})();
