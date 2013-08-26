(function() {
  goog.provide('ga_profile_directive');

  var module = angular.module('ga_profile_directive', []);

  module.directive('gaProfile',
      [
        function() {
          return {
            restrict: 'A',
            templateUrl: 'components/profile/partials/profile.html',
            scope: {
              options: '=gaProfileOptions'
            },
            link: function(scope, element, attrs) {
              var options = scope.options;

              function updateProfile(data) {
                console.log(data);
              }

              scope.$on('gaProfileDataLoaded', function(ev, data) {
                updateProfile(data);
              });
            }
          };
        }
      ]);
})();
