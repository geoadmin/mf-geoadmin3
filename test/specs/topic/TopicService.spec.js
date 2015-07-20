describe('ga_topic_service', function() {
  var gaTopic, $httpBackend, $rootScope, gaGlobalOptions, topicPermalink, gaPermalink,
      expectedUrl = 'http://api3.geo.admin.ch/123456/rest/services',
      topics = [{
        "langs": "de,fr,it",
        "selectedLayers": [],
        "backgroundLayers": [
          "ch.swisstopo.pixelkarte-farbe",
          "ch.swisstopo.pixelkarte-grau",
          "ch.swisstopo.swissimage"
        ],
        "id": "sometopic",
        "showCatalog": true
      }, {
        "langs": "de,fr",
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
    module(function($provide) {
      $provide.value('gaPermalink', {
        getParams: function() {
          return {
            topic: topicPermalink
          };
        },
        updateParams: function(params){
          topicPermalink = params.topic;
        }
      });
    });
    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      gaGlobalOptions = $injector.get('gaGlobalOptions');
      gaTopic = $injector.get('gaTopic');
      gaPermalink = $injector.get('gaPermalink');
    });
    $httpBackend.whenGET(expectedUrl).respond({
      "topics": topics
    });
    $httpBackend.expectGET(expectedUrl);
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('topic not defined in permalink', function() {
    var cpt;

    beforeEach(function() {
      cpt = 0;
      $rootScope.$on('gaTopicChange', function() {
        cpt++;
      });
      $httpBackend.flush();
    });

    it('has loaded topics', function() {
      expect(gaTopic.getTopics().length).to.be(2);
    });

    it('has loaded the default topic', function() {
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(cpt).to.be(1);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);
    });

    it('sets correctly a new topic', function() {
      gaTopic.set(topics[1]);
      expect(gaTopic.get().id).to.be(topics[1].id);
      expect(cpt).to.be(2);
      expect(gaPermalink.getParams().topic).to.be(topics[1].id);

      gaTopic.setById('sometopic');
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(cpt).to.be(3);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);
    });

    it('does nothing when trying to set a wrong topic', function() {
      gaTopic.set({id:'topicnotexisting'});
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(cpt).to.be(1);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);

      gaTopic.setById('topicnotexisting');
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(cpt).to.be(1);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);
    });

    it('forces the reload of the current topic', function() {
      gaTopic.set(topics[0], true);
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(cpt).to.be(2);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);

      gaTopic.setById('sometopic', true);
      expect(gaTopic.get().id).to.be(topics[0].id);
      expect(gaPermalink.getParams().topic).to.be(topics[0].id);
      expect(cpt).to.be(3);
    });
  });

  describe('topic defined from permalink', function() {
    beforeEach(function() {
      topicPermalink = 'anothertopic';
      $httpBackend.flush();
    });

    it('loads the topic from permalink if exist', function() {
      expect(gaTopic.get().id).to.be(topics[1].id);
      expect(gaPermalink.getParams().topic).to.be(topics[1].id);
    });
  });

  describe('wrong topic defined in permalink', function() {
    beforeEach(function() {
      topicPermalink = 'topicnotexisting';
      $httpBackend.flush();
    });

    it('loads the default topic if the topic in permalink doesn t exist', function() {
      expect(gaTopic.get().id).to.be(gaGlobalOptions.defaultTopicId);
      expect(gaPermalink.getParams().topic).to.be(gaGlobalOptions.defaultTopicId);
    });
  });
});

