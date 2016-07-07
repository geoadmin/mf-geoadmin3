goog.provide('ga_profile');

goog.require('ga_profile_directive');
goog.require('ga_profile_service');
goog.require('ga_profilebt_directive');

(function() {

  angular.module('ga_profile', [
    'ga_profile_directive',
    'ga_profile_service',
    'ga_profilebt_directive'
  ]);
})();
