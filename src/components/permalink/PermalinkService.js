(function() {
  goog.provide('ga_permalink_service');

  goog.require('ga_urlutils_service');

  var module = angular.module('ga_permalink_service', [
    'ga_urlutils_service'
  ]);

  /**
   * The gaHistory service.
   *
   * A reference to the browser's window.history object.
   */
  module.provider('gaHistory', function() {

    this.$get = function($window) {
      return $window.history;
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
    this.$get = function($window, $rootScope, $sniffer, gaHistory, gaUrlUtils) {

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

          this.getParams = function() {
            return params;
          };

          this.updateParams = function(p) {
            angular.extend(params, p);
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
              if ($sniffer.history && !(document.fullscreenElement ||
                  document.msFullscreenElement ||
                  document.mozFullScreen ||
                  document.webkitIsFullScreen)) {
                gaHistory.replaceState(null, '', newHref);
              }
              $rootScope.$broadcast('gaPermalinkChange');
            });
          }
        });

        return permalink;
      };
  });

})();
