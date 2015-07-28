goog.provide('ga_search_directive');

goog.require('ga_map_service');
goog.require('ga_marker_overlay_service');
goog.require('ga_permalink');
goog.require('ga_search_service');
goog.require('ga_search_type_directives');
(function() {

  var module = angular.module('ga_search_directive', [
    'ga_map_service',
    'ga_marker_overlay_service',
    'ga_permalink',
    'ga_search_service',
    'ga_search_type_directives',
    'ga_urlutils_service',
    'pascalprecht.translate'
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
    function($scope, $rootScope, $translate, $sce, $timeout, gaPermalink,
             gaUrlUtils, gaSearchGetCoordinate, gaMapUtils, gaMarkerOverlay,
             gaKml, gaPreviewLayers) {
      var keyboardNav = false;
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
            url = gaUrlUtils.append(url, 'lang=' + $translate.use());
            url = $scope.options.applyTopicToUrl(url,
                $scope.childoptions.currentTopic);

            $scope.childoptions.baseUrl = url;
            $scope.childoptions.query = q;
          }
        } else {
          blockQuery = false;
        }
      };

      $scope.trigger = function() {
        startQuery($scope.query);
      };

      $scope.$watch('query', function() {
        $scope.trigger();
      });

      $scope.$on('gaTopicChange', function(evt, data) {
        $scope.childoptions.currentTopic = data.id;
      });

      $scope.updateHref = function() {
        $scope.encodedPermalinkHref = encodeURIComponent(gaPermalink.getHref());
      };

      $rootScope.$on('$translateChangeEnd', function() {
        $scope.lang = $translate.use();
      });

      $scope.layers = $scope.map.getLayers().getArray();

      $scope.setKeyboardNav = function(isNav) {
        keyboardNav = isNav;
      };

      var losingFocus = false;
      $scope.lostFocus = function() {
        if (!keyboardNav) {
          // We apply a timeout of 200 ms to make
          // sure the click event on the result item is fired
          // before the blur event on the input
          losingFocus = true;
          $timeout(function() {
            if (losingFocus) {
              $scope.searchFocused = false;
              losingFocus = false;
            }
          }, 200);
        }
      };

      $scope.onFocus = function() {
        losingFocus = false;
        $scope.setKeyboardNav(false);
        $scope.searchFocused = true;
      };

      $scope.showDropDown = function() {
        var hasResults = restat.sets() > 0 ? true : false;
        return $scope.searchFocused && hasResults;
      };

      //Init swisssearch parameter handling
      var searchParam = gaPermalink.getParams().swisssearch;
      if (angular.isDefined(searchParam) &&
          searchParam.length > 0) {
        $scope.searchFocused = true;
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
                  $scope.setKeyboardNav(false);
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
                  $scope.setKeyboardNav(true);
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
