(function() {
  goog.provide('ga_storage_service');

  goog.require('ga_browsersniffer_service');

  var module = angular.module('ga_storage_service', [
    'ga_browsersniffer_service'
  ]);

  /**
   * Service provides read/write/delete functions in local storages.
   *
   * There is 2 sets (get/set/remove) of functions:
   *   - one for tiles management. These functions use the mozilla localforage
   *   library (see http://github.com/mozilla/localForage). We use this library
   *   to get the maximum advantages of last HTML 5 offline storage features
   *   (indexedDb, webSQL, localStorage). See the api doc for more
   *   information http://mozilla.github.io/localForage/.
   *
   *   - one for basic localStorage. These functions are used to store simple
   *   string (homescreen popup, offline data informations).
   *
   */
  module.provider('gaStorage', function() {

    // Compress/decompress functions to utf-16, comes form ftlabs
    // Reduce by 50% the size of base 64 string.
    var compress = function(s) {
      if (!s) {
        return s;
      }
      var i, l, out = '';
      if (s.length % 2 !== 0) {
        s += ' ';
      }
      for (i = 0, l = s.length; i < l; i += 2) {
        out += String.fromCharCode((s.charCodeAt(i) * 256) +
        s.charCodeAt(i + 1));
      }
      return String.fromCharCode(9731) + out;
    };
    var decompress = function(s) {
      if (!s) {
        return s;
      }
      var i, l, n, m, out = '';
      if (s.charCodeAt(0) !== 9731) {
        return s;
      }
      for (i = 1, l = s.length; i < l; i++) {
        n = s.charCodeAt(i);
        m = Math.floor(n / 256);
        out += String.fromCharCode(m, n % 256);
      }
      return out;
    };
    var isInitialized = false;

    this.$get = function(gaBrowserSniffer) {
      var Storage = function() {

        // Initialize the database config, needed when using webSQL to avoid ios
        // prompts when db becomes bigger.
        // Returns true the db has been initialized false otherwise.
        this.init = function() {
          if (!isInitialized) {
            window.localforage.config({
              name: 'map.geo.admin.ch',
              storeName: 'ga',
              size: 50 * 1024 * 1024, // Only use by webSQL
              version: (gaBrowserSniffer.msie) ? 1 : '1.0',
              description: 'Storage for map.geo.admin.ch'
            });
            if (gaBrowserSniffer.mobile) {
              window.localforage.setDriver('webSQLStorage');
            }
            isInitialized = true;
            return true;
          }
          return false;
        };

        // Strings management
        this.getItem = function(key) {
          return window.localStorage.getItem(key);
        };
        this.setItem = function(key, data) {
          window.localStorage.setItem(key, data);
        };
        this.removeItem = function(key) {
          window.localStorage.removeItem(key);
        };

        // Tiles management
        // TODO: localforage can use promise but it doesn't seem to work for
        // now
        this.getTile = function(key, callback) {
          if (!isInitialized) {return callback(null);}
          window.localforage.getItem(key, function(compressedBase64) {
            callback(decompress(compressedBase64));
          });
        };
        this.setTile = function(key, base64, callback) {
          this.init();
          window.localforage.setItem(key, compress(base64), callback);
        };
        this.removeTile = function(key, callback) {
          window.localforage.removeItem(key, callback);
        };
        this.clearTiles = function(callback) {
          this.init();
          window.localforage.clear(callback);
        };
      };
      return new Storage();
    };
  });
})();

