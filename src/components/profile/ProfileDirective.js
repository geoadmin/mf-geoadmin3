(function() {
  goog.provide('ga_profile_directive');

  goog.require('ga_popup');
  goog.require('ga_profile_service');

  var module = angular.module('ga_profile_directive', [
    'ga_profile_service',
    'ga_popup',
    'pascalprecht.translate'
  ]);

  module.directive('gaProfile',
      function($translate, gaProfileService, gaPopup) {
        return {
          restrict: 'A',
          templateUrl: 'components/profile/partials/profile.html',
          scope: {
            options: '=gaProfileOptions'
          },
          link: function(scope, element, attrs) {
            var options = scope.options;
            var profile = gaProfileService(options);

            scope.$on('gaProfileDataLoaded', function(ev, data) {
              var element = profile.create(data);
              var popup = gaPopup.create({
                title: $translate('profile_title'),
                className: 'profile-popup',
                content: angular.element(element).context.outerHTML,
                x: 0,
                y: 10
              });
              popup.open();
            });
          }
        };
      });
})();
