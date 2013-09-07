(function() {
  goog.provide('ga_popup_service');

  goog.require('ga_draggable_directive');

  var module = angular.module('ga_popup_service', [
    'ga_draggable_directive'
  ]);

  module.provider('gaPopup', function() {

    this.$get = function($compile, $rootScope) {

      var Popup = function(options, scope) {

        // Create the popup element with its content to the HTML page
        var element = angular.element(
          '<div ga-popup ' +
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
        options.open = function() {popup.open();};
        options.close = function() {popup.close();};
        options.destroy = function() {popup.destroy();};

        // Create scope, compile and link
        this.scope = (scope || $rootScope).$new();
        this.scope.options = options;
        this.element = $compile(element)(this.scope);
        this.destroyed = false;

        // Attach popup to body element
        $(document.body).append(this.element);
      };

      Popup.prototype.open = function(scope) {
        // Show the popup
        this.element.show();
      };

      Popup.prototype.close = function() {
        this.element.hide();

        var destroyOnClose = this.scope.options.destroyOnClose;
        if (destroyOnClose !== false) {
          this.destroy();
        }
      };

      Popup.prototype.destroy = function() {
        this.scope.$destroy();
        this.scope = null;
        this.element.remove();
        this.element = null;
        this.destroyed = true;
     };

      return {
        create: function(options) {
          return new Popup(options);
        }
      };
    };
  });
})();
