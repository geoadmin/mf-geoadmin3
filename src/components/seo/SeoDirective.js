(function() {
  goog.provide('ga_seo_directive');

  goog.require('ga_map_service');
  goog.require('ga_seo_service');

  var module = angular.module('ga_seo_directive', [
    'ga_map_service',
    'ga_seo_service'
  ]);

  module.directive('gaSeo',
      function($sce, $timeout, gaSeoService, gaLayers) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/seo/partials/seo.html',
          scope: {
          },
          link: function(scope, element, attrs) {

            scope.triggerPageEnd = false;
            scope.showPopup = false;
            scope.htmls = [];

            var addHtmlSnippet = function(htmlSnippet) {
              scope.htmls.push($sce.trustAsHtml(htmlSnippet));
            };

            var initSnapshot = function() {
              var i,
                  layers = gaSeoService.getLayers(),
                  firstTime = true;

              $timeout(function() {
                scope.showPopup = true;
              }, 0);

              scope.$on('gaLayersChange', function() {
                if (firstTime) {
                  //Load metadata of selected layers
                  for (i = 0; i < layers.length; i++) {
                    gaLayers.getMetaDataOfLayer(layers[i])
                        .success(function(data) {
                          addHtmlSnippet(data);
                        }).error(function() {
                        });
                  }
                }
                firstTime = false;
              });

              //FIXME: right now, hardcoded pagload trigger of 3 seconds
              //Maybe this need to be adapted
              $timeout(function() {
                scope.triggerPageEnd = true;
              }, 3000);

            };

            if (gaSeoService.isSnapshot()) {
              initSnapshot();
           }
         }
       };
      });
})();
