/* eslint-disable max-len */
describe('ga_popup_service', function() {
  var popup, rootScope;

  beforeEach(function() {
    var gaPopup;

    module(function($provide) {
      $provide.value('gaLang', {
        get: function() {
          return 'fr';
        }
      });
    });

    inject(function($injector) {
      gaPopup = $injector.get('gaPopup');
      rootScope = $injector.get('$rootScope');
    });

    popup = gaPopup.create({
      className: 'custom-class',
      content: '<div> content </div>'
    });
    rootScope.$digest();
  });

  it('creates a popup with a content', function() {
    expect(popup.scope).not.to.be(null);
    expect(popup.element).not.to.be(null);
    expect(popup.scope.toggle).to.be(false);
    expect(popup.element.css('display')).to.be('none');
    expect(popup.element.hasClass('custom-class')).to.be(true);
    expect(popup.element.find('.ga-popup-content').html()).to.be('<div class="ng-scope"> content </div>');
  });

  it('opens/closes/destroys a popup', function() {
    popup.open();
    rootScope.$digest();
    expect(popup.scope.toggle).to.be(true);
    expect(popup.element.css('display')).to.be('block');

    popup.close();
    rootScope.$digest();
    expect(popup.scope.toggle).to.be(false);
    expect(popup.element.css('display')).to.be('none');

    popup.open();
    rootScope.$digest();
    expect(popup.scope.toggle).to.be(true);
    expect(popup.element.css('display')).to.be('block');

    popup.destroy();
    expect(popup.scope).to.be(null);
    expect(popup.element).to.be(null);
  });
});
