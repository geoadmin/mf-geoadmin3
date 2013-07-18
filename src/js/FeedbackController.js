(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      ['$scope', '$http', 'gaPermalink', 'gaGlobalOptions', function($scope, $http, gaPermalink, gaGlobalOptions) {

        var method = "POST";
        var url = gaGlobalOptions.baseUrlPath + "/feedback";

        $scope.permalinkValue = gaPermalink.getHref();

        $scope.submit = function() {
          var formData = {
            'email': $scope.email,
            'feedback': $scope.feedback,
            'ua': navigator.userAgent,
            'permalink': $scope.permalinkValue,
            'typeOfRequest': 'feedback'
          };
          console.log(formData);
          $http({
            method: method,
            url: url,
            data: formData
          }).
          success(function(response){
                alert("ok");
          }).
          error(function(response){
                alert("not ok");
          })

        };

      }]);

})();
