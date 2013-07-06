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
            templateUrl: 'src/permalinkpanel/partials/permalinkpanel.html',
            link: function(scope, element, attrs) {
              // Store in the scope the permalink value which is bound to
              // the input field
              scope.permalinkvalue = gaPermalink.getHref();

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkvalue = gaPermalink.getHref();
              });

              // Function to shorten url
              // Make an asynchronous request to url shortener
              scope.shortenUrl = function() {
                $http.jsonp(shortenURL, {
                  params: {
                    url: scope.permalinkvalue
                  }
                }).success(function(response) {
                  scope.permalinkvalue = response.shorturl;
                });
              };

              // Function to share content
              scope.share = function(target) {
                if (target === 'facebook') {
                  var url = 'http://www.facebook.com/sharer.php?u=' +
                     encodeURIComponent(gaPermalink.getHref()) +
                     '&t=' + encodeURIComponent(document.title);
                  window.open(url, '_blank');
                } else if (target === 'twitter') {
                  var url = 'https://twitter.com/intent/tweet?url=' +
                     encodeURIComponent(gaPermalink.getHref()) +
                     '&text=' + encodeURIComponent(document.title);
                  window.open(url, '_blank');
                } else if (target === 'google_plus') {
                  var url = 'https://plus.google.com/share?url=' +
                     encodeURIComponent(gaPermalink.getHref());
                  window.open(url, '_blank');
                } else if (target === 'qrcode') {
                  var url = 'http://api.geo.admin.ch/qrcodegenerator?url=' +
                     encodeURIComponent(gaPermalink.getHref());
                  window.open(url, '_blank');
                } else if (target === 'envelope') {
                  alert('TODO: how to implement that ???');
                }
              };

              // Select the input field on click in order to allow copy/paste
              scope.selectOnClick = function(e) {
                e.target.select();
              };
            }
          };
        }]);
})();
