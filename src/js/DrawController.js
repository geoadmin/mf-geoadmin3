goog.provide('ga_draw_controller');

goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_draw_controller', [
    'pascalprecht.translate',
    'ga_styles_service'
  ]);

  module.controller('GaDrawController', function($scope, $translate,
      gaGlobalOptions, gaStyleFactory) {

    $scope.$on('gaPopupFocusChange', function(evt, isFocus) {
       $scope.options.hasPopupFocus = isFocus;
    });

    // Defines static styles
    var white = [255, 255, 255];
    var black = [0, 0, 0];

    var options = {
      showExport: true,
      broadcastLayer: false,
      useTemporaryLayer: false,
      translate: $translate // For translation of ng-options
    };

    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});

    // Set default options for draw style directive.
    var red = {name: 'red', fill: [255, 0, 0], border: 'white'};
    $scope.options.color = red;
    $scope.options.textColor = red;
    $scope.options.textSize = {label: 'small_size', scale: 1};
    $scope.options.icon = {id: 'marker'},
    $scope.options.iconColor = red;
    $scope.options.iconSize = {label: 'big_size', value: [48, 48], scale: 1};
    $scope.options.font = gaStyleFactory.FONT;

    // Return the icon url with the good color.
    var getIconUrl = function(icon) {
      return gaGlobalOptions.apiUrl + '/color/' +
          $scope.options.iconColor.fill.toString() + '/' + icon.id +
          '-24@2x.png';
    };

    // Draw a marker
    var markerDrawStyleFunc = function(feature, resolution) {
      var styles = [
        new ol.style.Style({
          image: new ol.style.Icon({
            src: getIconUrl($scope.options.icon),
            scale: $scope.options.iconSize.scale
          }),
          zIndex: gaStyleFactory.ZICON
        })
      ];
      return styles;
    };


    // Draw a text
    var annotationDrawStyleFunc = function(feature, resolution) {
      var color = $scope.options.textColor;
      if (!$scope.options.name) {
        $scope.options.name = $translate.instant('draw_new_text');
      }
      var text = new ol.style.Text({
          font: $scope.options.font,
          text: $scope.options.name,
          fill: new ol.style.Fill({
            color: color.fill.concat([1])
          }),
          stroke: gaStyleFactory.getTextStroke(color.fill),
          scale: $scope.options.textSize.scale
      });
      feature.set('name', $scope.options.name);

      var styles = [
        new ol.style.Style({
          text: text,
          zIndex: gaStyleFactory.ZICON
        })
      ];
      return styles;
    };

    // Draw a line or polygon
    var linepolygonDrawStyleFunc = function(feature) {
      var color = $scope.options.color;
      var styles = [
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: color.fill.concat([0.4])
          }),
          stroke: new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3
          }),
          zIndex: gaStyleFactory.ZPOLYGON
        })
      ];
      return styles;
    };

    var measureDrawStyleFunc = gaStyleFactory.getStyleFunction('measure');


    var generateDrawStyleFunc = function(styleFunction) {
      // ol.interaction.Draw generates automatically a sketchLine when
      // drawing  polygon
      var sketchPolygon = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.4]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 255, 255, 0],
          width: 0
        })
      });

      return function(feature, resolution) {
        var styles;
        if (feature.getGeometry().getType() === 'Polygon') {
          styles = [sketchPolygon];
        } else if (feature.getGeometry().getType() === 'Point') {
          var color = $scope.options.color;
          var fill = new ol.style.Fill({
            color: color.fill.concat([0.4])
          });
          var stroke = new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3
          });
          var sketchCircle = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 4,
              fill: fill,
              stroke: stroke
            })
          });
          styles = [sketchCircle];
        } else {
          styles = styleFunction(feature, resolution);
        }
        return styles;
      };
    };

    // Select style function display vertices of the geometry
    $scope.options.selectStyleFunction = (function() {

      // The vertex style display a black and white circle on the existing
      // vertices, and also when the user can add a new vertices.
      var vertexStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: white.concat([1])
          }),
          stroke: new ol.style.Stroke({
            color: black.concat([1])
          })
        }),
        geometry: function(feature) {
          var geom = feature.getGeometry();
          if (geom instanceof ol.geom.LineString) {
            var coordinates = feature.getGeometry().getCoordinates();
            return new ol.geom.MultiPoint(coordinates);
          } else if (geom instanceof ol.geom.Polygon) {
            var coordinates = feature.getGeometry().getCoordinates()[0];
            return new ol.geom.MultiPoint(coordinates);
          } else {
            return feature.getGeometry();
          }
        },
        zIndex: gaStyleFactory.ZSKETCH
      });

      return function(feature, resolution) {
        if (!feature.getStyleFunction() ||
            !feature.getStyleFunction().call(feature, resolution)) {
          return [vertexStyle];
        }
        var styles = feature.getStyleFunction().call(feature, resolution);
        // When a feature is selected we apply its current style and the
        // vertex style.
        return styles.concat([
          vertexStyle
        ]);
      }
    })();

    // Define tools
    if (!$scope.options.tools) {
      $scope.options.tools = [{
        id: 'marker',
        cssClass: 'fa fa-ga-marker',
        drawOptions: {
          type: 'Point',
          style: markerDrawStyleFunc
        },
        style: markerDrawStyleFunc
      }, {
        id: 'annotation',
        cssClass: 'fa fa-ga-add-text',
        drawOptions: {
          type: 'Point',
          style: annotationDrawStyleFunc
        },
        style: annotationDrawStyleFunc
      }, {
        id: 'linepolygon',
        cssClass: 'fa fa-ga-add-line',
        drawOptions: {
          type: 'Polygon',
          minPoints: 2,
          style: generateDrawStyleFunc(linepolygonDrawStyleFunc)
        },
        style: linepolygonDrawStyleFunc
      }, {
        id: 'measure',
        cssClass: 'fa fa-ga-measure',
        drawOptions: {
          type: 'Polygon',
          minPoints: 2,
          style: generateDrawStyleFunc(measureDrawStyleFunc)
        },
        style: measureDrawStyleFunc,
        showMeasure: true
      }];
    }
    for (var i = 0, ii = $scope.options.tools.length; i < ii; i++) {
      var tool = $scope.options.tools[i];
      tool.activeKey = 'is' + tool.id.charAt(0).toUpperCase() +
          tool.id.slice(1) + 'Active';
      tool.title = 'draw_' + tool.id;
    }
  });
})();
