(function() {
  goog.provide('ga_topic_controller');

  var module = angular.module('ga_topic_controller', []);

  module.controller('GaTopicController',
      ['$scope', 'gaPermalink', 'gaGlobalOptions',
        function($scope, gaPermalink, gaGlobalOptions) {
          $scope.options = {
            defaultTopicId: 'inspire',
            setActiveTopicId: function(topicId) {
              this.activeTopicId = topicId;
              this.updateUrl();
            },
            updateUrl: function() {
              this.url = gaGlobalOptions.serviceUrl + '/rest/services/' + this.activeTopicId +
                '/MapServer/layersconfig?lang=' + gaPermalink.getLang() + '&callback=' +
                'JSON_CALLBACK'
            }
          };
      }]);
})();
