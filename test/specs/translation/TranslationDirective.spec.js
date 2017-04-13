describe('ga_translation_directive', function() {
  var element, scope, parentScope, $rootScope, $compile, $gaBrowserSniffer,
      lang = 'rm',
      langs = ['de', 'fr', 'it', 'rm', 'en'];

  var loadDirective = function() {
    parentScope = $rootScope.$new();
    var tpl = '<div ga-translation-selector ga-translation-selector-options="options"></div>';
    element = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = element.isolateScope();
  };
  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaLang', {
        get: function() {
          return lang;
        },
        set: function(newLang) {
          lang = (langs.indexOf(newLang) != -1) ?
              newLang : 'de';
        }
      });
      $provide.value('gaTopic', {});
      $provide.value('gaBrowserSniffer', {
        mobile: false
      });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    });
  });

  describe('when no langs defined', function() {

    beforeEach(function() {
      $rootScope.options = {
        langs: undefined
      };
      loadDirective();
    });

    it('displays nothing', function() {
      var items = element.find('a');
      expect(items.length).to.be(0);
    });
  });

  describe('loads default langs from controller (desktop template)', function() {

    beforeEach(function() {
      $rootScope.options = {
        langs: langs
      };
      loadDirective();
    });

    it('updates correctly the html', function() {
      var items = element.find('a');
      expect(items.length).to.be(5);
      var itemSelected = element.find('a.ga-lang-selected');
      expect(itemSelected.length).to.be(1);
      expect($(items[3]).hasClass('ga-lang-selected')).to.be(true);
    });

    it('updates correctly the html on multiple $translate change event', function() {
      $rootScope.$broadcast('$translateChangeEnd', {language: 'fr'});
      $rootScope.$digest();
      var items = element.find('a');
      var itemSelected = element.find('a.ga-lang-selected');
      expect(itemSelected.length).to.be(1);
      expect($(items[1]).hasClass('ga-lang-selected')).to.be(true);

      $rootScope.$broadcast('$translateChangeEnd', {language: 'it'});
      $rootScope.$digest();
      items = element.find('a');
      itemSelected = element.find('a.ga-lang-selected');
      expect(itemSelected.length).to.be(1);
      expect($(items[2]).hasClass('ga-lang-selected')).to.be(true);
    });

    it('changes lang on click', function() {
      var items = element.find('a');
      var itemSelected = element.find('a.ga-lang-selected');
      expect(itemSelected.length).to.be(1);
      var item0 = $(items[0]);
      var item1 = $(items[1]);
      item0.click();
      expect(item0.hasClass('ga-lang-selected')).to.be(true);
      item1.click();
      expect(item1.hasClass('ga-lang-selected')).to.be(true);
    });
  });

  describe('uses select box template (mobile)', function() {

    beforeEach(function() {
      gaBrowserSniffer.mobile = true;
      loadDirective();
    });

    it('displays nothing if no langs defined', function() {
      var items = element.find('select option');
      expect(items.length).to.be(1); //empty option
    });
  });

  describe('load default langs from controller (mobile template)', function() {

    beforeEach(function() {
      lang = 'rm';
      gaBrowserSniffer.mobile = true;
      $rootScope.options = {
        langs: langs
      };
      loadDirective();
    });

    it('updates correctly the html', function() {
      var items = element.find('select option');
      expect(items.length).to.be(5);
      var itemSelected = element.find('option[selected]');
      expect(itemSelected.length).to.be(1);
      expect(itemSelected.attr('value')).to.be('string:rm');
    });

    it('updates correctly the html on multiple $translate change event', function() {
      $rootScope.$broadcast('$translateChangeEnd', {language: 'fr'});
      $rootScope.$digest();
      var items = element.find('select option[value]');
      expect($(items[1]).attr('selected')).to.be('selected');

      $rootScope.$broadcast('$translateChangeEnd', {language: 'it'});
      $rootScope.$digest();
      items = element.find('select option[value]');
      expect($(items[2]).attr('selected')).to.be('selected');
    });
  });
});

