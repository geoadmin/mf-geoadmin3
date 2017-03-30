goog.provide('ga_shareembed_directive');

goog.require('ga_permalink');

(function() {

  var module = angular.module('ga_shareembed_directive', [
    'ga_permalink'
  ]);

  /**
   * This component is a modal window, it CAN'T be reused multiple times.
   * This modal window can be opened from aanother component broadcasting a
   * gaShareEmbedActive event on the $rootScope.
   */
  module.directive('gaShareEmbed', function(gaPermalink, $window) {
    return {
      restrict: 'A',
      scope: {},
      templateUrl: 'components/share/partials/share-embed.html',
      link: function(scope, element) {
        var modal = element.find('.modal');
        scope.iframeSizes = [{
          label: 'small_size',
          value: [400, 300]
        }, {
          label: 'medium_size',
          value: [600, 450]
        }, {
          label: 'big_size',
          value: [800, 600]
        }, {
          label: 'custom_size',
          value: undefined
        }];
        scope.iframeSize = scope.iframeSizes[0].value;

        // Load the content of iframe only when necessary
        modal.on('shown.bs.modal', function() {
          scope.$applyAsync(function() {
            scope.loadIframe = true;
          });
        }).on('hidden.bs.modal', function() {
          scope.$applyAsync(function() {
            scope.loadIframe = false;
          });
        });

        // Display a preview window
        var previewWindow;
        modal.find('.form-inline a').click(function() {
          if (previewWindow) {
            previewWindow.close();
          }
          // The name of this window is used in embed.html to makes a
          // difference between the preview window and an embed page
          // not used in an iFrame.
          previewWindow = $window.open(scope.embedValue, 'embed',
              'width=' + scope.iframeWidth +
              ', height=' + scope.iframeHeight);
        });

        // Manage minimal size
        var minSize = 200;
        modal.find('.form-inline input').blur(function() {
          if (scope.iframeWidth < minSize ||
              scope.iframeHeight < minSize) {
            scope.$applyAsync(function() {
              if (scope.iframeWidth < minSize) {
                scope.iframeWidth = minSize;
              } else if (scope.iframeHeight < minSize) {
                scope.iframeHeight = minSize;
              }
            });
          }
        });

        // Update value of embed input if the map has changed
        scope.updateEmbedValueFromIframe = function() {
          var iframe = modal.find('iframe')[0];
          if (iframe) {
            var href = iframe.contentWindow.location.href;
            if (scope.embedValue != href) {
              scope.embedValue = href;
              scope.$digest();
            }
          }
        };

        // Open the modal
        scope.$on('gaShareEmbedActive', function(evt) {
          scope.embedValue = gaPermalink.getEmbedHref();
          modal.modal('show');
        });

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
      }
    };
  });
})();
