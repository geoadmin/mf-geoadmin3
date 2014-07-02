(function() {
  goog.provide('ga_featuretree_controller');
  goog.require('ga_print_service');
  var module = angular.module('ga_featuretree_controller',
    ['ga_print_service']
  );

  module.controller('GaFeaturetreeController',
        function($scope, gaGlobalOptions, gaPrintService, $http) {

        $scope.options = {
          searchUrlTemplate: gaGlobalOptions.apiUrl + '/rest/services/{Topic}/SearchServer',
          htmlUrlTemplate: gaGlobalOptions.cachedApiUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup'
        };

        $scope.printInProgress = false;
        $scope.printProgressPercentage = 0;
        var currentTopic = '';
        var featureTree;

        $scope.$on('gaTopicChange', function(event, topic) {
          currentTopic = topic.id;
        });

        $scope.print = function() {
          var printElementsTotal = countFeatures(featureTree);
          var printElementsLoaded = 0;
          var printLayers = [];
          printLayers['failure'] = '';
          $scope.printInProgress = true;
          $scope.printProgressPercentage = 0;

          var printElementLoaded = function(html, layerName) {
            printLayers[layerName] += html;
            printElementsLoaded++;
            $scope.printProgressPercentage = Math.round(printElementsLoaded / printElementsTotal * 100);
            if (printElementsTotal == printElementsLoaded && $scope.printInProgress) {
              printFinished(printLayers);
            }
          };

          for (var layerName in featureTree) {
            var layer = featureTree[layerName];
            printLayers[layerName] = '';
            for (var arrayId in layer.features) {
              var htmlUrl = $scope.options.htmlUrlTemplate
                .replace('{Topic}', currentTopic)
                .replace('{Layer}', layerName)
                .replace('{Feature}', layer.features[arrayId].id);
              $http.get(htmlUrl)
                .success(function(data, status, headers, config) {
                  printElementLoaded(data, layerName);
                })
                .error(function(data, status, headers, config) {
                  printElementLoaded("<div>There was a problem loading this feature. topic: "+currentTopic+", layer: "+layerName+", feature: "+layer.features[arrayId].id+", status: "+status+"<div>", "failure");
                });
            }
          }
        };

        var printFinished = function(printLayers) {
          $scope.printInProgress = false;
          var printHtml = '';
          for (var layerName in printLayers) {
            printHtml += printLayers[layerName];
          }
          gaPrintService.htmlPrintout(printHtml);
        };

        var countFeatures = function(featureTree) {
          var counter = 0;
          for (var layerName in featureTree) {
            counter += featureTree[layerName].features.length;
          }
          return counter;
        };

        $scope.$on('gaUpdateFeatureTree', function(event, tree) {
          featureTree = tree;

          // Open popup when it's reduced
          if ($scope.globals.isFeatureTreeActive  && $('#featuretree-popup').hasClass('ga-popup-reduced')) {
            $scope.globals.isFeatureTreeActive = false;
          }
        });

      }
  );
})();
