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

    var elt = element.find('.popover-title');
    expect(elt.length).to.be(1);

    var title = elt.find('.ga-popup-title');
    expect(title.length).to.be(1);

    var close = elt.find('.icon-remove');
    expect(close.length).to.be(1);

    var reduce = elt.find('.icon-minus');
    expect(reduce.length).to.be(1);

    var print = elt.find('.icon-print');
    expect(print.length).to.be(0);

    var help = elt.find('.icon-question-circle');
    expect(help.length).to.be(0);

    elt = element.find('.ga-popup-content');
    expect(elt.length).to.be(1);

  });

  it('shows/closes the popup with scope property', inject(function($rootScope) {
    expect(element.css('display')).to.be('none'); // hidden by default

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

    element.find('.icon-remove').click();
    expect(element.css('display')).to.be('none');
    expect($rootScope.popupShown).to.be(false);
  }));

  it('increases z-index on click', inject(function($rootScope) {
    $rootScope.popupShown = true;
    $rootScope.$digest();
    expect(element.css('display')).to.be('block');

    element.find('.ga-popup-content').click();
    var zIndex = parseInt(element.css('z-index'));
    element.find('.ga-popup-content').click();
    var newZIndex = parseInt(element.css('z-index'));
    expect(newZIndex > zIndex).to.be(true);

    element.find('.ga-popup-title').click();
    var newestZIndex = parseInt(element.css('z-index'));
    expect(newestZIndex > newZIndex).to.be(true);
  }));

  it('displays the title available in options', inject(function($rootScope) {
    expect(element.find('.ga-popup-title').html()).to.be('Title popup');
  }));
});

