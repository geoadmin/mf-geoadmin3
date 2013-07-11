(function() {
  goog.provide('ga_importkml_directive');
  
  var module = angular.module('ga_importkml_directive', []);

  module.directive('gaImportKml',
    ['$http', '$log',
    function($http, $log) {            
      return {
        retsrict: 'A',
        templateUrl: 'src/importkml/partials/form.html', 
        scope: {
            map: "=gaImportKmlMap"
        },
        link: function(scope, element, attrs, controller) {
            
          // Trigger the hidden input[type=file] onclick event
          element.find('button').click(function() {
            element.find('input[type="file"]').click();
          });
                     
          // Register input[type=file] onchange event 
          element.find("input[type=file]").bind('change', function(evt) {
           
            if (evt.target.files) {               
              // Use HTML5 fileAPI
              scope.handleFileList(evt.target.files);
              scope.$apply();

            } else {
                // No FileAPI
                // Use old behavior, use the form validation download file using proxy
           }
          });
          

          // Register drag'n'drop events on map div
          var dropzone = $(scope.map.viewport_); //element.find("textarea");
          dropzone.bind('dragenter', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("dragenter");
            this.style.border = "5px solid red";
          });
          dropzone.bind('dragleave', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("dragleave");
            this.style.border = "none";
          });
          dropzone.bind('dragover', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("dragover");
          });
          dropzone.bind('drop', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("drop");
            this.style.border = "none";

            // A file, an <a> html tag or a plain text url can be dropped
            var files = evt.originalEvent.dataTransfer.files

            if (files && files.length > 0) {
              // A file has been dropped
              scope.handleFileList(files);
              scope.$apply();              
            
            } else if (evt.originalEvent.dataTransfer.types) {
              // No files so may be it's HTML link or a URL which has been
              // dropped
              var text = evt.originalEvent.dataTransfer.getData(evt.originalEvent.dataTransfer.types[0]);
              scope.fileUrl = text;
              scope.handleFileUrl();
              scope.$apply()
              
            } else {
              // No FileAPI
              // Use old behavior, download file using proxy
            }                 
          });       
        }
      }; 
    }]
  );
})();
