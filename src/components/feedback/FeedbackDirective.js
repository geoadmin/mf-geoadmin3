(function() {
  goog.provide('ga_feedback_directive');

  var module = angular.module('ga_feedback_directive', []);

  module.directive('gaFeedback',
      ['$http', '$rootScope', 'gaPermalink', 'gaGlobalOptions',
        function($http, $rootScope, gaPermalink, gaGlobalOptions) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              map: '=gaFeedbackOptions'
            },
            templateUrl: 'components/feedback/partials/feedback.html',
            link: function(scope, element, attrs) {
              var method = 'POST';
              var url = gaGlobalOptions.baseUrlPath + '/feedback';

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
                  $rootScope.$broadcast('gaFeedbackSuccess', response);
                }).error(function(response) {
                  $rootScope.$broadcast('gaFeedbackError', response);
                });

              };
            }
          };
        }]);

})();
