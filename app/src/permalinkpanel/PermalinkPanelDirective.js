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
              var shortenUrl =
                  scope.options.serviceUrl + '/shorten.json?cb=JSON_CALLBACK';

              $('.share-tooltip').tooltip({
                placement: 'bottom'
              });
              // Store in the scope the permalink value which is bound to
              // the input field
              scope.permalinkValue = gaPermalink.getHref();
              scope.permalinkHref = gaPermalink.getHref();
              scope.encodedPermalinkHref =
                  encodeURIComponent(gaPermalink.getHref());
              scope.encodedDocumentTitle = encodeURIComponent(document.title);
              scope.urlShorted = false;

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkValue = gaPermalink.getHref();
                scope.permalinkHref = gaPermalink.getHref();
                scope.encodedPermalinkHref =
                    encodeURIComponent(gaPermalink.getHref());
                scope.urlShorted = false;
                // assuming document.title never change
              });

              // Function to shorten url
              // Make an asynchronous request to url shortener
              scope.shortenUrl = function() {
                $http.jsonp(shortenUrl, {
                  params: {
                    url: scope.permalinkValue
                  }
                }).success(function(response) {
                  scope.permalinkValue = response.shorturl;
                  scope.urlShorted = true;
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
