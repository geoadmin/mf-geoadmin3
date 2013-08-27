(function() {
  goog.provide('ga_feedback_directive');
  goog.require('ga_permalink');

  var module = angular.module('ga_feedback_directive', [
    'ga_permalink'
  ]);

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
              var feedbackUrl = scope.options.feedbackUrl;

              scope.permalinkValue = gaPermalink.getHref();

               // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkValue = gaPermalink.getHref();
              });

              scope.submit = function() {
                var formData = {
                  'email': scope.email,
                  'feedback': scope.feedback,
                  'ua': navigator.userAgent,
                  'permalink': scope.permalinkValue
                };

                $http({
                  method: method,
                  url: feedbackUrl,
                  // Work with params in order to serialize the json object
                  params: formData,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
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
