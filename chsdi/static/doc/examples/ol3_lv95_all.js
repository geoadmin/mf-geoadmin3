var RESOLUTIONS = [
    4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
    1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1
];

var extent = [2420000, 130000, 2900000, 1350000];
var projection = ol.proj.get('EPSG:2056');
projection.setExtent(extent);


var lang = getUrlParameter('lang') || 'en';
var layer = getUrlParameter('layer') || 'ch.swisstopo.pixelkarte-farbe_wmts';
var timestamp = getUrlParameter('timestamp') || 20140520;
var format = getUrlParameter('format') || 'jpeg';
var raw_url = getUrlParameter('base_url') || qualifyURL('..');

var BASE_URL = raw_url.replace(/\/+$/, "")

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function qualifyURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.cloneNode(false).href;
}

var matrixIds = [];
for (var i = 0; i < RESOLUTIONS.length; i++) {
    matrixIds.push(i);
}



var cadastralCfg = {
    attribution: "Mensuration officielle suisse / FL",
    timestamps: ["current"],
    background: false,
    format: "png",
    serverLayerName: "ch.kantone.cadastralwebmap-farbe",
    label: "CadastralWebMap",
    hasLegend: true,
    type: "wmts"
};

$.ajax({
    url: BASE_URL + "/rest/services/api/MapServer/layersConfig?lang=" + lang
}).done(function(data) {
    var content = '';
    var layer_nb = 0;
    var timestamps_nb = 0;
    var config = data[layer];
    data['ch.kantone.cadastralwebmap-farbe'] = cadastralCfg;
    $.each(data, function(index, layerConfig) {
        if (layerConfig.type == 'wmts') {
            var layerId = index;
            layer_nb += 1;
            timestamps_nb += layerConfig.timestamps.length;
            content += '<b>' + layerConfig.label + '</b>   (' + layerConfig.serverLayerName + ')<br>';

            $.each(layerConfig.timestamps, function(index, timestamp) {
                content += '<a href="' + location.pathname + '?layer=' + layerId + '&timestamp=' + timestamp + '&format=' + layerConfig.format + '&base_url=' + BASE_URL + '">' + '[' + timestamp + ']' + '</a>';
            })
            content += '<br><br>';
        }
    });
    $('#layers').html('<h3>All ' + layer_nb + ' available layers and ' + timestamps_nb + ' timestamps');
    $('#layers').append(content);
});



var wmtsSource = function(layer, options) {
    var resolutions = options.resolutions ? options.resolutions : RESOLUTIONS;
    var tileGrid = new ol.tilegrid.WMTS({
        origin: [extent[0], extent[3]],
        resolutions: resolutions,
        matrixIds: matrixIds
    });
    var extension = options.format || 'png';
    var timestamp = options.timestamp || options['timestamps'][0];
    return new ol.source.WMTS(({
        attributions: [new ol.Attribution({
            html: '<a target="new" href="http://www.swisstopo.admin.ch/' +
                'internet/swisstopo/en/home.html">swisstopo</a>'
        })],
        url: (BASE_URL + '/1.0.0/{Layer}/default/' +
            timestamp + '/2056/' +
            '{TileMatrix}/{TileCol}/{TileRow}.').replace('http:', location.protocol) + extension,
        tileGrid: tileGrid,
        projection: projection,
        layer: options['serverLayerName'] ? options['serverLayerName'] : layer,
        requestEncoding: 'REST'
    }));
};

// Background layer
var baseConfig = {
    "attribution": "swisstopo",
    "format": "jpeg",
    "serverLayerName": "ch.swisstopo.pixelkarte-grau",
    "attributionUrl": "http://www.swisstopo.admin.ch/internet/swisstopo/fr/home.html",
    "timestamps": [
        "20151231"
    ],
    "label": "ch.swisstopo.pixelkarte-farbe_grau",
    "type": "wmts"
};



var base_layer = new ol.layer.Tile({
    source: wmtsSource(baseConfig.serverLayerName, baseConfig)
});



var layerConfig = GeoAdmin.getConfig()[layer];

if (timestamp) layerConfig.timestamp = timestamp;

var wmts_src = wmtsSource(layerConfig.serverLayerName, layerConfig);

var wmts_layer = new ol.layer.Tile({
    source: wmts_src
});

var wms_layer = new ol.layer.Image({
    extent: extent,
    source: new ol.source.ImageWMS({
        url: 'http://wms.geo.admin.ch/',
        ratio: 1.0,
        projection: 'EPSG:2056',
        params: {
            'LAYERS': ['org.epsg.grid_21781'],
            'FORMAT': 'image/png',
            'TILED': false
        },
        serverType: 'mapserver'
    })
});


var layers = [wmts_layer, wms_layer];
if (!layerConfig.background) {
    base_layer.setOpacity(0.5);
    layers.unshift(base_layer);
}
var map = new ol.Map({
    layers: layers,
    target: 'map',
    logo: false,
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: false
        })
    }).extend([
        new ol.control.ScaleLine({
            units: 'metric'
        })
    ]),
    view: new ol.View({
        center: [2600000, 1200000],
        resolutions: RESOLUTIONS,
        projection: projection,
        resolution: 250,
    })
});
