goog.provide('ga_seo_controller');
(function() {

  var module = angular.module('ga_seo_controller', []);

  module.controller('GaSeoController', function($scope, gaGlobalOptions) {
    $scope.options = {
      htmlUrlTemplate: gaGlobalOptions.apiUrl +
          '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup',
      searchUrl: gaGlobalOptions.apiUrl + '/rest/services/ech/SearchServer',
      identifyUrl: gaGlobalOptions.apiUrl +
          '/rest/services/all/MapServer/identify'
    };
  });
})();
