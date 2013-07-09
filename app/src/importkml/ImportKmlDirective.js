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

                       //scope.file = file;
                       //scope.$apply();
                       
                       angular.element(event.target).scope().file = file;
                       angular.element(event.target).scope().fileName = file.name;
                       angular.element(event.target).scope().$apply();

                       $log.log(scope);
                       $log.log(file);
                   });
                }
            }; 
         }]);
})();
