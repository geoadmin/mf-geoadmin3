(function() {
  goog.provide('ga_seo_directive');

  goog.require('ga_map_service');
  goog.require('ga_seo_service');

  var module = angular.module('ga_seo_directive', [
    'ga_map_service',
    'ga_seo_service'
  ]);

  module.directive('gaSeo',
      function($sce, $timeout, $interval, gaSeoService, gaLayers) {
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
              var i, intervalpromise,
                  layers = gaSeoService.getLayers(),
                  firstTime = true,
                  MIN_WAIT = 1000;

              //Minimal wait is 1 second and is the minimal wait time
              //after the layersconfig is loaded. Usually, catalog
              //is loaded later...so if we want to assure that
              //the catalog is loaded, we have to adapt a little

              $timeout(function() {
                scope.showPopup = true;
              }, 0);

              //We could adapt the description
              //$('meta[name=description]').attr('content', 'holidu');

              scope.$on('gaLayersChange', function() {
                if (firstTime) {
                  //Load metadata of selected layers
                  for (i = 0; i < layers.length; i++) {
                    gaSeoService.addRequestCount();
                    gaLayers.getMetaDataOfLayer(layers[i])
                        .success(function(data) {
                          addHtmlSnippet(data);
                          gaSeoService.removeRequestCount();
                        }).error(function() {
                          gaSeoService.removeRequestCount();
                        });
                  }


                  //keep this in the end here
                  intervalpromise = $interval(function() {
                    if (!gaSeoService.waitOnRequests()) {
                      $interval.cancel(intervalpromise);
                      scope.triggerPageEnd = true;
                    }
                  }, MIN_WAIT);
                }
                firstTime = false;
              });

            };

            if (gaSeoService.isSnapshot()) {
              initSnapshot();
           }
         }
       };
      });
})();
