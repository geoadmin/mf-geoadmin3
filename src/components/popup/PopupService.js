(function() {
  goog.provide('ga_popup_service');

  var module = angular.module('ga_popup_service', []);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', function($compile) {

      var Popup = function(options) {

        if (!options || !options.content) {
          return;
        }

        // Add the popup element with its content to the HTML page
        this.element = angular.element(
          '<div ga-popup ' +
               'ga-popup-options="options" ' +
               'ga-draggable=".ga-popup-title">' +
             options.content +
          '</div>'
        );

        this.options = options;
      };

      Popup.prototype.open = function(scope) {

        if (!scope || !this.options || !this.options.content) {
          return;
        }

        // We create a new scope for easily destroy it
        // then we attach it the popup options
        this.scope = scope.$new();
        this.scope.options = this.options;

        // Build the popup directive
        var me = this;
        this.scope.options.close = function() {me.close();};
        $compile(this.element)(this.scope);
        this.scope.$apply();

        // Attach the element to the body
        $(document.body).append(this.element);

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
        create: function(options) {
          return new Popup(options);
        }
      };


    }];

  });
})();
