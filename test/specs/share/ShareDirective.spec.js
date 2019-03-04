/* eslint-disable max-len */
describe('ga_share_directive', function() {

  function compileElement() {
    var element = angular.element(
        '<div ga-share ga-share-active=active ga-share-options="options"></div>');

    inject(function($rootScope, $compile) {
      $rootScope.options = {
        serviceUrl: 'https://api.geo.admin.ch',
        iframeSizes: [{
          label: 'small_size',
          value: [1, 1]
        }]
      };
      $rootScope.active = false;
      $compile(element)($rootScope);
      $rootScope.$digest();
    });
    return element;
  }

  describe('when desktop', function() {
    var element;
    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaBrowserSniffer', {
          android: false,
          ios: false
        });
      });

      element = compileElement();
    });

    it('creates 5 <i>', function() {
      var icon = element.find('.ga-share-icons i');
      expect(icon.length).to.be(4);
    });
  });

  describe('when android', function() {
    var element;
    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaBrowserSniffer', {
          android: true,
          ios: false
        });
      });

      element = compileElement();
    });

    it('creates 6 <i>', function() {
      var icon = element.find('.ga-share-icons i');
      expect(icon.length).to.be(5);
    });
  });

  describe('when ios', function() {
    var element;
    beforeEach(function() {
      module(function($provide) {
        $provide.value('gaBrowserSniffer', {
          android: false,
          ios: true
        });
      });

      element = compileElement();
    });

    it('creates 6 <i>', function() {
      var icon = element.find('.ga-share-icons i');
      expect(icon.length).to.be(5);
    });
  });
});
