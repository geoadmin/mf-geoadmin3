(function() {
  goog.provide('ga_share_directive');

  goog.require('ga_permalink');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_share_directive', [
    'ga_permalink',
    'ga_urlutils_service'
  ]);

  module.directive('gaShare',
      function($http, $window, gaPermalink, gaUrlUtils) {
          return {
            restrict: 'A',
            scope: {
              options: '=gaShareOptions'
            },
            templateUrl: 'components/share/partials/share.html',
            link: function(scope, element, attrs) {
              var shortenUrl = gaUrlUtils.append(scope.options.shortenUrl,
                  'cb=JSON_CALLBACK');
              scope.qrcodegeneratorPath = scope.options.qrcodegeneratorPath;

              $('.ga-share-icon').tooltip({
                placement: 'bottom'
              });
              $('.ga-share-permalink input').on({
                focus: function() {
                  this.setSelectionRange(0, 9999);
                },
                mouseup: function(e) {
                  // prevent unselection on blur
                  e.preventDefault();
                },
                touchend: function(e) {
                  // prevent unselection on blur
                  e.preventDefault();
                }
              });
              // Store in the scope the permalink value which is bound to
              // the input field
              scope.permalinkValue = gaPermalink.getHref();
              scope.encodedPermalinkHref =
                  encodeURIComponent(gaPermalink.getHref());
              scope.encodedDocumentTitle = encodeURIComponent(document.title);
              scope.urlShortened = false;

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkValue = gaPermalink.getHref();
                scope.encodedPermalinkHref =
                    encodeURIComponent(gaPermalink.getHref());
                scope.urlShortened = false;
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
                  scope.urlShortened = true;
                });
              };

              // Select the input field on click in order to allow copy/paste
              scope.selectOnClick = function(e) {
                e.target.select();
              };

              // Be able to disable some widgets on homescreen
              scope.homescreen = $window.navigator.standalone;
            }
          };
        });
})();
