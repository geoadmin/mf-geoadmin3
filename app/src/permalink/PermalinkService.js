(function() {
  goog.provide('ga_permalink_service');

  var module = angular.module('ga_permalink_service', []);


  // stolen from Angular
  // https://github.com/angular/angular.js/blob/master/src/Angular.js
  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
  }

  // stolen from Angular
  // https://github.com/angular/angular.js/blob/master/src/Angular.js
  function parseKeyValue(keyValue) {
    var obj = {}, kv, key;
    angular.forEach((keyValue || '').split('&'), function(keyValue) {
      if (keyValue) {
        kv = keyValue.split('=');
        key = tryDecodeURIComponent(kv[0]);
        if (angular.isDefined(key)) {
          obj[key] = angular.isDefined(kv[1]) ?
              tryDecodeURIComponent(kv[1]) : true;
        }
      }
    });
    return obj;
  }

  // stolen from Angular
  // https://github.com/angular/angular.js/blob/master/src/Angular.js
  function toKeyValue(obj) {
    var parts = [];
    angular.forEach(obj, function(value, key) {
      parts.push(encodeUriQuery(key, true) +
          (value === true ? '' : '=' + encodeUriQuery(value, true)));
    });
    return parts.length ? parts.join('&') : '';
  }

  // stolen from Angular
  // https://github.com/angular/angular.js/blob/master/src/Angular.js
  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      // Ignore any invalid uri component
    }
  }

  function Permalink(b, p) {
    var base = b;
    var params = p;

    this.getHref = function(p) {
      var newParams = angular.extend({}, params);
      if (angular.isDefined(p)) {
        angular.extend(newParams, p);
      }
      return base + '?' + toKeyValue(newParams);
    };

    this.getParams = function() {
      return params;
    };

    this.updateParams = function(p) {
      angular.extend(params, p);
    };
  }

  /**
   * The gaHistory service.
   *
   * A reference to the browser's window.history object.
   */
  module.provider('gaHistory', function() {

    this.$get = ['$window', function($window) {
      return $window.history;
    }];

  });

  /**
   * The gaPermalink service.
   *
   * The service provides three functions:
   *
   * - getHref Get full permalink.
   * - getParams Get the search params.
   * - updateParams Update the search params.
   *
   * updateParams should be called during a digest cycle. If the browser
   * supports the history API the link in the address bar is updated.
   */
  module.provider('gaPermalink', function() {
    this.$get = ['$window', '$rootScope', '$sniffer', 'gaHistory',
      function($window, $rootScope, $sniffer, gaHistory) {

        var loc = $window.location;
        var port = loc.port;
        var protocol = loc.protocol;

        var base = protocol + '//' + loc.hostname +
            (port !== '' ? ':' + port : '') +
            loc.pathname;

        var permalink = new Permalink(
            base, parseKeyValue(loc.search.substring(1)));

        if ($sniffer.history) {
          var lastHref = loc.href;
          $rootScope.$watch(function() {
            var newHref = permalink.getHref();
            if (lastHref !== newHref) {
              $rootScope.$evalAsync(function() {
                lastHref = newHref;
                gaHistory.replaceState(null, '', newHref);
              });
            }
          });
        }

        return permalink;
      }];
  });

})();
