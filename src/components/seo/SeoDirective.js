(function() {
  goog.provide('ga_seo_directive');

  goog.require('ga_permalink_service');

  var module = angular.module('ga_seo_directive', [
    'ga_permalink_service'
  ]);

  module.directive('gaSeo',
      function($timeout, gaPermalink) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/seo/partials/seo.html',
          scope: {
          },
          link: function(scope, element, attrs) {

            scope.showme = false;

            if (gaPermalink.getParams().snapshot) {
              $timeout(function() {
                scope.showme = true;
              }, 3000);
            }
         }
       };
      });
})();
