goog.provide('ga_vector_feedback_controller');

(function() {
  var module = angular.module('ga_vector_feedback_controller', []);

  module.controller('GaVectorFeedbackController', function(
      $scope,
      gaGlobalOptions
  ) {
    $scope.options = {
      serviceDocUrl: gaGlobalOptions.apiUrl + '/services/sdiservices.html',
      comment: '',
      likeSelect: '',
      backgroundLayers: [
        {
          id: 'ch.swisstopo.lightmap.vt',
          label: 'Light Map'
        },
        {
          id: 'ch.swisstopo.hybridmap.vt',
          label: 'Hybrid Map'
        }
      ],
      layers: {
        'ch.swisstopo.lightmap.vt': {
          selectableLayers: [
            { value: 'background', label: 'Background' },
            { value: 'lakes', label: 'Lakes' },
            { value: 'rivers', label: 'Rivers' },
            { value: 'build_area', label: 'Built area' },
            { value: 'highways', label: 'Highways' },
            { value: 'forests', label: 'Forests' }
          ]
        },
        'ch.swisstopo.hybridmap.vt': {
          selectableLayers: [
            { value: 'cities', label: 'Cities' },
            { value: 'highways', label: 'Highways' }
          ]
        }
      },
      colors: [
        {
          value: 'default',
          label: 'Default'
        },
        {
          value: '#acc864',
          label: 'Light Green'
        },
        {
          value: '#3a8841',
          label: 'Green'
        },
        {
          value: '#40b5bc',
          label: 'Light Blue'
        },
        {
          value: '#483df6',
          label: 'Blue'
        },
        {
          value: '#ffff99',
          label: 'Light Yellow'
        },
        {
          value: '#ffca00',
          label: 'Yellow'
        },
        {
          value: '#f28500',
          label: 'Orange'
        },
        {
          value: '#dc0f0f',
          label: 'Red'
        },
        {
          value: '#80379c',
          label: 'Purple'
        },
        {
          value: 'black',
          label: 'Black'
        },
        {
          value: 'white',
          label: 'White'
        }
      ]
    };

    // Initialize to the first layer
    $scope.options.backgroundLayer = $scope.options.backgroundLayers[0];
    $scope.options.color = $scope.options.colors[0];

    // Always use the firest selectable layer in the list
    $scope.$watch('options.backgroundLayer', function(newVal) {
      $scope.options.selectedLayer =
        $scope.options.layers[newVal.id].selectableLayers[0];
    });

    $scope.$watch('options.color', function(newVal) {
      console.log('Should apply new color');
      console.log(newVal);
    });

    $scope.submit = function() {
      console.log($scope.options.comment);
      console.log($scope.options.likeSelect);
    };
  });
})();
