goog.provide('ga_topic_directive');

goog.require('ga_topic_service');
(function() {

  var module = angular.module('ga_topic_directive', [
    'ga_topic_service'
  ]);

  module.directive('gaTopic',
      function($rootScope, $translate, $q, gaTopic) {
        return {
          restrict: 'A',
          templateUrl: 'components/topic/partials/topic.html',
          scope: {},
          link: function(scope, element, attrs) {
            var modal = element.find('.modal');

            var translateTopics = function(topics) {
              for (var i = 0; i < topics.length; i++) {
                topics[i].name = $translate.instant(topics[i].id);
              }
              return topics;
            };

            // Because ng-repeat creates a new scope for each item in the
            // collection we can't use ng-click="activeTopic = topic" in
            // the template. Hence this intermediate function.
            // see: https://groups.google.com/forum/#!topic/angular/nS80gSdZBsE
            scope.setActiveTopic = function(newTopic) {
              scope.activeTopic = newTopic;
            };

            scope.$watch('activeTopic', function(newTopic) {
              if (newTopic && scope.topics) {
                modal.modal('hide');
                gaTopic.set(newTopic);
              }
            });

            $rootScope.$on('$translateChangeEnd', function() {
              scope.topics = translateTopics(gaTopic.getTopics());
            });

            $q.all([$translate.onReady, gaTopic.loadConfig()]).then(
                function() {
              scope.topics = translateTopics(gaTopic.getTopics());
              scope.activeTopic = gaTopic.get();
              scope.$applyAsync(function() {
                element.find('.ga-topic-item').tooltip({
                  container: modal,
                  placement: 'bottom'
                });
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
