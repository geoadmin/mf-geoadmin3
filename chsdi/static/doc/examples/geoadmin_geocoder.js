// Create a GeoAdmin Map
var map = new ga.Map({
  
  // Define the div where the map is placed
  target: 'map',
  
  // Create a view
  view: new ol.View({
    
    // Define the default resolution
    // 10 means that one pixel is 10m width and height
    // List of resolution of the WMTS layers:
    // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
    resolution: 10,
    
    // Define a coordinate CH1903 (EPSG:21781) for the center of the view
    center: [561666.5, 185569.5]
  })
});

// Create a background layer
var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');

// Add the layers in the map
map.addLayer(lyr1);

// Geocode a location
map.geocode('Payerne');
