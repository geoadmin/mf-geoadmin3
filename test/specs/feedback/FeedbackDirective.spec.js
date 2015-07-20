describe('ga_feedback_directive', function() {

  var map,
      element,
      gaPermalink,
      encodeUriQuery,
      $httpBackend,
      $rootScope,
      $compile;

  function compileEl($rootScope, $compile, element) {
    $compile(element)($rootScope);
    $rootScope.$digest();
  }

  beforeEach(function() {
    module(function($provide) {
      var mockGetHref = {
        getHref: function() {
          return 'http://permalink.com';
        },
        getParams: function() {
          return {
            'param1': 'value1'
          };
        }

      };
      $provide.value('gaPermalink', mockGetHref);
      $provide.value('gaBrowserSniffer', {});
      $provide.value('gaLayers', {});
      $provide.value('gaTopic', {});
      $provide.value('gaLang', {});
    });

    element = angular.element(
        '<div ga-feedback ' +
             'ga-feedback-options="options"' +
             'ga-feedback-map="map">' +
        '</div>')

    inject(function($injector, gaUrlUtils) {
      map = new ol.Map({});
      map.setSize([600,300]);
      map.getView().fitExtent([-20000000, -20000000, 20000000, 20000000],
          map.getSize());
      gaPermalink = $injector.get('gaPermalink');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $rootScope.map = map;
      $compile = $injector.get('$compile');
      $rootScope.options = {
        feedbackUrl: 'http://feedback.com',
        showExport: false,
        broadcastLayer: false
      };
      encodeUriQuery = gaUrlUtils.encodeUriQuery;
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('check feedback fields', function() {
    compileEl($rootScope, $compile, element);
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();
    expect(element.find('p a[href]').attr('href')).to.be('http://permalink.com');
    expect(element.find('input[type=email]').length).to.be(1);
    expect(element.find('textarea').length).to.be(1);
    expect(element.find('button[type=submit]').length).to.be(1);
    expect(element.find('input[type=file]').length).to.be(1);
    expect(element.find('div.progress').length).to.be(1);
  });

  it('sends a post request', function() {
    compileEl($rootScope, $compile, element);
    var textArea = element.find('textarea');
    textArea.val('dummyFeedback');
    textArea.trigger('input');
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();

    var expectedUrl = $rootScope.options.feedbackUrl;
    $httpBackend.whenPOST(expectedUrl).respond('success');
    var button = element.find('button[type=submit]');
    expect(button.attr('type')).to.be('submit');
    button.click();
    $httpBackend.flush();
  });

  describe('On IE device', function() {
    beforeEach(function() {
      inject(function(gaBrowserSniffer) {
        gaBrowserSniffer.msie = 9;
        compileEl($rootScope, $compile, element);
      });
    });
    it('check feedback fields for IE9', function() {
      expect(element.find('input[type=email]').length).to.be(1);
      expect(element.find('textarea').length).to.be(1);
      expect(element.find('button[type=submit]').length).to.be(1);
      expect(element.find('div[ng-show="!isIE9"]').attr('class')).to.be('ng-hide');
      expect(element.find('div.progress').attr('class').split(' ')[3]).to.be('ng-hide');
    });
  });
});

