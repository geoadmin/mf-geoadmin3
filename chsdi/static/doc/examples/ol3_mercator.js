


function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.cloneNode(false).href;
}

// OpenStreetMap B/W Mapnik Layer
var osm_bw = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      ol.source.OSM.DATA_ATTRIBUTION
    ],
    url: '/ogcproxy?url=http://{a-d}.www.toolserver.org/' +
        'tiles/bw-mapnik/{z}/{x}/{y}.png'
  })
});

// Reprojected WMTS layer from map.geo.admin.ch
var geotope = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: '&copy; <a href="http://www.swisstopo.admin.ch/' +
            'internet/swisstopo/en/home.html">swisstopo</a>'
      })
    ],
    url: qualifyURL('..') + '1.0.0/ch.swisstopo.geologie-geotope/default/20130107/3857/{z}/{x}/{y}.png'
  })
});


var map = new ol.Map({
  layers: [
    osm_bw,
    geotope
  ],
  target: 'map',
  view: new ol.View2D({
    maxZoom: 16,
    center: [900000, 5986452.183179816],
    zoom: 9,
    minZoom: 8
  })
});
