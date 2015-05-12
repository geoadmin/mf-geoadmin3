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
    resolution: 500,
    
    // Define a coordinate CH1903 (EPSG:21781) for the center of the view
    center: [660500, 186000]
  })
});

// Create a background layer
var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');

// Add the background layers to the map
map.addLayer(lyr1);

// Vector layer variable declaration and initialization
var olSource = new ol.source.GeoJSON();
var vectorLayer = new ol.layer.Vector({
  source: olSource
});

var getUrl = function(name) {
  var elRequest = ':input[name=' + name + ']';
  return $(elRequest).val();
}

var hasVectorOnMap = function() {
  if (map.getLayers().getArray().length > 1) {
    return true;
  }
};

// Load and apply GeoJSON file function
var setLayerSource = function() {
  var geojsonFormat = new ol.format.GeoJSON();
  $.ajax({
    type: 'GET',
    url: getUrl('geojson-url'),
    success: function(data) {
      olSource.addFeatures(
        geojsonFormat.readFeatures(data)
      );
      $('#geojsonSuccess').show(400).delay(3000).hide(400);
    },
    error: function() {
      olSource.clear();
      $('#geojsonError').show(400).delay(3000).hide(400);
    }
  });
};

// Load and apply styling file function
var setLayerStyle = function() {
  $.ajax({
    type: 'GET',
    url: getUrl('style-url'),
    success: function(data) {
      var olStyleForVector = new ga.style.StylesFromLiterals(data);
      vectorLayer.setStyle(function(feature) {
        return [olStyleForVector.getFeatureStyle(feature)];
      });
      $('#styleSuccess').show(400).delay(3000).hide(400);
      $("#editor").text(JSON.stringify(data, null, 4));
    },
    error: function() {
      $('#styleError').show(400).delay(3000).hide(400);
    }
  });
};

// Apply GeoJSON config from urls
var applyGeojsonConfig = function() {

  // Load Styling file
  setLayerStyle();

  // Load Geojson file
  setLayerSource();

  // Only one vector layer is added
  if (hasVectorOnMap()) {
    map.removeLayer(vectorLayer);
  }

  // Add Geojson layer
  map.addLayer(vectorLayer);

}

// Clear vector layer from map
var clearLayer = function() {
  if (vectorLayer) {
    map.removeLayer(vectorLayer);
  }
};

// Load styling file in editor
var loadStyleInEditor = function() {
  $.ajax({
    type: 'GET',
    url: getUrl('style-url'),
    success: function(data) {
      //$('#editor').val('');
      $("#editor").val(JSON.stringify(data, null, 4));
      $('#styleSuccess').show(400).delay(3000).hide(400);
    },
    error: function() {
      $('#styleError').show(400).delay(3000).hide(400);
    }
  });
};

// Apply style changes from editor
var applyGeojsonEditor = function() {
  if (hasVectorOnMap()) {
    map.removeLayer(vectorLayer);
  }
  var data = JSON.parse($('#editor').val());
  var olStyleForVector = new ga.style.StylesFromLiterals(data);
  vectorLayer.setStyle(function(feature) {
    return [olStyleForVector.getFeatureStyle(feature)];
  });
  setLayerSource();
  map.addLayer(vectorLayer);
};

// Popup showing the position the user clicked
var popup = new ol.Overlay({
  element: document.getElementById('popup')
});

map.addOverlay(popup);

var findFeatures = function(pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    features.push(feature);
  });
  return features;
};

var displayFeatureInfo = function(pixel, coordinate) {
  var features = findFeatures(pixel);
  var element = popup.getElement();
  var feature = features[0];
  if (feature) {
     $(element).popover('destroy');
     popup.setPosition(coordinate);
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
};

map.on('singleclick', function(evt) {
  var pixel = evt.pixel;
  var coordinate = evt.coordinate;
  displayFeatureInfo(pixel, coordinate);
});
