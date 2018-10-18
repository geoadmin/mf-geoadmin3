/* eslint-disable max-len */
describe.only('ga_gl_style_service', function() {
  var gaGLStyle, $httpBackend, styleUrl, styleJSON;

  var injectServices = function($injector) {
    gaGLStyle = $injector.get('gaGLStyle');
    $httpBackend = $injector.get('$httpBackend');
  };

  beforeEach(function() {
    inject(function($injector) {
      injectServices($injector);
    });

    styleUrl = 'https://glstyle.ch';

    styleJSON = {
      version: 8,
      name: 'ch.swisstopo.leichte-basiskarte.vt',
      center: [9, 46],
      zoom: 6.5,
      bearing: 0,
      pitch: 5.5,
      sources: {
        'ch.swissnames3d': {
          url: 'https://swissnames3d.json',
          type: 'vector'
        },
        'ch.swisstopo.swissalti3d-reliefschattierung': {
          url: 'https://swissalti3d.json',
          type: 'raster'
        }
      },
      sprite: 'https://linktosprite',
      glyphs: 'https://linktoglyphs',
      layers: [
        {
          id: 'background',
          type: 'background',
          minzoom: 6,
          maxzoom: 24,
          layout: {
            visibility: 'visible'
          },
          paint: {
            'background-color': 'rgb(255, 255, 255)'
          }
        },
        {
          id: 'hillshade_',
          type: 'raster',
          source: 'ch.swisstopo.swissalti3d-reliefschattierung',
          minzoom: 6,
          maxzoom: 24,
          layout: {
            visibility: 'visible'
          },
          paint: {
            'raster-opacity': {
              stops: [[5.5, 0], [6, 0.3], [8, 0.3], [10, 0.3], [16, 0.1]]
            },
            'raster-hue-rotate': 1,
            'raster-brightness-min': 0.5,
            'raster-brightness-max': 1,
            'raster-saturation': 0,
            'raster-contrast': 0.5,
            'raster-fade-duration': 100
          }
        },
        {
          id: 'labels_watercourse',
          type: 'symbol',
          source: 'ch.swissnames3d',
          'source-layer': 'ch.swissnames3d-layer',
          minzoom: 13,
          maxzoom: 24,
          filter: [
            'all',
            ['==', 'layerid', 'labels-hydrology-ln'],
            ['==', 'class', 'watercourse']
          ],
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 250,
            'symbol-avoid-edges': true,
            'text-rotation-alignment': 'map',
            'text-font': ['Arial'],
            'text-size': {
              stops: [[13, 12], [18, 16]]
            },
            'text-max-width': 10,
            'text-line-height': 1.2,
            'text-letter-spacing': 0.1,
            'text-justify': 'center',
            'text-anchor': 'center',
            'text-max-angle': 45,
            'text-rotate': 0,
            'text-padding': 2,
            'text-keep-upright': true,
            'text-transform': 'none',
            'text-offset': [0, 0.2],
            'text-allow-overlap': false,
            visibility: 'visible'
          },
          paint: {
            'text-color': 'rgb(61, 168, 245)',
            'text-halo-color': 'rgb(212, 236, 253)',
            'text-halo-width': 1.5,
            'text-halo-blur': 15
          }
        },
        {
          id: 'labels_settlement_100-999',
          type: 'symbol',
          source: 'ch.swissnames3d',
          'source-layer': 'ch.swissnames3d-layer',
          minzoom: 12,
          maxzoom: 24,
          filter: [
            'all',
            ['==', 'layerid', 'labels-locality'],
            ['==', 'class', 'locality'],
            ['==', 'subclass', '100-999']
          ],
          layout: {
            'symbol-placement': 'point',
            'icon-padding': 35,
            'text-rotation-alignment': 'viewport',
            'text-font': ['Arial'],
            'text-size': {
              stops: [[11, 12], [15, 19.5], [18, 25]]
            },
            'text-max-width': 10,
            'text-line-height': 1.2,
            'text-letter-spacing': 0.01,
            'text-justify': 'center',
            'text-anchor': 'center',
            'text-max-angle': 45,
            'text-rotate': 0,
            'text-padding': 2,
            'text-keep-upright': true,
            'text-transform': 'none',
            'text-offset': [0, 0],
            'text-allow-overlap': false,
            visibility: 'visible'
          },
          paint: {
            'text-color': 'rgb(119, 119, 119)',
            'text-halo-color': 'rgb(255, 255, 255)',
            'text-halo-width': 1.25,
            'text-halo-blur': 0.5
          }
        }
      ]
    };
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('requests and caches a GL style #get', function(done) {
    $httpBackend.expectGET(styleUrl).respond(styleJSON);
    $httpBackend.expectGET(styleJSON.sprite + '.json').respond({ id: 'dummy' });
    gaGLStyle.get(styleUrl).then(function(data) {
      expect(data.styleJSON.name).to.equal('ch.swisstopo.leichte-basiskarte.vt');
      expect(data.spriteJSON.id).to.equal('dummy');
      done();
    });
    $httpBackend.flush();
  });

  it('filters a GL style #filter and resests the style via #resest', function(done) {
    $httpBackend.expectGET(styleUrl).respond(styleJSON);
    $httpBackend.expectGET(styleJSON.sprite + '.json').respond({ id: 'dummy' });
    gaGLStyle.get(styleUrl).then(function() {
      var newStyle = gaGLStyle.filter([['id', '==', 'labels_watercourse']]);
      expect(newStyle.layers.length).to.equal(3);
      expect(newStyle.layers[2].id).to.equal('labels_settlement_100-999');

      newStyle = gaGLStyle.filter([['type', '!=', 'background']]);
      expect(newStyle.layers.length).to.equal(1);
      expect(newStyle.layers[0].type).to.equal('background');

      newStyle = gaGLStyle.reset();
      expect(newStyle.layers.length).to.equal(4);
      done();
    });
    $httpBackend.flush();
  });
});
