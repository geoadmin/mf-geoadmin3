describe('ga_popup_service', function() {
  var popup;

  beforeEach(function() {
    var gaPopup;

    inject(function($injector) {
      gaPopup = $injector.get('gaPopup');
    });
    
    popup = gaPopup.create({
      className: 'custom-class',
      content: '<div> content </div>'
    });

  });
  
  it('creates a popup with a content', function() {
    expect(popup.element.hasClass('ga-popup')).to.be(true);
    expect(popup.element.hasClass('custom-class')).to.be(true);
    expect(popup.element.find('.ga-popup-content').html()).to.be('<div class="ng-scope"> content </div>');
    expect(popup.destroyed).to.be(false);
  });
  
  it('opens/closes a popup', function() {
    popup.open();
    expect(popup.element.css('display')).to.be('block');
    popup.close(); 
    expect(popup.element).to.be(null);
    expect(popup.scope).to.be(null);
    expect(popup.destroyed).to.be(true);
  });

  it('doesn\'t destroy on close', function() {
    popup.scope.options.destroyOnClose = false;
    popup.open();
    expect(popup.element.css('display')).to.be('block');
    popup.close(); 
    expect(popup.element.css('display')).to.be('none');
    expect(popup.scope).not.to.be(null);
    expect(popup.destroyed).to.be(false);
    popup.destroy();
    expect(popup.element).to.be(null);
    expect(popup.scope).to.be(null);
    expect(popup.destroyed).to.be(true);
  });
});
