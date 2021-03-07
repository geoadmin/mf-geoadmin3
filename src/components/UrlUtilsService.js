goog.provide('ga_urlutils_service');
(function() {

  var module = angular.module('ga_urlutils_service', []);

  module.provider('gaUrlUtils', function() {

    this.$get = function(gaGlobalOptions, $http, $q, $window) {

      var UrlUtils = function(shortenUrl) {

        // Ugly hack because print can't work with most CF distributions. So
        // from Angular
        // https://github.com/angular/angular.js/blob/v1.4.8/src/ng/directive/input.js#L15
        var URL_REGEXP = new RegExp('^(blob:)?(ftp|http|https):\\/\\/' +
                                    '(?:\\w+(?::\\w+)?@)?' +
                                    '[^\\s/]+(?::\\d+)?' +
                                    '(?:\\/[\\w#!:.?+=&%@{}\\- /' +
                                    '[\\]$\'()*,;~]*)?$');

        var SUBDOMAINS_REGEXP = /\{s(:(([\w,]?)+))?\}/;

        // Test validity of a URL
        this.isValid = function(url) {
          return (!!url && url.length > 0 && URL_REGEXP.test(url));
        };

        // Test if the URL comes from a friendly site
        this.isAdminValid = function(url) {
          return (this.isValid(url) &&
                  gaGlobalOptions.adminUrlRegexp.test(url));
        };

        // Test if URL is a blob url
        this.isBlob = function(url) {
          return /^blob:/.test(url);
        };

        // Test if URL uses https
        this.isHttps = function(url) {
          return (this.isValid(url) && /^https/.test(url));
        };

        // Test if URL represents resource that needs to pass via proxy
        this.needsProxy = function(url) {
          if (this.isBlob(url)) {
            return false;
          }
          return (!this.isHttps(url) ||
                  !this.isAdminValid(url) ||
                  /.*(kmz)$/.test(url) ||
                  (!this.isAdminValid(url) &&
                   /.*(kmz|kml|gpx|xml)$/.test(url))
          );
        };

        // Test using a head request if the remote resource enables CORS
        this.isCorsEnabled = function(url) {
          return $http.head(url, { timeout: 1500 });
        };

        this.buildProxyUrl = function(url) {
          if (!this.isValid(url)) {
            return url;
          }
          var parts = /^(http|https)(:\/\/)(.+)/.exec(url);
          var protocol = parts[1];
          var resource = parts[3];
          // proxy is RESTFful, <service>/<protocol>/<resource>
          return gaGlobalOptions.proxyUrl + protocol + '/' +
              encodeURIComponent(resource);
        };

        this.proxifyUrlInstant = function(url) {
          if (this.needsProxy(url)) {
            return this.buildProxyUrl(url);
          }
          return url;
        };

        this.getCesiumProxy = function() {
          var that = this;
          return {
            getURL: function(resource) {
              if (that.needsProxy(resource)) {
                return that.buildProxyUrl(resource);
              }
              return resource;
            }
          };
        };

        this.proxifyUrl = function(url) {
          var that = this;
          var deferred = $q.defer();
          if (!this.isBlob(url) && this.isHttps(url) &&
              !this.isAdminValid(url) && !/.*kmz$/.test(url)) {
            this.isCorsEnabled(url).then(function(enabled) {
              deferred.resolve(url);
            }, function() {
              deferred.resolve(that.buildProxyUrl(url));
            });
          } else {
            deferred.resolve(this.proxifyUrlInstant(url));
          }
          return deferred.promise;
        };

        // Remove proxy from the URL
        this.unProxifyUrl = function(url) {
          if (this.isValid(url)) {
            var reg = new RegExp(['^(http|https)://(service-proxy.',
              '(dev|int|prod).bgdi.ch|proxy.geo.admin.ch|',
              'service-proxy.bgdi-dev.swisstopo.cloud)',
              '/(http|https)/(.*)'].join(''));
            var parts = reg.exec(url);
            if (parts && parts.length === 6) {
              return parts[4] + '://' + parts[5];
            }
          }
          return url;
        };

        this.shorten = function(url, timeout) {
          return $http.get(shortenUrl, {
            timeout: timeout,
            params: {
              url: url
            }
          }).then(function(response) {
            return response.data.shorturl;
          }, function(reason) {
            $window.console.error(reason);
            return url;
          });
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
            url = $window.location.protocol + url;
          }
          return url;
        };

        this.getHostname = function(str) {
          return ((decodeURIComponent(str).match(/:\/\/(.[^/]+)/) || [])[1] || '').toString();
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
                if (kv.length > 1) {
                  obj[key] = this_.tryDecodeURIComponent(
                      kv.splice(1, kv.length - 1).join('='));
                } else {
                  obj[key] = true;
                }
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

        // Returns the subdomains as an array, for example:
        // wms{s:,0,1,2}.geo.admin.ch returns [''', 0, 1, 2]
        this.parseSubdomainsTpl = function(tpl) {
          var sd;
          if (tpl) {
            var matches = tpl.match(SUBDOMAINS_REGEXP);
            if (matches && matches.length > 2 &&
                matches[2] && matches[2].length) {
              sd = matches[2].split(',');
            }
          }
          return sd
        }

        // Returns true if the url has a subdomains template in it
        // like: wms{s:,0,1,2}.geo.admin.ch
        this.hasSubdomainsTpl = function(tpl) {
          return SUBDOMAINS_REGEXP.test(tpl || '');
        }

        // Replace subdomains regexp
        this.getMultidomainsUrls = function(tpl, dfltSubdomains) {
          if (!this.hasSubdomainsTpl(tpl)) {
            return [tpl];
          }
          var urls = [];
          var subdomains = this.parseSubdomainsTpl(tpl) ||
              dfltSubdomains || [''];
          subdomains.forEach(function(subdomain) {
            urls.push(tpl.replace(SUBDOMAINS_REGEXP, subdomain));
          });
          return urls;
        }
      };

      return new UrlUtils(this.shortenUrl);
    };
  });

})();
