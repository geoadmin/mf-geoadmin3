goog.provide('ga_share_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_share_directive', [
    'ga_browsersniffer_service',
    'ga_permalink',
    'pascalprecht.translate'
  ]);

  module.directive('gaShare', function($http, $rootScope, $timeout, $translate,
      $window, gaPermalink, gaBrowserSniffer) {
    return {
      restrict: 'A',
      scope: {
        active: '=gaShareActive',
        options: '=gaShareOptions'
      },
      templateUrl: 'components/share/partials/share.html',
      link: function(scope, element, attrs) {
        var permalinkInput = $('.ga-share-permalink input');
        var shortenUrl = scope.options.shortenUrl;

        scope.qrcodegeneratorPath = scope.options.qrcodegeneratorPath;
        scope.mobile = gaBrowserSniffer.mobile;
        scope.showMore = false;

        if (!gaBrowserSniffer.mobile) {
          $('.ga-share-icon').tooltip({
            placement: 'bottom'
          });
        }

        // Store in the scope the permalink value which is bound to
        // the input field
        scope.encodedDocumentTitle = encodeURIComponent(
            $translate.instant('page_title'));
        scope.urlShortened = false;
        // Listen to permalink change events from the scope.
        scope.$on('gaPermalinkChange', function(event) {
          scope.active = false;
        });

        scope.updateUrl = function() {
          scope.permalinkValue = gaPermalink.getHref();
          scope.encodedPermalinkHref =
              encodeURIComponent(gaPermalink.getHref());
          // assuming document.title never change
          scope.embedValue = gaPermalink.getEmbedHref();
        };

        // Function to shorten url
        // Make an asynchronous request to url shortener
        scope.shortenUrl = function() {
          scope.encodedDocumentTitle = encodeURIComponent(
              $translate.instant('page_title'));
          $http.get(shortenUrl, {
            params: {
              url: scope.permalinkValue
            }
          }).then(function(response) {
            scope.permalinkValue = response.data.shorturl;
            scope.urlShortened = true;
            scope.$applyAsync(function() {
              // Auto-select the shortened permalink (not on mobiles)
              if (!gaBrowserSniffer.mobile) {
                permalinkInput.focus();
              }
            });
          });
        };

        // Watching opening and closing more options menu
        var iframeInput;
        scope.showMoreClick = function() {
          if (!scope.showMore) {
            $timeout(function() {
              // When we open the show more panel we scroll the parent
              //div then we put the focus on the input text
              element.parent().scrollTop(140);
              if (!iframeInput) {
                iframeInput = $('.ga-share-embed input');
              }
              iframeInput.focus();
            }, 0, false);
          }
          scope.showMore = !scope.showMore;
        };

        scope.openEmbedModal = function() {
          $rootScope.$broadcast('gaShareEmbedActive');
        };

        // Be able to disable some widgets on homescreen
        scope.homescreen = $window.navigator.standalone;

        var activate = function() {
          // URL is shortened only when menu share is active
          scope.updateUrl();
          scope.shortenUrl();
        };

        scope.$watch('active', function(newVal, oldVal) {
          if (newVal === true) {
            activate();
          }
        });
      }
    };
  });
})();
