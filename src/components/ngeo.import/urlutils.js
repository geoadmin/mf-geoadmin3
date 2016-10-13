goog.provide('ngeo.urlUtilsService');
(function() {

  var module = angular.module('ngeo.urlUtilsService', []);

  module.provider('ngeoUrlUtils', function() {

    this.$get = function(gaGlobalOptions) {

      var UrlUtils = function() {

        // from Angular
        // https://github.com/angular/angular.js/blob/v1.4.8/src/ng/directive/input.js#L15
        var URL_REGEXP = new RegExp('^(ftp|http|https):\\/\\/' +
                                    '(?:\\w+(?::\\w+)?@)?' +
                                    '[^\\s/]+(?::\\d+)?' +
                                    '(?:\\/[\\w#!:.?+=&%@\\- /' +
                                    '[\\]$\'()*,;~]*)?$');

        // Test validity of a URL
        this.isValid = function(url) {
          return (!!url && url.length > 0 && URL_REGEXP.test(url));
        };

        // Test if the URL comes from a friendly site
        this.isAdminValid = function(url) {
          return (this.isValid(url) &&
                  gaGlobalOptions.adminUrlRegexp.test(url));
        };

        // Test if URL uses https
        this.isHttps = function(url) {
          return (this.isValid(url) && /^https/.test(url));
        };

        // Test if URL represents resource that needs to pass via ogcProxy
        this.needsProxy = function(url) {
          return (!this.isHttps(url) ||
                  !this.isAdminValid(url) ||
                  /.*kmz$/.test(url));
        };

        this.proxifyUrl = function(url) {
          if (this.needsProxy(url)) {
            return gaGlobalOptions.ogcproxyUrl + encodeURIComponent(url);
          }
          return url;
        };

        // Test if the URL comes from a third party site
        this.isThirdPartyValid = function(url) {
          return !this.isAdminValid(url) ||
                  this.isPublicValid(url);
        };

        this.isPublicValid = function(url) {
          return gaGlobalOptions.publicUrlRegexp.test(url);
        };

        this.transformIfAgnostic = function(url) {
          if (/^\/\//.test(url)) {
            url = location.protocol + url;
          }
          return url;
        };

        this.getHostname = function(str) {
          return decodeURIComponent(str).match(/:\/\/(.[^/]+)/)[1].toString();
        };

        this.append = function(url, paramString) {
          if (paramString) {
            var parts = (url + ' ').split(/[?&]/);
            url += (parts.pop() === ' ' ? paramString :
                (parts.length > 0 ? '&' + paramString : '?' + paramString));
          }
          return url;
        };

        this.remove = function(url, params, ignoreCase) {
          var parts = url.split('?');
          if (parts.length > 1) {
            var qs = '&' + parts[1];
            var flags = (ignoreCase) ? 'gi' : 'g';
            qs = qs.replace(
                new RegExp('&(' + params.join('|') + ')=[^&]*', flags), '');
            url = parts[0] + qs.replace(/^&/, '?');
          }
          return url;
        };

        // stolen from Angular
        // https://github.com/angular/angular.js/blob/master/src/Angular.js
        this.encodeUriQuery = function(val, pctEncodeSpaces) {
          return encodeURIComponent(val).
              replace(/%40/gi, '@').
              replace(/%3A/gi, ':').
              replace(/%24/g, '$').
              replace(/%2C/gi, ',').
              replace(/%7B/gi, '{').
              replace(/%7D/gi, '}').
              replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
        };

        // stolen from Angular
        // https://github.com/angular/angular.js/blob/master/src/Angular.js
        this.parseKeyValue = function(keyValue) {
          var obj = {}, kv, key, this_ = this;
          angular.forEach((keyValue || '').split('&'), function(keyValue) {
            if (keyValue) {
              kv = keyValue.split('=');
              key = this_.tryDecodeURIComponent(kv[0]);
              if (angular.isDefined(key)) {
                obj[key] = angular.isDefined(kv[1]) ?
                    this_.tryDecodeURIComponent(kv[1]) : true;
              }
            }
          });
          return obj;
        };

        // stolen from Angular
        // https://github.com/angular/angular.js/blob/master/src/Angular.js
        this.toKeyValue = function(obj) {
          var parts = [], this_ = this;
          angular.forEach(obj, function(value, key) {
            parts.push(this_.encodeUriQuery(key, true) +
                (value === true ? '' : '=' +
                    this_.encodeUriQuery(value, true)));
          });

          return parts.length ? parts.join('&') : '';
        };

        // stolen from Angular
        // https://github.com/angular/angular.js/blob/master/src/Angular.js
        this.tryDecodeURIComponent = function(value) {
          try {
            return decodeURIComponent(value);
          } catch (e) {
            // Ignore any invalid uri component
          }
        };
      };

      return new UrlUtils();
    };
  });

})();
