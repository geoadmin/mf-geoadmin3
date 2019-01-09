goog.provide('ga_catalogtree_controller');

(function() {

  var module = angular.module('ga_catalogtree_controller', []);

  module.controller('GaCatalogtreeController', function($scope,
      gaGlobalOptions) {
    var catalogUrlTemplate;
    // Config services urls (topic details)
    if (gaGlobalOptions.configOverwrite) {
      catalogUrlTemplate = gaGlobalOptions.configUrl +
              '/{Lang}/catalog.{Topic}.json';
    } else {
      catalogUrlTemplate = gaGlobalOptions.configUrl +
              '/configs/{Lang}/catalog.{Topic}.json'
    }
    $scope.options = {
      catalogUrlTemplate: catalogUrlTemplate
    };
  });
})();
