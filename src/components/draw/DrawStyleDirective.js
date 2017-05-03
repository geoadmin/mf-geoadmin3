goog.provide('ga_drawstyle_directive');

goog.require('ga_styles_service');
goog.require('ga_urlutils_service');
goog.require('ga_window_service');

(function() {

  var module = angular.module('ga_drawstyle_directive', [
    'ga_styles_service',
    'ga_urlutils_service',
    'ga_window_service'
  ]);

  module.directive('gaDrawStyle', function($document, $window, $translate,
      gaGlobalOptions, gaStyleFactory, gaUrlUtils, gaWindow) {

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

    var findSize = function(olStyle, sizes, dflt) {
      var scale = olStyle.getScale();
      for (var i = 0; i < sizes.length; i++) {
        if (scale == sizes[i].scale) {
          return sizes[i];
        }
      }
      return dflt || sizes[2];
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
          useTextStyle = true;
          var img = featStyle.getImage();
          scope.options.icon = findIcon(img, scope.options.icons);
          scope.options.iconSize = findSize(img, scope.options.iconSizes);
          scope.options.iconColor = findIconColor(img, scope.options.colors);
        }
        if (!useIconStyle && featStyle.getStroke()) {
          useColorStyle = true;
          scope.options.color = findColor(featStyle.getStroke().getColor(),
              scope.options.colors);
        }
        if (featStyle.getText()) {
          useTextStyle = true;
          scope.options.name = featStyle.getText().getText();
          scope.options.textColor = findColor(
              featStyle.getText().getFill().getColor(),
              scope.options.colors);
          scope.options.textSize = findSize(featStyle.getText(),
              scope.options.textSizes, scope.options.textSizes[0]);
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

    // Return the icon url with the good color.
    var getIconUrl = function(icon, olColor) {
      return gaGlobalOptions.apiUrl + '/color/' +
          olColor.toString() + '/' + icon.id +
          '-24@2x.png';
    };

    // Get the current style defined by the properties object
    var updateStylesFromProperties = function(feature, properties) {
      var oldStyles = feature.getStyle();
      if (!oldStyles || !oldStyles.length) {
        // No style to update
        return;
      }
      var oldStyle = oldStyles.shift();

      // Update Fill if it exists
      var color = properties.color;
      var fill = oldStyle.getFill();
      if (fill) {
        fill.setColor(color.fill.concat(fill.getColor()[3]));
      }

      // Update Stroke if it exists
      var stroke = oldStyle.getStroke();
      if (stroke) {
        stroke.setColor(color.fill.concat(stroke.getColor()[3]));
      }

      // Update text style
      var text;
      if (properties.text) {
        text = oldStyle.getText() || new ol.style.Text();
        text.setText(properties.text);
        text.setScale(properties.textSize.scale);

        if (properties.font) {
          text.setFont(properties.font);
        }

        var textColor = properties.textColor.fill.concat([1]);
        var textFill = text.getFill() || new ol.style.Fill();
        textFill.setColor(textColor);
        text.setFill(textFill);
        text.setStroke(gaStyleFactory.getTextStroke(textColor));

      }

      // Update Icon style if it exists
      var icon = oldStyle.getImage();
      if (icon instanceof ol.style.Icon &&
          angular.isDefined(properties.icon)) {
        icon = new ol.style.Icon({
          src: getIconUrl(properties.icon, properties.iconColor.fill),
          scale: properties.iconSize.scale
        });
      }
      var styles = [
        new ol.style.Style({
          fill: fill,
          stroke: stroke,
          text: text,
          image: icon,
          zIndex: oldStyle.getZIndex()
        })
      ].concat(oldStyles);
      return styles;
    };

    var applyStyle = function(newValues, oldValues, scope) {
      var feature = scope.feature;
      if (feature) {
        var text = (newValues[0]) ? newValues[1] : undefined;
        // Update the style of the feature with the current style
        var styles = updateStylesFromProperties(feature, {
          font: scope.options.font,
          description: newValues[2],
          color: newValues[3],
          icon: newValues[4],
          iconColor: newValues[5],
          iconSize: newValues[6],
          text: text,
          textColor: newValues[7],
          textSize: newValues[8]
        });

        // Set feature's properties
        feature.set('name', text);
        feature.set('description', newValues[2]);
        feature.setStyle(styles);
      }
    };

    var youtubeRegExp =
      new RegExp('^http(s)?:\/\/www.youtube.com\/watch\\?v=([A-Za-z0-9_]+)$');

    var embedYoutubeLink = function(url) {
      var videoId = youtubeRegExp.exec(url)[2];
      return 'https://youtube.com/embed/' + videoId;
    };

    return {
      restrict: 'A',
      templateUrl: 'components/draw/partials/drawstyle.html',
      scope: {
        feature: '=gaDrawStyle',
        layer: '=gaDrawStyleLayer',
        options: '=gaDrawStyleOptions'
      },
      link: function(scope, element, attrs, controller) {
        if (!scope.options) {
          return;
        }

        scope.appendToDescr = function($event, linkType) {
          var linkVal = youtubeRegExp.test(linkType.value) ?
              embedYoutubeLink(linkType.value) : linkType.value;
          scope.options.description += linkType.tpl
              .replace(/{{url}}/g, linkVal)
              .replace(/{{textToDisplay}}/, linkType.textToDisplay || '');
          // Close the popover then focus the textarea
          $('.ga-descr-buttons').next('textarea').click().focus();
          // Clear input field
          element.find('.ga-add-link input').val('');
          var linkDesc = element.find('.ga-html-link input');
          if (linkDesc) {
            linkDesc.val('');
          }
        };

        scope.isValidUrl = function(url) {
          return gaUrlUtils.isValid(url);
        };

        scope.deleteSelectedFeature = function(layer, feature) {
          if (layer.getSource().getFeatures().length == 1 &&
              confirm($translate.instant('confirm_remove_all_features'))) {
            layer.getSource().clear();
            scope.feature = undefined;
          } else if (confirm($translate.instant(
              'confirm_remove_selected_features'))) {
            layer.getSource().removeFeature(feature);
            scope.feature = undefined;
          }
        };

        scope.$watch('feature', function() {
          updateContent(scope);
        });

        // Active watchers
        // Update selected feature's style when the user change a value
        scope.$watchGroup([
          'useTextStyle',
          'options.name',
          'options.description',
          'options.color',
          'options.icon',
          'options.iconColor',
          'options.iconSize',
          'options.textColor',
          'options.textSize'
        ], applyStyle);

        // Open the popover with style inside
        var win = $($window);
        var closeBt = '<button class="ga-icon ga-btn fa fa-remove"></button>';
        scope.togglePopover = function(evt, linkType) {
          var bt = $(evt.currentTarget);

          if (!bt.data('bs.popover')) {

            var closePopover = function(evt) {
              // Don't
              if (bt.is(evt.target)) {
                return;
              }
              bt.popover('hide');
            };

            var title;
            var content = $(bt.data('target')).on('click', function(evt) {
              // Avoid to close the popup when we click inside the popover
              // content
              evt.stopPropagation();
            });

            if (linkType) {
              title = $translate.instant('add_' + linkType.label) + closeBt;
            } else {
              content = content.add($(closeBt));
            }

            bt.popover({
              html: true,
              placement: function() {
                return gaWindow.isWidth('xs') ? 'top' : 'auto right';
              },
              content: content,
              title: title,
              trigger: 'manual'
            });

            // Close popover on outside popover mouse event
            if (linkType && linkType.onOpen) {
              bt.on('show.bs.popover', function(evt) {
                linkType.onOpen();
              });
            }
            bt.on('shown.bs.popover', function(evt) {
              element.on('scroll', closePopover);
              $document.on('click', closePopover);
              win.on('resize', closePopover);
              $(evt.currentTarget).next('.popover').find('input,select')
                  .first().focus();
            }).on('hide.bs.popover', function() {
              element.off('scroll', closePopover);
              $document.off('click', closePopover);
              win.off('resize', closePopover);
            });
          }
          bt.popover('toggle');
        };
      }
    };
  });
})();
