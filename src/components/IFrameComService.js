goog.provide('ga_iframe_com_service');
(function() {

  var module = angular.module('ga_iframe_com_service', []);

  module.provider('gaIFrameCom', function() {

    //Feature detection from
    //https://github.com/Automattic/wpcom-proxy-request/pull/6

    var stringsOnly = (function() {
      var r = false;
      try {
        window.postMessage({toString: function() {r = true;}},'*');
      } catch (e) {}
      return r;
    })();

    this.$get = function() {

      var IFrameCom = function() {

        this.stringsOnly = function() {
          return stringsOnly;
        };

        this.send = function(type, payload, targetOrigin) {
          if (!targetOrigin) {
            targetOrigin = '*';
          }

          if (top != window) {
            var msg = {
              type: type,
              payload: payload
            };
            if (stringsOnly) {
              msg = JSON.stringify(msg);
            }
            window.parent.postMessage(msg, targetOrigin);
          }
        };
      };

      return new IFrameCom();
    };
  });

})();
