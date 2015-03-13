function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return  a.cloneNode(false).href.replace('api3', 'wmts10');
}

var attributions = [
  new ol.Attribution({
    html: '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
      '&copy swisstopo / Amtliche Vermessung Schweiz/FL</a>'
  })
];

var resolutions = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
  1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1
];

var wmtsCadastre = new ol.layer.Tile({
  source: new ol.source.WMTS(({
    layer: 'ch.kantone.cadastralwebmap-farbe',
    crossOrigin: 'anonymous',
    attributions: attributions,
    url: qualifyURL('..') + '1.0.0/{Layer}/default/current/21781/{TileMatrix}/{TileCol}/{TileRow}.png',
    tileGrid: new ol.tilegrid.WMTS({
      origin: [420000, 350000],
      resolutions: resolutions,
      matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
    }),
    requestEncoding: 'REST'
  }))
});

var wmsCadastre = new ol.layer.Tile({
  extent: [420000, 30000, 900000, 350000],
  source: new ol.source.TileWMS({
    url: 'http://wms.geo.admin.ch/',
    crossOrigin: 'anonymous',
    attributions: attributions,
    params: {
      'LAYERS': 'ch.kantone.cadastralwebmap-farbe',
      'FORMAT': 'image/png',
      'TILED': true,
      'VERSION': '1.1.1'
    },
    serverType: 'mapserver'
  })
});

var mapLeft = new ga.Map({
  target: 'map-left',
  layers: [wmtsCadastre],
  view: new ol.View({
    resolution: 1.0,
    center: [502160, 125800]
  })
});

var mapRight = new ga.Map({
  target: 'map-right',
  layers: [wmsCadastre],
});

mapRight.bindTo('view', mapLeft);

