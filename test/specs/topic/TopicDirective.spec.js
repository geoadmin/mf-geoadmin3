describe('ga_topic_directive', function() {
  var element, $rootScope, $compile, $q, topics, def;

  beforeEach(function() {
    topics = [{
      id: 'sometopic',
      topicFallback: 'sometopic',
      topicGroup: 1
    }, {
      id: 'anothertopic',
      topicFallback: 'anothertopic',
      topicGroup: 2
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

    inject(function(_$rootScope_, _$compile_, $q) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
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

      it('updates correctly the html on first topic change event', function() {
        var items = element.find('.ga-topic-item');
        var topicGroup1 = element.find('.ga-topic-group-wrapper-1');
        var topicGroup2 = element.find('.ga-topic-group-wrapper-2');
        expect(items.length).to.be(2);
        expect(topicGroup1.length).to.be(1);
        expect(topicGroup2.length).to.be(1);
        expect($(items[0]).hasClass('ga-topic-active')).to.be(true);
        expect($(items[1]).hasClass('ga-topic-active')).to.be(false);
      });

      it('updates correctly the html on multiple topic change event', function() {
        $rootScope.$broadcast('gaTopicChange', topics[1]);
        $rootScope.$digest();
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(2);
        expect($(items[1]).hasClass('ga-topic-active')).to.be(true);

        $rootScope.$broadcast('gaTopicChange', topics[0]);
        $rootScope.$digest();
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(2);
        expect($(items[0]).hasClass('ga-topic-active')).to.be(true);
      });

      it('changes topic on click', function() {
        var items = element.find('.ga-topic-item');
        expect(items.length).to.be(2);
        var item0 = $(items[0]);
        var item1 = $(items[1]);
        item1.click();
        expect(item0.hasClass('ga-topic-active')).to.be(false);
        expect(item1.hasClass('ga-topic-active')).to.be(true);
      });
    });
  });

  describe('uses select box template (mobile)', function() {

    beforeEach(function() {
      element = angular.element('<div ga-topic ga-topic-ui="select"></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    });

    it('displays nothing if topics are not loaded', function() {
      var items = element.find('select option');
      expect(items.length).to.be(1); //empty option
    });

    describe('loads a topic', function() {

      beforeEach(function() {
        def.resolve(topics);
        $rootScope.$broadcast('gaTopicChange', topics[0]);
        $rootScope.$digest();
      });

      it('updates correctly the html on first topic change event', function() {
        var items = element.find('select option');
        expect(items.length).to.be(2);
        expect($(items[0]).attr('selected')).to.be('selected');
        expect($(items[1]).attr('selected')).to.be(undefined);
      });

      it('updates correctly the html on multiple topic change event', function() {
        $rootScope.$broadcast('gaTopicChange', topics[1]);
        $rootScope.$digest();
        var items = element.find('select option');
        expect(items.length).to.be(2);
        expect($(items[1]).attr('selected')).to.be('selected');

        $rootScope.$broadcast('gaTopicChange', topics[0]);
        $rootScope.$digest();
        var items = element.find('select option');
        expect(items.length).to.be(2);
        expect($(items[0]).attr('selected')).to.be('selected');
      });

      it('changes topic on select', function() {
        var items = element.find('select option');
        expect(items.length).to.be(2);
        var item0 = $(items[0]);
        var item1 = $(items[1]);
        item1.click();
        expect(item0.attr('selected')).to.be('selected');
        expect(item1.attr('selected')).to.be(undefined);
      });
    });
  });

});

