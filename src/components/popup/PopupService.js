(function() {
  goog.provide('ga_popup_service');

  goog.require('ga_draggable_directive');

  var module = angular.module('ga_popup_service', [
    'ga_draggable_directive'
  ]);

  module.provider('gaPopup', function() {

    this.$get = function($compile, $rootScope) {

      var Popup = function(options) {

        // Create the popup element with its content to the HTML page
        var element = angular.element(
          '<div ga-popup="toggle" ' +
               'ga-popup-options="options" ' +
               'ga-draggable=".ga-popup-title">' +
               options.content +
          '</div>'
        );

        if (options.className) {
          element.addClass(options.className);
        }

        // Pass some popup functions for clients to be used in content
        var popup = this;
        options.close = function(evt) {
          var onCloseCallback = popup.scope.options.onCloseCallback;
          if (angular.isFunction(onCloseCallback)) {
            onCloseCallback(this);
          }
        };

        // Create scope, compile and link
        this.scope = $rootScope.$new();
        this.scope.toggle = false;
        this.scope.options = options;
        this.element = $compile(element)(this.scope);

        // Attach popup to body element
        $(document.body).append(this.element);
      };

      Popup.prototype.open = function() {
        this.scope.toggle = true;
      };

      Popup.prototype.close = function() {
        var position = this.element.position();
        this.scope.options.x = position.left;
        this.scope.options.y = position.top;
        this.scope.toggle = false;
      };

      Popup.prototype.destroy = function() {
        this.scope.$destroy();
        this.scope = null;
        this.element.remove();
        this.element = null;
      };

      return {
        create: function(options) {
          return new Popup(options);
        }
      };
    };
  });
})();
