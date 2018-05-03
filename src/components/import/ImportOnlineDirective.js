goog.provide('ga_importonline_directive');

goog.require('ga_file_service');

(function() {

  var module = angular.module('ga_importonline_directive', [
    'ga_file_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaImportOnline', function($q, $timeout, $translate,
      gaFile) {

    var timeoutP;

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import-online.html',
      scope: {
        'options': '=gaImportOnlineOptions'
      },
      link: function(scope, elt) {
        /**
         * @type {gax.ImportOnlineOptions}
         */
        var options = scope.options;
        if (!options || typeof options.handleFileContent !== 'function') {
          elt.remove();
          return;
        }

        scope.handleFileContent = options.handleFileContent;

        var initUserMsg = function() {
          scope.userMessage = $translate.instant('connect');
          scope.progress = 0;
          scope.loading = false;
        };
        initUserMsg();

        /**
         * @param {Array<{name: string, url: string}>} servers.
         * @return {function(string, function())} The matching function.
         */
        var substringMatcher = function(servers) {
          return function(q, cb) {
            var matches = [];
            if (!q) {
              matches = servers;
            } else {
              servers.forEach(function(server) {
                if (server.name.includes(q)) {
                  matches.push(server);
                }
              });
            }
            cb(matches);
          };
        };

        // Create the typeahead input for the list of urls available
        var taElt = elt.find('input[name=url]').typeahead({
          hint: true,
          highlight: true,
          minLength: 0
        }, {
          name: 'wms',
          displayKey: 'name',
          limit: 500,
          source: substringMatcher(scope.options.servers)
        }).on('typeahead:selected', function(evt, server) {
          taElt.typeahead('close');
          // When a WMS is selected in the list, start downloading the
          // GetCapabilities
          scope.fileUrl = server.url;
          scope.handleFileUrl();
          scope.$digest();
        });

        var taMenu = elt.find('.tt-menu');
        elt.find('.ga-import-open').on('mousedown', function(evt) {
          if (taMenu.css('display') === 'none') {
            taElt.trigger('focus');
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
          if (options.isValidUrl) {
            return options.isValidUrl(url);
          }
          return true;
        };

        // Handle URL of a file (GetCap or KML or GPX)
        scope.handleFileUrl = function() {
          var transformUrl = options.transformUrl || $q.when;

          transformUrl(scope.fileUrl).then(function(url) {
            scope.canceler = $q.defer();
            scope.loading = true;
            scope.userMessage = $translate.instant('uploading_file');
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
          });
        };
      }
    };
  });
})(); ;
