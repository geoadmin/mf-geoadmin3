(function() {
  goog.provide('ga_networkstatus_service');

  var module = angular.module('ga_networkstatus_service', []);

  module.factory('httpInterceptor', function($q, gaNetworkStatus) {
    return {
      responseError: function(rejection) {
        // In case an $http request failed we check if we are still connected.
        gaNetworkStatus.check(2000);
        return $q.reject(rejection);
      }
    };
  });

  module.config(function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  });

  /**
   * This service watches the status of network connection.
   *
   * Currently it watches every $http and $.ajax requests errors, if an error
   * occurs we wait 2 sec then we make an http request on the checker file of
   * chsdi (we don't use geoadmin checker only to avoid appcache fallback).
   * If the checker responds that means we are online, otherwise we make a
   * 2nd request 2 sec later, if the 2nd requests failed that means we
   * are offline.
   *
   * A timeout of 1 sec is set for the checker file, so if we have a bad
   * connection, we consider we are offline.
   *
   * During offline mode we test every 2 sec if we are back online.
   */
  module.provider('gaNetworkStatus', function() {
    var count = 0;
    var promise;
    this.$get = function($document, $rootScope, $timeout, gaGlobalOptions) {
      var NetworkStatusService = function() {
        var that = this;
        this.offline = !navigator.onLine;
        this.check = function(timeout) {
          if (promise) {
            $timeout.cancel([promise]);
          }
          if (timeout) {
            count++;
            promise = $timeout(this.check, timeout);
            return;
          }
          $.ajax({
            method: 'GET',
            url: gaGlobalOptions.mapUrl + '/checker',
            timeout: 1000,
            success: function() {
              count = 0;
              if (that.offline) {
                triggerChangeStatusEvent(false);
              }
            },
            error: function() {
              count++;
              // We consider we are offline after 3 requests failed
              if (count > 2 && !that.offline) {
                triggerChangeStatusEvent(true);
              }
            }
          });
        };
      };
      var net = new NetworkStatusService();

      var triggerChangeStatusEvent = function(offline) {
        net.offline = offline;
        $rootScope.$broadcast('gaNetworkStatusChange', net.offline);
        $rootScope.$digest();
      };

      // When the window opens, navigator.onLine is false so we run the checker
      // to detect when it's online again.
      if (net.offline) {
        net.check();
      }

      // The manifest returns 404 or 410, the download failed,
      // or the manifest changed while the download was in progress.
      if (window.applicationCache) { // IE9
        window.applicationCache.addEventListener('error', function() {
          net.check();
        }, false);
      }

      // airplane mode, works offline(firefox)
      window.addEventListener('offline', function() {
        triggerChangeStatusEvent(true);
      });

      // online event doesn't means we have a internet connection, that means we
      // have possiby one (connected to a router ...)
      window.addEventListener('online', function() {
        net.check();
      });

      // We catch every $.ajax request errors or (canceled request).
      $document.ajaxError(function(evt, jqxhr, settings, thrownError) {
        // Filter out canceled requests
        if (!/^(canceled|abort)$/.test(thrownError)) {
          net.check(2000);
        }
      });

      return net;
    };
  });
})();

