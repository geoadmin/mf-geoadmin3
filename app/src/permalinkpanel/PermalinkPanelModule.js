(function() {
  goog.provide('ga_permalinkpanel');

  goog.require('ga_permalinkpanel_controller');
  goog.require('ga_permalinkpanel_directive');

  angular.module('ga_permalinkpanel', [
    'ga_permalinkpanel_controller',
    'ga_permalinkpanel_directive'
  ]);
})();
