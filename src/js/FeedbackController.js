(function() {
  goog.provide('ga_feedback_controller');

  var module = angular.module('ga_feedback_controller', []);

  module.controller('GaFeedbackController',
      ['$scope', '$http', 'gaPermalink', function($scope, $http, gaPermalink) {

        $scope.permalinkValue = gaPermalink.getHref();

        $scope.submit = function() {

        };

      }]);

})();
