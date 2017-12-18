goog.provide('ga_importdnd_directive');

goog.require('ga_file_service');

(function() {

  var module = angular.module('ga_importdnd_directive', [
    'ga_file_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaImportDnd', function($window, $document, $q, $translate,
      gaFile) {

    return {
      restrict: 'A',
      templateUrl: 'components/import/partials/import-dnd.html',
      scope: {
        'options': '=gaImportDndOptions'
      },
      link: function(scope, elt) {

        var options = scope.options;
        if (!options || typeof options.handleFileContent !== 'function') {
          elt.remove();
          return;
        }

        scope.handleFileContent = options.handleFileContent;

        elt.click(function() {
          // Hide the drop zone on click,
          // used when for some reasons unknown
          // the element stays displayed. See:
          // https://github.com/geoadmin/mf-geoadmin3/issues/1908
          this.style.display = 'none';
        }).on('dragleave drop', function(evt) {
          this.style.display = 'none';
        }).on('dragover dragleave drop', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
        }).on('drop', function(evt) {

          // A file, an <a> html tag or a plain text url can be dropped
          var files = evt.originalEvent.dataTransfer.files;

          if (files && files.length > 0) {
            gaFile.read(files[0]).then(function(fileContent) {
              scope.handleFileContent(fileContent, files[0]);
            });
          } else if (evt.originalEvent.dataTransfer.types) {
            // No files so may be it's HTML link or a URL which has been
            // dropped
            var text = evt.originalEvent.dataTransfer.getData('text/plain');

            if (options.isValidUrl(text)) {

              var transformUrl = options.transformUrl || $q.when;

              transformUrl(text).then(function(url) {
                gaFile.load(url).then(function(fileContent) {
                  return scope.handleFileContent(fileContent, {
                    url: url
                  });
                }).catch(function(err) {
                  $window.alert($translate.instant(err.message));
                });
              });
            } else {
              $window.alert($translate.instant('invalid_url') + text);
            }
          }
        });

        // Display the drop zone if the content dragged is dropable.
        var onDragEnter = function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          var types = evt.originalEvent.dataTransfer.types || [];
          for (var i = 0, len = types.length; i < len; ++i) {
            if (/(files|text\/plain)/i.test(types[i])) {
              elt.css('display', 'table');
              break;
            }
          }
        };
        $document.on('dragenter', onDragEnter);

        // Block drag of all elements by default to avoid
        // unwanted display of dropzone.
        var onDragStart = function() {
          return false;
        };
        $document.on('dragstart', onDragStart);

        scope.$on('$destroy', function() {
          $document.off('dragEnter', onDragEnter).off('dragstart', onDragStart);
        });
      }
    };
  });
})();
