(function() {
  goog.provide('ga_popup_service');

  var module = angular.module('ga_popup_service', []);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', '$rootScope', function($compile, $rootScope) {

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

        var popup = this;
        this.options = options;
        this.options.close = function() {popup.close();};
      };

      Popup.prototype.open = function(scope) {

        // We create a new scope then compile the element
        if (!this.scope) {
          this.scope = (scope || $rootScope).$new();
          this.scope.options = this.options;
          $compile(this.element)(this.scope);
        }

        // Attach the element to the body if needed
        if (this.element.parent().length == 0) {
          $(document.body).append(this.element);
        }

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
          this.scope = null;
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
