(function() {
  goog.provide('ga_topic_directive');
  goog.require('ga_permalink');

  var module = angular.module('ga_topic_directive', [
    'ga_permalink'
  ]);

  module.directive('gaTopic',
      ['$rootScope', '$http', 'gaPermalink',
        function($rootScope, $http, gaPermalink) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/topic/partials/topic.html',
          scope: {
            options: '=gaTopicOptions'
          },
          link: function(scope, element, attrs) {
            var options = scope.options;

            function initTopics() {
              var topicParam = gaPermalink.getParams().topic;
              if (!topicParam || !scope.setActiveTopic(topicParam)) {
                // use default topic
                scope.setActiveTopic(options.defaultTopicId);
              }
            }

            $http.jsonp(options.url).then(function(result) {
              scope.topics = result.data.topics;
              angular.forEach(scope.topics, function(value) {
                value.label = value.id;
                value.thumbnail = 'http://placehold.it/110x60';
              });
              initTopics();
            });

            scope.setActiveTopic = function(topicId) {
              for (var i = 0, len = scope.topics.length; i < len; i++) {
                var topic = scope.topics[i];
                if (topic.id == topicId) {
                  gaPermalink.updateParams({topic: topic.id});
                  $rootScope.$broadcast('gaTopicChange', topic);
                  return true;
                }
              }
              return false;
            };

         }
       };
      }]);
})();
