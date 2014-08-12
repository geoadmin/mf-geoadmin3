describe('ga_feedback_directive', function() {

  var element,
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
        }
      };
      $provide.value('gaPermalink', mockGetHref);
      var mockBrowserSniffer = {};
      $provide.value('gaBrowserSniffer', mockBrowserSniffer);
    });

    element = angular.element(
        '<div ga-feedback ' +
             'ga-feedback-options="options" ' +
             'ga-feedback-response="response">' +
        '</div>')

    inject(function($injector, gaUrlUtils) {
      gaPermalink = $injector.get('gaPermalink');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $rootScope.options = {
        feedbackUrl: 'http://feedback.com'
      };
      encodeUriQuery = gaUrlUtils.encodeUriQuery;

      $rootScope.response = undefined;
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
    var helpBlocks = element.find('.help-block');
    expect(helpBlocks.find('[href]').attr('href')).to.be('http://permalink.com');
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
      expect(element.find('div.help-block').attr('class').split(' ')[1]).to.be('ng-hide');
      expect(element.find('div.progress').attr('class').split(' ')[3]).to.be('ng-hide');
    });
  });
});

