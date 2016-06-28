goog.provide('ga_drawstyle_directive');

(function() {

  var module = angular.module('ga_drawstyle_directive', []);

  module.directive('gaDrawStyle', function() {

    // Find the corresponding style
    var findIcon = function(olIcon, icons) {
      var id = olIcon.getSrc();
      for (var i = 0; i < icons.length; i++) {
        var regex = new RegExp('/' + icons[i].id + '-24');
        if (regex.test(id)) {
          return icons[i];
        }
      }
      return icons[0];
    };

    var findIconSize = function(olIcon, iconSizes) {
      var scale = olIcon.getScale();
      for (var i = 0; i < iconSizes.length; i++) {
        if (scale == iconSizes[i].scale) {
          return iconSizes[i];
        }
      }
      return iconSizes[2];
    };

    var findIconColor = function(olIcon, colors) {
      var url = olIcon.getSrc();
      // Test if the url use the color service
      var colorReg = /\/([0-9]{1,3},[0-9]{1,3},[0-9]{1,3})\//;
      var rgb = url.match(colorReg);
      if (rgb) {
        for (var i = 0; i < colors.length; i++) {
          if (colors[i].fill.toString() == rgb[1].toString()) {
            return colors[i];
          }
        }
      }
      // Red
      return colors[5];
    };

    var findColor = function(olColor, colors) {
      var rgb = ol.color.asString(olColor.slice(0, 3));
      for (var i = 0; i < colors.length; i++) {
        if (rgb == ol.color.asString(colors[i].fill)) {
          return colors[i];
        }
      }
      return colors[5];
    };

    // Determines which elements to display in the feature's propereties
    // tab
    var updateContent = function(scope) {
      var feature = scope.feature;
      var useTextStyle = false;
      var useIconStyle = false;
      var useColorStyle = false;
      if (feature) {
        var styles = feature.getStyleFunction()();
        var featStyle = styles[0];
        if (featStyle.getImage() instanceof ol.style.Icon) {
          useIconStyle = true;
          var img = featStyle.getImage();
          scope.options.icon = findIcon(img, scope.options.icons);
          scope.options.iconSize = findIconSize(img,
              scope.options.iconSizes);
          scope.options.iconColor = findIconColor(img,
              scope.options.colors);
        }
        if (!useIconStyle && featStyle.getStroke()) {
          useColorStyle = true;
          scope.options.color = findColor(
              featStyle.getStroke().getColor(),
              scope.options.colors);
        }
        if (featStyle.getText()) {
          useTextStyle = true;
          scope.options.name = featStyle.getText().getText();
          scope.options.textColor = findColor(
              featStyle.getText().getFill().getColor(),
              scope.options.colors);
        }

        scope.options.name = feature.get('name') || '';
        scope.options.description = feature.get('description') || '';
      } else {
        scope.options.name = '';
        scope.options.description = '';
      }
      scope.useTextStyle = useTextStyle;
      scope.useIconStyle = useIconStyle;
      scope.useColorStyle = useColorStyle;
    };

    return {
      restrict: 'A',
      templateUrl: 'components/draw/partials/draw-style.html',
      scope: {
        feature: '=gaDrawStyle',
        options: '=gaDrawStyleOptions'
      },
      link: function(scope, element, attrs, controller) {
        if (!scope.feature && !scope.options) {
          return;
        }
        var unWatch = [];
        updateContent(scope);

        // Active watchers
        // Update selected feature's style when the user change a value
        unWatch.push(scope.$watchGroup([
          'useTextStyle',
          'options.icon',
          'options.iconSize',
          'options.color',
          'options.textColor',
          'options.iconColor',
          'options.name',
          'options.description'
        ], function() {
          var feature = scope.feature;
          if (feature) {
            // Update the style of the feature with the current style
            var styles = scope.options.updateStyle(feature, {
              name: (scope.useTextStyle) ?
                  scope.options.name : undefined,
              description: scope.options.description,
              color: scope.options.color,
              font: scope.options.font,
              textColor: (scope.useTextStyle) ?
                  scope.options.textColor : undefined,
              iconColor: scope.options.iconColor,
              icon: scope.options.icon,
              iconSize: scope.options.iconSize
            });
            feature.setStyle(styles);
            // then apply the select style
            styles = scope.options.selectStyleFunction(feature);
            feature.setStyle(styles);
          }
        }));

        scope.openIcons = function() {
         $('.lala').popover({
            html: true,
            content: $('.lala2')[0]
          });
        };
      }
    };
  });
})();
