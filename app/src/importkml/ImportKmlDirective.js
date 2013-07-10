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
            map: "=gaImportKmlMap",
            options: "=geImportKmlOptions"
        },
        link: function(scope, element, attrs, controller) {
            
          // Trigger the hidden input[type=file] onclick event
          element.find('button').click(function() {
            element.find('input[type="file"]').click();
          });

          // Register input[type=file] onchange event 
          element.find("input[type=file]").bind('change', function(event) {
           
            if (event.target.files) {               
              // Use HTML5 fileAPI 
              var files = event.target.files;
              handleFileList(files);
            
            } else {
                // Use old behavior, download file using proxy
           }
          });
          

          // Register drag'n'drop events on map div
          var dropzone = $(scope.map.viewport_); //element.find("textarea");
          dropzone.bind('dragenter', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("dragenter");
          });
          dropzone.bind('dragleave', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $log.log("dragleave");
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

            // A file, an <a> html tag or a plain text url can be dropped
            var files = evt.originalEvent.dataTransfer.files

            if (files && files.length > 0) {
              // A file has been dropped
              handleFileList(files);
            
            } else if (evt.originalEvent.dataTransfer.types) {
              // No files so may be it's HTML link or a URL which has been
              // dropped
              var text = evt.originalEvent.dataTransfer.getData(evt.originalEvent.dataTransfer.types[0]);
               scope.$apply(function() {
                  scope.fileContent = text; 
               });

            } else {
              // No FileAPI
              // Use old behavior, download file using proxy
            }

                 
          });

          // Handle a FileList (from input[type=file] or DnD), works only with FileAPI
          function handleFileList(files) {
            var file = files[0];
            scope.file = file;
            scope.fileUrl = "http://local/" + file.name;  
            
            // Read the file
 	        var reader = new FileReader();
	        //reader.onprogress = handleReaderProgress;
	        reader.onload = handleReaderLoadEnd;
            reader.readAsText(file);
          }
                
          // Callback when FileReader has finished          
          function handleReaderLoadEnd(evt) {
               scope.$apply(function() {
                  scope.fileContent = evt.target.result;
               });
               displayFileContent(); 
          }
           
          // Display the KML file content on the map
          function displayFileContent() {
                  // Add a layer 
                  var epsg4326 = ol.proj.get('EPSG:4326');
                  var swissProjection = ol.proj.get('EPSG:21781');

  
                  var vector = new ol.layer.Vector({
                    source: new ol.source.Vector({
                      projection: epsg4326
                    })
                  });
                  scope.map.addLayer(vector);
                
                  // Parse the KML file
                  var kml = new ol.parser.KML({
                    maxDepth: 1, 
                    dimension: 2, 
                    extractStyles: true, 
                    extractAttributes: true
                  });

                  vector.parseFeatures(scope.fileContent, kml, swissProjection);
                   
          }
        }
      }; 
    }]
  );
})();
