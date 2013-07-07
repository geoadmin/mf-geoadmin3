(function() {
  goog.provide('ga_permalinkpanel_directive');

  var module = angular.module('ga_permalinkpanel_directive', []);

  module.directive('gaPermalinkPanel',
      ['$http', 'gaPermalink', 'gaGlobalOptions',
        function($http, gaPermalink, gaGlobalOptions) {
          var shortenURL =
              gaGlobalOptions.serviceUrl + '/shorten.json?cb=JSON_CALLBACK';
          return {
            restrict: 'A',
            scope: {},
            templateUrl: 'src/permalinkpanel/partials/permalinkpanel.html',
            link: function(scope, element, attrs) {
              $('.permalinkTooltip').tooltip({
                placement: 'right'
              });
              $('.shareTooltip').tooltip({
                placement: 'bottom'
              });
              // Store in the scope the permalink value which is bound to
              // the input field
              scope.permalinkvalue = gaPermalink.getHref();

              scope.createHtml = function() {
                var myPermalink = gaPermalink.getHref();
                var html = '<iframe width="800" height="600" frameborder="0" ' +
                    'scrolling="no" marginheight="0" marginwidth="0" src="' +
                    myPermalink + '"</iframe>';
                return html;
              };

              scope.htmlvalue = scope.createHtml();

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkvalue = gaPermalink.getHref();
                scope.htmlvalue = scope.createHtml();
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
                  var url = gaGlobalOptions.serviceUrl +
                     '/qrcodegenerator?url=' +
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
