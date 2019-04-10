goog.provide('ga_vector_feedback_controller');

goog.require('ga_background_service');
goog.require('ga_browsersniffer_service');
goog.require('ga_layers_service');

(function() {
  var module = angular.module('ga_vector_feedback_controller', [
    'ga_browsersniffer_service',
    'ga_background_service',
    'ga_layers_service'
  ]);

  module.controller('gaVectorTileFeedbackController', function(
      $scope,
      gaGlobalOptions
  ) {
    var apiUrl = gaGlobalOptions.apiUrl;
    $scope.options = {
      surveyUrl: 'https://findmind.ch/c/vectorsimple{lang}',
      serviceDocUrl: apiUrl + '/services/sdiservices.html#vectortiles'
    };
  });
})();
