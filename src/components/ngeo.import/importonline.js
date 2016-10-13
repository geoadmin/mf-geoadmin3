goog.provide('ngeo.importOnlineDirective');

goog.require('ngeo.fileService');

(function() {

  var module = angular.module('ngeo.importOnlineDirective', [
    'ngeo.fileService',
    'pascalprecht.translate'
  ]);

  module.directive('ngeoImportOnline', function($q, $timeout, ngeoFile) {

    var timeoutP;

    return {
      restrict: 'A',
      templateUrl: 'components/ngeo.import/partials/import-online.html',
      scope: {
        options: '=ngeoImportOnlineOptions'
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

        var substringMatcher = function(urls) {
          return function(q, cb) {
            var matches = [];
            if (!q) {
              matches = urls;
            } else {
              var regex = new RegExp(q, 'i');
              urls.forEach(function(url) {
                if (regex.test(url)) {
                  matches.push(url);
                }
              });
            }
            cb(matches);
          }
        };

        // Create the typeAhead input for the list of urls available
        var taElt = elt.find('input[name=url]').typeahead({
          hint: true,
          highlight: true,
          minLength: 0
        }, {
          name: 'wms',
          limit: 500,
          source: substringMatcher(scope.options.urls)
        }).on('typeahead:select', function(evt, url) {
          taElt.typeahead('close');
          // When a WMS is selected in the list, start downloading the
          // GetCapabilities
          scope.fileUrl = url;
          scope.handleFileUrl();
          scope.$digest();
        });

        var taMenu = elt.find('.tt-menu');
        elt.find('.ngeo-import-open').on('mousedown', function(evt) {

          if (taMenu.css('display') == 'none') {
            taElt.focus();
            taElt.typeahead('val', '');
          } else {
            taElt.blur();
          }
          evt.preventDefault();
        });

        scope.$on('$translateChangeEnd', function() {
          if (scope.fileUrl && /lang=/.test(scope.fileUrl)) {
            scope.handleFileUrl();
          }
        });

        scope.cancel = function() {
          scope.progress = 0;
          if (scope.canceler) {
            scope.canceler.resolve();
            scope.canceler = null;
          }
        };

        scope.isValid = function(url) {
          if (scope.options.isValidUrl) {
            scope.options.isValidUrl(url);
          }
          return true;
        };

        // Handle URL of WMS
        scope.handleFileUrl = function() {
          var url = scope.fileUrl;

          if (scope.options.transformUrl) {
            url = scope.options.transformUrl(url);
          }

          scope.canceler = $q.defer();
          scope.loading = true;
          scope.userMessage = 'uploading_file';
          $timeout.cancel(timeoutP);

          // Angularjs doesn't handle onprogress event
          ngeoFile.load(url, scope.canceler).then(function(fileContent) {
            scope.canceler = null;

            return scope.handleFileContent(fileContent, {
              url: scope.fileUrl
            });

          }).then(function(result) {
            scope.userMessage = result.message;

          }, function(err) {
            scope.userMessage = err.message;

          })['finally'](function() {
            scope.canceler = null;
            scope.loading = false;
            timeoutP = $timeout(initUserMsg, 10000);
          });
        };
      }
    };
  });
})();

