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
    this.$get = function($rootScope, $http, $translate, gaPermalink,
                         gaGlobalOptions, gaUrlUtils) {
      var topic; // The current topic
      var topics = []; // The list of topics available

      // Load the topics config
      var loadTopicsConfig = function(url) {
        return $http.get(url).then(function(response) {
          topics = response.data.topics;
          angular.forEach(topics, function(value) {
            value.tooltip = 'topic_' + value.id + '_tooltip';
            value.langs = gaGlobalOptions.languages;
            if (!value.activatedLayers) {
              value.activatedLayers = [];
            }
            if (!value.plConfig || !value.plConfig.length) {
              value.plConfig = false;
            } else {
              //plConfig overwrites some default settings. So we
              //apply them here
              var p = gaUrlUtils.parseKeyValue(value.plConfig);
              //Overwrite background layer if available
              if (p.bgLayer) {
                value.defaultBackground = p.bgLayer;
              }
              //Overwrite activated and selected layers
              if (p.layers && p.layers.length) {
                value.activatedLayers = [];
                value.selectedLayers = [];
                var ls = p.layers.split(',');
                var lv = p.layers_visibility ?
                         p.layers_visibility.split(',') : [];
                for (var i = 0; i < ls.length; i++) {
                  if (i < lv.length && lv[i] != 'false') {
                    value.selectedLayers.push(ls[i]);
                  } else {
                    value.activatedLayers.push(ls[i]);
                  }
                }
              }

            }
          });
          topic = getTopicById(gaPermalink.getParams().topic, true);
          if (topic) {
            broadcast();
          }
        });
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
        var topicsP = loadTopicsConfig(topicsUrl);

        // Returns a promise that is resolved when topics are loaded
        this.loadConfig = function() {
          return topicsP;
        };

        // Returns the topics loaded. Should be used only after the
        // load config promise is resolved.
        this.getTopics = function() {
          return topics;
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
