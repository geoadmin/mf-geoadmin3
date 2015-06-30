goog.provide('ga_draw_controller');
(function() {

  var module = angular.module('ga_draw_controller', [
    'pascalprecht.translate',
    'ga_styles_service'
  ]);

  module.controller('GaDrawController',
      function($rootScope, $scope, $translate, gaGlobalOptions, gaStyleFactory, gaMeasure) {
        
        $scope.$on('gaPopupFocusChange', function(evt, isFocus) {
          $scope.options.hasPopupFocus = isFocus;
        });

        // Defines static styles
        var white = [255, 255, 255];
        var black = [0, 0, 0];

        $scope.options = $scope.options || {};
        $scope.options.shortenUrl = gaGlobalOptions.apiUrl
              + '/shorten.json',
         
        // Add popup options
        $scope.options.popupOptions = {
          title: 'no type',
          help:'66',
          x: 0,
          y: 'auto',
          container: 'body',
          position: 'bottom-left'
        };

        // Add measure options
        $scope.options.measureOptions = {
        };
 
        // Add profile options
        $scope.options.profileOptions = {
          xLabel: 'profile_x_label',
          yLabel: 'profile_y_label',
          margin: {
             top: 0,
             right: 20,
             bottom: 40,
             left: 60
          },
          height: 145,
          elevationModel: 'COMB'
        };

        // Defines directive options
        $scope.options.showExport =
            angular.isDefined($scope.options.showExport) ?
            $scope.options.showExport : true;

        $scope.options.broadcastLayer =
            $scope.options.broadcastLayer || false;
         
        $scope.options.useTemporaryLayer =
            $scope.options.useTemporaryLayer || false;

        $scope.options.translate = $translate; // For translation of ng-options

        $scope.options.name = '';

        $scope.options.description = '';

        $scope.options.colors = [
          {name: 'black',  fill: [0, 0, 0], border: 'white'},
          {name: 'blue',   fill: [0, 0, 255], border: 'white'},
          {name: 'gray',   fill: [128, 128, 128], border: 'white'},
          {name: 'green',  fill: [0, 128, 0], border: 'white'},
          {name: 'orange', fill: [255, 165, 0], border: 'black'},
          {name: 'red',    fill: [255, 0, 0], border: 'white'},
          {name: 'white',  fill: [255, 255, 255], border: 'black'},
          {name: 'yellow', fill: [255, 255, 0], border: 'black'}
        ];

        $scope.options.iconSizes = [
          {label:'24 px', value: [24, 24], scale: 0.5},
          {label:'36 px', value: [36, 36], scale: 0.75},
          {label:'48 px', value: [48, 48], scale: 1}
        ];

        $scope.options.icons = [
            
            // Basics
            {id: 'marker'},
            {id: 'circle'},
            {id: 'square'},
            {id: 'triangle'},
            {id: 'star'},
            {id: 'star-stroked'},
            {id: 'marker-stroked'},
            {id: 'circle-stroked'},
            {id: 'square-stroked'},
            {id: 'triangle-stroked'},
            {id: 'cross'},
            {id: 'disability'},
            {id: 'danger'},
            
            // Shops 
            {id: 'art-gallery'},
            {id: 'alcohol-shop'},
            {id: 'bakery'},
            {id: 'bank'},
            {id: 'bar'},
            {id: 'beer'},
            {id: 'cafe'},
            {id: 'cinema'},
            {id: 'commercial'},
            {id: 'clothing-store'},
            {id: 'grocery'},
            {id: 'fast-food'},
            {id: 'hairdresser'},
            {id: 'fuel'},
            {id: 'laundry'},
            {id: 'library'},
            {id: 'lodging'},
            {id: 'pharmacy'},
            {id: 'restaurant'},
            {id: 'shop'},
            
            // Transport
            {id: 'airport'},
            {id: 'bicycle'},
            {id: 'bus'},
            {id: 'car'},
            {id: 'ferry'},
            {id: 'london-underground'},
            {id: 'rail'},
            {id: 'rail-above'},
            {id: 'rail-light'},
            {id: 'rail-metro'},
            {id: 'rail-underground'},
            {id: 'scooter'},

            // Sport 
            {id: 'america-football'},
            {id: 'baseball'},
            {id: 'basketball'},
            {id: 'cricket'},
            {id: 'golf'},
            {id: 'skiing'},
            {id: 'soccer'},
            {id: 'swimming'},
            {id: 'tennis'},
            
            // Places 
            {id: 'airfield'},
            {id: 'building'},
            {id: 'campsite'},
            {id: 'cemetery'},
            {id: 'city'},
            {id: 'college'},
            {id: 'dog-park'},
            {id: 'embassy'},
            {id: 'farm'},
            {id: 'fire-station'},
            {id: 'garden'},
            {id: 'harbor'},
            {id: 'heliport'},
            {id: 'hospital'},
            {id: 'industrial'},
            {id: 'land-use'},
            {id: 'lighthouse'},
            {id: 'monument'},
            {id: 'minefield'},
            {id: 'museum'},
            {id: 'oil-well'},
            {id: 'park2'},
            {id: 'park'},
            {id: 'parking'},
            {id: 'parking-garage'},
            {id: 'pitch'},
            {id: 'place-of-worship'},
            {id: 'playground'},
            {id: 'police'},
            {id: 'polling-place'},
            {id: 'post'},
            {id: 'religious-christian'},
            {id: 'religious-jewish'},
            {id: 'religious-muslim'},
            {id: 'prison'},
            {id: 'school'},
            {id: 'slaughterhouse'},
            {id: 'theatre'},
            {id: 'toilets'},
            {id: 'town'},
            {id: 'town-hall'},
            {id: 'village'},
            {id: 'warehouse'},
            {id: 'wetland'},
            {id: 'zoo'},

            
            {id: 'camera'},
            {id: 'chemist'},
            {id: 'dam'},
            {id: 'emergency-telephone'},
            {id: 'entrance'},
            {id: 'heart'},
            {id: 'logging'},
            {id: 'mobilephone'},
            {id: 'music'},
            {id: 'roadblock'},
            {id: 'rocket'},
            {id: 'suitcase'},
            {id: 'telephone'},
            {id: 'waste-basket'},
            {id: 'water'}
        ];
       
        $scope.options.setDefaultValues = function() { 
          // Set default color
          $scope.options.color = $scope.options.colors[5];
          
          // Set default icon
          $scope.options.icon = $scope.options.icons[0];
          
          // Set default icon size
          $scope.options.iconSize = $scope.options.iconSizes[2];

        }
        $scope.options.setDefaultValues();

        // Define icons properties
        for (var i = 0, ii = $scope.options.icons.length; i < ii; i++) {
          var icon = $scope.options.icons[i];
          icon.url = gaGlobalOptions.resourceUrl + 'img/maki/' + icon.id + '-24@2x.png';
        }
        $scope.getIconUrl = function(i) {
          return i.url;
        };

        // Get the current style defined by inputs 
        $scope.options.updateStyle = function(feature) {
          var style;
          var oldStyles = feature.getStyle();
          if (oldStyles.length) {
            style = oldStyles[0];
          } else {
            // No style to update
            return;         
          }

          // Update Fill if it exists
          var color = $scope.options.color;
          var fill = style.getFill();
          if (fill) {
            fill.setColor(color.fill.concat([0.4]));
          }
          
          // Update Stroke if it exists
          var stroke = style.getStroke();
          if (stroke) {
            stroke.setColor(color.fill.concat([1]));
          }
          
          // Update text style
          var text = style.getText();
          if (text && $scope.options.name) {
            text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: $scope.options.name,
              fill: new ol.style.Fill({
                color: color.fill.concat([1])
              }),
              stroke: gaStyleFactory.getTextStroke(color.fill.concat([1]))
            });
          } 

          // Update Icon style if it exists
          var icon = style.getImage();
          if (icon instanceof ol.style.Icon &&
              angular.isDefined($scope.options.icon)) {
            icon = new ol.style.Icon({
              src: $scope.getIconUrl($scope.options.icon),
              scale: $scope.options.iconSize.scale
            });
          }
          
          // Set feature's properties
          if ($scope.options.name) {
            feature.set('name', $scope.options.name);
          }
          feature.set('description', $scope.options.description);

          var styles = [
            new ol.style.Style({
              fill: fill,
              stroke: stroke,
              text: text,
              image: icon,
              zIndex: style.getZIndex()
            })
          ];
          return styles;
        };

        // Draw a marker
        var markerDrawStyleFunc = function(feature, resolution) {
          var styles = [
            new ol.style.Style({
              image: new ol.style.Icon({
                src: $scope.getIconUrl($scope.options.icon),
                scale: $scope.options.iconSize.scale
              }),
              zIndex: gaStyleFactory.ZICON
            })
          ];
          return styles;
        }
        

        // Draw a text
        var annotationDrawStyleFunc = function(feature, resolution) {
          var color = $scope.options.color;
          if (!$scope.options.name) {
            $scope.options.name = $translate.instant('draw_new_text');
          }
          var text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: $scope.options.name,
              fill: new ol.style.Fill({
                color: color.fill.concat([1])
              }),
              stroke: gaStyleFactory.getTextStroke(color.fill)
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

        // Draw a dashed line or polygon 
        var measureDrawStyleFunc = function(feature) {
          var color = $scope.options.colors[5]; // red
          var stroke = new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3
          });
          var dashedStroke = new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3,
            lineDash: [8]
          });
          var styles = [
            new ol.style.Style({
              fill: new ol.style.Fill({
                color: color.fill.concat([0.4])
              }),
              stroke: dashedStroke,
              zIndex: gaStyleFactory.ZPOLYGON
            }), new ol.style.Style({
              stroke: stroke,
              geometry: function(feature) {
                var coords = feature.getGeometry().getCoordinates();
                if (coords.length == 2 ||
                    (coords.length == 3 && coords[1][0] == coords[2][0] &&
                    coords[1][1] == coords[2][1])) {
                 var circle = new ol.geom.Circle(coords[0],
                     gaMeasure.getLength(feature.getGeometry()));
                 return circle;
                }
              },
              zIndex: gaStyleFactory.ZPOLYGON
            })
          ];
          return styles;
        };

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
              styles =  [sketchPolygon];
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
              styles =  [sketchCircle];
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
        $scope.options.tools = [{
          id: 'marker',
          cssClass: 'icon-ga-marker',
          drawOptions: {
            type: 'Point',
            style: markerDrawStyleFunc
          },
          style: markerDrawStyleFunc,
          useIconStyle: true
        }, {
          id: 'annotation',
          cssClass: 'icon-ga-add-text',
          drawOptions: {
            type: 'Point',
            style: annotationDrawStyleFunc
          },
          style: annotationDrawStyleFunc
        }, {
          id: 'linepolygon',
          cssClass: 'icon-ga-add-line',
          drawOptions: {
            type: 'Polygon',
            style: generateDrawStyleFunc(linepolygonDrawStyleFunc)
          },
          style: linepolygonDrawStyleFunc
        }, /*{
          id: 'freehand',
          drawOptions: {
            type: 'LineString',
            condition: ol.events.condition.shiftKeyOnly,
            freehandCondition: ol.events.condition.noModifierKeys,
            style: generateDrawStyleFunc(freehandDrawStyleFunc)
          },
          style: freehandDrawStyleFunc
        },*/ {
          id: 'measure',
          cssClass: 'icon-ga-measure',
          drawOptions: {
            type: 'Polygon',
            minPoints: 2,
            style: generateDrawStyleFunc(measureDrawStyleFunc)
            /*,
            geometryFunction: function(coords, geometry) {
              console.log('geomFunction');
              return new ol.geom.LineString(coords[0]);
            }*/
          },
          style: measureDrawStyleFunc,
          showMeasure: true
        }];
        
        for (var i = 0, ii = $scope.options.tools.length; i < ii; i++) {
          var tool = $scope.options.tools[i];
          tool.activeKey = 'is' + tool.id.charAt(0).toUpperCase() + tool.id.slice(1) + 'Active';
          tool.title = 'draw_' + tool.id;
        }
      });
})();
