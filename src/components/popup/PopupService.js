(function() {
  goog.provide('ga_popup_service');

  var module = angular.module('ga_popup_service', []);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', function($compile) {

      var Popup = function() {};

      Popup.prototype.open = function(scope, options) {

        if (!scope || !options || !options.content) {
          return;
        }

        // We create a new scope for easily destroy it
        // then we attch it the popup options
        this.scope = scope.$new();
        this.scope.options = options;

        // Add the popup element with its content to the HTML page
        this.element = angular.element(
          '<div ga-popup ' +
               'ga-popup-options="options" ' +
               'ga-draggable=".ga-popup-title">' +
             options.content +
          '</div>'
        );
        $(document.body).append(this.element);

        // Build the popup directive
        var me = this;
        this.scope.options.close = function() {me.close();};
        $compile(this.element)(this.scope);
        this.scope.$apply();

        // Show the popup
        this.element.show();
      };

      Popup.prototype.close = function() {
        // Destroy the created scope and element
        if (this.element) {
          this.element.remove();
        }

        if (this.scope) {
          this.scope.$destroy();
        }
      };


      return {
        create: function() {
          return new Popup();
        }
      };


    }];

  });
})();
