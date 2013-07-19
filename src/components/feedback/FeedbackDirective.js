(function() {
  goog.provide('ga_feedback_directive');

  var module = angular.module('ga_feedback_directive', []);

  /**
   * This directive displays a form for displaying and submitting feedback.
   *
   * When the response is received from the feedback service it sets the
   * "response" scope property to "success" or "error".
   */
  module.directive('gaFeedback',
      ['$http', 'gaPermalink',
        function($http, gaPermalink) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              options: '=gaFeedbackOptions',
              response: '=gaFeedbackResponse'
            },
            templateUrl: 'components/feedback/partials/feedback.html',
            link: function(scope, element, attrs) {
              var method = 'POST';
              var url = scope.options.baseUrlPath + '/feedback';

              scope.permalinkValue = gaPermalink.getHref();

              scope.submit = function() {
                var formData = {
                  'email': scope.email,
                  'feedback': scope.feedback,
                  'ua': navigator.userAgent,
                  'permalink': scope.permalinkValue,
                  'typeOfRequest': 'feedback'
                };

                $http({
                  method: method,
                  url: url,
                  data: formData
                }).success(function(response) {
                  scope.response = 'success';
                }).error(function(response) {
                  scope.response = 'error';
                });

              };
            }
          };
        }]);

})();
