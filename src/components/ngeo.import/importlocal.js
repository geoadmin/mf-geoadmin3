goog.provide('ngeo.importLocalDirective');

goog.require('ngeo.fileService');

(function() {

  var module = angular.module('ngeo.importLocalDirective', [
    'ngeo.fileService'
  ]);

  module.directive('ngeoImportLocal', function($timeout, ngeoFile) {

    var timeoutP;

    return {
      restrict: 'A',
      templateUrl: 'components/ngeo.import/partials/import-local.html',
      scope: {
        options: '=ngeoImportLocalOptions'
      },
      link: function(scope, elt) {

        if (!scope.options ||
            !angular.isFunction(scope.options.handleFileContent)) {
          elt.remove();
          return;
        }

        scope.handleFileContent = scope.options.handleFileContent;


        var initUserMsg = function() {
          scope.userMessage = 'load_kml';
          scope.progress = 0;
          scope.fileReader = null;
        };
        initUserMsg();

        var triggerInputFileClick = function() {
          elt.find('input[type="file"]').click();
        };

        // Trigger the hidden input[type=file] onclick event
        elt.find('button.ngeo-import-browse').click(triggerInputFileClick);
        elt.find('input.form-control[type=text][readonly]').
          click(triggerInputFileClick);

        // Register input[type=file] onchange event, use HTML5 File api
        elt.find('input[type=file]').bind('change', function(evt) {
          if (evt.target.files && evt.target.files.length > 0) {
            scope.$apply(function() {
              scope.files = evt.target.files;
            });
          }
        });

        // Watchers
        scope.$watchCollection('files', function() {
          // Handle a FileList (from input[type=file] or DnD),
          // works only with FileAPI
          if (scope.files && scope.files.length > 0) {
            var file = scope.files[0];
            scope.file = file;
            scope.fileSize = file.size;
            if (scope.isDropped) {
              scope.handleFile();
            }
          }
        });

        scope.isLoading = function() {
          return 0 < scope.progress && scope.progress < 100;
        };

        scope.isValid = function(file) {
          return !file || ngeoFile.isValidFileSize(file.size);
        };


        scope.cancel = function() {
          // Kill file reading
          if (scope.fileReader) {
            scope.fileReader.abort();
            scope.fileReader = null;
          }
        };

        // Handle a File (from a FileList),
        // works only with FileAPI
        scope.handleFile = function() {
          scope.loading = true;
          scope.userMessage = 'reading_file';
          $timeout.cancel(timeoutP);

          ngeoFile.read(scope.file).then(function(fileContent) {
            scope.fileReader = null;
            scope.userMessage = 'parsing_file';
            return scope.handleFileContent(fileContent, scope.file);

          }).then(function(parsingResults) {
            scope.userMessage = 'parse_succeeded';

          }, function(err) {
            scope.userMessage = err.message;

          }, function(evt) {
            if (!scope.fileReader) {
              scope.fileReader = evt.target;
            }

          })['finally'](function() {
             scope.fileReader = null;
             scope.loading = false;
             timeoutP = $timeout(initUserMsg, 5000);
          });
        };
      }
    };
  });
})();

