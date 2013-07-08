describe('ga_permalinkpanel_directive', function() {

  var element;

  beforeEach(function() {

    // load the template
    module('src/permalinkpanel/partials/permalinkpanel.html');

    element = angular.element(
      '<div ga-permalink-panel></div>');


    inject(function($rootScope, $compile) {
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

  });

  it('creates 6 <img>', function() {
      var img = element.find('img');
      expect(img.length).to.be(6);
  });

 });