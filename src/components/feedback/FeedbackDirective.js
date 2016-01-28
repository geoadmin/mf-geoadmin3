goog.provide('ga_feedback_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_export_kml_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_feedback_directive', [
    'ga_browsersniffer_service',
    'ga_export_kml_service',
    'ga_permalink',
    'pascalprecht.translate'
  ]);


  /**
   * This directive displays a form for displaying and submitting feedback.
   *
   * When the response is received from the feedback service it sets the
   * "response" scope property to "success" or "error".
   */
  module.directive('gaFeedback',
      function($http, $translate, gaPermalink, gaBrowserSniffer, gaExportKml,
               gaGlobalOptions) {
          return {
            restrict: 'A',
            replace: true,
            scope: {
              options: '=gaFeedbackOptions',
              map: '=gaFeedbackMap',
              active: '=gaFeedbackActive'
            },
            templateUrl: 'components/feedback/partials/feedback.html',
            link: function(scope, element, attrs) {
              function validateSize(fileSize) {
                if (fileSize > 10000000) { // 10 Mo
                  alert($translate.instant('file_too_large') + ' (Max 10Mb)');
                  return false;
                }
                return true;
              }

              function validateFormat(fileName) {
                if (/(pdf|zip|png|jpeg|jpg|kml|kmz|gpx)$/gi.test(fileName)) {
                  return true;
                } else {
                  alert($translate.instant('feedback_unsupported_format'));
                  return false;
                }
              }
              function createFormData() {
                var formData,
                    kml = '';
                if (canCreateKml()) {
                  kml = gaExportKml.create(drawingLayer,
                                           scope.map.getView().getProjection());
                }
                // Not supported by IE9
                var feedbackMessage = scope.feedback;
                feedbackMessage += '\n\n\n---------------------------------\n';
                feedbackMessage += 'Message created with version: ';
                feedbackMessage += gaGlobalOptions.version;
                if (!scope.isIE || gaBrowserSniffer.msie > 9) {
                    formData = new FormData();
                    formData.append('email', scope.email);
                    formData.append('feedback', feedbackMessage);
                    formData.append('ua', navigator.userAgent);
                    formData.append('permalink', scope.permalinkValue);
                    formData.append('attachement', scope.file || '');
                    formData.append('kml', kml);
                    return formData;
                } else {
                    formData = {
                      email: scope.email,
                      feedback: feedbackMessage,
                      ua: navigator.userAgent,
                      permalink: scope.permalinkValue,
                      attachement: '',
                      kml: kml
                    };
                    return $.param(formData);
                }
              }
              var drawingLayer = null;
              var method = 'POST';
              var feedbackUrl = scope.options.feedbackUrl;
              var elFileInpt = element.find('input[type=file]');
              scope.isIE9 = (gaBrowserSniffer.msie == 9);
              // msie is either false or a number
              scope.isIE = gaBrowserSniffer.msie ? true : false;
              scope.isMobile = gaBrowserSniffer.mobile;
              scope.showProgress = false;
              scope.success = false;
              scope.error = false;
              scope.form = true;

              var canCreateKml = function() {
                if (!drawingLayer ||
                    drawingLayer.getSource().
                        getFeatures().length <= 0) {
                  return false;
                }
                return true;
              };

              scope.resetFile = function(evt) {
                scope.file = null;
                evt.stopPropagation();
                evt.preventDefault();
              };

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
              scope.file = null;

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

              scope.$on('gaDrawingLayer', function(event, data) {
                drawingLayer = data;
              });

              scope.$watch('active', function(active) {
                scope.form = true;
                scope.error = false;
                scope.success = false;
                scope.showDraw = active;
                if (drawingLayer) {
                  drawingLayer.getSource().clear();
                }
              });

              scope.submit = function() {
                var contentType;
                var formData = createFormData();
                var params = {
                  method: method,
                  url: feedbackUrl,
                  data: formData
                };
                var resetF = function() {
                  scope.error = false;
                  scope.success = false;
                  scope.form = false;
                  scope.showProgress = false;
                  scope.file = null;
                  scope.feedback = '';
                };


                if (!scope.isIE || gaBrowserSniffer.msie > 9) {
                  params.transformRequest = angular.identity;
                  params.headers = {'Content-Type': undefined};
                } else {
                  params.headers = {'Content-Type':
                      'application/x-www-form-urlencoded'};
                }

                scope.showProgress = true;
                $http(params).success(function(response) {
                  resetF();
                  scope.success = true;
                }).error(function(response) {
                  resetF();
                  scope.error = true;
                });

              };
            }
          };
        });
})();
