(function() {
  goog.provide('ga_importkml_controller');

  var module = angular.module('ga_importkml_controller', []);

  module.controller('GaImportKmlController', 
    ['$scope', '$http', '$log', 'gaGlobalOptions', function($scope, $http, $log, gaGlobalOptions) {
    
      $scope.file = null;  
      $scope.fileUrl = null;  
      $scope.fileContent = null; // Use for debug purpose
      $scope.userMessage = "";
      $scope.options = {
        serviceUrl: gaGlobalOptions.serviceUrl
      };

      // Handle fileURL
      $scope.handleFileUrl = function() {
        //scope.fileUrl = url;
        var url = $scope.fileUrl;
        
        if (url && url.length > 0) {
          var proxyUrl = $scope.options.serviceUrl + "/ogcproxy?url=" + encodeURIComponent(url);
          $scope.userMessage = "Uploading file ...";
          
          $http({method: 'GET', url: proxyUrl})
            .success(function(data, status, headers, config) {
              $scope.userMessage = "Upload succeed !!!";
              $scope.fileContent = data;                
              $scope.displayFileContent();
            })
            .error(function(data, status, headers, config) {
              $scope.userMessage = "Upload file failed !!! Verify that your file exists"; 
              $log.error("Display KML failed");               
            });
        }
      };

      // Display the KML file content on the map
      $scope.displayFileContent = function() {
        $scope.userMessage = "Starting parsing file ...";

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

        vector.parseFeatures($scope.fileContent, kml, swissProjection);                  
        $scope.userMessage = "File parsed. Your datas are now display on the map.";
      };
      
      // Handle a FileList (from input[type=file] or DnD), works only with FileAPI
      $scope.handleFileList = function(files) {
         $scope.userMessage = "Reading file ...";
          
         var file = files[0];
         $scope.file = file;         
           
         // Read the file
 	     var reader = new FileReader();
	     //reader.onprogress = handleReaderProgress;
	     reader.onload = $scope.handleReaderLoadEnd;
         reader.readAsText(file);
      };
                
      // Callback when FileReader has finished          
      $scope.handleReaderLoadEnd = function(evt) {
         $scope.userMessage = "Read file succeed !!!";
         $scope.fileContent = evt.target.result;
         $scope.displayFileContent();
         $scope.$apply();
      };           
  }]);
})();
