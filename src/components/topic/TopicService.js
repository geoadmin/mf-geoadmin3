goog.provide('ga_topic_service');

goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_topic_service', [
    'ga_permalink'
  ]);

  /**
   * Topics manager
   */
  module.provider('gaTopic', function() {
    this.$get = function($rootScope, $http, $q, $timeout, gaPermalink,
        gaGlobalOptions) {
      var topic; // The current topic
      var topics = []; // The list of topics available

      // Load the topics config
      var loadTopics = function(topicsUrl) {
        var deferred = $q.defer();
        $http.get(topicsUrl).success(function(data) {
          topics = data.topics;
          angular.forEach(topics, function(value) {
            value.tooltip = 'topic_' + value.id + '_tooltip';
            value.langs = angular.isString(value.langs) ?
                value.langs.split(',') : value.langs;
          });
          deferred.resolve(topics);
        }).error(function() {
          deferred.reject();
        });
        return deferred.promise;
      };

      var getTopicById = function(id, useFallbackTopic) {
        for (var i = 0, ii = topics.length; i < ii; i++) {
          if (topics[i].id == id) {
            return topics[i];
          }
        }
        if (useFallbackTopic) {
          // If the topic doesn't exist we load the default one
          var defaultTopic = getTopicById(gaGlobalOptions.defaultTopicId,
              false);
          // If the default topic doesn't exist we load the first one
          if (!defaultTopic) {
            return topics[0];
          }
          return defaultTopic;
        }
      };

      var broadcast = function() {
        if (gaPermalink.getParams().topic != topic.id) {
          gaPermalink.updateParams({topic: topic.id});
        }
        $rootScope.$broadcast('gaTopicChange', topic);
      };

      var Topic = function(topicsUrl) {

        // We load the topics configuration
        var topicsP = loadTopics(topicsUrl);

        topicsP.then(function(fetchedTopics) {
          topics = fetchedTopics;
          topic = getTopicById(gaPermalink.getParams().topic, true);
          if (topic) {
            // We must wait for all the directive to be completely initialized
            // before broadcasting. Otherwise, we may broadcast while nothing
            // is initialized to recieve the message.
            $timeout(broadcast);
          }
        });

        // Returns a promise that is resolved when topics are loaded
        this.getTopics = function() {
          return topicsP;
        };

        this.set = function(newTopic, force) {
          if (newTopic) {
            this.setById(newTopic.id, force);
          }
        };

        this.setById = function(newTopicId, force) {
          if (force || !topic || newTopicId != topic.id) {
            var newTopic = getTopicById(newTopicId, false);
            if (newTopic) {
              topic = newTopic;
              broadcast();
            }
          }
        };

        this.get = function() {
          return topic;
        };
      };
      return new Topic(this.topicsUrl);
    };
  });
})();
