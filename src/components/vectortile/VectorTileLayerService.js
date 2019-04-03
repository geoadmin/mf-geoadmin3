(function () {
  
  angular.module('ga_vector_tile_layer_service', [
    'ga_maputils_service'
  ])
  .factory('gaVectorTileLayerService', VectorTileLayerService);

  function VectorTileLayerService () {
    var vectortileLayer = {
      type: 'aggregate',
      background: true,
      serverLayerName: 'ch.swisstopo.leichte-basiskarte.vt',
      attribution: '' +
        '<a target="_blank" href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
        '<a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ' +
        '<a target="_blank" href="https://www.swisstopo.admin.ch/' + lang + '/home.html">swisstopo</a>',
      styles: [{
        id: 'default',
        url: 'https://vectortiles.geo.admin.ch/gl-styles/ch.swisstopo.leichte-basiskarte.vt/v006/style.json'
      }, {
        id: 'color',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-vintage.vt_v006.json'
      }, {
        id: 'grey',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-grey.vt_v006.json'
      }, {
        id: 'lsd',
        url: 'https://cms.geo.admin.ch/www.geo.admin.ch/cms_api/gl-styles/ch.swisstopo.leichte-basiskarte-lsd.vt_v006.json'
      }],
      edits: [{
        id: 'settlement',
        regex: /settlement/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'landuse',
        regex: /landuse/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'hydrology',
        regex: /hydrology/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]

      }, {
        id: 'roadtraffic',
        regex: /roadtraffic/,
        props: [
          ['paint', 'line-color', '{color}'],
          ['paint', 'line-width', '{size}']
        ]

      }, {
        id: 'labels',
        regex: /labels/,
        props: [
          ['layout', 'visibility', '{toggle}', 'visible', 'none'],
          ['paint', 'text-color', '{color}'],
          ['layout', 'text-size', '{size}']
        ]
      }, {
        id: 'woodland',
        regex: /woodland/,
        props: [
          ['paint', 'fill-color', '{color}']
        ]
      }, {
        id: 'territory',
        regex: /territory|background/,
        props: [
          ['paint', 'background-color', '{color}']
        ]
      }]
    };
    var currentStyleIndex = 0;
    function getCurrentStyleUrl () {
      return vectortileLayer.styles[currentStyleIndex].url;
    }
    return {
      getCurrentStyleUrl: getCurrentStyleUrl
    };
  };
})();