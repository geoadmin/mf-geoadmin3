goog.provide('ga_help_directive');

goog.require('ga_help_service');
(function() {

  var module = angular.module('ga_help_directive', [
    'ga_help_service'
  ]);

  /* Help Directive
   *
   * This directives places a help button into the html.
   * When clicked, the help is displayed in a popup
   *
   * The directive has one attribute for configuration:
   * ga-help="your-help-id". This help id is used to get
   * the corresponding html snippet from the help service.
   * You need to add your id to the help service
   *
   * Sample html:
   * <div ga-help="11"></div>
   * Multiple id's can be specified, separated by commas and
   * they will appear in the same window
   * <span ga-help="12,13,14"></div>
  */
  module.directive('gaHelp', function() {
    return {
      restrict: 'A',
      scope: {
        helpIds: '@gaHelp',
        optionsFunc: '&gaHelpOptions'
      },
      templateUrl: 'components/help/partials/help.html',
      link: function(scope, element, attrs) {
        scope.options = scope.optionsFunc();
        if (scope.options && scope.options.showOnHover) {
          element.parent().on('mouseenter', function(evt) {
            element.css('visibility', 'visible');
          }).on('mouseleave', function(evt) {
            element.css('visibility', 'hidden');
          });
        } else {
          element.css('visibility', 'visible');
        }
      }
    };
  });

  module.directive('gaHelpAction', function($rootScope, $sce, gaHelp,
      gaPopup, $window) {
    var popupContent = '<div class="ga-help-content" ' +
                            'ng-repeat="res in options.results">' +
                         '<h2 ng-bind-html="res[0]"></h2>' +
                         '<div ng-bind-html="res[1]"></div>' +
                         '<br>' +
                         '<img ng-src="{{res[2]}}" ' +
                              'draggable="false"/>' +
                       '</div>';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var popup;
        var results = [];
        var helpIds = attrs['gaHelpAction'];
        var shown = false;
        element.on('click', function(evt) {
          if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          scope.$applyAsync(function() {
            displayHelp(evt);
          });
        });

        var displayHelp = function(evt) {
          if (angular.isDefined(popup)) {
            if (shown) {
              popup.close();
            } else {
              popup.open();
              shown = true;
            }
          } else if (helpIds) {
            var ids = helpIds.split(',');

            // Create the popup
            popup = gaPopup.create({
              className: 'ga-help-popup ga-popup-tablet-full',
              destroyOnClose: false,
              title: 'help_label',
              content: popupContent, // contains data-binding to results
              results: results,
              showPrint: true,
              onCloseCallback: function() {
                shown = false;
              }
            });

            var updateContent = function(doOpen) {
              var resCount = 0,
                len = ids.length,
                i;

              var resultReceived = function() {
                if (resCount === 0 &&
                    doOpen) {
                  popup.open();
                  shown = true;
                }

                resCount++;
              };
              for (i = 0; i < len; i++) {
                gaHelp.get(ids[i]).then(function(res) {
                  results.push([
                    $sce.trustAsHtml(res.rows[0][1]),
                    $sce.trustAsHtml(res.rows[0][2]),
                    res.rows[0][4]
                  ]);
                  resultReceived();
                }, function() {
                  resultReceived();
                  // FIXME: better error handling
                  var msg = 'No help found for id ' + ids[i];
                  $window.alert(msg);
                });
              }
            };

            updateContent(true);

            // react on language change
            $rootScope.$on('$translateChangeEnd', function() {
              // Remove old content _without destroying the array_
              // The below is used because it's fastest and is
              // best supported across browsers
              while (results.length > 0) {
                results.pop();
              }
              updateContent(false);
            });
          }
        };
      }
    };
  });

  /**
   * This directive highlights the element designed by a jquery selector
   * displaying a big shadow around him then display a toolitp with an help
   * inside.
   */
  module.directive('gaHelpHighlight', function($document, $window, $translate,
      $timeout) {
    var transitionClass = 'ga-help-hl-transition';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var target,
          win = $($window),
          container = $document.find('.ga-help-hl-container');

        if (!container.length) {
          container = $(
              '<div class="ga-help-hl-container">' +
              '<div class="ga-help-hl"></div>' +
            '</div>');
          $(document.body).append(container);
          container.on('click', function(evt) {
            evt.stopPropagation();
          });
        }

        // Highlighter
        var hl = container.find('.ga-help-hl');

        // Remove popover,  style and listeners
        var clean = function(evt) {
          container.hide();
          hl.removeAttr('style').removeClass(transitionClass);
          target.off('hidden.bs.popover keydown', clean).popover('destroy');
          win.off('resize', clean);

          // The destroy of popover is effective after the end of animation
          // (150ms) so we re-focus the target after this period
          $timeout(function() {
            target.focus();
          }, 160, false);
        };

        element.click(function(evt) {
          if (!target) {
            target = $(attrs['gaHelpHighlight']);
          }
          // Init the highlight position where the user has clicked
          container.show();
          hl.css({
            top: evt.pageY + 'px',
            left: evt.pageX + 'px'
          });

          // Show the popover at the end of transition
          target.popover({
            placement: 'bottom',
            container: 'body',
            delay: {'show': 310, 'hide': 0},
            title: $translate.instant('help_search_data_title'),
            content: $translate.instant('help_search_data'),
            trigger: 'focus'
          }).focus().one('hidden.bs.popover keydown', clean);

          // Start transition
          var offset = target.offset();
          hl.addClass(transitionClass).css({
            top: offset.top - 5 + 'px',
            left: offset.left - 5 + 'px',
            width: target.outerWidth() + 10 + 'px',
            height: target.outerHeight() + 10 + 'px'
          });

          win.on('resize', clean);
        });
      }
    };
  });
})();
