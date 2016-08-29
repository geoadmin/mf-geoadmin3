goog.provide('ga_iframecom_service');
(function() {

  var module = angular.module('ga_iframecom_service', []);

  module.provider('gaIFrameCom', function() {

    this.$get = function($window) {

      //Feature detection from
      //https://github.com/Automattic/wpcom-proxy-request/pull/6
      var stringsOnly = false;
      try {
        $window.postMessage({
          toString: function() {
            stringsOnly = true;
          }
        }, '*');
      } catch (e) {}

      var IFrameCom = function() {

        this.stringsOnly = stringsOnly;

        this.send = function(type, payload, targetOrigin) {
          if (!targetOrigin) {
            targetOrigin = '*';
          }

          if ($window.top != $window) {
            var msg = {
              type: type,
              payload: payload
            };
            if (stringsOnly) {
              msg = JSON.stringify(msg);
            }
            $window.parent.postMessage(msg, targetOrigin);
          }
        };
      };

      return new IFrameCom();
    };
  });

})();
