(function() {
  goog.provide('ga_importkml_directive');

  var module = angular.module('ga_importkml_directive', []);

  module.directive('gaImportKml',
      ['$http', '$log',
       function($http, $log, gaBrowserSniffer) {
         return {
           retsrict: 'A',
           templateUrl: 'components/importkml/partials/importkml.html',
           scope: {
             map: '=gaImportKmlMap'
           },
           link: function(scope, elt, attrs, controller) {

             // Deactivate user form submission with Enter key
             elt.find('input').keypress(function(evt) {
               var charCode = evt.charCode || evt.keyCode;
               if (charCode == 13) { //Enter key's keycode
                 return false;
               }
             });

             // Submit the current form displayed for validation
             elt.find('.validate-kml-file').click(function() {
               var form = $(elt).find('.tab-pane.active form');
               form.submit();
             });

             if (!scope.isIE9) {
               // Trigger the hidden input[type=file] onclick event
               elt.find('button').click(function() {
                 elt.find('input[type="file"]').click();
               });

               // Register input[type=file] onchange event
               elt.find('input[type=file]').bind('change', function(evt) {

                 if (evt.target.files && evt.target.files.length > 0) {
                   // Use HTML5 fileAPI
                   scope.$apply(function() {
                     scope.handleFileList(evt.target.files);
                   });

                 } else {
                   // No FileAPI available
                 }
               });


               // Register drag'n'drop events on <body>
               var dropZone = angular.element(
                   "<div class='import-kml-drop-zone'>" +
                   '  <div>DROP ME HERE</div>' +
                   '</div>');

               var dragEnterZone = angular.element(document.body);
               dragEnterZone.append(dropZone);
               dragEnterZone.bind('dragenter', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log("dragenter");
                 dropZone.css('display', 'table');
                 evt.originalEvent.dataTransfer.effectAllowed = "all";

                 evt.originalEvent.dataTransfer.dropEffect = "copy";
               });

               dropZone.bind('dragleave', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log("dragleave");
                 this.style.display = 'none';
               });

               dropZone.bind('dragover', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log("dragover");
               });

               dropZone.bind('drop', function(evt) {
                 evt.stopPropagation();
                 evt.preventDefault();
                 //$log.log("drop");
                 this.style.display = 'none';

                 // A file, an <a> html tag or a plain text url can be dropped
                 var files = evt.originalEvent.dataTransfer.files;

                 if (files && files.length > 0) {
                   scope.$apply(function() {
                     scope.handleFileList(files);
                   });

                 } else if (evt.originalEvent.dataTransfer.types) {
                   // No files so may be it's HTML link or a URL which has been
                   // dropped
                   var text = evt.originalEvent.dataTransfer.getData('text/plain');
                       
                   scope.$apply(function() {
                     scope.fileUrl = text;
                     scope.handleFileUrl();
                   });

                 } else {
                   // No FileAPI available
                 }
               });
             }
           }
         };
       }]
  );
})();
