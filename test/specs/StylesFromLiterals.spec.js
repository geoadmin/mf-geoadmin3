describe('ga_stylesfromliterals_service', function() {
  var gaStylesFromLiterals;

  beforeEach(function() {
    inject(function($injector) {
      gaStylesFromLiterals = $injector.get('gaStylesFromLiterals');
    });
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
    expect(olStyle instanceof ol.style.Style).to.be(true);
    expect(olImage instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FFFFFF');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
    expect(olImage.getStroke().getWidth()).to.equal(2);
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
    olStyle = gaStyle.getFeatureStyle(olFeature);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
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
    olStyle = gaStyle.getFeatureStyle(olFeature);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF2222');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#F55555');
    expect(olImage.getStroke().getWidth()).to.equal(2);
  });

  it('supports simple unique type style assignment resolution dependent', function() {
    // ]maxResolution, minResolution]
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
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
    expect(olImage.getStroke().getWidth()).to.equal(3);

    olStyle = gaStyle.getFeatureStyle(olFeature, 750);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#C03199');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#C03199');
    expect(olImage.getStroke().getWidth()).to.equal(1);

    olStyle = gaStyle.getFeatureStyle(olFeature, 2000);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#C03199');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
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
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF2222');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#F55555');
    expect(olImage.getStroke().getWidth()).to.equal(2);
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
    olStyle = gaStyle.getFeatureStyle(olFeature);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
    expect(olImage.getStroke().getWidth()).to.equal(3);

    var olFeature = geoJsonFormat.readFeature(
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
    var olStyle = gaStyle.getFeatureStyle(olFeature);
    var olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF2222');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#F55555');
    expect(olImage.getStroke().getWidth()).to.equal(2);
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
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF1FF1');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#FFFFFF');
    expect(olImage.getStroke().getWidth()).to.equal(3);

    olStyle = gaStyle.getFeatureStyle(olFeature, 1000);
    olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#GGGGGG');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
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
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor()).to.equal('#FF2222');
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor()).to.equal('#F55555');
    expect(olImage.getStroke().getWidth()).to.equal(2);
  });
});
