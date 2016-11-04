goog.provide('ga_topic_directive');

goog.require('ga_topic_service');
(function() {

  var module = angular.module('ga_topic_directive', [
    'ga_topic_service'
  ]);

  module.directive('gaTopic',
      function($rootScope, gaTopic) {
        return {
          restrict: 'A',
          templateUrl: function(element, attrs) {
            return 'components/topic/partials/topic.' +
              ((attrs.gaTopicUi == 'select') ? 'select.html' : 'html');
          },
          scope: {},
          link: function(scope, element, attrs) {
            var indexedTopic = [];
            // Only because IE9 doesn't support flex
            // We need to use this magic number and an extra wrapper
            var desktopTopicWidth = 159.5;
            var baseTopicGrpClsName = 'ga-topic-group-wrapper-';
            var topicGroupWidths = {};

            // Because ng-repeat creates a new scope for each item in the
            // collection we can't use ng-click="activeTopic = topic" in
            // the template. Hence this intermediate function.
            // see: https://groups.google.com/forum/#!topic/angular/nS80gSdZBsE
            scope.setActiveTopic = function(newTopic) {
              scope.activeTopic = newTopic;
            };

            scope.$watch('activeTopic', function(newTopic) {
              if (newTopic && scope.topics) {
                gaTopic.set(newTopic);
              }
            });

            scope.groupedTopics = function() {
              indexedTopic = [];
              return scope.topics;
            };

            scope.topicPerGroup = function(topic) {
              var isNewTopicGroup =
                  indexedTopic.indexOf(topic.topicGroup) == -1;
              if (isNewTopicGroup) {
                indexedTopic.push(topic.topicGroup);
                topicGroupWidths[baseTopicGrpClsName + topic.topicGroup] = 0;
              }
              topicGroupWidths[baseTopicGrpClsName + topic.topicGroup] +=
                desktopTopicWidth;
              return isNewTopicGroup;
            };

            gaTopic.loadConfig().then(function() {
              scope.topics = gaTopic.getTopics();
              scope.activeTopic = gaTopic.get();
              scope.$applyAsync(function() {
                element.find('.ga-topic-item').tooltip({
                  placement: 'bottom'
                });
                for (var key in topicGroupWidths) {
                  element.find('.' + key).css('width', topicGroupWidths[key]);
                }
              });
              scope.$on('gaTopicChange', function(evt, newTopic) {
                if (scope.activeTopic != newTopic) {
                  scope.activeTopic = newTopic;
                }
              });
            });
          }
        };
      });
})();
