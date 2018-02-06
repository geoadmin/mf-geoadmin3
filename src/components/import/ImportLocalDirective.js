goog.provide('ga_importlocal_directive');

goog.require('ga_file_service');

(function() {

  var module = angular.module('ga_importlocal_directive', [
    'ga_file_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaImportLocal', function($timeout, $translate, gaFile) {

    var timeoutP;

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import-local.html',
      scope: {
        'options': '=gaImportLocalOptions'
      },
      link: function(scope, elt) {

        /**
         * @type {gax.ImportLocalOptions}
         */
        var options = scope.options;
        if (!options || typeof options.handleFileContent !== 'function') {
          elt.remove();
          return;
        }
        scope.handleFileContent = scope.options.handleFileContent;

        var initUserMsg = function() {
          scope.userMessage = $translate.instant('load_local_file');
          scope.progress = 0;
          scope.fileReader = null;
        };
        initUserMsg();

        var triggerInputFileClick = function() {
          elt.find('input[type="file"]').trigger('click');
        };

        // Trigger the hidden input[type=file] onclick event
        elt.find('button.ga-import-browse').trigger('click',
            triggerInputFileClick);
        elt.find('input.form-control[type=text][readonly]').
            trigger('click', triggerInputFileClick);

        // Register input[type=file] onchange event, use HTML5 File api
        elt.find('input[type=file]').on('change', function(evt) {
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
          return scope.progress > 0 && scope.progress < 100;
        };

        scope.isValid = function(file) {
          return !file || gaFile.isValidFileSize(file.size);
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
          if (!scope.file) {
            return;
          }
          scope.loading = true;
          scope.userMessage = $translate.instant('reading_file');
          $timeout.cancel(timeoutP);

          gaFile.read(scope.file).then(function(fileContent) {
            scope.fileReader = null;
            scope.userMessage = $translate.instant('parsing_file');
            return scope.handleFileContent(fileContent, scope.file);
          }).then(function(result) {
            scope.userMessage = result.message;
          }, function(err) {
            scope.userMessage = err.message;
          }, function(evt) {
            if (!scope.fileReader) {
              scope.fileReader = evt.target;
            }
          }).finally(function() {
            scope.fileReader = null;
            scope.loading = false;
            timeoutP = $timeout(initUserMsg, 5000);
          });
        };
      }
    };
  });
})();
