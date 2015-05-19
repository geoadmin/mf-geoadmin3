describe('ga_styles_from_literals_service', function() {
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
    expect(olImage.getFill().getColor() === '#FFFFFF').to.be(true);
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor() === '#FFFFFF').to.be(true);
    expect(olImage.getStroke().getWidth() === 2).to.be(true);
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
    var olStyle = gaStyle.getFeatureStyle(olFeature);
    var olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor() === '#FF1FF1').to.be(true);
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor() === '#FFFFFF').to.be(true);
    expect(olImage.getStroke().getWidth() === 3).to.be(true);

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
          '"foo": "toto"' +
        '}}'
    );
    var olStyle = gaStyle.getFeatureStyle(olFeature);
    var olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor() === '#FF2222').to.be(true);
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor() === '#F55555').to.be(true);
    expect(olImage.getStroke().getWidth() === 2).to.be(true);
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
    var olStyle = gaStyle.getFeatureStyle(olFeature);
    var olImage = olStyle.getImage();
    expect(olStyle.getImage() instanceof ol.style.Image).to.be(true);
    expect(olImage.getFill() instanceof ol.style.Fill).to.be(true);
    expect(olImage.getFill().getColor() === '#FF1FF1').to.be(true);
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor() === '#FFFFFF').to.be(true);
    expect(olImage.getStroke().getWidth() === 3).to.be(true);

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
    expect(olImage.getFill().getColor() === '#FF2222').to.be(true);
    expect(olImage.getStroke() instanceof ol.style.Stroke).to.be(true);
    expect(olImage.getStroke().getColor() === '#F55555').to.be(true);
    expect(olImage.getStroke().getWidth() === 2).to.be(true);
  });
});
