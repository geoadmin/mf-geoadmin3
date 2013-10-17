describe('ga_popup_directive', function() {
  var element;
  
  beforeEach(function() {
    element = angular.element(
      '<div ga-popup="popupShown" ga-popup-options="{title:\'Title popup\'}"></div>');
    inject(function($rootScope, $compile) {
      $compile(element)($rootScope);
      $rootScope.$digest();
    });
  });

  it('creates html elements', function() {
    expect(element.hasClass('ga-popup')).to.be(true);
    
    var elt = element.find('.ga-popup-title');
    expect(elt.length).to.be(1);
    
    elt = elt.find('.close');
    expect(elt.length).to.be(1);
    
    elt = element.find('.ga-popup-content[ng-transclude]');
    expect(elt.length).to.be(1);
  });
  
  it('shows/closes the popup with scope property', inject(function($rootScope) {
    expect(element.css('display')).to.be('');

    $rootScope.popupShown = true;
    $rootScope.$digest();
    expect(element.css('display')).to.be('block');

    $rootScope.popupShown = false;
    $rootScope.$digest();
    expect(element.css('display')).to.be('none');
  }));
  
  it('closes the popup with close button', inject(function($rootScope) {
    $rootScope.popupShown = true;
    $rootScope.$digest();
    expect(element.css('display')).to.be('block');
    
    element.find('.close').click();
    expect(element.css('display')).to.be('none');
    expect($rootScope.popupShown).to.be(false);
  }));
 
  it('displays the title available in options', inject(function($rootScope) {
    expect(element.find('.ga-popup-title > span').html()).to.be('Title popup');
  }));
});

