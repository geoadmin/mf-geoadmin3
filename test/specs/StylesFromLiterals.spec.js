/* eslint-disable max-len */
describe('ga_stylesfromliterals_service', function() {

  describe('gaStylesFromLiterals', function() {
    var gaStylesFromLiterals, $window;

    beforeEach(function() {
      inject(function($injector) {
        gaStylesFromLiterals = $injector.get('gaStylesFromLiterals');
        $window = $injector.get('$window');
      });
    });

    it('supports icon style assignment for a point', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'icon',
          src: 'https://data.geo.admin.ch/ch.bfe.bikesharing/images/13.png'
          /* anchor: [
            1,
            1
          ] */
        }
      };
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle();
      var olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.Icon);
      expect(olImage.getSrc()).to.be(singleTypeStyle.vectorOptions.src);
      expect(olImage.getImage(1).crossOrigin).to.be('anonymous');
    });

    it('supports single type style assignment for a point', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'circle',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle();
      var olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.Circle);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(2);
      expect(olImage.getRadius()).to.equal(8);

      singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'square',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      gaStyle = gaStylesFromLiterals(singleTypeStyle);
      olStyle = gaStyle.getFeatureStyle();
      olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.RegularShape);
      expect(olImage.getPoints()).to.be(4);
      expect(olImage.getAngle()).to.be(Math.PI / 4);
      expect(olImage.getRotation()).to.be(0);
      expect(olImage.getRadius()).to.be(8);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(2);
      expect(olImage.getRadius()).to.equal(8);

      singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'triangle',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      gaStyle = gaStylesFromLiterals(singleTypeStyle);
      olStyle = gaStyle.getFeatureStyle();
      olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.RegularShape);
      expect(olImage.getPoints()).to.be(3);
      expect(olImage.getRotation()).to.be(0);
      expect(olImage.getAngle()).to.be(0);

      singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'star',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      gaStyle = gaStylesFromLiterals(singleTypeStyle);
      olStyle = gaStyle.getFeatureStyle();
      olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.RegularShape);
      expect(olImage.getPoints()).to.be(5);
      expect(olImage.getRotation()).to.be(0);
      expect(olImage.getAngle()).to.be(0);

      singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'cross',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      gaStyle = gaStylesFromLiterals(singleTypeStyle);
      olStyle = gaStyle.getFeatureStyle();
      olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.RegularShape);
      expect(olImage.getPoints()).to.be(4);
      expect(olImage.getRotation()).to.be(0);
      expect(olImage.getAngle()).to.be(0);

      // Test dynamic rotation on single type style
      singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        rotation: 'azimut',
        vectorOptions: {
          type: 'cross',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          }
        }
      };
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "bar",' +
            '"azimut": 1.22' +
          '}}'
      );
      gaStyle = gaStylesFromLiterals(singleTypeStyle);
      olStyle = gaStyle.getFeatureStyle(olFeature);
      olImage = olStyle.getImage();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.RegularShape);
      expect(olImage.getPoints()).to.be(4);
      expect(olImage.getRotation()).to.be(1.22);
      expect(olImage.getAngle()).to.be(0);
    });

    it('supports single type style assignment for a line', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'line',
        vectorOptions: {
          stroke: {
            color: '#FF1FF1',
            width: 3,
            lineCap: 'square',
            lineJoin: 'square'
          }
        }
      };
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olStyle.getStroke()).to.be.an(ol.style.Stroke);
      expect(olStyle.getStroke().getColor()).to.equal('#FF1FF1');
      expect(olStyle.getStroke().getWidth()).to.equal(3);
      expect(olStyle.getStroke().getLineCap()).to.equal('square');
      expect(olStyle.getStroke().getLineJoin()).to.equal('square');
    });

    it('supports single type style assignment for a point and a static label', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'circle',
          radius: 8,
          fill: {
            color: '#FFFFFF'
          },
          stroke: {
            color: '#FFFFFF',
            width: 2
          },
          label: {
            template: 'oh yes I am static',
            text: {
              textAlign: 'center',
              textBaseline: 'middle',
              font: 'bold 10px Helvetica',
              stroke: {
                color: 'rgba(22, 22, 22, 0.4)',
                width: 4
              },
              fill: {
                color: 'rgba(52, 52, 52, 0.3)'
              }
            }
          }
        }
      };
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle();
      var olImage = olStyle.getImage();
      var olText = olStyle.getText();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.Circle);
      expect(olText).to.be.an(ol.style.Text);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(2);
      expect(olImage.getRadius()).to.equal(8);
      expect(olText.getText()).to.equal('oh yes I am static');
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');
      expect(olText.getStroke()).to.be.an(ol.style.Stroke);
      expect(olText.getStroke().getColor()).to.equal('rgba(22, 22, 22, 0.4)');
      expect(olText.getStroke().getWidth()).to.equal(4);
      expect(olText.getFill()).to.be.an(ol.style.Fill);
      expect(olText.getFill().getColor()).to.equal('rgba(52, 52, 52, 0.3)');
    });

    it('supports single type style assignment for a polygon', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'polygon',
        vectorOptions: {
          fill: {
            color: '#FF2FF2'
          },
          stroke: {
            color: '#GG1GG1',
            width: 5
          }
        }
      };
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olStyle.getStroke()).to.be.an(ol.style.Stroke);
      expect(olStyle.getStroke().getColor()).to.equal('#GG1GG1');
      expect(olStyle.getStroke().getWidth()).to.equal(5);
      expect(olStyle.getFill()).to.be.an(ol.style.Fill);
      expect(olStyle.getFill().getColor()).to.equal('#FF2FF2');
    });

    it('supports label for single type style assignment', function() {
      var singleTypeStyle = {
        type: 'single',
        geomType: 'point',
        vectorOptions: {
          type: 'circle',
          radius: 8,
          fill: {
            color: '#FF1FF1'
          },
          stroke: {
            color: '#FFFFFF',
            width: 3
          },
          label: {
            property: 'foo',
            text: {
              textAlign: 'center',
              textBaseline: 'middle',
              font: 'bold 10px Helvetica',
              scale: 1.5,
              offsetX: 0,
              offsetY: 0,
              stroke: {
                color: 'rgba(255, 255, 255, 0.7)',
                width: 4
              },
              fill: {
                color: 'rgba(52, 52, 52, 0.95)'
              }
            }
          }
        }
      };
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "bar"' +
          '}}'
      );
      var gaStyle = gaStylesFromLiterals(singleTypeStyle);
      var olStyle = gaStyle.getFeatureStyle(olFeature);
      var olImage = olStyle.getImage();
      var olText = olStyle.getText();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.Image);
      expect(olImage).to.be.an(ol.style.Circle);
      expect(olText).to.be.an(ol.style.Text);
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getRadius()).to.equal(8);
      expect(olText.getText()).to.equal('bar');
      expect(olText.getFill()).to.be.an(ol.style.Fill);
      expect(olText.getStroke()).to.an(ol.style.Stroke);
      expect(olText.getScale()).to.equal(1.5);
      expect(olText.getOffsetX()).to.equal(0);
      expect(olText.getOffsetY()).to.equal(0);
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');
    });

    it('supports label for unique type style assignment', function() {
      var uniqueTypeStyle = {
        type: 'unique',
        property: 'foo',
        values: [
          {
            geomType: 'line',
            value: 'bar',
            vectorOptions: {
              stroke: {
                color: '#FFFFFF',
                width: 3
              },
              label: {
                property: 'oraison',
                text: {
                  textAlign: 'center',
                  textBaseline: 'middle',
                  font: 'bold 10px Helvetica',
                  scale: 1.1,
                  offsetX: 1,
                  offsetY: 2,
                  stroke: {
                    color: 'rgba(22, 22, 22, 0.4)',
                    width: 4
                  },
                  fill: {
                    color: 'rgba(52, 52, 52, 0.3)'
                  }
                }
              }
            }
          }, {
            geomType: 'point',
            value: 'toto',
            vectorOptions: {
              type: 'circle',
              radius: 2,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 3
              }
            }
          }
        ]
      };
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "toto",' +
            '"oraison": "mylord"' +
          '}}'
      );
      var gaStyle = gaStylesFromLiterals(uniqueTypeStyle);
      var olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      var olImage = olStyle.getImage();
      var olText = olStyle.getText();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).to.be.an(ol.style.Image);
      expect(olImage).to.be.an(ol.style.Circle);
      expect(olText).to.equal(null);
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getFill().getColor()).to.equal('#FF2222');

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '[10000,' +
               '20000],' +
              '[12000,' +
               '21000]' +
            '],' +
            '"type": "LineString"' +
          '},' +
          '"properties": {' +
            '"foo": "bar",' +
            '"oraison": "mylady"' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      olText = olStyle.getText();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).not.to.be.an(ol.style.Image);
      expect(olText).to.be.an(ol.style.Text);
      expect(olStyle.getStroke()).to.be.an(ol.style.Stroke);
      expect(olStyle.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olStyle.getStroke().getWidth()).to.equal(3);
      expect(olText.getText()).to.equal('mylady');
      expect(olText.getStroke()).to.an(ol.style.Stroke);
      expect(olText.getScale()).to.equal(1.1);
      expect(olText.getOffsetX()).to.equal(1);
      expect(olText.getOffsetY()).to.equal(2);
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '[10000,' +
               '20000],' +
              '[12000,' +
               '21000]' +
            '],' +
            '"type": "LineString"' +
          '},' +
          '"properties": {' +
            '"foo": "bar",' +
            '"oraison": 0' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      olText = olStyle.getText();
      expect(olStyle).to.be.an(ol.style.Style);
      expect(olImage).not.to.be.an(ol.style.Image);
      expect(olText).to.be.an(ol.style.Text);
      expect(olStyle.getStroke()).to.be.an(ol.style.Stroke);
      expect(olStyle.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olStyle.getStroke().getWidth()).to.equal(3);
      expect(olText.getText()).to.equal('0');
      expect(olText.getStroke()).to.an(ol.style.Stroke);
      expect(olText.getScale()).to.equal(1.1);
      expect(olText.getOffsetX()).to.equal(1);
      expect(olText.getOffsetY()).to.equal(2);
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');
    });

    it('supports simple unique type style assignment', function() {
      var uniqueTypeStyle = {
        type: 'unique',
        property: 'foo',
        values: [
          {
            geomType: 'point',
            value: 'bar',
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            value: 'toto',
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(uniqueTypeStyle);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "bar"' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      var olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '15000,' +
              '25000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "toto"' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);
    });

    it('supports simple unique type style assignment with dynamic rotation', function() {
      var uniqueTypeStyle = {
        type: 'unique',
        property: 'foo',
        values: [
          {
            geomType: 'point',
            value: 'bar',
            rotation: 'azimut',
            vectorOptions: {
              type: 'star',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            value: 'toto',
            rotation: 'azimut',
            vectorOptions: {
              type: 'star',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(uniqueTypeStyle);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "bar",' +
            '"azimut": 1.57' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      var olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olStyle.getImage().getRotation()).to.equal(1.57);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);
    });

    it('supports simple unique type style assignment resolution dependent', function() {
      // [minResolution, maxResolution[
      var uniqueTypeStyleWithRes = {
        type: 'unique',
        property: 'foo',
        values: [
          {
            geomType: 'point',
            minResolution: 1.5,
            maxResolution: 750,
            value: 'bar',
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            minResolution: 750,
            value: 'bar',
            vectorOptions: {
              type: 'circle',
              radius: 3,
              fill: {
                color: '#C03199'
              },
              stroke: {
                color: '#C03199',
                width: 1
              }
            }
          }, {
            geomType: 'point',
            value: 'toto',
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(uniqueTypeStyleWithRes);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "bar"' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 5);
      var olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);

      olStyle = gaStyle.getFeatureStyle(olFeature, 750);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#C03199');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#C03199');
      expect(olImage.getStroke().getWidth()).to.equal(1);

      olStyle = gaStyle.getFeatureStyle(olFeature, 2000);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#C03199');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#C03199');
      expect(olImage.getStroke().getWidth()).to.equal(1);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": "toto"' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 2000);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);

      // Resolution only
      uniqueTypeStyleWithRes = {
        type: 'unique',
        values: [
          {
            geomType: 'point',
            minResolution: 1.5,
            maxResolution: 750,
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            minResolution: 750,
            vectorOptions: {
              type: 'circle',
              radius: 3,
              fill: {
                color: '#C03199'
              },
              stroke: {
                color: '#C03199',
                width: 1
              }
            }
          }
        ]
      };

      gaStyle = gaStylesFromLiterals(uniqueTypeStyleWithRes);
      olStyle = gaStyle.getFeatureStyle(olFeature, 2000);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#C03199');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#C03199');
      expect(olImage.getStroke().getWidth()).to.equal(1);
      expect(olImage.getRadius()).to.equal(3);
    });

    it('supports range type style assignment', function() {
      var rangeTypeStyle = {
        type: 'range',
        property: 'foo',
        ranges: [
          {
            geomType: 'point',
            range: [0, 10],
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            range: [10, 20],
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(rangeTypeStyle);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 3' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      var olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '15000,' +
              '25000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 11' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '11000,' +
              '21000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 10' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '11000,' +
              '21000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 1000' +
          '}}'
      );
      var stub = sinon.stub($window.console, 'log');
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.equal(null);
      expect(stub.calledWithExactly('Feature ID: undefined. No matching style found for key foo and value 1000.')).to.be(true);
      stub.restore();
    });

    it('supports label templates', function() {
      var rangeTypeStyle = {
        type: 'range',
        property: 'foo',
        ranges: [
          {
            geomType: 'point',
            range: [0, 10],
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              },
              label: {
                template: '${name} is for ${foo} days in ${country}',
                text: {
                  textAlign: 'center',
                  textBaseline: 'middle',
                  font: 'bold 1.35em FrutigerNeueW02-Regular, Times, sans-serif',
                  stroke: {
                    color: '#FFFFFF',
                    width: 3
                  },
                  fill: {
                    color: '#FF1FF1'
                  },
                  backgroundFill: {
                    color: 'red'
                  },
                  backgroundStroke: {
                    color: 'red'
                  }
                }
              }
            }
          }, {
            geomType: 'point',
            range: [10, 2000000],
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              },
              label: {
                template: '${name} is for ${foo} days in ${country}',
                text: {
                  textAlign: 'center',
                  textBaseline: 'middle',
                  font: 'bold 1.35em FrutigerNeueW02-Regular, Times, sans-serif',
                  stroke: {
                    color: '#FF2222',
                    width: 3
                  },
                  fill: {
                    color: '#F55555'
                  }
                }
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(rangeTypeStyle);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 15,' +
            '"name": "Joe",' +
            '"country": "Baltimore"' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      var olImage = olStyle.getImage();
      var olText = olStyle.getText();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);
      expect(olText.getText()).to.equal('Joe is for 15 days in Baltimore');
      expect(olText.getStroke()).to.an(ol.style.Stroke);
      expect(olText.getStroke().getColor()).to.equal('#FF2222');
      expect(olText.getStroke().getWidth()).to.equal(3);
      expect(olText.getFill()).to.an(ol.style.Fill);
      expect(olText.getFill().getColor()).to.equal('#F55555');
      expect(olText.getFont()).to.equal('bold 1.35em FrutigerNeueW02-Regular, Times, sans-serif');
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');
      expect(olText.getBackgroundFill()).to.be.an(ol.style.Fill);
      expect(olText.getBackgroundStroke()).to.be.an(ol.style.Stroke);
      expect(olText.getBackgroundFill().getColor()).to.equal(null);
      expect(olText.getBackgroundStroke().getColor()).to.equal(null);

      // Test with a 0
      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 0,' +
            '"name": "Joe",' +
            '"country": "Baltimore"' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      olText = olStyle.getText();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);
      expect(olText.getText()).to.equal('Joe is for 0 days in Baltimore');
      expect(olText.getStroke()).to.an(ol.style.Stroke);
      expect(olText.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olText.getStroke().getWidth()).to.equal(3);
      expect(olText.getFill()).to.an(ol.style.Fill);
      expect(olText.getFill().getColor()).to.equal('#FF1FF1');
      expect(olText.getFont()).to.equal('bold 1.35em FrutigerNeueW02-Regular, Times, sans-serif');
      expect(olText.getTextAlign()).to.equal('center');
      expect(olText.getTextBaseline()).to.equal('middle');
      expect(olText.getBackgroundFill()).to.be.an(ol.style.Fill);
      expect(olText.getBackgroundStroke()).to.be.an(ol.style.Stroke);
      expect(olText.getBackgroundFill().getColor()).to.equal('red');
      expect(olText.getBackgroundStroke().getColor()).to.equal('red');
    });

    it('supports range type style assignment resolution dependent', function() {
      var rangeTypeStyle = {
        type: 'range',
        property: 'foo',
        ranges: [
          {
            geomType: 'point',
            range: [0, 10],
            minResolution: 1.5,
            maxResolution: 750,
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF1FF1'
              },
              stroke: {
                color: '#FFFFFF',
                width: 3
              }
            }
          }, {
            geomType: 'point',
            minResolution: 750,
            range: [0, 10],
            vectorOptions: {
              type: 'circle',
              radius: 2,
              fill: {
                color: '#GGGGGG'
              },
              stroke: {
                color: '#AAAAAA',
                width: 1
              }
            }
          }, {
            geomType: 'point',
            range: [10, 20],
            vectorOptions: {
              type: 'circle',
              radius: 8,
              fill: {
                color: '#FF2222'
              },
              stroke: {
                color: '#F55555',
                width: 2
              }
            }
          }
        ]
      };
      var gaStyle = gaStylesFromLiterals(rangeTypeStyle);
      var geoJsonFormat = new ol.format.GeoJSON();
      var olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '10000,' +
              '20000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 3' +
          '}}'
      );
      var olStyle = gaStyle.getFeatureStyle(olFeature, 10);
      var olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
      expect(olImage.getStroke().getWidth()).to.equal(3);

      olStyle = gaStyle.getFeatureStyle(olFeature, 1000);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#GGGGGG');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#AAAAAA');
      expect(olImage.getStroke().getWidth()).to.equal(1);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '15000,' +
              '25000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 11' +
          '}}'
      );
      olStyle = gaStyle.getFeatureStyle(olFeature, 2000);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.be.an(ol.style.Image);
      expect(olImage.getFill()).to.be.an(ol.style.Fill);
      expect(olImage.getFill().getColor()).to.equal('#FF2222');
      expect(olImage.getStroke()).to.be.an(ol.style.Stroke);
      expect(olImage.getStroke().getColor()).to.equal('#F55555');
      expect(olImage.getStroke().getWidth()).to.equal(2);

      olFeature = geoJsonFormat.readFeature(
          '{"type": "Feature",' +
          '"geometry": {' +
            '"coordinates": [' +
              '11000,' +
              '21000' +
            '],' +
            '"type": "Point"' +
          '},' +
          '"properties": {' +
            '"foo": 1000' +
          '}}'
      );
      var stub = sinon.stub($window.console, 'log');
      olStyle = gaStyle.getFeatureStyle(olFeature, 100);
      olImage = olStyle.getImage();
      expect(olStyle.getImage()).to.equal(null);
      expect(stub.calledWithExactly('Feature ID: undefined. No matching style found for key foo and value 1000.')).to.be(true);
      stub.restore();
    });
  });
});
