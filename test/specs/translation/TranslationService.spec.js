describe('ga_translation_service', function() {
  var gaLang, $httpBackend, $rootScope, gaGlobalOptions, langPermalink, gaPermalink,
      navLang = (window.navigator.userLanguage || window.navigator.language).split('-')[0],
      topics = [], cpt = 0,
      topicsLoaded = [{
        "langs": "somelang,de,fr,it",
        "selectedLayers": [],
        "backgroundLayers": [
          "ch.swisstopo.pixelkarte-farbe",
          "ch.swisstopo.pixelkarte-grau",
          "ch.swisstopo.swissimage"
        ],
        "id": "sometopic",
        "showCatalog": true
      }, {
        "langs": "somelang,de,fr",
        "selectedLayers": [],
        "backgroundLayers": [
          "ch.swisstopo.pixelkarte-grau",
          "ch.swisstopo.pixelkarte-farbe",
          "ch.swisstopo.swissimage"
        ],
        "id": "anothertopic",
        "showCatalog": true
      }];

  beforeEach(function() {
    // We redefine the $translateProvider
    module(function($translateProvider, gaGlobalOptions) {
      $translateProvider.forceAsyncReload(true);
      $translateProvider.useStaticFilesLoader({
        prefix: 'locales/',
        suffix: '.json'
      });
      $translateProvider.cloakClassName('ng-cloak');
      // TODO: Use $snaitize instead in the future
      // see http://angular-translate.github.io/docs/#/guide/19_security
      $translateProvider.useSanitizeValueStrategy(null);
    });

    module(function($provide) {
      $provide.value('gaTopic', {
        getTopics: function() {
          return topics;
        },
        get: function(params){
          return topics[0];
        }
      });
      $provide.value('gaPermalink', {
        getParams: function() {
          return {
            lang: langPermalink
          };
        },
        updateParams: function(params){
          langPermalink = params.lang;
        }
      });
    });
    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      gaLang = $injector.get('gaLang');
      gaPermalink = $injector.get('gaPermalink');
    });
    cpt = 0;
    $rootScope.$on('$translateChangeEnd', function(evt, newLang) {
      cpt++;
    });
    $httpBackend.whenGET('locales/somelang.json').respond({});
    $httpBackend.whenGET('locales/de.json').respond({});
    $httpBackend.whenGET('locales/fr.json').respond({});
    $httpBackend.whenGET('locales/en.json').respond({});
    $httpBackend.whenGET('locales/it.json').respond({});
    $httpBackend.whenGET('locales/rm.json').respond({});
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('lang defined by navigator', function() {
    it('uses navigator language as default language', function() {
      expect(gaLang.get()).to.be(navLang);
      var expectedUrl = 'locales/' + navLang + '.json';
      $httpBackend.expectGET(expectedUrl);
      $httpBackend.flush();
      expect(cpt).to.be(1);
      expect(gaPermalink.getParams().lang).to.be(navLang);

      // For the next test
      langPermalink = 'rm';
    });
  });
  
  describe('lang defined from permalink', function() {
    beforeEach(function() {
      cpt = 0;
    });

    it('defines a language in the permalink (topic not yet loaded)', function() {
      expect(gaLang.get()).to.be(langPermalink);
      var expectedUrl = 'locales/' + langPermalink + '.json';
      $httpBackend.expectGET(expectedUrl);
      $httpBackend.flush();
      expect(cpt).to.be(1);
      
      // For the next test
      langPermalink = 'langnotexisting';
    });

    it('defines a wrong language in the permlink then load the default language (topic not yet loaded)', function() {
      expect(gaLang.get()).to.be(gaGlobalOptions.translationFallbackCode);
      $httpBackend.expectGET('locales/' + gaGlobalOptions.translationFallbackCode + '.json');
      $httpBackend.flush();
      expect(gaLang.get()).to.be(gaGlobalOptions.translationFallbackCode);
      expect(cpt).to.be(1);
      expect(gaPermalink.getParams().lang).to.be(gaGlobalOptions.translationFallbackCode);

      // We set a lang not available in the topic
      langPermalink = 'rm';
    });

    it('switches to default language if the current one is not allowed by the topic', function() {
      expect(gaLang.get()).to.be(langPermalink);
      $httpBackend.expectGET('locales/' + langPermalink + '.json');
      $httpBackend.flush();
      expect(gaPermalink.getParams().lang).to.be(langPermalink);
      topics = topicsLoaded;
      $rootScope.$broadcast('gaTopicChange', topicsLoaded[0]); 
      $httpBackend.expectGET('locales/' + gaGlobalOptions.translationFallbackCode + '.json');
      $httpBackend.flush();
      expect(gaPermalink.getParams().lang).to.be(gaGlobalOptions.translationFallbackCode);
      expect(cpt).to.be(2);
    });

    it('sets a language', function() {
      expect(gaLang.get()).to.be(langPermalink);
      $httpBackend.expectGET('locales/' + langPermalink + '.json');
      $httpBackend.flush();
      expect(gaPermalink.getParams().lang).to.be(langPermalink);
      gaLang.set('de');
      $httpBackend.expectGET('locales/de.json');
      $httpBackend.flush();
      expect(gaPermalink.getParams().lang).to.be('de');
      expect(cpt).to.be(2);
      // If we set the same language, nothing happens
      gaLang.set('de');
      expect(gaPermalink.getParams().lang).to.be('de');
      expect(cpt).to.be(2);
    });
  });
});

