(function() {
  goog.provide('ga_popup_service');

  var module = angular.module('ga_popup_service', []);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', function($compile) {

      var Popup = function() {
           };

      Popup.prototype.open = function(options) {

        // Destroy the popup if it exists
        this.close();

        if (!options || !options.scope || !options.content) {
          return;
        }


        // Add the popup element to the HTML page
        var popupElt = angular.element(
          '<div ga-popup></div>'
        );
        $(document.body).append(popupElt);


        //Build the popup
        popupElt.html(options.content);

        var me = this;
        var scope = options.scope;
        scope.popup = options;
        scope.popup.close = function() {me.close();};
        $compile(popupElt)(scope);
        scope.$apply();

        // Save the created scope and element
        this.popupElt = popupElt.closest('.ga-popup');
        this.popupScope = scope.$$childTail;
      };

      Popup.prototype.close = function() {
        // Destroy the created scope and element
        if (this.popupElt) {
          this.popupElt.remove();
        }

        if (this.popupScope) {
          this.popupScope.$destroy();
        }
      };


      return new Popup();


    }];

  });
})();
