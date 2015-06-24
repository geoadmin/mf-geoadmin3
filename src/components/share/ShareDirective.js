goog.provide('ga_share_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_share_directive', [
    'ga_browsersniffer_service',
    'ga_permalink'
  ]);

  module.directive('gaShareCopyInput', function(gaBrowserSniffer, $translate) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (!gaBrowserSniffer.mobile) {
          element.attr('readonly', 'readonly').tooltip({
            placement: attrs.placement || 'bottom',
            trigger: 'focus',
            title: function() {
              return $translate.instant('share_link_tooltip');
            }
          }).on({
            focus: function() {
              this.setSelectionRange(0, 9999);
            }
          });
        }
      }
    };
  });

  module.directive('gaShareCopyBt', function(gaBrowserSniffer,
      $translate, $document, $timeout) {
    return {
      restrict: 'A',
      scope: {},
      template: '<span ng-show="isCopied" translate>copy_success</span>' +
          '<span ng-show="!isCopied" translate>copy_url</span>',
      link: function(scope, element, attrs) {
        scope.isCopied = false;
        var isCopyAllow = ((gaBrowserSniffer.msie >= 11) ||
            (gaBrowserSniffer.chrome >= 43));
        if (!isCopyAllow) {
          element.remove();
        }
        // Use clipboard API to copy URL in OS clipboard
        element.on('click', function() {
            var inputToCopy = $(attrs.gaShareCopyBt);
            inputToCopy[0].setSelectionRange(0, 9999);

            // Execute the copy command
            var res = $document[0].execCommand('copy');
            if (res) {
              scope.isCopied = true;
              scope.$digest();
              $timeout(function() {
                scope.isCopied = false;
                scope.$digest();
              }, 5000, false);
            }

            // Remove the selections - NOTE: the two following lines
            // do the job for all three browsers
            $document[0].getSelection().removeAllRanges();
            $document[0].getSelection().addRange($document[0]
                .createRange());
        });

      }
    };
  });

  module.directive('gaShare',
    function($document, $http, $timeout, $translate, $window, gaPermalink,
        gaBrowserSniffer) {
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
          scope.encodedDocumentTitle = encodeURIComponent(document.title);
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
            $http.get(shortenUrl, {
              params: {
                url: scope.permalinkValue
              }
            }).success(function(response) {
              scope.permalinkValue = response.shorturl;
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

          // Set iframe size variables
          scope.$watch('iframeSize', function() {
            var maxWidth = 840;
            if (scope.iframeSize) {
              scope.iframeWidth = scope.iframeSize[0];
              scope.iframeHeight = scope.iframeSize[1];
              maxWidth = scope.iframeWidth + 40;
            }
            scope.contentWidth = {
              'max-width': maxWidth + 'px'
            };
          });

          scope.iframeSize = scope.options.iframeSizes[0].value;

          // Be able to disable some widgets on homescreen
          scope.homescreen = $window.navigator.standalone;

          // Load the content of iframe only when necessary
          var pulldown = $('#pulldown');
          element.find('.modal').on('show.bs.modal', function() {
            // TODO: remove this hack and find something cleaner
            pulldown.css('z-index', 1040);
          }).on('shown.bs.modal', function() {
            $(this).find('.ga-embed-input').focus();
            scope.$apply(function() {
              scope.loadIframe = true;
            });
          }).on('hidden.bs.modal', function() {
            scope.$apply(function() {
              scope.loadIframe = false;
            });
            // TODO: remove this hack and find something cleaner
            pulldown.css('z-index', '');
          });

          // Display a preview window
          var previewWindow;
          element.find('.form-inline a').click(function() {
            if (previewWindow) {
              previewWindow.close();
            }
            // The name of this window is used in embed.html to makes a
            // difference between the preview window and an embed page
            // not used in an iFrame.
            previewWindow = window.open(scope.embedValue, 'embed',
                'width=' + scope.iframeWidth +
                ', height=' + scope.iframeHeight);
          });

          // Manage minimal size
          var minSize = 200;
          element.find('.form-inline input').blur(function() {
            if (scope.iframeWidth < minSize ||
                scope.iframeHeight < minSize) {
              scope.$apply(function() {
                if (scope.iframeWidth < minSize) {
                  scope.iframeWidth = minSize;
                } else if (scope.iframeHeight < minSize) {
                  scope.iframeHeight = minSize;
                }
              });
            }
          });

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
    }
  );
})();
