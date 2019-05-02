/* eslint-disable max-len */
describe('ga_translation_service', function() {

  describe('gaLang', function() {
    var gaLang, $httpBackend, $rootScope, gaGlobalOptions, langPermalink, gaPermalink,
      navUserLanguage, navLanguage, cpt = 0;

    var injectServices = function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
        gaLang = $injector.get('gaLang');
        gaPermalink = $injector.get('gaPermalink');
      });

      gaLang.init();

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
    };

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
        $provide.value('$window', {
          navigator: {
            userLanguage: navUserLanguage,
            language: navLanguage
          },
          addEventListener: function() {},
          document: window.document
        });
        $provide.value('gaTopic', {
          getTopics: function() {
            return [];
          },
          get: function(params) {
            return undefined;
          }
        });
        $provide.value('gaPermalink', {
          getParams: function() {
            return {
              lang: langPermalink
            };
          },
          updateParams: function(params) {
            langPermalink = params.lang;
          }
        });
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('lang defined by navigator', function() {

      beforeEach(function() {
        langPermalink = null;
        navUserLanguage = null;
        navLanguage = null;
      });

      ['rm', 'rm-CH'].forEach(function(l) {
        it('uses navigator.userLanguage (' + l + ') as default language', function() {
          navUserLanguage = l;
          injectServices();
          expect(gaLang.get()).to.be('rm');
          var expectedUrl = 'locales/rm.json';
          $httpBackend.expectGET(expectedUrl);
          $httpBackend.flush();
          expect(cpt).to.be(1);
          expect(gaPermalink.getParams().lang).to.be('rm');
        });
      });

      ['it', 'it-CH'].forEach(function(l) {
        it('uses navigator.language (' + l + ')  as default language', function() {
          navLanguage = l;
          injectServices();
          expect(gaLang.get()).to.be('it');
          var expectedUrl = 'locales/it.json';
          $httpBackend.expectGET(expectedUrl);
          $httpBackend.flush();
          expect(cpt).to.be(1);
          expect(gaPermalink.getParams().lang).to.be('it');
        });
      });
    });

    describe('lang defined from permalink', function() {

      it('defines a language in the permalink', function() {
        langPermalink = 'rm';
        injectServices();
        expect(gaLang.get()).to.be(langPermalink);
        var expectedUrl = 'locales/' + langPermalink + '.json';
        $httpBackend.expectGET(expectedUrl);
        $httpBackend.flush();
        expect(cpt).to.be(1);
      });

      it('defines a wrong language in the permlink then load the default language', function() {
        langPermalink = 'langnotexisting';
        injectServices();
        expect(gaLang.get()).to.be(gaGlobalOptions.translationFallbackCode);
        $httpBackend.expectGET('locales/' + gaGlobalOptions.translationFallbackCode + '.json');
        $httpBackend.flush();
        expect(gaLang.get()).to.be(gaGlobalOptions.translationFallbackCode);
        expect(cpt).to.be(1);
        expect(gaPermalink.getParams().lang).to.be(gaGlobalOptions.translationFallbackCode);
      });

      it('sets a language', function() {
        langPermalink = 'fr';
        injectServices();
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
});
