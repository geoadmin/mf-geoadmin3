(function() {
  goog.provide('ga_popup_service');

  var module = angular.module('ga_popup_service', []);

  module.provider('gaPopup', function() {

    this.$get = ['$compile', function($compile) {

      var Popup = function() {
        this.popupElt = angular.element(
        '<div ga-draggable=".popover-title" class="popover bottom ga-popup">' +
          '<div class="arrow"></div>' +
          '<div class="popover-inner">' +
            '<h4 class="popover-title">' +
              '<span translate>{{popupTitle}}</span>' +
              '<button type="button" class="close" ng-click="closePopup()">' +
              '×</button>' +
            '</h4>' +
            '<div class="popover-content" ng-bind-html-unsafe="popupContent">' +
            '</div>' +
          '</div>' +
        '</div>'
        );
      };

      Popup.prototype.open = function(template, scope) {
        scope.popupTitle = 'TEstTitle';
        scope.popupContent = template;
        var popup = this.popupElt;
        scope.closePopup = function() {popup.remove()};

        if (this.popupElt.parent().length == 0) {
          $(document.body).append(this.popupElt);
          $compile(this.popupElt)(scope);
        }

        scope.$apply();
        this.popupElt.css({
          'display': 'block',
          left: (scope.popupPositionX - (this.popupElt.width() / 2)) + 'px',
          top: (scope.popupPositionY + (11 / 2)) + 'px'
        });
      };

      Popup.prototype.close = function() {
        this.popupElt.remove();

      };


      return new Popup();
    }];

  });
})();
