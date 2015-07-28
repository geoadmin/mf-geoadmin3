goog.provide('ga_search_directive');

goog.require('ga_map_service');
goog.require('ga_marker_overlay_service');
goog.require('ga_permalink');
goog.require('ga_search_service');
goog.require('ga_search_type_directives');
goog.require('ga_topic_service');
goog.require('ga_translation_service');
(function() {

  var module = angular.module('ga_search_directive', [
    'ga_map_service',
    'ga_marker_overlay_service',
    'ga_permalink',
    'ga_search_service',
    'ga_search_type_directives',
    'ga_urlutils_service',
    'ga_translation_service',
    'ga_topic_service'
  ]);

  var ResultStats = function() {
    this.results = {
      'locations': -1,
      'featuresearch': -1,
      'layers': -1
    };
  };

  ResultStats.prototype.reset = function() {
    for (var type in this.results) {
      this.results[type] = -1;
    }
  };

  ResultStats.prototype.update = function(type, nr) {
    this.results[type] = nr;
  };

  ResultStats.prototype.sets = function() {
    var ret = 0;
    for (var type in this.results) {
      ret += this.results[type] > 0 ? 1 : 0;
    }
    return ret;
  };

  ResultStats.prototype.done = function() {
    for (var type in this.results) {
      if (this.results[type] < 0) {
        return false;
      }
    }
    return true;
  };

  ResultStats.prototype.totalResults = function() {
    var ret = 0;
    for (var type in this.results) {
      ret += this.results[type] !== -1 ? this.results[type] : 0;
    }
    return ret;
  };

  var swisssearchActive = false;
  var keepSearchParam = false;

  module.controller('GaSearchDirectiveController',
    function($scope, $rootScope, $sce, $timeout, gaPermalink,
             gaUrlUtils, gaSearchGetCoordinate, gaMapUtils, gaMarkerOverlay,
             gaKml, gaPreviewLayers, gaLang, gaTopic) {
      var blockQuery = false;
      var restat = new ResultStats();
      $scope.restat = restat;

      // Child options are used as a carrier of communication
      // between main search directive and result directive
      $scope.childoptions = {};

      $scope.childoptions.featureUrl = $scope.options.featureUrl;

      // Result set announces a result selection
      $scope.childoptions.valueSelected = function(strValue) {
        $scope.query = strValue;
        blockQuery = true;

        // Take care of swisssearch parameter
        if (swisssearchActive) {
          // If we end up here because swisssearch cause a single click, we
          // remove the swisssearch parameter on move/zoom.
          if (restat.totalResults() == 1) {
            keepSearchParam = true;
            var uReg = $scope.map.getView().on('propertychange', function() {
              gaPermalink.deleteParam('swisssearch');
              ol.Observable.unByKey(uReg);
            });
          } else {
            gaPermalink.deleteParam('swisssearch');
          }
          swisssearchActive = false;
          $rootScope.$broadcast('gaSwisssearchDone');
        }
      };

      $scope.query = '';
      $scope.childoptions.query = '';

      $scope.clearInput = function() {
        restat.reset();
        gaMarkerOverlay.remove($scope.map);
        gaPreviewLayers.removeAll($scope.map);
        $scope.query = '';
        $scope.childoptions.query = '';
        $scope.input.blur();
      };

      $scope.preClear = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
      };

      $scope.lostFocus = function(evt) {
        $scope.searchFocused = false;
      };

      $scope.onFocus = function(evt) {
        $scope.searchFocused = true;
      };

      var startQuery = function(q) {
        restat.reset();

        if (!blockQuery) {
          // URL?
          if (gaUrlUtils.isValid(q)) {
            gaKml.addKmlToMapForUrl($scope.map, q, {
              attribution: q,
              zoomToExtent: true
            });
            return;
          }
          // Coordinate?
          var position = gaSearchGetCoordinate(
              $scope.map.getView().getProjection().getExtent(), q);

          if (position) {
            gaMapUtils.moveTo($scope.map, 8, position);
            gaMarkerOverlay.add($scope.map, position,
                                [position, position], true);
          } else {
            // Standard query then
            var url = gaUrlUtils.append($scope.options.searchUrl,
                                        'searchText=' + encodeURIComponent(q));
            url = gaUrlUtils.append(url, 'lang=' + gaLang.get());
            url = url.replace('{Topic}', gaTopic.get().id);

            $scope.childoptions.baseUrl = url;
            $scope.childoptions.query = q;
          }
        } else {
          blockQuery = false;
          $scope.childoptions.query = '';
        }
      };

      // We begin to watch the query only when topics are loaded
      gaTopic.getTopics().then(function() {
        $scope.topicLoaded = true;
        if ($scope.query) {
          startQuery($scope.query);
        }
        $scope.$watch('query', function(newVal, oldVal) {
          if (newVal != oldVal) {
            startQuery(newVal);
          }
        });
      });

      //Init swisssearch parameter handling
      var searchParam = gaPermalink.getParams().swisssearch;
      if (angular.isDefined(searchParam) &&
          searchParam.length > 0) {
        var unregister = $scope.$on('gaLayersChange', function() {
          // At this point layers are not added to the map yet
          $scope.map.getLayers().once('add', function() {
            $timeout(function() {
              swisssearchActive = true;
              $rootScope.$broadcast('gaSwisssearchActivated');
              $scope.query = searchParam;
              //Remove swisssearch parameter when query text changes
              var unregWatch = $scope.$watch('query', function(newval) {
                if (newval != searchParam && !keepSearchParam) {
                  swisssearchActive = false;
                  $rootScope.$broadcast('gaSwisssearchDone');
                  gaPermalink.deleteParam('swisssearch');
                  unregWatch();
                }
                keepSearchParam = false;
              });
            });
          });
          unregister();
        });
      }

    }
  );

  module.directive('gaSearch',
      function($timeout) {
        return {
          restrict: 'A',
          templateUrl: 'components/search/partials/search.html',
          controller: 'GaSearchDirectiveController',
          scope: {
            options: '=gaSearchOptions',
            map: '=gaSearchMap',
            searchFocused: '=gaSearchFocused'
          },
          link: function($scope, element, attrs) {
            $scope.input = element.find('input');

            $scope.keydown = function(evt) {
              //Enter key
              if (evt.keyCode == 13) {
                if (evt.target && evt.target.blur) {
                  evt.target.blur();
                }
              }
              //Down Arrow, Tab Or PageDown
              if (evt.keyCode == 9 || evt.keyCode == 40 || evt.keyCode == 34) {
                //focus to first result
                var firstRes = $(element).find('.ga-search-result').first();
                if (firstRes.length === 1 &&
                    firstRes[0].className.indexOf('ga-search-result') > -1) {
                  evt.preventDefault();
                  firstRes.focus();
                }
              }
            };

            // Result set announces their results (put here because we need
            // element)
            $scope.childoptions.announceResults = function(type, nr) {
              $scope.restat.update(type, nr);

              if (swisssearchActive &&
                  $scope.restat.done()) {
                $timeout(function() {
                  var renderedResults = element.find('.ga-search-item');
                  if (renderedResults.length === 1) {
                    renderedResults.click();
                  }
                });
              }
            };
          }
        };
      });
})();
