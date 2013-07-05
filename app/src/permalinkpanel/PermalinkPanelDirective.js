(function() {
  goog.provide('ga_permalinkpanel_directive');

  var module = angular.module('ga_permalinkpanel_directive', []);

  module.directive('gaPermalinkPanel',
      ['$http', 'gaPermalink',
        function($http, gaPermalink) {
          var shortenURL =
              'http://api.geo.admin.ch/shorten.json?cb=JSON_CALLBACK';
          return {
            restrict: 'A',
            scope: {
              map: '=gaPermalinkPanelMap'
            },
            templateUrl: 'src/permalinkpanel/partials/panel.html',
            link: function(scope, element, attrs) {
              scope.permalinkvalue = gaPermalink.getHref();
              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkvalue = gaPermalink.getHref();
              });

              scope.shortenUrl = function() {
                $http.jsonp(shortenURL, {
                  params: {
                    url: scope.permalinkvalue
                  }
                }).success(function(response) {
                  scope.permalinkvalue = response.shorturl;
                });
              };
            }
          };
        }]);
})();
