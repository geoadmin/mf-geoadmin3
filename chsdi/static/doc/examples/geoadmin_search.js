// Create a GeoAdmin Map
var map = new ga.Map({
    
  // Define the div where the map is placed
  target: 'map',
  
  // Define the default layers
  layers: [
    ga.layer.create ('ch.swisstopo.pixelkarte-farbe')
  ],
   
  // Create a view
  view: new ol.View({

    // 500 means that one pixel is 500m width and height
    // List of resolution of the WMTS layers:
    // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
    resolution: 500,

    // Define a coordinate CH1903 (EPSG:21781) for the center of the view
    center: [660000, 190000]
  })
});

// Initialize the location marker
var element = $('<div class="marker"></div>');
var popup = new ol.Overlay({
  positioning:'bottom-center',
  element: element 
});
map.addOverlay(popup);

// Initialize the suggestion engine
var mySource = new Bloodhound({
  limit: 30,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/rest/services/api/SearchServer?searchText=%QUERY&type=locations',
    filter: function(locations) {   
      return locations.results;
    }
  }
});

// This kicks off the loading and processing of local and prefetch data,
// the suggestion engine will be useless until it is initialized
mySource.initialize();

// Initialize typeahead input
$('#search').typeahead(null, {
  name: 'locations',
  displayKey: function(location) {
    return location.attrs.label.replace('<b>', '').replace('</b>', '');
  },
  source: mySource.ttAdapter(),
  templates: {
    suggestion: function(location) {
      return '<p>' + location.attrs.label + '</p>' ;
    } 
  }                                      
});

var parseExtent = function(stringBox2D) {
  var extent = stringBox2D.replace('BOX(', '').replace(')', '').replace(',', ' ').split(' ');
  return $.map(extent, parseFloat);
};

// When a result is selected.
$('#search').on('typeahead:selected', function(evt, location, suggName) {
  var originZoom = {
    address: 10,
    parcel: 10,
    sn25: 8,
    feature: 7
  };
  var view = map.getView();
  var origin = location.attrs.origin;
  var extent = [0,0,0,0];
  if(location.attrs.geom_st_box2d) {
    extent = parseExtent(location.attrs.geom_st_box2d);
  } else if (location.attrs.x && location.attrs.y) {
    var x = location.attrs.y;
    var y = location.attrs.x
    extent = [x,y,x,y]; 
  }

  if(originZoom.hasOwnProperty(origin)) {
    var zoom = originZoom[origin];
    var center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    view.setZoom(zoom);
    view.setCenter(center);
    popup.setPosition(center);
  } else {
    popup.setPosition([0,0]);
    view.fitExtent(extent, map.getSize());
  }
});

