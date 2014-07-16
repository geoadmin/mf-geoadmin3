//Create a GeoAdmin Map
var map = new ga.Map({

  // Define the div where the map is placed
  target: 'map',

  // Create a 2D view
  view: new ol.View2D({

    // 10 means that one pixel is 10m width and height
    // List of resolution of the WMTS layers:
    // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
    resolution: 650,

    // Define a coordinate CH1903 (EPSG:21781) for the center of the view  
    center: [655500, 188750]
  })
});

// Create a background layer
var lyr = ga.layer.create('ch.swisstopo.pixelkarte-grau');

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([655500, 188750]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([655500, 188750]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

// Add the layers in the map
map.addLayer(lyr);

var tpl = 
  '<div class="checkbox">' +
      '<label>{name}' +
        '<input type="checkbox" onclick="displayLayer(\'{layerBodId}\', this.checked)"/>' +
      '</label>' + '<button onclick="getLegend(\'{layerBodId}\')" class="btn btn-default" style="display: inline;border-radius: 50%;background-color: black;color: white;font-size: 13px;font-weight: bold;font-family: serif;border-top-width: 0px;border-bottom-width: 0px;padding-left: 6px;height: 16px;width: 16px;padding-right: 6px;padding-bottom: 3px;padding-top: 0px;border-left-width: 0px;border-right-width: 0px;margin-left: 10px;" data-toggle="modal" data-target="#legend-modal">i</button>'
  '</div>';

var layers ={};
var displayLayer = function(layerBodId, visible) {
  layers[layerBodId].setVisible(visible);
};

var getLegend = function(layerBodId) {
  var body = $('#legend-modal').find('.modal-body');
  body.empty();
  $.get('http://api3.geo.admin.ch/rest/services/api/MapServer/' + layerBodId + '/legend?lang=de', function(data) {
    body.append(data);
  });
};

$(document).ready(function(){
  var nano = function(template, data) {
    return template.replace(/\{([\w\.]*)\}/g,
      function (str, key) {
        var keys = key.split("."), value = data[keys.shift()];
            $.each(keys, function () {
                value = value[this];
            });
              return (value === null || value === undefined) ? "" : value;
      }
    );
  };
                var inspireCat = ['cat14', 'cat91'];
                $.getJSON("http://api3.geo.admin.ch/rest/services/inspire/CatalogServer?lang=de",
                  function(data) {
                    var firstLevelCat;
                      for (var i = 0, ii = data.results.root.children.length; i < ii; i++) {
                        if (inspireCat[0] === data.results.root.children[i].category) {
                          firstLevelCat = data.results.root.children[i];
                          break;
                        }
                      }
                    var secondLevelCat;
                      for (var i = 0, ii = firstLevelCat.children.length; i < ii; i++) {
                        if (inspireCat[1] === firstLevelCat.children[i].category) {
                          secondLevelCat = firstLevelCat.children[i];
                          break;
                        }
                      }

                      // List of layers labels we want to display: ["AGNES", "Geoidmodell in CH1903", ....]
                      var listOfLayersLabels = [];
                      for (var i = 0, ii = secondLevelCat.children.length; i < ii; i++) {
                        listOfLayersLabels.push(secondLevelCat.children[i].label);
                      }

                      $.getJSON("http://api3.geo.admin.ch/rest/services/inspire/MapServer?lang=de",
                        function(data){
                          var listOfLayers = [];
                            $.each(data.layers, function(i,item){
                              if (listOfLayersLabels.indexOf(item.name) != -1) {
                                listOfLayers.push(item);
                              }
                            });
                            listOfLayers.sort(function(a, b) {
                              return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
                            });

                            for (var i = 0, ii = listOfLayers.length; i < ii; i++) {
                              var item = listOfLayers[i];

                                $("#inhalt").append(nano(tpl, item));
                                layers[item.layerBodId] = ga.layer.create(item.layerBodId);
                                layers[item.layerBodId].setVisible(false);
                                map.addLayer(layers[item.layerBodId]);

                            }
                        }
                      );
                  }
                );
});

