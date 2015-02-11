var RESOLUTIONS = [
    4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
    1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
];

var extent = [2420000, 130000, 2900000, 1350000];

function qualifyURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.cloneNode(false).href;
}

var matrixIds = [];
for (var i = 0; i < RESOLUTIONS.length; i++) {
    matrixIds.push(i);
}


var wmtsSource = function(layer, options) {
    var resolutions = options.resolutions ? options.resolutions : RESOLUTIONS;
    var tileGrid = new ol.tilegrid.WMTS({
        origin: [extent[0], extent[3]],
        resolutions: resolutions,
        matrixIds: matrixIds
    });
    var extension = options.format || 'png';
    var timestamp = options['timestamps'][0];
    return new ol.source.WMTS(({
        attributions: [new ol.Attribution({
            html: '<a target="new" href="http://www.swisstopo.admin.ch/' +
                'internet/swisstopo/en/home.html">swisstopo</a>'
        })],
        url: (qualifyURL('..') + '1.0.0/{Layer}/default/' +
            timestamp + '/2056/' +
            '{TileMatrix}/{TileCol}/{TileRow}.').replace('http:', location.protocol) + extension,
        tileGrid: tileGrid,
        layer: options['serverLayerName'] ? options['serverLayerName'] : layer,
        requestEncoding: 'REST'
    }));
};

// See http://api3.geo.admin.ch/rest/services/api/MapServer/layersConfig
var layerConfig = {
    "attribution": "swisstopo",
    "format": "jpeg",
    "serverLayerName": "ch.swisstopo.swissimage",
    "attributionUrl": "http://www.swisstopo.admin.ch/internet/swisstopo/fr/home.html",
    "label": "SWISSIMAGE",
    "timestamps": [
        "20140620",
        "20131107",
        "20130916",
        "20130422",
        "20120809",
        "20120225",
        "20110914",
        "20110228"
    ]
};



var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    //projection: 'EPSG:2056',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

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
            'LAYERS': ['org.epsg.grid_21781,org.epsg.grid_4326'],
            'FORMAT': 'image/png',
            'TILED': false
        },
        serverType: 'mapserver'
    })
});


var map = new ol.Map({
    layers: [wmts_layer, wms_layer],
    target: 'map',
    logo: false,
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: false
        })
    }).extend([
        new ol.control.ScaleLine({
            units: 'metric'
        }),
        mousePositionControl
    ]),
    view: new ol.View({
        center: [2720000, 1095000],
        //projection: 'EPSG:3857',
        resolution: 100,
    })
});
