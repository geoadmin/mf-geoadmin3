goog.provide('ga_importonline_directive');

goog.require('ga_file_service');
goog.require('ga_urlutils_service');

(function() {

  var module = angular.module('ga_importonline_directive', [
    'ga_file_service',
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaImportOnline', function($translate, $q, $document,
      $timeout, gaUrlUtils, gaFile) {

    var timeoutP;

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import-online.html',
      scope: {
        options: '=gaImportOnlineOptions'
      },
      link: function(scope, elt) {

        if (!scope.options ||
            !angular.isFunction(scope.options.handleFileContent)) {
          elt.remove();
          return;
        }

        scope.handleFileContent = scope.options.handleFileContent;

        var initUserMsg = function() {
          scope.userMessage = 'connect';
          scope.progress = 0;
          scope.loading = false;
        };
        initUserMsg();

        // Create the typeAhead input for the list of urls available
        var taElt = elt.find('input[name=url]').typeahead({
          local: scope.options.defaultWMSList,
          limit: 500
        }).on('typeahead:initialized', function(evt) {
          // Re-initialize the list of suggestions
          initSuggestions();
        }).on('typeahead:selected', function(evt, datum) {
          // When a WMS is selected in the list, start downloading the
          // GetCapabilities
          scope.fileUrl = datum.value;
          scope.handleFileUrl();
          scope.$digest();
          // Re-initialize the list of suggestions
          initSuggestions();
        });

        // Append the suggestions list to the body
        var taMenu = elt.find('.tt-dropdown-menu');
        $($document[0].body).append(taMenu);

        var applyCssToMenu = function() {
          var pos = taElt.offset();
          var width = taElt.width();
          taMenu.css({
            top: pos.top + 30, // + input height
            left: pos.left,
            width: width + 30, // + padding
            zIndex: taElt.parents('div[ga-popup]').css('zIndex')
          });

        };
        taElt.on('focus', function() {
          applyCssToMenu();
        });

        // Toggle list of suggestions
        elt.find('.ga-import-open').on('mousedown', function(evt) {
          if (taMenu.css('display') == 'none') {
            taElt.focus();
          } else {
            taElt.blur();
          }
          // Re-initialize the list of suggestions
          initSuggestions();
          evt.preventDefault();
        });

        scope.$on('$translateChangeEnd', function() {
          if (scope.fileUrl && /lang=/.test(scope.fileUrl)) {
            scope.handleFileUrl();
          }
        });

        // Fill the list of suggestions with all the data
        var initSuggestions = function() {
          var taView = $(taElt).data('ttView');
          var dataset = taView.datasets[0];
          dataset.getSuggestions('http', function(suggestions) {
            taView.dropdownView.renderSuggestions(dataset, suggestions);
          });
        };

        scope.cancel = function() {
          scope.progress = 0;
          if (scope.canceler) {
            scope.canceler.resolve();
            scope.canceler = null;
          }
        };

        scope.isValid = function(url) {
          return gaUrlUtils.isValid(url);
        };

        // Handle URL of WMS
        scope.handleFileUrl = function() {
          var url = scope.fileUrl;

          if (/(wms|service\.svc|osm)/i.test(url)) {
            // Append WMS GetCapabilities default parameters
            url = gaUrlUtils.append(url, scope.options.defaultGetCapParams);

            // Use lang param only for admin.ch servers
            if (/admin\.ch/.test(url)) {
              url = gaUrlUtils.append(url, 'lang=' + $translate.use());
            }
          }

          scope.canceler = $q.defer();
          scope.loading = true;
          scope.userMessage = 'uploading_file';
          $timeout.cancel(timeoutP);

          // Angularjs doesn't handle onprogress event
          gaFile.load(url, scope.canceler).then(function(fileContent) {
            scope.canceler = null;

            return scope.handleFileContent(fileContent, {
              url: scope.fileUrl
            });

          }).then(function(result) {
            scope.userMessage = result.message;

          }, function(err) {
            scope.userMessage = err.message;

          }).finally(function() {
            scope.canceler = null;
            scope.loading = false;
            timeoutP = $timeout(initUserMsg, 10000);
          });
        };

        scope.$on('$destroy', function() {
          taMenu.remove();
        });
      }
    };
  });
})();

