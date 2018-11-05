goog.provide('ga_query_vector_controller');

(function() {
  var module = angular.module('ga_query_vector_controller', [
    'ga_browsersniffer_service'
  ]);

  module.controller('GaQueryVectorController', function(
      $scope,
      gaBrowserSniffer
  ) {
    var mobile = gaBrowserSniffer.mobile;
    // properties may come from tileJSON instead in the future
    // var tileJSON = 'https://maps.tilehosting.com/data/v3.json?key=Og58UhhtiiTaLVlPtPgs';
    $scope.options = {
      mobile: mobile,
      layers: {
        'omt.vt': {
          properties: [
            {
              id: 'landcover',
              field: 'class'
            },
            {
              id: 'landuse',
              field: 'class'
            },
            {
              id: 'park',
              field: 'class'
            },
            {
              id: 'building',
              field: 'render_height'
            },
            {
              id: 'housenumber',
              field: 'housenumber'
            }
          ]
        }
      }
    };
  });
})();
