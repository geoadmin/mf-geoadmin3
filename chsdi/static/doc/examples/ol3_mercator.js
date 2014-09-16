


function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.cloneNode(false).href;
}

// Reprojected WMTS layer from map.geo.admin.ch
var swissimage = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: [
      new ol.Attribution({
        html: '&copy; <a href="http://www.swisstopo.admin.ch/' +
            'internet/swisstopo/en/home.html">swisstopo</a>'
      })
    ],
    url: qualifyURL('..') + '1.0.0/ch.swisstopo.swissimage/default/20140620/3857/{z}/{x}/{y}.jpeg'
  })
});


var map = new ol.Map({
  layers: [
    swissimage
  ],
  target: 'map',
  view: new ol.View2D({
    maxZoom: 16,
    center: [900000, 5986452.183179816],
    zoom: 9,
    minZoom: 8
  })
});
