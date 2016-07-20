goog.provide('ga_drawstyle_controller');

goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_drawstyle_controller', [
    'ga_styles_service'
  ]);

  module.controller('GaDrawStyleController', function($scope, $translate,
      gaStyleFactory) {

    // Defines static styles
    var white = [255, 255, 255];
    var black = [0, 0, 0];

    var options = {
      name: '',
      description: '',
      font: gaStyleFactory.FONT,
      linkTypes: [{
        label: 'link',
        value: '',
        tpl: '<a target="_blank" href="{{url}}">{{textToDisplay}}</a>',
        btnClass: 'fa-link',
        onOpen: function() {
          this.textToDisplay = $translate.instant('more_info');
        }
      }, {
        label: 'image',
        value: '',
        tpl: '<img src="{{url}}" style="max-height:200px;"/>',
        btnClass: 'fa-picture-o'
      }, {
        label: 'video',
        value: '',
        tpl: '<iframe src="{{url}}" height="200" width="auto"></iframe>',
        btnClass: 'fa-film'
      }],
      colors: [
        {name: 'black', fill: [0, 0, 0], border: 'white'},
        {name: 'blue', fill: [0, 0, 255], border: 'white'},
        {name: 'gray', fill: [128, 128, 128], border: 'white'},
        {name: 'green', fill: [0, 128, 0], border: 'white'},
        {name: 'orange', fill: [255, 165, 0], border: 'black'},
        {name: 'red', fill: [255, 0, 0], border: 'white'},
        {name: 'white', fill: [255, 255, 255], border: 'black'},
        {name: 'yellow', fill: [255, 255, 0], border: 'black'}
      ],
      textSizes: [
        {label: 'small_size', scale: 1},
        {label: 'medium_size', scale: 1.5},
        {label: 'big_size', scale: 2}
      ],
      iconSizes: [
        {label: 'small_size', value: [24, 24], scale: 0.5},
        {label: 'medium_size', value: [36, 36], scale: 0.75},
        {label: 'big_size', value: [48, 48], scale: 1}
      ],
      icons: [
          // Basics
          {id: 'marker'},
          {id: 'circle'},
          {id: 'square'},
          {id: 'triangle'},
          {id: 'star'},
          {id: 'star-stroked'},
          {id: 'marker-stroked'},
          {id: 'circle-stroked'},
          {id: 'square-stroked'},
          {id: 'triangle-stroked'},
          {id: 'cross'},
          {id: 'disability'},
          {id: 'danger'},

          // Shops
          {id: 'art-gallery'},
          {id: 'alcohol-shop'},
          {id: 'bakery'},
          {id: 'bank'},
          {id: 'bar'},
          {id: 'beer'},
          {id: 'cafe'},
          {id: 'cinema'},
          {id: 'commercial'},
          {id: 'clothing-store'},
          {id: 'grocery'},
          {id: 'fast-food'},
          {id: 'hairdresser'},
          {id: 'fuel'},
          {id: 'laundry'},
          {id: 'library'},
          {id: 'lodging'},
          {id: 'pharmacy'},
          {id: 'restaurant'},
          {id: 'shop'},

          // Transport
          {id: 'airport'},
          {id: 'bicycle'},
          {id: 'bus'},
          {id: 'car'},
          {id: 'ferry'},
          {id: 'london-underground'},
          {id: 'rail'},
          {id: 'rail-above'},
          {id: 'rail-light'},
          {id: 'rail-metro'},
          {id: 'rail-underground'},
          {id: 'scooter'},

          // Sport
          {id: 'america-football'},
          {id: 'baseball'},
          {id: 'basketball'},
          {id: 'cricket'},
          {id: 'golf'},
          {id: 'skiing'},
          {id: 'soccer'},
          {id: 'swimming'},
          {id: 'tennis'},

          // Places
          {id: 'airfield'},
          {id: 'building'},
          {id: 'campsite'},
          {id: 'cemetery'},
          {id: 'city'},
          {id: 'college'},
          {id: 'dog-park'},
          {id: 'embassy'},
          {id: 'farm'},
          {id: 'fire-station'},
          {id: 'garden'},
          {id: 'harbor'},
          {id: 'heliport'},
          {id: 'hospital'},
          {id: 'industrial'},
          {id: 'land-use'},
          {id: 'lighthouse'},
          {id: 'monument'},
          {id: 'minefield'},
          {id: 'museum'},
          {id: 'oil-well'},
          {id: 'park2'},
          {id: 'park'},
          {id: 'parking'},
          {id: 'parking-garage'},
          {id: 'pitch'},
          {id: 'place-of-worship'},
          {id: 'playground'},
          {id: 'police'},
          {id: 'polling-place'},
          {id: 'post'},
          {id: 'religious-christian'},
          {id: 'religious-jewish'},
          {id: 'religious-muslim'},
          {id: 'prison'},
          {id: 'school'},
          {id: 'slaughterhouse'},
          {id: 'theatre'},
          {id: 'toilets'},
          {id: 'town'},
          {id: 'town-hall'},
          {id: 'village'},
          {id: 'warehouse'},
          {id: 'wetland'},
          {id: 'zoo'},


          {id: 'camera'},
          {id: 'chemist'},
          {id: 'dam'},
          {id: 'emergency-telephone'},
          {id: 'entrance'},
          {id: 'heart'},
          {id: 'logging'},
          {id: 'mobilephone'},
          {id: 'music'},
          {id: 'roadblock'},
          {id: 'rocket'},
          {id: 'suitcase'},
          {id: 'telephone'},
          {id: 'waste-basket'},
          {id: 'water'}
      ]
    };


    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});
    $scope.options.linkType = options.linkTypes[0];
    $scope.options.color = options.colors[5];
    $scope.options.textColor = options.colors[5];
    $scope.options.textSize = options.textSizes[0];
    $scope.options.icon = options.colors[0];
    $scope.options.iconColor = options.colors[5];
    $scope.options.iconSize = options.iconSizes[2];

    $scope.$on('gaDrawStyleActive', function(evt, feature, layer, pixel) {
      $scope.feature = feature;
      $scope.layer = layer;
    });
  });
})();
