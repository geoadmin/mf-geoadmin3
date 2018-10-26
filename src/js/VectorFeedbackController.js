goog.provide('ga_vector_feedback_controller');

(function() {
  var module = angular.module('ga_vector_feedback_controller', [
    'ga_browsersniffer_service'
  ]);

  module.controller('GaVectorFeedbackController', function(
      $scope,
      gaGlobalOptions,
      gaBrowserSniffer
  ) {
    var apiUrl = gaGlobalOptions.apiUrl;
    var mobile = gaBrowserSniffer.mobile;
    var colors = [
      { value: 'lightgray', label: 'Light Gray' },
      { value: '#acc864', label: 'Light Green' },
      { value: '#3a8841', label: 'Green' },
      { value: '#40b5bc', label: 'Light Blue' },
      { value: '#483df6', label: 'Blue' },
      { value: '#ffff99', label: 'Light Yellow' },
      { value: '#ffca00', label: 'Yellow' },
      { value: '#f28500', label: 'Orange' },
      { value: '#dc0f0f', label: 'Red' },
      { value: '#80379c', label: 'Purple' },
      { value: 'black', label: 'Black' },
      { value: 'white', label: 'White' }
    ];

    $scope.options = {
      serviceDocUrl: apiUrl + '/services/sdiservices.html',
      mobile: mobile,
      comment: '',
      likeSelect: '',
      layers: {
        'omt.vt': {
          selectableLayers: [
            {
              value: 'landuse-residential',
              label: 'Landuse Residential',
              edit: ['id', 'landuse-residential', 'paint|fill-color|{color}']
            },
            {
              value: 'landcover_grass',
              label: 'Landcover Grass',
              edit: ['id', 'landcover_grass', 'paint|fill-color|{color}']
            }
          ],
          labelsFilters: [
            ['source-layer', '==', 'place'],
            ['source-layer', '==', 'transportation_name'],
            ['source-layer', '==', 'aerodrome_label'],
            ['source-layer', '==', 'poi']
          ]
        },
        'ch.swisstopo.leichte-basiskarte.vt': {
          selectableLayers: [
            { value: 'background', label: 'Background' },
            { value: 'lakes', label: 'Lakes' },
            { value: 'rivers', label: 'Rivers' },
            { value: 'build_area', label: 'Built area' },
            { value: 'highways', label: 'Highways' },
            { value: 'forests', label: 'Forests' }
          ],
          labelsFilters: [['source', '==', 'ch.swissnames3d']]
        },
        'ch.swisstopo.hybridkarte.vt': {
          selectableLayers: [
            { value: 'cities', label: 'Cities' },
            { value: 'highways', label: 'Highways' }
          ],
          labelsFilters: [['source', '==', 'ch.swissnames3d']]
        }
      },
      backgroundLayers: [
        {
          id: 'omt.vt',
          label: 'Openmaptiles'
        },
        {
          id: 'ch.swisstopo.leichte-basiskarte.vt',
          label: 'Basemap light'
        },
        {
          id: 'ch.swisstopo.hybridkarte.vt',
          label: 'Hybrid Map'
        }
      ],
      colors: colors,
      showLabels: [
        { value: true, label: 'Show' },
        { value: false, label: 'Hide' }
      ]
    };
  });
})();
