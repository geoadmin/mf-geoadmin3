describe('ga_translation_directive', function() {
  var element, $rootScope, $compile, $gaBrowserSniffer, def, gaTopic;
      lang = 'rm',
      langs = ['de', 'fr', 'it', 'rm', 'en'],
      topics = [{
          id: '5lang',
          langs: ['de', 'fr', 'it', 'rm', 'en']
      }, {
        id: '4lang',
        langs: ['de', 'fr', 'en', 'it']
      }, {
        id: '3lang',
        langs: ['de', 'fr', 'en']
      }, {
        id: '2lang',
        langs: ['de', 'fr']
      }, {
        id: 'noLang',
        langs: []
      }];

  beforeEach(function() {

    module(function($provide) {
      $provide.value('gaLang', {
        get: function() {
          return lang;
        },
        set: function(newLang) {
          lang = (langs.indexOf(newLang) != -1) ?
              newLang : gaGlobalOptions.translationFallbackCode;
        }
      });
      $provide.value('gaBrowserSniffer', {
        mobile: false
      });
      var activeTopic = topics[topics.length - 1];
      $provide.value('gaTopic', {
        loadConfig: function() {
          return def.promise;
        },
        get: function() {
          return activeTopic;
        },
        set: function(topic) {
          activeTopic = topic;
          $rootScope.$broadcast('gaTopicChange', topic);
        }
      });
    });

    inject(function(_$rootScope_, _$compile_, $q, _gaGlobalOptions_, _gaBrowserSniffer_, _gaTopic_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      def = $q.defer();
      def.resolve();
      gaGlobalOptions = _gaGlobalOptions_;
      gaBrowserSniffer = _gaBrowserSniffer_;
      gaTopic = _gaTopic_;
    });
    gaGlobalOptions.translationFallbackCode = 'de';
  });
   
  describe('uses template by default (desktop)', function() {

    beforeEach(function() {
      element = angular.element('<div ga-translation-selector ga-translation-selector-options="options"></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    });
 
    it('displays nothing if no langs defined', function() {
      var items = element.find('a');
      expect(items.length).to.be(0);
    });
  });

  describe('load default langs from controller (desktop template)', function() {

    beforeEach(function() {
      $rootScope.options = {
        langs: langs
      };
      element = angular.element('<div ga-translation-selector ga-translation-selector-options="options"></div>');
      $compile(element)($rootScope);
      gaTopic.set(topics[0]);
      $rootScope.$digest();
    });

    it('updates correctly the html', function() {
      var items = element.find('a');
      expect(items.length).to.be(5);
      var itemSelected = element.find('a.ga-lang-selected');
      expect(itemSelected.length).to.be(1);
      expect($(items[3]).hasClass('ga-lang-selected')).to.be(true);
    });

    it('updates correctly the html on multiple topic change event', function() {
      gaTopic.set(topics[1]);
      $rootScope.$digest();
      var items = element.find('a');
      expect(items.length).to.be(4);

      gaTopic.set(topics[2]);
      $rootScope.$digest();
      items = element.find('a');
      expect(items.length).to.be(3);
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
      element = angular.element('<div ga-translation-selector ga-translation-selector-options="options"></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
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
      element = angular.element('<div ga-translation-selector ga-translation-selector-options="options"></div>');
      $compile(element)($rootScope);
      gaTopic.set(topics[0]);
      $rootScope.$digest();
    });

    it('updates correctly the html', function() {
      var items = element.find('select option');
      expect(items.length).to.be(5);
      var itemSelected = element.find('option[selected]');
      expect(itemSelected.length).to.be(1);
      expect(itemSelected.attr('value')).to.be('string:rm');
    });

    it('updates correctly the html on multiple topic change event', function() {
      gaTopic.set(topics[1]);
      $rootScope.$digest();
      // In phantomjs an empty option is added but not in a real browser
      var items = element.find('select option[value]');
      expect(items.length).to.be(4); 

      gaTopic.set(topics[2]);
      $rootScope.$digest();
      items = element.find('select option[value]');
      expect(items.length).to.be(3);
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

    it('changes lang on click', function() {
      // TODO: Fix this. Works for Topic driective but not for this one
      /*var items = element.find('select option[value]');
      var item0 = $(items[0]);
      var item1 = $(items[1]);
      item0.click();
      $rootScope.$digest();
      console.log(item0);
      expect(item0.attr('selected')).to.be('selected');
      item1.click();
      expect(item1.attr('selected')).to.be('selected');*/
    });
  });
});

