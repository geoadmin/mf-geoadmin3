


function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.cloneNode(false).href;
}

// Reprojected WMTS layer from map.geo.admin.ch

var createLayer = function(layername, timestamp) {
    return new ol.layer.Tile({
       source: new ol.source.OSM({
         attributions: [
           new ol.Attribution({
             html: '<a target="new" href="http://www.swisstopo.admin.ch/' +
                 'internet/swisstopo/en/home.html">swisstopo</a>'
           })
         ],
         url: qualifyURL('..') + '1.0.0/' + layername + '/default/' + timestamp + '/3857/{z}/{x}/{y}.jpeg'
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
    createLayer('ch.swisstopo.swissimage', 20151231)
  ],
  target: 'map-left',
  view: new ol.View({
    maxZoom: 19,
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
    createLayer('ch.swisstopo.pixelkarte-farbe', 20151231)
  ],
  target: 'map-right',
  view: new ol.View({
    maxZoom: 17
  })
});

map_right.bindTo('view', map_left);


