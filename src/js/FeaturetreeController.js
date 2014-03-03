(function() {
  goog.provide('ga_featuretree_controller');

  var module = angular.module('ga_featuretree_controller', [
  ]);

  module.controller('GaFeaturetreeController',
      ['$scope', 'gaGlobalOptions', '$http',
      function($scope, gaGlobalOptions, $http){

        $scope.options = {
          searchUrlTemplate: gaGlobalOptions.mapUrl + '/rest/services/{Topic}/SearchServer',
          htmlUrlTemplate: gaGlobalOptions.cachedMapUrl + '/rest/services/{Topic}/MapServer/{Layer}/{Feature}/htmlPopup',
          active: false
        };

        $scope.printInProgress = false;
        $scope.printProgressPercentage = 0;
        var currentTopic = "";
        var featureTree;

        $scope.$on('gaTopicChange', function(event, topic) {
          currentTopic = topic.id;
        });

        $scope.print = function() {
          var printElementsTotal = countFeatures(featureTree);
          var printElementsLoaded = 0;
          var printLayers = new Array();
          printLayers["failure"] = "";
          $scope.printInProgress = true;
          $scope.printProgressPercentage = 0;

          printElementLoaded = function(html, layer_name){
            printLayers[layer_name] += html;
            printElementsLoaded++;
            $scope.printProgressPercentage = Math.round(printElementsLoaded / printElementsTotal * 100);
            if (printElementsTotal == printElementsLoaded && $scope.printInProgress){
              printFinished(printLayers);
            }
          }

          for(var layer_name in featureTree){
            layer = featureTree[layer_name];
            printLayers[layer_name] = "";
            for(var array_id in layer.features){
              var htmlUrl = $scope.options.htmlUrlTemplate
                .replace('{Topic}', currentTopic)
                .replace('{Layer}', layer_name)
                .replace('{Feature}', layer.features[array_id].id);
              $http.get(htmlUrl)
                .success(function(data, status, headers, config){
                  printElementLoaded(data, layer_name);
                })
                .error(function(data, status, headers, config) {
                  printElementLoaded("<div>There was a problem loading this feature. topic: "+currentTopic+", layer: "+layer_name+", feature: "+layer.features[array_id].id+", status: "+status+"<div>", "failure");
                });
            }
          } 
        };

        printFinished = function(printLayers){
          $scope.printInProgress = false;
          var printHtml = "";
          for (layer_name in printLayers){
            printHtml += printLayers[layer_name];
          }
          var cssLinks = angular.element.find('link');
          var windowPrint = window.open('', '', 'height=400, width=600');
          windowPrint.document.write('<html><head>');
          for (var i = 0; i < cssLinks.length; i++) {
            if (cssLinks[i].href) {
              var href = cssLinks[i].href;
              if (href.indexOf('app.css') !== -1) {
                windowPrint.document.write('<link href="' + href +
                '" rel="stylesheet" type="text/css" media="screen">');
                windowPrint.document.write('<link href="' +
                href.replace('app.css', 'print.css') +
                '" rel="stylesheet" type="text/css" media="print">');
              }
            }
          }
          windowPrint.document.write('</head><body ' +
          'onload="window.print(); window.close();">');
          windowPrint.document.write(printHtml);
          windowPrint.document.write('</body></html>');
          windowPrint.document.close();
        }

        countFeatures = function(featureTree){
          counter = 0;
          for(var layer_name in featureTree){
            counter += featureTree[layer_name].features.length;
          }
          return counter;
        }

        $scope.$on('gaUpdateFeatureTree', function(event, tree){
          featureTree = tree;
        });

        $scope.$on('gaTriggerFeatureTreeActivation', function() {
          if (!$scope.globals.isFeatureTreeActive) {
            $scope.globals.isFeatureTreeActive = true;
          }
        });

        $scope.$watch('globals.isFeatureTreeActive', function(newval, oldval) {
          if (angular.isDefined(newval)) {
            $scope.options.active = newval;
          }
        });
      }
  ]);
})();
