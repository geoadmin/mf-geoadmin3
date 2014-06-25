describe('ga_feedback_directive', function() {

  var element,
      mockGetHref,
      gaPermalink,
      encodeUriQuery,
      $httpBackend,
      $rootScope;

  beforeEach(module(function($provide) {
    mockGetHref = {
      getHref: function() {
        return 'http://permalink.com';
      }
    };
    $provide.value('gaPermalink', mockGetHref);
  }));

  beforeEach(function () {
    element = angular.element(
        '<div ga-feedback ' +
             'ga-feedback-options="options" ' +
             'ga-feedback-response="response">' +
        '</div>')

    inject(function($injector, $compile, gaUrlUtils) {
      gaPermalink = $injector.get('gaPermalink');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $rootScope.options = {
        feedbackUrl: 'http://feedback.com'
      };
      encodeUriQuery = gaUrlUtils.encodeUriQuery;

      $rootScope.response = undefined;
      $compile(element)($rootScope);
      $rootScope.$digest();
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('check feedback fields', function() {
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();
    var helpBlocks = element.find('.help-block');
    expect(helpBlocks.find('[href]').attr('href')).to.be('http://permalink.com');
    expect(element.find('input[type=email]').length).to.be(1);
    expect(element.find('textarea').length).to.be(1);
    expect(element.find('button[type=submit]').length).to.be(1);
  });

  it('sends a post request', function() {
    var textArea = element.find('textarea');
    textArea.val('dummyFeedback');
    textArea.trigger('input');
    $rootScope.$broadcast('gaPermalinkChange');
    $rootScope.$digest();

    var url = $rootScope.options.feedbackUrl + '?';
    var qs = 'feedback=dummyFeedback' +
        '&permalink=' + encodeUriQuery(gaPermalink.getHref()) +
        '&ua=' + encodeUriQuery(navigator.userAgent);
    var expectedUrl = url + qs;
    $httpBackend.whenPOST(expectedUrl).respond('success');
    var button = element.find('button');
    expect(button.attr('type')).to.be('submit');
    button.click();
    $httpBackend.flush();
  });
});
