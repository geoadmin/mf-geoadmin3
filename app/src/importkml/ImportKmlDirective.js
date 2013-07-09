(function() {
    goog.provide('ga_importkml_directive');
    
    var module = angular.module('ga_importkml_directive', []);
 
    module.directive('gaImportKml',
        ['$http', '$log',
        function($http, $log) {
            
            return {
                retsrict: 'A',
                templateUrl: 'src/importkml/partials/form.html', 
           
                link: function(scope, element, attrs, controller
                ) {
                   $(element).find("input[type=file]").bind('change', function(event){
                       var files = event.target.files;
                       var file = files[0];

                        
                        // Doesn't work
                       /*scope.$apply(function() 
                       {
                            scope.file = file;
                            scope.fileName = file.name;
                       });*/

                       // Work
                       var controllerScope =  angular.element(event.target).scope();
                       controllerScope.file = file;
                       controllerScope.fileName = file.name;
                       controllerScope.$apply();

                       // example of kml in Swiss territory
                       // http://60plus.csem.ch/v02/Balades/gpx_xml_kml/20091223_Vers_le_Lac_des_Tailleres.
                       $log.log(scope);
                       $log.log(file);
                   });
                }
            }; 
         }]);
})();
