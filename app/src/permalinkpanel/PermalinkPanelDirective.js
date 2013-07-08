(function() {
  goog.provide('ga_permalinkpanel_directive');

  var module = angular.module('ga_permalinkpanel_directive', []);

  module.directive('gaPermalinkPanel',
      ['$http', 'gaPermalink',
        function($http, gaPermalink) {
          return {
            restrict: 'A',
            scope: {
              options: '=gaPermalinkPanelOptions'
            },
            templateUrl: 'src/permalinkpanel/partials/permalinkpanel.html',
            link: function(scope, element, attrs) {
              var shortenURL =
                  scope.options.serviceUrl + '/shorten.json?cb=JSON_CALLBACK';

              $('.permalinkTooltip').tooltip({
                placement: 'right'
              });
              $('.share-tooltip').tooltip({
                placement: 'bottom'
              });
              // Store in the scope the permalink value which is bound to
              // the input field
              scope.permalinkvalue = gaPermalink.getHref();

              scope.serviceUrl = gaGlobalOptions.serviceUrl;
              scope.permalinkHref = gaPermalink.getHref();
              scope.encodedPermalinkHref =
                  encodeURIComponent(gaPermalink.getHref());
              scope.encodedDocumentTitle = encodeURIComponent(document.title);

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkvalue = gaPermalink.getHref();
                scope.permalinkHref = gaPermalink.getHref();
                scope.encodedPermalinkHref =
                    encodeURIComponent(gaPermalink.getHref());
                // assuming document.title never change
              });

              // Function to shorten url
              // Make an asynchronous request to url shortener
              scope.shortenUrl = function() {
                $http.jsonp(shortenUrl, {
                  params: {
                    url: scope.permalinkvalue
                  }
                }).success(function(response) {
                  scope.permalinkvalue = response.shorturl;
                });
              };

              // Select the input field on click in order to allow copy/paste
              scope.selectOnClick = function(e) {
                e.target.select();
              };
            }
          };
        }]);
})();
