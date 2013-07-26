(function() {
  goog.provide('ga_topic_directive');
  goog.require('ga_permalink');

  var module = angular.module('ga_topic_directive', [
    'ga_permalink'
  ]);

  module.directive('gaTopic',
      ['$rootScope', 'gaPermalink',
        function($rootScope, gaPermalink) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/topic/partials/topic.html',
          scope: {
            options: '=gaTopicOptions'
          },
          link: function(scope, element, attrs) {
            var options = scope.options;

            // FIXME: tests data, use remote service
            scope.topics = [{
              id: 'blw',
              label: 'BLW',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'inspire',
              label: 'Inspire',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'ech',
              label: 'ECH',
              thumbnail: 'http://placehold.it/110x60'
            }];

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

            var queryParams = gaPermalink.getParams();
            var found = scope.setActiveTopic(queryParams.topic);
            if (!found) {
              // topic not set, fallback to default
              scope.setActiveTopic(options.defaultTopicId);
            }
          }
        };
      }]);
})();
