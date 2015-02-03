


function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.cloneNode(false).href;
}

// Reprojected WMTS layer from map.geo.admin.ch

var createLayer = function(timestamp) {
    return new ol.layer.Tile({
       source: new ol.source.OSM({
         attributions: [
           new ol.Attribution({
             html: '<a target="new" href="http://www.swisstopo.admin.ch/' +
                 'internet/swisstopo/en/home.html">swisstopo</a>'
           })
         ],
         url: qualifyURL('..') + '1.0.0/ch.swisstopo.pixelkarte-farbe/default/' + timestamp + '/3857/{z}/{x}/{y}.jpeg'
       })
   });
}

var map_left = new ol.Map({
  logo: false,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  layers: [
    createLayer(20111206)
  ],
  target: 'map-left',
  view: new ol.View({
    maxZoom: 17,
    center: [902568.5270415349, 5969980.338127118],
    zoom: 15,
    minZoom: 2
  })
});

var map_right = new ol.Map({
  logo: false,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  layers: [
    createLayer(20140520)
  ],
  target: 'map-right'
});

map_right.bindTo('view', map_left);


