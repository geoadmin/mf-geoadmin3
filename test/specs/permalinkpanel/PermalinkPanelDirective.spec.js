describe('ga_permalinkpanel_directive', function() {

  var element;

  beforeEach(function() {

    // load the template
    module('src/permalinkpanel/partials/permalinkpanel.html');

    element = angular.element(
      '<div ga-permalink-panel ga-permalink-panel-options="options"></div>');


    inject(function($rootScope, $compile) {
      $rootScope.options = {
        serviceUrl: 'http://api.geo.admin.ch'
      };
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

  });

  it('creates 5 <img>', function() {
      var img = element.find('img');
      expect(img.length).to.be(5);
  });

 });