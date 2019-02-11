goog.provide('ga_permalink_service');

goog.require('ga_urlutils_service');
(function() {

  var module = angular.module('ga_permalink_service', [
    'ga_urlutils_service'
  ]);

  /**
   * The gaHistory service.
   *
   * A wrapper to the browser's window.history object.
   */
  module.provider('gaHistory', function() {
    this.$get = function($window, $sniffer, $document) {
      var doc = $document[0];
      var isFullScreen = function() {
        return (doc.fullscreenElement || doc.msFullscreenElement ||
            doc.mozFullScreen || doc.webkitIsFullScreen);
      };
      return {
        pushState: function(data, title, url) {
          if ($sniffer.history) {
            $window.history.pushState(data, title, url);
          }
        },
        replaceState: function(data, title, url) {
          if ($sniffer.history && !isFullScreen()) {
            $window.history.replaceState(data, title, url);
          }
        }
      };
    };
  });

  /**
   * The gaPermalink service.
   *
   * The service provides three functions:
   *
   * - getHref Get full permalink.
   * - getParams Get the search params.
   * - updateParams Update the search params.
   * - deleteParam Delete a search param.
   *
   * updateParams and deleteParam should be called during a digest cycle.
   * If the browser supports the history API the link in the address bar
   * is updated.
   */
  module.provider('gaPermalink', function() {
    this.$get = function($window, $rootScope, gaHistory, gaUrlUtils) {

      var Permalink = function(b, p) {
        var base = b;
        var params = p;

        this.getHref = function(p) {
          var newParams = angular.extend({}, params);
          if (angular.isDefined(p)) {
            angular.extend(newParams, p);
          }
          return base + '?' + gaUrlUtils.toKeyValue(newParams);
        };

        this.getEmbedHref = function(p) {
          var newParams = angular.extend({}, params);
          if (angular.isDefined(p)) {
            angular.extend(newParams, p);
          }
          if (angular.isDefined(newParams.mobile)) {
            delete newParams.mobile;
          }
          var baseEmbed = base.replace(/^http:/, 'https:').
              replace(/(index|mobile)\.html$/, 'embed.html');
          if (!/embed\.html$/.test(baseEmbed)) {
            if (!/\/$/.test(baseEmbed)) {
              baseEmbed += '/';
            }
            baseEmbed += 'embed.html';
          }
          return baseEmbed + '?' + gaUrlUtils.toKeyValue(newParams);
        };

        // The main href is the embed permalink but without the name of
        // the html page.
        this.getMainHref = function(p) {
          return this.getEmbedHref(p).replace(/\/embed\.html\?/, '/?');
        };

        this.getParams = function() {
          return params;
        };

        this.updateParams = function(p) {
          angular.extend(params, p);
        };

        this.deleteSwissCoords = function() {
          this.deleteParam('E');
          this.deleteParam('N');
          this.deleteParam('X');
          this.deleteParam('Y');
        };

        this.deleteParam = function(key) {
          delete params[key];
        };

        this.refresh = function() {
          gaHistory.replaceState(null, '', this.getHref());
        };
      };

      var loc = $window.location;
      var port = loc.port;
      var protocol = loc.protocol;

      var base = protocol + '//' + loc.hostname +
            (port !== '' ? ':' + port : '') +
            loc.pathname;

      var permalink = new Permalink(
          base, gaUrlUtils.parseKeyValue(loc.search.substring(1)));

      var lastHref = loc.href;
      $rootScope.$watch(function() {
        var newHref = permalink.getHref();
        if (lastHref !== newHref) {
          $rootScope.$evalAsync(function() {
            lastHref = newHref;
            gaHistory.replaceState(null, '', newHref);
            $rootScope.$broadcast('gaPermalinkChange');
          });
        }
      });

      return permalink;
    };
  });
})();
