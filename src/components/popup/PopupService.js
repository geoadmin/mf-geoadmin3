(function() {
  goog.provide('ga_popup_service');

  goog.require('ga_draggable_directive');

  var module = angular.module('ga_popup_service', [
    'ga_draggable_directive'
  ]);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', '$rootScope', function($compile, $rootScope) {

      var Popup = function(options, scope) {

        var classString = '';
        if (options.popupClass) {
          classString = 'class="' + options.popupClass + '" ';
        }
        // Create the popup element with its content to the HTML page
        var element = angular.element(
          '<div ga-popup ' +
               'ga-popup-options="options" ' +
               classString +
               'ga-draggable=".ga-popup-title">' +
               options.content +
          '</div>'
        );

        // Pass some popup functions for clients to be used in content
        var popup = this;
        options.open = function() {popup.open();};
        options.close = function() {popup.close();};
        options.destroy = function() {popup.destroy();};

        // Create scope, compile and link
        this.scope = (scope || $rootScope).$new();
        this.scope.options = options;
        this.element = $compile(element)(this.scope);

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
