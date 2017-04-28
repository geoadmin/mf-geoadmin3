describe('ga_topic_directive', function() {
  var element, $rootScope, $compile, $translate, $translateProvider, $q, topics, def;

  beforeEach(function() {
    topics = [{
      id: 'sometopic'
    }, {
      id: 'anothertopic'
    }, {
      id: 'finaltopic'
    }];

    module(function($provide) {
      $provide.value('gaTopic', new (function() {
        var topic = topics[0];
        this.loadConfig = function() {
          return def.promise;
        };
        this.getTopics = function() {
          return topics;
        };
        this.get = function() {
          return topic;
        };
        this.set = function(newTopic) {
          topic = newTopic;
        };
      })());

    });

    module(function($translateProvider) {
      $translateProvider.translations('en',
          {'anothertopic': 'Zombie', 'sometopic': 'Alien', 'finaltopic': 'Énergie'});
    });

    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $translate = $injector.get('$translate');
      $q = $injector.get('$q');
      def = $q.defer();
    });


  });

  describe('uses template by default (desktop)', function() {

    beforeEach(function() {
      element = angular.element('<div ga-topic></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

    it('displays nothing if topics are not loaded', function() {
      var items = element.find('.ga-topic-item');
      expect(items.length).to.be(0);
    });

    describe('loads a topic', function() {

      beforeEach(function() {
        def.resolve(topics);
        $rootScope.$broadcast('gaTopicChange', topics[0]);
        $rootScope.$digest();
      });

      it('reorders correctly the html on lang change event', function() {
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(3);
        expect($(items[0]).text()).to.be('anothertopic');
        expect($(items[1]).text()).to.be('finaltopic');
        expect($(items[2]).text()).to.be('sometopic');
        $translate.use('en');
        $rootScope.$broadcast('translateChangeEnd', {language: 'en'});
        $rootScope.$digest();
        items = element.find('.ga-topic-item');
        expect($(items[0]).text()).to.be('Alien');
        expect($(items[1]).text()).to.be('Énergie');
        expect($(items[2]).text()).to.be('Zombie');
      });

      it('updates correctly the html on first topic change event', function() {
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(3);
        expect($(items[0]).hasClass('ga-topic-active')).to.be(false);
        expect($(items[1]).hasClass('ga-topic-active')).to.be(false);
        expect($(items[2]).hasClass('ga-topic-active')).to.be(true);
      });

      it('updates correctly the html on multiple topic change event', function() {
        $rootScope.$broadcast('gaTopicChange', topics[1]);
        $rootScope.$digest();
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(3);
        expect($(items[0]).hasClass('ga-topic-active')).to.be(true);

        $rootScope.$broadcast('gaTopicChange', topics[0]);
        $rootScope.$digest();
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(3);
        expect($(items[2]).hasClass('ga-topic-active')).to.be(true);
      });

      it('changes topic on click', function() {
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(3);
        var item0 = $(items[0]);
        var item1 = $(items[1]);
        item1.click();
        expect(item0.hasClass('ga-topic-active')).to.be(false);
        expect(item1.hasClass('ga-topic-active')).to.be(true);
      });
    });
  });
});

