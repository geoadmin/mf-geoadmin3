(function() {
  goog.provide('ga_tooltip_controller');

  var module = angular.module('ga_tooltip_controller', []);

  module.controller('GaTooltipController',
      ['$scope', 'gaGlobalOptions',
      function($scope, gaGlobalOptions) {

        var baseUrl = function(topic) {
            return gaGlobalOptions.serviceUrl +
                '/rest/services/' + topic +
                '/MapServer/';

        };

        $scope.options = {
          getIdentifyUrl: function(topic) {
            return baseUrl(topic) + 'identify?';
          },
          getHtmlUrl: function(topic) {
            return baseUrl(topic);
          }
        };
      }
  ]);
})();
