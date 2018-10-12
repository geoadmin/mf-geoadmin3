goog.provide('ga_vector_feedback_controller');

(function() {
  var module = angular.module('ga_vector_feedback_controller', []);

  module.controller('GaVectorFeedbackController', function(
      $scope,
      gaGlobalOptions
  ) {
    $scope.options = {
      serviceDocUrl: gaGlobalOptions.apiUrl + '/services/sdiservices.html',
      comment: '',
      likeSelect: ''
    };
    $scope.submit = function() {
      console.log($scope.options.comment);
      console.log($scope.options.likeSelect);
    };
  });
})();
