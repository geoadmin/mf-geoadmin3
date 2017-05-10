describe('ga_feedback_directive', function() {

  var map, elt, scope, parentScope, options, gaPermalink, $httpBackend, $rootScope,
      $compile, gaUrlUtils, $timeout, gaExportKml, gaGlobalOptions;

  var loadDirective = function(map, options) {
    parentScope = $rootScope.$new();
    parentScope.map = map;
    parentScope.options = options;
    var tpl = '<div ga-feedback ga-feedback-options="options" ga-feedback-map="map"></div>';
    elt = $compile(tpl)(parentScope);
    $rootScope.$digest();
    scope = elt.isolateScope();
  };

  var provideServices = function($provide) {
    $provide.value('gaPermalink', {
      getHref: function() {
        return 'http://permalink.com';
      },
      getParams: function() {
        return {
          'param1': 'value1'
        };
      }
    });
    $provide.value('gaBrowserSniffer', {});
    $provide.value('gaLayers', {});
    $provide.value('gaTopic', {});
    $provide.value('gaLang', {});
  };

  var injectServices = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
    gaPermalink = $injector.get('gaPermalink');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    gaUrlUtils = $injector.get('gaUrlUtils');
    gaExportKml = $injector.get('gaExportKml');
    gaGlobalOptions = $injector.get('gaGlobalOptions');
  };

  beforeEach(function() {
    module(function($provide) {
      provideServices($provide);
    });

    inject(function($injector) {
      injectServices($injector);
    });

    map = new ol.Map({});
    map.setSize([600, 300]);
    map.getView().fit([-20000000, -20000000, 20000000, 20000000]);
    options = {
      feedbackUrl: 'http://feedback.com',
      broadcastLayer: false
    };
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $timeout.verifyNoPendingTasks();
  });

  it('check feedback fields', function() {
    loadDirective(map, options);
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();
    $timeout.flush();
    expect(elt.find('p a[href]').attr('href')).to.be('http://permalink.com');
    expect(elt.find('input[type=email]').length).to.be(1);
    expect(elt.find('textarea').length).to.be(1);
    expect(elt.find('button[type=submit]').length).to.be(1);
    expect(elt.find('input[type=file]').length).to.be(1);
    expect(elt.find('div.progress').length).to.be(1);
  });

  it('sends a post request', function() {
    loadDirective(map, options);
    var textArea = elt.find('textarea');
    textArea.val('dummyFeedback');
    textArea.trigger('input');
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();
    $timeout.flush();

    var expectedUrl = options.feedbackUrl;
    $httpBackend.whenPOST(expectedUrl).respond('success');
    var button = elt.find('button[type=submit]');
    expect(button.attr('type')).to.be('submit');
    button.click();
    $httpBackend.flush();
    $timeout.flush();
  });

  describe('On IE device', function() {

    beforeEach(function() {
      gaBrowserSniffer.msie = 9;
      loadDirective(map, options);
      $timeout.flush();
    });

    it('check feedback fields for IE9', function() {
      expect(elt.find('input[type=email]').length).to.be(1);
      expect(elt.find('textarea').length).to.be(1);
      expect(elt.find('button[type=submit]').length).to.be(1);
      expect(elt.find('div[ng-show="!isIE9"]').attr('class')).to.be('ng-hide');
      expect(elt.find('div.progress').attr('class').split(' ')[3]).to.be('ng-hide');
    });
  });
});

