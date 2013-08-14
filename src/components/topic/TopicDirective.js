(function() {
  goog.provide('ga_topic_directive');
  goog.require('ga_permalink');
  goog.require('ga_urlutils_service');

  var module = angular.module('ga_topic_directive', [
    'ga_permalink',
    'ga_urlutils_service'
  ]);

  module.directive('gaTopic',
      ['$rootScope', '$http', 'gaPermalink', 'gaUrlUtils',
        function($rootScope, $http, gaPermalink, gaUrlUtils) {
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

            var url = gaUrlUtils.append(options.url, 'callback=JSON_CALLBACK');
            $http.jsonp(url).then(function(result) {
              scope.topics = result.data.topics;
              angular.forEach(scope.topics, function(value) {
                value.label = value.id;
                value.thumbnail = 'http://placehold.it/110x60';
              });
              initTopics();
            });

            scope.setActiveTopic = function(topicId) {
              var i, len = scope.topics.length;
              for (i = 0; i < len; i++) {
                var topic = scope.topics[i];
                if (topic.id == topicId) {
                  gaPermalink.updateParams({topic: topicId});
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
