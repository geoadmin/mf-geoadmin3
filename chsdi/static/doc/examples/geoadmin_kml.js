// Create a GeoAdmin Map
var map = new ga.Map({
  
  // Define the div where the map is placed
  target: 'map',
  
  // Create a 2D view
  view: new ol.View2D({
    
    // Define the default resolution
    // 10 means that one pixel is 10m width and height
    // List of resolution of the WMTS layers:
    // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
    resolution: 500,
    
    // Define a coordinate CH1903 (EPSG:21781) for the center of the view
    center: [670000, 160000]
  })
});

// Create a background layer
var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');

map.addLayer(lyr1);

// Create the KML Layer
var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    parser: new ol.parser.KML({
      maxDepth: 1,
      dimension: 2,
      extractStyles: true,
      extractAttributes: true
    }),
    url: 'bln-style.kml'
  })
});

map.addLayer(vector);

var displayFeatureInfo = function(pixel, coordinate) {
  map.getFeatures({
    pixel: pixel,
    layers: [vector],
    success: function(layerFeatures) {
      var element = popup.getElement(); 
      var feature = layerFeatures[0][0];
      if (feature) {
        $(element).popover('destroy');
        popup.setPosition(coordinate);
        // the keys are quoted to prevent renaming in ADVANCED_OPTIMIZATIONS mode.
        $(element).popover({
          'placement': 'top',
          'animation': false,
          'html': true,
          'content': feature.get('description')
        });
        $(element).popover('show');
      } else {
        $(element).popover('destroy');
      }
    }
  });
};

// Popup showing the position the user clicked
var popup = new ol.Overlay({
  element: document.getElementById('popup')
});
map.addOverlay(popup);

map.on('singleclick', function(evt) {
  var pixel = evt.getPixel();
  var coordinate = evt.getCoordinate();
  displayFeatureInfo(pixel, coordinate);
});
