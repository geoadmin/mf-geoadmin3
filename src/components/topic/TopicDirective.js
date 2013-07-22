(function() {
  goog.provide('ga_topic_directive');

  var module = angular.module('ga_topic_directive', [
    'ga_permalink'
  ]);

  module.directive('gaTopicSelector',
      ['$rootScope', 'gaPermalink', function($rootScope, gaPermalink) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/topic/partials/topic.html',
          link: function(scope, element, attrs) {

            // FIXME: tests data, use remote service
            scope.topics = [{
              id: 'bafu',
              label: 'BAFU',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'swisstopo',
              label: 'swisstopo',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'are',
              label: 'ARE',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'bazl',
              label: 'BAZL',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'wandern',
              label: 'Wandern',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'verkehr',
              label: 'Verkehr',
              thumbnail: 'http://placehold.it/110x60'
            }, {
              id: 'larm',
              label: 'Lärm',
              thumbnail: 'http://placehold.it/110x60'
            }];

            scope.setActiveTopic = function(topicId) {
              for (var i = 0, len = scope.topics.length; i < len; i++) {
                var topic = scope.topics[i];
                if (topic.id == topicId) {
                  scope.activeTopic = topic;
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
              // topic not set, fallback to 'swisstopo'
              scope.setActiveTopic('swisstopo');
            }
          }
        };
      }]);
})();
