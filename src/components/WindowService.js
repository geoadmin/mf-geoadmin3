goog.provide('ga_window_service');
(function() {

  var module = angular.module('ga_window_service', []);

  module.provider('gaWindow', function() {
    this.$get = function($window) {

      var breakpointsWidth = {
        // Width
        // 0px to 480px
        'xs': $('<div class="ga-visible-xs"></div>'),
        // 481px to 768px
        's': $('<div class="ga-visible-s"></div>'),
        // 769px to 992px
        'm': $('<div class="ga-visible-m"></div>'),
        // 993px to Infinity
        'l': $('<div class="ga-visible-l"></div>')
      };

      var breakpointsHeight = {
        // Height
        // 0 to 480px
        'xs': $('<div class="ga-visible-xs"></div>'),
        // 481px to 600px
        's': $('<div class="ga-visible-s"></div>'),
        // 601px to 800px
        'm': $('<div class="ga-visible-m"></div>'),
        // 801px to Infinity
        'l': $('<div class="ga-visible-l"></div>')
      };

      var width = new ResponsiveToolkit('width', breakpointsWidth,
          $window.document);
      var height = new ResponsiveToolkit('height', breakpointsHeight,
          $window.document);

      var Win = function() {

        this.isWidth = function(str) {
          return width.is(str);
        };

        this.isHeight = function(str) {
          return height.is(str);
        };
      };
      return new Win();
    };
  });

  /**
   * Code comes from:
   * https://github.com/maciej-gurban/responsive-bootstrap-toolkit
   */
  var ResponsiveToolkit = function(name, breakpoints, document) {
    this.breakpoints = breakpoints;

    /**
     * Returns true if current breakpoint matches passed alias
     */
    this.is = function(str) {
      if (str.charAt(0) === '<' || str.charAt(0) === '>') {
        return _isMatchingExpression(str, this.breakpoints);
      }
      return this.breakpoints[str] && this.breakpoints[str].is(':visible');
    };

    // Add the elements to the body
    var divClass = 'ga-window-' + name;
    var div = $('.' + divClass).remove();
    div = $('<div class="ga-window ' + divClass + '"></div>');
    div.appendTo('body');
    $.each(breakpoints, function(alias) {
      breakpoints[alias].appendTo(div);
    });

    /**
     * Splits the expression in into <|> [=] alias
     */
    var _splitExpression = function(str) {

      // Used operator
      var operator = str.charAt(0);
      // Include breakpoint equal to alias?
      var orEqual = (str.charAt(1) === '=');

      /**
       * Index at which breakpoint name starts.
       *
       * For:  >sm, index = 1
       * For: >=sm, index = 2
       */
      var index = 1 + (orEqual ? 1 : 0);

      /**
       * The remaining part of the expression, after the operator, will be
       * treated as the breakpoint name to compare with.
       */
      var breakpointName = str.slice(index);

      return {
        operator: operator,
        orEqual: orEqual,
        breakpointName: breakpointName
      };
    };

    /**
     * Returns true if currently active breakpoint matches the expression
     */
    var _isAnyActive = function(aliases, breakpoints) {
      var found = false;
      $.each(aliases, function(index, alias) {
        // Once first breakpoint matches, return true and break out of the loop
        if (breakpoints[alias].is(':visible')) {
          found = true;
          return false;
        }
      });
      return found;
    };

    /**
     * Determines whether current breakpoint matches the expression given
     */
    var _isMatchingExpression = function(str, breakpoints) {

      var expression = _splitExpression(str);

      // Get names of all breakpoints
      var breakpointList = Object.keys(breakpoints);

      // Get index of sought breakpoint in the list
      var pos = breakpointList.indexOf(expression.breakpointName);

      // Breakpoint found
      if (pos !== -1) {

        var start = 0;
        var end = 0;

        /**
         * Parsing viewport.is('<=md') we interate from smallest breakpoint
         * ('xs') and end at 'md' breakpoint, indicated in the expression,
         * That makes: start = 0, end = 2 (index of 'md' breakpoint)
         *
         * Parsing viewport.is('<md') we start at index 'xs' breakpoint, and
         * end at 'sm' breakpoint, one before 'md'.
         * Which makes: start = 0, end = 1
         */
        if (expression.operator === '<') {
          start = 0;
          end = expression.orEqual ? ++pos : pos;
        }
        /**
         * Parsing viewport.is('>=sm') we interate from breakpoint 'sm' and end
         * at the end of breakpoint list.
         * That makes: start = 1, end = undefined
         *
         * Parsing viewport.is('>sm') we start at breakpoint 'md' and end at
         * the end of breakpoint list.
         * Which makes: start = 2, end = undefined
         */
        if (expression.operator === '>') {
          start = expression.orEqual ? pos : ++pos;
          end = undefined;
        }

        var acceptedBreakpoints = breakpointList.slice(start, end);

        return _isAnyActive(acceptedBreakpoints, breakpoints);
      }
    };
  };
})();
