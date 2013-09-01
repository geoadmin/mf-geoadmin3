describe('ga_share_directive', function() {

  var element;

  beforeEach(function() {

    element = angular.element(
      '<div ga-share ga-share-options="options"></div>');

    inject(function($rootScope, $compile) {
      $rootScope.options = {
        serviceUrl: 'http://api.geo.admin.ch'
      };
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

  });

  it('creates 5 <i>', function() {
      var icon = element.find('.share-icons i');
      expect(icon.length).to.be(5);
  });

  it('checks the permalink value', function() {
      var input = element.find('input');
      expect(input.length).to.be(1);
      expect(input[0].value).to.contain('http://');
  });

 });

