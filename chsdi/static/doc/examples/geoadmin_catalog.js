(function($) {
  var layers ={};
  $.displayLayer = function(layerBodId, visible) {
    layers[layerBodId].setVisible(visible);
  };

  $.getLegend = function(layerBodId) {
    var modalBody = $('#legend-modal').find('.modal-body');
    modalBody.empty();
    // Use JSONP for IE9
    $.ajax({
      url: location.protocol + '//api3.geo.admin.ch/rest/services/api/MapServer/' + layerBodId + '/legend?lang=de',
      jsonp: "callback",
      dataType: "jsonp",
      success: function(data) {
        modalBody.append(data);
      }
    });
  };

  //Create a GeoAdmin Map
  var map = new ga.Map({
    // Define the div where the map is placed
    target: 'map',
    // Create a view
    view: new ol.View({
      // 10 means that one pixel is 10m width and height
      // List of resolution of the WMTS
      // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
      resolution: 650,
      // Define a coordinate CH1903 (EPSG:21781) for the center of the view
      center: [655500, 188750]
    })
  });

  // Create a background layer
  var lyr = ga.layer.create('ch.swisstopo.pixelkarte-grau');

  // Add the layers in the map
  map.addLayer(lyr);

  var tpl =
    '<div class="checkbox">' +
        '<label>{label}' +
          '<input type="checkbox" onclick="$.displayLayer(\'{layerBodId}\', this.checked)"/>' +
        '</label>' + '<button onclick="$.getLegend(\'{layerBodId}\')" class="btn btn-default legend-btn" data-toggle="modal" data-target="#legend-modal">i</button>'
    '</div>';

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

  $('.checkbox-tree').bind('click', function(evt) {
    var display = $('.checkbox-inhalt').css('display');
    if (display === 'block') {
      $('.checkbox-inhalt').hide();
    } else {
      $('.checkbox-inhalt').show();
    }
  });

  var catalogConfig = [
    {layerBodId: 'ch.bafu.bundesinventare-amphibien', label: 'Amphibien Ortsfeste Objekte'},
    {layerBodId: 'ch.bafu.bundesinventare-amphibien_wanderobjekte', label: 'Amphibien Wanderobjekte'},
    {layerBodId: 'ch.bafu.bundesinventare-auen', label: 'Auengebiete'},
    {layerBodId: 'ch.bafu.bundesinventare-bln', label: 'BLN'},
    {layerBodId: 'ch.bafu.bundesinventare-flachmoore', label: 'Flachmoore'},
    {layerBodId: 'ch.bafu.bundesinventare-hochmoore', label: 'Hochmoore'}
  ];

  for (var i=0; i < catalogConfig.length; i++) {
    var item = catalogConfig[i];
    $('.checkbox-inhalt').append(nano(tpl, item));
    layers[item.layerBodId] = ga.layer.create(item.layerBodId);
    layers[item.layerBodId].setVisible(false);
    map.addLayer(layers[item.layerBodId]);
  }
})(jQuery);
