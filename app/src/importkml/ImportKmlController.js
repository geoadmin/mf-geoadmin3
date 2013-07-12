(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController', 
    ['$scope', '$http', '$log', 'gaGlobalOptions', function($scope, $http, $log, gaGlobalOptions) {
    
      $scope.file = null;  
      $scope.fileUrl = null;  
      $scope.fileContent = null; 
      $scope.userMessage = "";
      $scope.progress = 0;
      $scope.options = {
        serviceUrl: gaGlobalOptions.serviceUrl,
        proxyUrl: "ogcproxy?url="
      };

      // Handle fileURL
      $scope.handleFileUrl = function() {       
        var url = $scope.fileUrl;
        
        if (url && url.length > 0) { // Angular test the validation of the input too
          
          var proxyUrl =  $scope.options.proxyUrl + encodeURIComponent(url);
          $scope.userMessage = "Uploading file ...";
          $scope.progress = 0.1;

          $http.get(proxyUrl)
            .success(function(data, status, headers, config) {
              $scope.userMessage = "Upload succeed !!!";
              $scope.fileContent = data;                
              $scope.displayFileContent();
            })
            .error(function(data, status, headers, config) {
              $scope.userMessage = "Upload file failed !!! Verify that your file exists"; 
              $scope.progress = 0;
              $log.error("Display KML failed");               
            });
        }
      };
     

      // Handle a FileList (from input[type=file] or DnD), works only with FileAPI
      $scope.handleFileList = function(files) {

        var file = files[0];
        
         // Test the validity of the file
        if (!/\.kml$/g.test(file.name)) { 
          alert("The file you are trying to load is not a KML file");
          return ;
        }  

        if (file.size > 20000000) {
         alert("The file you are trying to load is more than 20 MB");
         return; 
        }
               
        $scope.file = file;       
        $scope.userMessage = "Reading file ...";
        $scope.progress = 0.1;    
        
        // Read the file
 	    var reader = new FileReader();
	    reader.onprogress = $scope.handleReaderProgress;
	    reader.onload = $scope.handleReaderLoadEnd;
        reader.readAsText(file);
      };
                
      // Callback when FileReader is processing
      $scope.handleReaderProgress = function(evt) {
        if (evt.lengthComputable) {
          $scope.$apply(function() {
            $scope.progress = (evt.loaded / evt.total) * 80 ;
          });
        }
      }

      // Callback when FileReader has finished          
      $scope.handleReaderLoadEnd = function(evt) {
        $scope.$apply(function() {
          $scope.userMessage = "Read file succeed !!!";
          $scope.fileContent = evt.target.result;
          $scope.displayFileContent();
        });
      }; 
     
     
      // Display the KML file content on the map
      $scope.displayFileContent = function() {
        $scope.userMessage = "Start parsing file ...";
        $scope.progress = 80;

        // Create vector layer 
        var epsg4326 = ol.proj.get('EPSG:4326');
        var swissProjection = ol.proj.get('EPSG:21781');  
        var vector = new ol.layer.Vector({
          source: new ol.source.Vector({
            projection: epsg4326
          })
        });
            
        // Add the layer
        $scope.map.addLayer(vector);

        // Parse the KML file
        var kml = new ol.parser.KML({
          maxDepth: 1, 
          dimension: 2, 
          extractStyles: true, 
          extractAttributes: true
        });
        
        try {
          vector.parseFeatures($scope.fileContent, kml, swissProjection);  
          $scope.userMessage = "File parsed. Your datas are now display on the map.";
          $scope.progress += 20;

        } catch(e) {
          $scope.userMessage = "Parsing failed for the following reason: " + e.message;
          $scope.progress = 0;
          $scope.map.removeLayer(kml);
        }

      };

      $scope.clearUserOutput = function() {
        $scope.userMessage = "";
        $scope.progress = 0;
      };

      $scope.cancel = function() {
        $scope.userMessage = "Operation canceled";
        $scope.progress = 0;
        
        if ($scope.fileReader) {
          $scope.fileReader.abort();
        }
 
        // Cancel $http, how?
        // $http.cancel();
      }
      
      $scope.reset = function() {
        $scope.cancel();
        $scope.clearUserOutput();
        $scope.file = null;
        $scope.fileUrl = null;
        $scope.fileContent = null;
      }
  }]);
})();
