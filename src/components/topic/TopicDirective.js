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
          templateUrl: function(element, attrs) {
            return 'components/topic/partials/topic.' +
              ((attrs.gaTopicUi == 'select') ? 'select.html' : 'html');
          },
          scope: {
            options: '=gaTopicOptions'
          },
          link: function(scope, element, attrs) {
            var options = scope.options;

            function isValidTopicId(id) {
              var i, len = scope.topics.length;
              for (i = 0; i < len; i++) {
                if (scope.topics[i].id == id) {
                  return true;
                }
              }
              return false;
            }

            function initTopics() {
              var topicId = gaPermalink.getParams().topic;
              if (isValidTopicId(topicId)) {
                scope.activeTopic = topicId;
              } else {
                scope.activeTopic = options.defaultTopicId;
              }
            }

            function extendLangs(langs) {
              var res = [];
              angular.forEach(langs.split(','), function(lang) {
                res.push({
                  label: angular.uppercase(lang),
                  value: lang
                });
              });
              return res;
            }

            var url = gaUrlUtils.append(options.url, 'callback=JSON_CALLBACK');
            $http.jsonp(url).then(function(result) {
              scope.topics = result.data.topics;
              angular.forEach(scope.topics, function(value) {
                value.label = value.id;
                value.thumbnail = 'http://placehold.it/110x60';
                value.langs = extendLangs(value.langs);
                value.bgLayer = value.defaultBackgroundLayer;
              });
              initTopics();
            });

            scope.setActiveTopic = function(topicId) {
              scope.activeTopic = topicId;
            };

            scope.$watch('activeTopic', function(newVal) {
              if (newVal && scope.topics) {
                var i, len = scope.topics.length;
                for (i = 0; i < len; i++) {
                  var topic = scope.topics[i];
                  if (topic.id == newVal) {
                    gaPermalink.updateParams({topic: newVal});
                    $rootScope.$broadcast('gaTopicChange', topic);
                    break;
                  }
                }
              }
            });

         }
       };
      }]);
})();
