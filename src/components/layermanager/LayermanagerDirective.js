(function() {
  goog.provide('ga_layermanager_directive');

  goog.require('ga_layer_metadata_popup_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_layermanager_directive', [
    'pascalprecht.translate',
    'ga_layer_metadata_popup_service',
    'ga_map_service'
  ]);

  /**
   * Filter for the gaLayermanager directive's ngRepeat. The filter
   * reverses the array of layers so layers in the layer manager UI
   * have the same order as in the map.
   */
  module.filter('gaReverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

  /**
   * Filter to display a correct time label in all possible situations
   */
  module.filter('gaTimeLabel', function($translate) {
    var maxYear = (new Date()).getFullYear();
    return function(input, layer) {
      // input values possible: 1978, '1978', '19783112', '99993112', undefined
      // if layer is WMTS:
      //   if timeselector not active:
      //      '99993112' ==> $translate.instant('all');
      //   else :
      //      undefined ==> '-'
      //      '19783112' ==> '1978'
      // if layer is WMS or others:
      //   if timeselector not active:
      //      undefined ==> ''
      //   else
      //      1978  ==> '1978'
      if (!input) {
        return (layer.getSource() instanceof ol.source.WMTS) ? '-' :
            $translate.instant('time_all');
      }
      var yearNum = input;
      if (angular.isString(input)) {
        yearNum = parseInt(input.substring(0, 4));
      }
      return (yearNum <= maxYear) ? yearNum : $translate.instant('time_all');
    }
  });

  module.directive('gaLayermanager', function($compile, $document, $timeout,
      $rootScope, $translate, $window, gaBrowserSniffer, gaLayerFilters,
      gaLayerMetadataPopup, gaLayers) {

    // Test if all layers have the same time property value.
    var hasLayersSameTime = function(olLayers) {
      if (olLayers.length == 0) {
        return false;
      }
      var year;
      for (var i = 0, ii = olLayers.length; i < ii; i++) {
        if (!olLayers[i].timeEnabled) {
          continue;
        }

        if (!olLayers[i].time) {
          return false;
        }

        if (!year) {
          year = parseInt(olLayers[i].time.substr(0, 4));
        }

        if (year > new Date().getFullYear()) {
          return false;
        }

        if (year != parseInt(olLayers[i].time.substr(0, 4))) {
          return false;
        }
      }
      return year;
    };

    // Save the current time values of layers
    var savedTime = {};
    var setSavedTime = function(olLayers) {
      olLayers.forEach(function(olLayer) {
        if (olLayer.timeEnabled) {
          savedTime[olLayer.id] = olLayer.time;
        }
      });
    };

    // Timestamps list template
    var tpl =
      '<div class="ga-layer-timestamps">' +
        '<div tabindex="1" ng-if="tmpLayer.type == \'wms\'" ' +
             'ng-class="{badge: !tmpLayer.time}" ' +
             'ng-click="setLayerTime(tmpLayer, null)" ' +
             'translate>time_all</div> ' +
        '<div tabindex="1" ng-repeat="i in tmpLayer.timestamps" ' +
             'ng-class="{badge: (tmpLayer.time == i)}" ' +
             'ng-click="setLayerTime(tmpLayer, i)">' +
          '{{i | gaTimeLabel:tmpLayer}}' +
        '</div>' +
      '</div>';

    // Create the popover
    var popover, content, container, callback, closeBt;
    var win = $($window);
    var createPopover = function(target, element, scope) {

      // Lazy load
      if (!container) {
        container = element.parent();
        callback = function(evt) {
          destroyPopover(evt.target, element);
        };
        closeBt = $('<button class="close">&times;</button>').on('click',
            function() {
          destroyPopover(null, element);
        });
      }

      popover = $(target).popover({
        container: container,
        content: content,
        html: 'true',
        placement: function() {
          return (win.width() < 640) ? 'left' : 'right';
        },
        title: $translate.instant('time_select_year'),
        trigger: 'manual'
      });
      popover.addClass('ga-layer-timestamps-popover');
      popover.popover('show');
      container.find('.popover-title').append(closeBt);
      element.on('scroll', callback);
      $document.on('click', callback);
      win.on('resize', callback);
    };

    // Remove the popover
    var destroyPopover = function(target, element) {
      if (popover) {
        if (target) {
          var popoverElt = container.find('.popover');
          if (popoverElt.is(target) ||
              popoverElt.has(target).length !== 0) {
            return;
          }
        }
        popover.popover('destroy');
        popover = undefined;
        element.unbind('scroll', callback);
        $document.unbind('click', callback);
        win.unbind('resize', callback);
      }
    };

    var updateTimeSelectorStatus = function(layers, element) {
      var year = hasLayersSameTime(layers);
      $rootScope.$broadcast('gaTimeSelectorToggle', !!(year), year);
      destroyPopover(null, element);
    };

    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'components/layermanager/partials/layermanager.html',
      scope: {
        map: '=gaLayermanagerMap'
      },
      link: function(scope, element, attrs) {
        var map = scope.map;
        content = $compile(tpl)(scope);

        // The ngRepeat collection is the map's array of layers. ngRepeat
        // uses $watchCollection internally. $watchCollection watches the
        // array, but does not shallow watch the array items! The array
        // items are OpenLayers layers, we don't want Angular to shallow
        // watch them.
        scope.layers = map.getLayers().getArray();
        scope.layerFilter = gaLayerFilters.selected;
        scope.mobile = gaBrowserSniffer.mobile;

        // On mobile we use a classic select box, on desktop a popover
        if (!scope.mobile) {
          // Simulate a select box with a popover
          scope.displayTimestamps = function(evt, layer) {
            if (popover && popover[0] === evt.target) {
              destroyPopover(evt.target, element);
            } else {
              destroyPopover(evt.target, element);
              scope.tmpLayer = layer;
              // We use timeout otherwise the popover is bad centered.
              $timeout(function() {
                createPopover(evt.target, element, scope);
              }, 100, false);
            }
            evt.preventDefault();
            evt.stopPropagation();
          };
        } else {
          scope.displayTimestamps = function() {};
        }

        scope.isDefaultValue = function(timestamp) {
          if (timestamp && timestamp.length) {
            return (timestamp.substring(0, 4) === '9999') ? 'ga-black' : '';
          }
          return (!timestamp || timestamp === 9999) ? 'ga-black' : '';
        };

        var dupId = 0;
        scope.duplicateLayer = function(evt, layer) {
          var dupLayer = gaLayers.getOlLayerById(layer.bodId);
          dupLayer.time = layer.time;
          dupLayer.id = layer.id + '_' + dupId++;
          var index = scope.layers.indexOf(layer);
          map.getLayers().insertAt(index, dupLayer);
          evt.preventDefault();
        };

        scope.moveLayer = function(evt, layer, delta) {
          var index = scope.layers.indexOf(layer);
          var layersCollection = map.getLayers();
          layersCollection.removeAt(index);
          layersCollection.insertAt(index + delta, layer);
          evt.preventDefault();
        };

        scope.removeLayer = function(layer) {
          map.removeLayer(layer);
        };

        scope.isBodLayer = function(layer) {
          return !!gaLayers.getLayer(layer.bodId);
        };

        scope.displayLayerMetadata = function(evt, layer) {
          var bodId = layer.bodId;
          if (gaLayers.getLayer(bodId)) {
            gaLayerMetadataPopup.toggle(bodId);
          }
          evt.preventDefault();
        };

        scope.setLayerTime = function(layer, time) {
          if (angular.isDefined(time)) {
            layer.time = time;
          }
          setSavedTime(scope.layers);
          updateTimeSelectorStatus(scope.layers, element);
        };

        scope.useRange = (!gaBrowserSniffer.mobile && (!gaBrowserSniffer.msie ||
            gaBrowserSniffer.msie > 9));

        if (!scope.useRange) {
          scope.opacityValues = [
            { key: '1' , value: '100%'},
            { key: '0.95' , value: '95%' }, { key: '0.9' , value: '90%' },
            { key: '0.85' , value: '85%' }, { key: '0.8' , value: '80%' },
            { key: '0.75' , value: '75%' }, { key: '0.7' , value: '70%' },
            { key: '0.65' , value: '65%' }, { key: '0.6' , value: '60%' },
            { key: '0.55' , value: '55%' }, { key: '0.5' , value: '50%' },
            { key: '0.45' , value: '45%' }, { key: '0.4' , value: '40%' },
            { key: '0.35' , value: '35%' }, { key: '0.3' , value: '30%' },
            { key: '0.25' , value: '25%' }, { key: '0.2' , value: '20%' },
            { key: '0.15' , value: '15%' }, { key: '0.1' , value: '10%' },
            { key: '0.05' , value: '5%' }, { key: '0' , value: '0%' }
          ];
        }

        // Toggle layer tools for small screen
        element.on('click', '.icon-gear', function() {
          var li = $(this).closest('li');
          li.toggleClass('ga-layer-folded');
          $(this).closest('ul').find('li').each(function(i, el) {
            if (el != li[0]) {
              $(el).addClass('ga-layer-folded');
            }
          });
        });

        // Change layers label when topic changes
        scope.$on('gaLayersChange', function(evt, data) {
          map.getLayers().forEach(function(olLayer) {
            if (scope.isBodLayer(olLayer)) {
              olLayer.label = gaLayers.getLayerProperty(olLayer.bodId, 'label');
            }
          });
        });

        // Callbacks used to save/retrieve user time values defined before
        // activation/deactivation of TimeSelector.
        scope.$on('gaTimeSelectorToggle', function(evt, active) {
          if (active) {
            setSavedTime(map.getLayers());
          }
        });
        scope.$on('gaTimeSelectorChange', function(evt, year) {
          // year=undefined means TimeSelector is deactivated
          if (!angular.isDefined(year)) {
            map.getLayers().forEach(function(olLayer, opt) {
              if (olLayer.timeEnabled && savedTime[olLayer.id]) {
                olLayer.time = savedTime[olLayer.id];
              }
            });
            savedTime = {};
          }
        });

        scope.$watchCollection('layers | filter:layerFilter',
            function(olLayers) {
          updateTimeSelectorStatus(olLayers, element);
        });
      }
    };
  });
})();

