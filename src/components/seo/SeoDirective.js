(function() {
  goog.provide('ga_seo_directive');

  goog.require('ga_map_service');
  goog.require('ga_seo_service');

  var module = angular.module('ga_seo_directive', [
    'ga_map_service',
    'ga_seo_service'
  ]);

  module.directive('gaSeo',
      function($sce, $timeout, $interval, $q, gaSeoService, gaLayers) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/seo/partials/seo.html',
          scope: {
          },
          link: function(scope, element, attrs) {
            var MIN_WAIT = 300;

            scope.triggerPageEnd = false;
            scope.showPopup = false;
            scope.htmls = [];

            var addHtmlSnippet = function(htmlSnippet) {
              scope.htmls.push($sce.trustAsHtml(htmlSnippet));
            };

            var getWaitPromise = function(time) {
              var def = $q.defer();
              $timeout(function() {
                def.resolve();
              }, time);
              return def.promise;
            };

            var insertLayerMetadata = function(layers) {
              var promises = [], i;

              var getMetadata = function(layerId) {
                var def = $q.defer();
                gaLayers.getMetaDataOfLayer(layerId)
                    .success(function(data) {
                      addHtmlSnippet(data);
                      def.resolve();
                    }).error(function() {
                      def.resolve();
                    });
                return def.promise;
              };

              for (i = 0; i < layers.length; i++) {
                promises.push(getMetadata(layers[i]));
              }
              return $q.all(promises);
            };

            var onLayersChange = function() {
              var layers = gaSeoService.getLayers(),
                  def = $q.defer(),
                  unregister;

              unregister = scope.$on('gaLayersChange', function() {
                var promises = [];

                //We wait at least MIN_WAIT after layers-config is loaded
                promises.push(getWaitPromise(MIN_WAIT));

                //Display layer metadata
                if (layers.length > 0) {
                  promises.push(insertLayerMetadata(layers));
                }

                $q.all(promises).then(function() {
                  def.resolve();
                });
                unregister();
              });

              return def.promise;
            };

            var onCatalogChange = function() {
              var def = $q.defer(),
                  unregister;

              unregister = scope.$on('gaCatalogChange', function() {
                getWaitPromise(MIN_WAIT).then(function() {
                  def.resolve();
                });
                unregister();
              });

              return def.promise;
            };

            var injectSnapshotData = function() {
              var promises = [];

              promises.push(onLayersChange());
              promises.push(onCatalogChange());

              return $q.all(promises);
            };

            // Just do something if we are in snapshot mode
            if (gaSeoService.isSnapshot()) {
              //Show popup
              $timeout(function() {
                scope.showPopup = true;
              }, 0);

              injectSnapshotData().then(function() {
                scope.triggerPageEnd = true;
              });
           }
         }
       };
      });
})();
