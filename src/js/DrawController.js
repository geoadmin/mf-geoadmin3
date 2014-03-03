(function() {
  goog.provide('ga_draw_controller');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_draw_controller', [
    'ga_urlutils_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaDrawController',
      function($scope, $translate, gaGlobalOptions, $http, $rootScope, gaUrlUtils, $document) {
        
        // Defines static styles
        var white = [255, 255, 255];
        var black = [0, 0, 0];
        var transparent = [0, 0, 0, 0];
        var transparentCircle =  new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({color: transparent}),
          stroke: new ol.style.Stroke({color: transparent})
        }); 

        // Defines directive options
        $scope.options = {
          translate: $translate, // For translation of ng-options
          waitClass: 'ga-draw-wait',
          text: '',
          tools: [
            {id: 'point',   iconClass: 'icon-ga-mapfunction'},
            {id: 'line',    iconClass: 'icon-ga-mapfunction'},
            {id: 'polygon', iconClass: 'icon-ga-mapfunction'},
            {id: 'text',    iconClass: 'icon-ga-mapfunction'},
            {id: 'modify',  iconClass: 'icon-ga-mapfunction'},
            {id: 'delete',  iconClass: 'icon-ga-mapfunction'}
          ],
          colors: [
            {name:'black',  fill: [0, 0, 0],       textStroke: white},
            {name:'blue',   fill: [0, 0, 255],     textStroke: white},
            {name:'gray',   fill: [128, 128, 128], textStroke: white},
            {name:'green',  fill: [0, 128, 0],     textStroke: white},
            {name:'orange', fill: [255, 165, 0],   textStroke: black},
            {name:'red',    fill: [255, 0, 0],     textStroke: white},
            {name:'white',  fill: [255, 255, 255], textStroke: black},
            {name:'yellow', fill: [255, 255, 0],   textStroke: black}
           ]
        };
        
        // Set default color
        $scope.options.color = $scope.options.colors[5];

        // Define tools identifiers
        for (var i = 0, ii = $scope.options.tools.length; i < ii; i++) {
          var tool = $scope.options.tools[i];
          tool.options = 'is' + tool.id.charAt(0).toUpperCase() + tool.id.slice(1) + 'Active';
          tool.cssClass = 'ga-draw-' + tool.id + '-bt';
          tool.title = 'draw_' + tool.id;
          tool.description = 'draw_' + tool.id + '_description';
          tool.instructions = 'draw_' + tool.id + '_instructions';
        }
        
         
        // Define layer style function
        $scope.options.styleFunction = (function() {
          return function(feature, resolution) {
            var text;
            var color = $scope.options.color;
            var fill = new ol.style.Fill({
              color: color.fill.concat([0.4])
            })
            var stroke = new ol.style.Stroke({
              color: color.fill.concat([1]),
              width: 3
            });

            if (($scope.options.isTextActive ||
                ($scope.options.isModifyActive &&
                    feature.getGeometry() instanceof ol.geom.Point)) &&
                angular.isDefined($scope.options.text)) {

              text = new ol.style.Text({
                font: '16px Calibri,sans-serif',
                text: $scope.options.text,
                fill: new ol.style.Fill({
                  color: stroke.getColor()
                }),
                stroke: new ol.style.Stroke({
                  color: color.textStroke.concat([1]),
                  width: 3
                })
              });
            }
            
            var styles = [
              new ol.style.Style({
                fill: fill,
                stroke: stroke,
                text: text,
                image: (text) ? transparentCircle : new ol.style.Circle({
                  radius: 4,
                  fill: fill,
                  stroke: stroke
                })
              })
            ];

            if (feature.getStyleFunction() &&
                feature.getStyleFunction()() !== null) {
              return feature.getStyleFunction()(resolution); 
            }
            return styles;
          };
        })()

        $scope.options.drawStyleFunction = (function() {
          return function(feature, resolution) {
            var styles;
            if (feature.getGeometry().getType() === 'Polygon') {
              styles =  [
                new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.4]
                  }),
                  stroke: new ol.style.Stroke({
                    color: [255, 255, 255, 0],
                    width: 0
                  })
                })
              ];
            } else {
              styles = $scope.options.styleFunction(feature, resolution);
            }
            return styles;
          }
        })();
         
        $scope.options.selectStyleFunction = (function() {
          var fill = new ol.style.Fill({
            color: white.concat([0.4])
          });
          var stroke = new ol.style.Stroke({
            color: white.concat([0.6]),
            width: 3 
          });
          
          var vertexStyle = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: white.concat([1])
              }),
              stroke: new ol.style.Stroke({
                color: black.concat([1])
              })
            }) 
          })
           
          return function(feature, resolution) {
            if (!feature.getStyleFunction() ||
                feature.getStyleFunction()()=== null) {
              return [vertexStyle];
            }
            var styles = feature.getStyleFunction()(resolution);
            var style = styles[0];
            var text = style.getText();
            if (text) {
              text = new ol.style.Text({
                font: text.getFont(),
                text: text.getText(),
                fill: fill,
                stroke: stroke
              });
            }

            return [
              new ol.style.Style({
                fill: fill,
                stroke: stroke,
                text: text,
                image: (text) ? style.getImage() :
                  new ol.style.Circle({
                    radius: 4,
                    fill: fill,
                    stroke: stroke
                  }) 
              })
            ];
          }
        })();
      });
})();
