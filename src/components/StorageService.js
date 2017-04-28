goog.provide('ga_storage_service');

goog.require('ga_browsersniffer_service');
(function() {

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

    // Compress/decompress functions to utf-16, comes form ftlabs:
    // http://labs.ft.com/2012/06/text-re-encoding-for-optimising-storage-
    // capacity-in-the-browser/
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

    this.$get = function($window, gaBrowserSniffer, $q) {
      var Storage = function() {

        // Initialize the database config, needed when using webSQL to avoid ios
        // prompts when db becomes bigger.
        this.init = function() {
          if (!isInitialized && $window.localforage &&
              gaBrowserSniffer.mobile) {
            // iOS 10 manages indexedDB but localforage has a wrong detection.
            // iOS 10 doesn't accept a webSQL db of 50MB exactly, that's why
            // 1023 instead of 1024 is specified in size parameter. To remove
            // when localforage will support indexedDB for iOS 10.
            $window.localforage.config({
              name: 'map.geo.admin.ch',
              storeName: 'ga',
              size: 50 * 1024 * 1023,
              version: (gaBrowserSniffer.msie) ? 1 : '1.0',
              description: 'Storage for map.geo.admin.ch'
            });
            // IE > 10, Safari, Chrome, Opera, FF -> indexeddb
            //
            // Exceptions:
            // Android default browser -> websql
            // iOS Chrome, Opera -> websql
            // iOS Safari -> websql
            isInitialized = true;
          }
        };

        // Strings management
        // LocalStorage creates a bug on IE >= 10 when security settings
        // are tight and don't permit writing on specific files. We put
        // it in try/catch to determine it here
        // See: http://stackoverflow.com/questions/13102116/access-denied
        var localStorageSupport = false;
        try {
          $window.localStorage.getItem('testkey');
          localStorageSupport = true;
        } catch (e) {
        }

        if (localStorageSupport) {
          this.getItem = function(key, type) {
            var val = $window.localStorage.getItem(key);
            if (/^(true|false)$/i.test(val)) {
              val = /^true$/i.test(val);
            }
            return type ? new type(val) : val;
          };
          this.setItem = function(key, data) {
            $window.localStorage.setItem(key, data);
          };
          this.removeItem = function(key) {
            $window.localStorage.removeItem(key);
          };
        } else {
          this.getItem = this.setItem = this.removeItem = angular.noop;
        }

        // Tiles management
        this.getTile = function(key) {
          if (!isInitialized) {
            return $q.when();
          }
          return $window.localforage.getItem(key).then(
              function(compressedDataURI) {
            return decompress(compressedDataURI);
          });
        };

        this.setTile = function(key, dataURI) {
          this.init();
          return $window.localforage.setItem(key, compress(dataURI));
        };

        this.clearTiles = function() {
          this.init();
          return $window.localforage.clear();
        };
      };
      return new Storage();
    };
  });
})();

