(function() {
  goog.provide('ga_offline_directive');

  goog.require('ga_map_service');
  goog.require('ga_networkstatus_service');

  var module = angular.module('ga_offline_directive', [
    'ga_map_service',
    'ga_networkstatus_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaOfflineDirectiveController',
    function($scope, $timeout, $translate, gaBrowserSniffer, gaOffline,
        gaNetworkStatus) {
      $scope.isIE9 = (gaBrowserSniffer.msie == 9);

      // Initialize scope variables
      $scope.offline = gaNetworkStatus.offline;

      // gaOffline values watchers
      $scope.$watch(gaOffline.hasData, function(val) {
        $scope.hasOfflineData = val;
      });

      $scope.$watch(gaOffline.isDownloading, function(val) {
        $scope.isDownloading = val;
      });

      $scope.$watch(gaOffline.isSelectorActive, function(val) {
        $scope.isOfflineSelectorActive = val;
      });

      $scope.$watch(gaOffline.isMenuActive, function(val) {
        $scope.isOfflineMenuActive = val;
      });

      // Offline data management
      $scope.save = function() {
        // Use $timeout fixes iOS8 homescreen bug(#1744).
        $timeout(function() {
          gaOffline.save($scope.map);
        }, 0, false);
      };

      $scope.abort = function() {
        // Use $timeout fixes iOS8 homescreen bug(#1744).
        $timeout(function() {
          if (confirm($translate.instant('offline_abort_warning'))) {
            gaOffline.abort();
            gaOffline.hideExtent();
          }
        }, 0, false);
      };

      $scope.toggleDataExtent = function() {
        gaOffline.toggleExtent($scope.map);
      };

      // Listeners
      $scope.$on('gaNetworkStatusChange', function(evt, val) {
        $scope.offline = val;
        if ($scope.offline) {
          if ($scope.isDownloading) {
            gaOffline.abort($scope);
          }
          gaOffline.hideSelector();
        }
      });
    }
  );

  module.directive('gaOfflineBt', function(gaOffline) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/offline/partials/offline-bt.html',
      controller: 'GaOfflineDirectiveController',
      link: function(scope, elt, attrs) {
        scope.onClick = function(evt) {
          if (!scope.isDownloading) {
            if (!scope.hasOfflineData) {
              gaOffline.toggleSelector();
            } else {
              gaOffline.toggleMenu();
            }
          }
        };
      }
    };
  });

  module.directive('gaOfflineMenu', function(gaOffline) {
    return {
      restrict: 'A',
      templateUrl: 'components/offline/partials/offline-menu.html',
      scope: {
        map: '=gaOfflineMenuMap'
      },
      controller: 'GaOfflineDirectiveController',
      link: function(scope, elt, attrs) {
        scope.openSelector = function() {
          gaOffline.hideMenu();
          gaOffline.showSelector();
        };
        scope.zoom = function() {
          gaOffline.hideMenu();
          gaOffline.showExtent(scope.map);
          gaOffline.displayData(scope.map);
        };
        scope.$watch(gaOffline.isExtentActive, function(val) {
          scope.isExtentActive = val;
        });
      }
    };
  });

  module.directive('gaOfflineSelector', function($timeout, $window, gaOffline,
      gaStorage) {
    return {
      restrict: 'A',
      templateUrl: 'components/offline/partials/offline-selector.html',
      scope: {
        map: '=gaOfflineSelectorMap'
      },
      controller: 'GaOfflineDirectiveController',
      link: function(scope, elt, attrs) {
        var deregister, rectangle, moving, height, width;
        var activate = function() {
          deregister = [
            scope.map.on('postcompose', handlePostCompose),
            scope.map.getView().on('change:rotation', function(evt) {
              moving = true;
            }),
            scope.map.getView().on('change:resolution', function(evt) {
              moving = true;
            }),
            scope.map.on('moveend', function(evt) {
              if (moving) {
                moving = false;
                refreshDisplay();
              }
            }),
            scope.map.on('change:size', function(evt) {
              refreshDisplay();
            })
          ];
          $window.addEventListener('orientationchange', timeoutRefreshDisplay);
          refreshDisplay();
          elt.show();
          scope.percent = 0;
          scope.isStorageFull = false;
          scope.statusMsg = '';
          scope.map.getView().setZoom(4);
        };

        var deactivate = function() {
          if (deregister) {
            for (var i = 0; i < deregister.length; i++) {
              deregister[i].src.unByKey(deregister[i]);
            }
          }
          $window.removeEventListener('orientationchange',
              timeoutRefreshDisplay);
          rectangle = [0, 0, 0, 0];
          scope.percent = 0;
          scope.map.render();
          elt.hide();
          if (scope.isDownloading) {
            scope.abort();
          }
        };

        var refreshDisplay = function() {
          updateSize();
          updateRectangle();
          scope.map.render();
        };

        // use to recenter the rectangle after an orientation change
        var timeoutRefreshDisplay = function() {
          $timeout(refreshDisplay, 500);
        };

        var handlePostCompose = function(evt) {
          evt.context.save();
          if (moving) { // Redraw rectangle only when roatting and zooming
            updateRectangle();
          }
          var ctx = evt.context;
          var topLeft = rectangle[0];
          var topRight = rectangle[1];
          var bottomRight = rectangle[2];
          var bottomLeft = rectangle[3];
          ctx.beginPath();
          // Outside polygon, must be clockwise
          ctx.moveTo(0, 0);
          ctx.lineTo(width, 0);
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.lineTo(0, 0);
          ctx.closePath();
          // Inner polygon,must be counter-clockwise
          ctx.moveTo(topLeft[0], topLeft[1]);
          ctx.lineTo(topRight[0], topRight[1]);
          ctx.lineTo(bottomRight[0], bottomRight[1]);
          ctx.lineTo(bottomLeft[0], bottomLeft[1]);
          ctx.lineTo(topLeft[0], topLeft[1]);
          ctx.closePath();
          ctx.fillStyle = 'rgba(0, 5, 25, 0.75)';
          ctx.fill();
          evt.context.restore();
        };

        var updateSize = function() {
          var size = scope.map.getSize();
          width = size[0] * ol.has.DEVICE_PIXEL_RATIO;
          height = size[1] * ol.has.DEVICE_PIXEL_RATIO;
        };

        // We need to calculate every corner to make it rotate
        var updateRectangle = function(scale) {
          var center = scope.map.getView().getCenter();
          var extent = ol.extent.buffer(center.concat(center), 5000);
          var topLeft = scope.map.getPixelFromCoordinate([extent[0],
              extent[3]]);
          var topRight = scope.map.getPixelFromCoordinate([extent[0],
              extent[1]]);
          var bottomRight = scope.map.getPixelFromCoordinate([extent[2],
              extent[1]]);
          var bottomLeft = scope.map.getPixelFromCoordinate([extent[2],
              extent[3]]);
          rectangle = [topLeft, topRight, bottomRight, bottomLeft];
          for (var i = 0; i < 4; i++) {
             rectangle[i][0] *= ol.has.DEVICE_PIXEL_RATIO;
             rectangle[i][1] *= ol.has.DEVICE_PIXEL_RATIO;
          }
        };

        scope.$watch('isOfflineSelectorActive', function(newVal, oldVal) {
          if (newVal === true) {
            activate();
          } else {
            deactivate();
          }
        });

        scope.$watch('isDownloading', function(val) {
          if (!val) {
            scope.percent = 0;
          }
        });

        scope.$on('gaOfflineProgress', function(evt, progress) {
          scope.$apply(function() {
            scope.percent = progress;
          });
        });

        scope.$on('gaOfflineSuccess', function(evt) {
          scope.$apply(function() {
            scope.toggleDataExtent();
            gaOffline.hideSelector();
          });
        });

        scope.$on('gaOfflineError', function(evt) {
          gaOffline.hideSelector();
          gaOffline.abort();
        });

        scope.$on('gaOfflineAbort', function(evt) {
          scope.$apply();
        });

      }
    };
  });


})();

