(function() {
  goog.provide('ga_feedback_directive');

  goog.require('ga_browsersniffer_service');
  goog.require('ga_permalink');
  goog.require('ga_waitcursor_service');

  var module = angular.module('ga_feedback_directive', [
    'ga_browsersniffer_service',
    'ga_permalink',
    'ga_waitcursor_service',
    'pascalprecht.translate'
  ]);


  /**
   * This directive displays a form for displaying and submitting feedback.
   *
   * When the response is received from the feedback service it sets the
   * "response" scope property to "success" or "error".
   */
  module.directive('gaFeedback',
      function($http, $translate, gaPermalink, gaWaitCursor,
          gaBrowserSniffer) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              options: '=gaFeedbackOptions',
              response: '=gaFeedbackResponse'
            },
            templateUrl: 'components/feedback/partials/feedback.html',
            link: function(scope, element, attrs) {
              function validateSize(fileSize) {
                if (fileSize > 10000000) { // 10 Mo
                  alert($translate('file_too_large') + ' (Max 10Mb)');
                  return false;
                }
                return true;
              }

              function validateFormat(fileName) {
                if (/(pdf|zip|png|jpeg|jpg|kml|kmz|gpx)$/.test(fileName)) {
                  return true;
                } else {
                  alert($translate('feedback_unsupported_format'));
                  return false;
                }
              }
              function createFormData() {
                var formData;
                // Not supported by IE9
                if (!scope.isIE || gaBrowserSniffer.msie > 9) {
                    formData = new FormData();
                    formData.append('email', scope.email);
                    formData.append('feedback', scope.feedback);
                    formData.append('ua', navigator.userAgent);
                    formData.append('permalink', scope.permalinkValue);
                    formData.append('attachement', scope.file || '');
                    return formData;
                } else {
                    formData = {
                      email: scope.email,
                      feedback: scope.feedback,
                      ua: navigator.userAgent,
                      permalink: scope.permalinkValue,
                      attachement: ''
                    };
                    return $.param(formData);
                }
              }
              var method = 'POST';
              var feedbackUrl = scope.options.feedbackUrl;
              var elFileInpt = element.find('input[type=file]');
              scope.isIE9 = (gaBrowserSniffer.msie == 9);
              scope.isIE = !isNaN(gaBrowserSniffer.msie);
              scope.showProgress = false;

              if (!scope.isIE || gaBrowserSniffer.msie > 9) {
                var triggerInputFileClick = function() {
                  elFileInpt.click();
                };

                // Trigger the hidden input[type=file] onclick event
                element.find('button.ga-feedback-browse-button').
                    click(triggerInputFileClick);
                element.find('input[type=text][readonly]').
                    click(triggerInputFileClick);
              }

              elFileInpt.bind('change', function(evt) {
                var file = (evt.srcElement || evt.target).files[0];
                if (validateSize(file.size) && validateFormat(file.name)) {
                  scope.$apply(function() {
                    scope.file = file;
                  });
                } else {
                  scope.$apply(function() {
                    scope.file = null;
                  });
                }
              });

              scope.permalinkValue = gaPermalink.getHref();

              // Listen to permalink change events from the scope.
              scope.$on('gaPermalinkChange', function(event) {
                scope.permalinkValue = gaPermalink.getHref();
              });

              scope.submit = function() {
                var contentType;
                var formData = createFormData();
                var params = {
                  method: method,
                  url: feedbackUrl,
                  data: formData
                };
                if (!scope.isIE || gaBrowserSniffer.msie > 9) {
                  params.transformRequest = angular.identity;
                  params.headers = {'Content-Type': undefined};
                } else {
                  params.headers = {'Content-Type':
                      'application/x-www-form-urlencoded'};
                }

                gaWaitCursor.add();
                scope.showProgress = true;
                $http(params).success(function(response) {
                  gaWaitCursor.remove();
                  scope.showProgress = false;
                  scope.response = 'success';
                }).error(function(response) {
                  gaWaitCursor.remove();
                  scope.showProgress = false;
                  scope.response = 'error';
                });

              };
            }
          };
        });
})();
