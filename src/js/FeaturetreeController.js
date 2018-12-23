goog.provide('ga_featuretree_controller');

goog.require('ga_print_service');
goog.require('ga_translation_service');

(function() {

  var module = angular.module('ga_featuretree_controller', [
    'ga_print_service',
    'ga_translation_service'
  ]);

  module.controller('GaFeaturetreeController', function($http, $scope,
      gaLang, gaGlobalOptions, gaPrint) {

    var featureTreeId = '#featuretree-popup';
    // List of layers using an extendHtmlPoup for the print instead of htmlPopup
    var extended = {
      'ch.bazl.luftfahrthindernis': true
    };

    $scope.options = {
      msUrl: gaGlobalOptions.cachedApiUrl + '/rest/services/all/MapServer',
      featuresShown: false,
      hasMoreResults: false,
      nbFeatures: 0,
      max: 200
    };

    $scope.getItemText = function() {
      return '(' + (($scope.options.hasMoreResults) ? '+' : '') +
          $scope.options.nbFeatures + ')';

    };
    // When the results of query tool are updated, we collapse/expand the
    // features tree accordion, then we update the feature tree
    $scope.$on('gaQueryResultsUpdated', function(evt, featuresByLayer) {
      evt.stopPropagation();
      var show = false, nbFeatures = 0, hasMoreResults = false;
      angular.forEach(featuresByLayer, function(layer) {
        if (layer.features && layer.features.length > 0) {
          show = true;
          hasMoreResults = (hasMoreResults || layer.hasMoreResults);
          nbFeatures += layer.features.length;
        }
      });
      $scope.options.nbFeatures = nbFeatures;
      $scope.options.featuresShown = show;
      $scope.options.hasMoreResults = hasMoreResults;
      $scope.$broadcast('gaNewFeatureTree', featuresByLayer);
    });

    // Print popup stuff
    var featureTree, winPrint, useNewTab;
    $scope.printInProgress = false;
    $scope.printProgressPercentage = 0;
    $scope.print = function() {

      var printElementsTotal = $scope.options.nbFeatures;
      if (printElementsTotal === 0) {
        return;
      }

      // We determine if need to open the popup in a new tab (extended tooltip)
      // or a new window (default)
      useNewTab = false;
      for (var layerBodId in featureTree) {
        if (extended[layerBodId]) {
          useNewTab = true;
          break;
        }
      }
      if (winPrint) {
        winPrint.close();
      }
      if (useNewTab) {
        // Code needed to open in a new tab on Chrome
        winPrint = window.open('', 'printout');
      }

      var lang = gaLang.get();
      var printElementsLoaded = 0;
      var printLayers = [];
      printLayers['failure'] = {
        head: null,
        body: ''
      };
      $scope.printInProgress = true;
      $scope.printProgressPercentage = 0;

      var printElementLoaded = function(html, bodId) {
        if (/(<html|<head|<body)/i.test(html)) { // extendedHtmlPopup
          var head = /<head[^>]*>((.|[\n\r])*)<\/head>/.exec(html)[1];
          var body = /<body[^>]*>((.|[\n\r])*)<\/body>/.exec(html)[1];
          printLayers[bodId].head = head;
          printLayers[bodId].body += body;
        } else { // htmlPopup
          printLayers[bodId].body += html;
        }
        printElementsLoaded++;
        $scope.printProgressPercentage = Math.round(printElementsLoaded /
            printElementsTotal * 100);
        if (printElementsTotal === printElementsLoaded &&
            $scope.printInProgress) {
          printFinished(printLayers);
        }
      };

      for (var bodId in featureTree) {
        printLayers[bodId] = {
          head: null,
          body: ''
        };
        var layer = featureTree[bodId];
        var layerUrl = $scope.options.msUrl + '/' + bodId;
        for (var i in layer.features) {
          $http.get(layerUrl + '/' + layer.features[i].id + '/' +
              (extended[bodId] ? 'extendedHtmlPopup' : 'htmlPopup'), {
            params: {
              lang: lang
            }
          }).then(function(response) {
            printElementLoaded(response.data, bodId);
          }, function(response) {
            printElementLoaded('<div>' +
                'There was a problem loading this feature. Layer: ' + bodId +
                ', feature: ' + layer.features[i].id +
                ', status: ' + response.status + '<div>', 'failure');
          });
        }
      }
    };

    var printFinished = function(printLayers) {
      $scope.printInProgress = false;
      $scope.printProgressPercentage = 0;
      var head = '';
      var body = '';
      for (var bodId in printLayers) {
        if (printLayers[bodId].head) {
          head += printLayers[bodId].head;
        }
        body += printLayers[bodId].body;
      }
      gaPrint.htmlPrintout(body, head || undefined,
          (useNewTab) ? function() {} : undefined);
    };

    var ftPopup = $(featureTreeId);
    $scope.$on('gaUpdateFeatureTree', function(evt, tree) {
      featureTree = tree;

      // Open popup when it's reduced
      if ($scope.globals.isFeatureTreeActive &&
         ftPopup.hasClass('ga-popup-reduced')) {
        $scope.globals.isFeatureTreeActive = false;
      }
      evt.stopPropagation();
    });

    $scope.$on('gaGetMoreFeatureTree', function(evt, layer) {
      $scope.$broadcast('gaQueryMore', layer.bodId, layer.offset +
          $scope.options.max);
      evt.stopPropagation();
    });
  });
})();
