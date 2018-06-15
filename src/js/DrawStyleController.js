goog.provide('ga_drawstyle_controller');

goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_drawstyle_controller', [
    'ga_styles_service'
  ]);

  module.controller('GaDrawStyleController', function($scope, $translate,
      gaGlobalOptions, gaStyleFactory) {

    var getCategoryIndexByName = function(categoryName) {
      for (var i = 0; i < options.iconCategories.length; i++) {
        if (options.iconCategories[i].label === categoryName) {
          return i;
        }
      }
      throw new Error('Category Name does not exist!');
    }

    var getImgsByCategory = function(categoryName) {
      var imgs = [];
      var categoryIndex = getCategoryIndexByName(categoryName);
      var category = options.iconCategories[categoryIndex];
      var nrImg = category.nbIcons;
      for (var i = 1; i <= nrImg; i++) {
        imgs.push({
          id: i,
          url: gaGlobalOptions.mapUrl + 'src/img/' + category.folder + '/' +
            category.prefix + i + '.png',
          category: category.label
        });
      }
      return imgs;
    }

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
        {id: 'marker', anchor: [0.5, 0.9], category: 'standard'},
        {id: 'circle', category: 'standard'},
        {id: 'square', category: 'standard'},
        {id: 'triangle', category: 'standard'},
        {id: 'star', category: 'standard'},
        {id: 'star-stroked', category: 'standard'},
        {id: 'marker-stroked', category: 'standard'},
        {id: 'circle-stroked', category: 'standard'},
        {id: 'square-stroked', category: 'standard'},
        {id: 'triangle-stroked', category: 'standard'},
        {id: 'cross', category: 'standard'},
        {id: 'disability', category: 'standard'},
        {id: 'danger', category: 'standard'},

        // Shops
        {id: 'art-gallery', category: 'standard'},
        {id: 'alcohol-shop', category: 'standard'},
        {id: 'bakery', category: 'standard'},
        {id: 'bank', category: 'standard'},
        {id: 'bar', category: 'standard'},
        {id: 'beer', category: 'standard'},
        {id: 'cafe', category: 'standard'},
        {id: 'cinema', category: 'standard'},
        {id: 'commercial', category: 'standard'},
        {id: 'clothing-store', category: 'standard'},
        {id: 'grocery', category: 'standard'},
        {id: 'fast-food', category: 'standard'},
        {id: 'hairdresser', category: 'standard'},
        {id: 'fuel', category: 'standard'},
        {id: 'laundry', category: 'standard'},
        {id: 'library', category: 'standard'},
        {id: 'lodging', category: 'standard'},
        {id: 'pharmacy', category: 'standard'},
        {id: 'restaurant', category: 'standard'},
        {id: 'shop', category: 'standard'},

        // Transport
        {id: 'airport', category: 'standard'},
        {id: 'bicycle', category: 'standard'},
        {id: 'bus', category: 'standard'},
        {id: 'car', category: 'standard'},
        {id: 'ferry', category: 'standard'},
        {id: 'london-underground', category: 'standard'},
        {id: 'rail', category: 'standard'},
        {id: 'rail-above', category: 'standard'},
        {id: 'rail-light', category: 'standard'},
        {id: 'rail-metro', category: 'standard'},
        {id: 'rail-underground', category: 'standard'},
        {id: 'scooter', category: 'standard'},

        // Sport
        {id: 'america-football', category: 'standard'},
        {id: 'baseball', category: 'standard'},
        {id: 'basketball', category: 'standard'},
        {id: 'cricket', category: 'standard'},
        {id: 'golf', category: 'standard'},
        {id: 'skiing', category: 'standard'},
        {id: 'soccer', category: 'standard'},
        {id: 'swimming', category: 'standard'},
        {id: 'tennis', category: 'standard'},

        // Places
        {id: 'airfield', category: 'standard'},
        {id: 'building', category: 'standard'},
        {id: 'campsite', category: 'standard'},
        {id: 'cemetery', category: 'standard'},
        {id: 'city', category: 'standard'},
        {id: 'college', category: 'standard'},
        {id: 'dog-park', category: 'standard'},
        {id: 'embassy', category: 'standard'},
        {id: 'farm', category: 'standard'},
        {id: 'fire-station', category: 'standard'},
        {id: 'garden', category: 'standard'},
        {id: 'harbor', category: 'standard'},
        {id: 'heliport', category: 'standard'},
        {id: 'hospital', category: 'standard'},
        {id: 'industrial', category: 'standard'},
        {id: 'land-use', category: 'standard'},
        {id: 'lighthouse', category: 'standard'},
        {id: 'monument', category: 'standard'},
        {id: 'minefield', category: 'standard'},
        {id: 'museum', category: 'standard'},
        {id: 'oil-well', category: 'standard'},
        {id: 'park2', category: 'standard'},
        {id: 'park', category: 'standard'},
        {id: 'parking', category: 'standard'},
        {id: 'parking-garage', category: 'standard'},
        {id: 'pitch', category: 'standard'},
        {id: 'place-of-worship', category: 'standard'},
        {id: 'playground', category: 'standard'},
        {id: 'police', category: 'standard'},
        {id: 'polling-place', category: 'standard'},
        {id: 'post', category: 'standard'},
        {id: 'religious-christian', category: 'standard'},
        {id: 'religious-jewish', category: 'standard'},
        {id: 'religious-muslim', category: 'standard'},
        {id: 'prison', category: 'standard'},
        {id: 'school', category: 'standard'},
        {id: 'slaughterhouse', category: 'standard'},
        {id: 'theatre', category: 'standard'},
        {id: 'toilets', category: 'standard'},
        {id: 'town', category: 'standard'},
        {id: 'town-hall', category: 'standard'},
        {id: 'village', category: 'standard'},
        {id: 'warehouse', category: 'standard'},
        {id: 'wetland', category: 'standard'},
        {id: 'zoo', category: 'standard'},

        {id: 'camera', category: 'standard'},
        {id: 'chemist', category: 'standard'},
        {id: 'dam', category: 'standard'},
        {id: 'emergency-telephone', category: 'standard'},
        {id: 'entrance', category: 'standard'},
        {id: 'heart', category: 'standard'},
        {id: 'logging', category: 'standard'},
        {id: 'mobilephone', category: 'standard'},
        {id: 'music', category: 'standard'},
        {id: 'roadblock', category: 'standard'},
        {id: 'rocket', category: 'standard'},
        {id: 'suitcase', category: 'standard'},
        {id: 'telephone', category: 'standard'},
        {id: 'waste-basket', category: 'standard'},
        {id: 'water', category: 'standard'}
      ],
      // type: Type of icon: if stored as css style -> "css", if image ->"img"
      // folder: folder where images stored (src/img/{folder}/
      // prefix: naming conventionof images is prefix + [1...nb of images]
      iconCategories: [
        {id: 'standard', label: 'standard', useColorOption: true, type: 'css'},
        {id: 'babs',
          label: 'babs',
          useColorOption: false,
          nbIcons: 160,
          type: 'img',
          folder: 'babs',
          prefix: 'babs-'}
      ]
    };

    // We use options provided by parent controller.
    $scope.options = angular.extend(options, $scope.options || {});
    $scope.options.linkType = options.linkTypes[0];
    $scope.options.color = options.colors[5];
    $scope.options.textColor = options.colors[5];
    $scope.options.textSize = options.textSizes[0];
    $scope.options.icon = options.icons[0];
    $scope.options.iconColor = options.colors[5];
    $scope.options.iconSize = options.iconSizes[2];
    $scope.options.iconCategory = options.iconCategories[0];

    $scope.options.iconCategories.forEach(function(category) {
      if (category.type === 'img') {
        category.icons = getImgsByCategory('babs');
      } else {
        category.icons = $scope.options.icons;
      }
    });

    $scope.$on('gaDrawStyleActive', function(evt, feature, layer, pixel) {
      $scope.feature = feature;
      $scope.layer = layer;
    });
  });
})();
