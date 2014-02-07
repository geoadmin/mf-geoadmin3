(function() {
  goog.provide('ga_accordion_directive');

  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_accordion_directive', [
    'ga_browsersniffer_service'
  ]);

  /**
   * Directive to make an accordion usable on small height screens.
   *
   */
  module.directive('gaAccordion', function($document, gaBrowserSniffer) {
    return {
      scope: false,
      link: function(scope, element, attr) {

        if (gaBrowserSniffer.mobile) {
          return;
        }

        var BREAKPOINT = 800;

        var toggles = element.children('.panel').children('.accordion-toggle');
        var clickHandler = function() {
          var current = this;
          $(current).toggleClass('only');
          toggles.each(function(i, toggle) {
            if (toggle == current) {
              return;
            }
            if ($(current).hasClass('only')) {
              $(toggle).slideUp().siblings('.theme-toggle').hide();
            } else {
              $(toggle).slideDown().siblings('.theme-toggle').show();
            }
          });
        };

        var activate = function() {
          toggles.each(function(i, toggle) {
            $($(toggle).attr('href')).collapse('hide').addClass('collapsed');
          });
          toggles.off('click', null, clickHandler).on('click', clickHandler);
        };

        var deactivate = function() {
          toggles.each(function(i, toggle) {
            $($(toggle).attr('href')).collapse('hide');
          });
          toggles.off('click', clickHandler)
              .addClass('collapsed').slideDown().removeClass('only')
              .siblings('.theme-toggle').show();
        };

        if ($('body').height() <= BREAKPOINT) {
          activate();
        }

        $(window).resize(function() {
          if ($(window).height() <= BREAKPOINT) {
            activate();
          } else {
            deactivate();
          }
        });
      }
    };

  });
})();
