/* eslint-disable max-len */
describe('ga_vector_tile_feedback_directive', function() {
  var $rootScope,
    $compile,
    gaBrowserSniffer,
    scope,
    scopeElt,
    options,
    el;

  var loadDirective = function(options) {
    scope = $rootScope.$new();
    scope.options = options;
    var tpl =
      '<div ga-vector-tile-feedback ' +
      'ga-vector-tile-feedback-options="options">' +
      '</div>';
    el = $compile(tpl)(scope);
    $rootScope.$digest();
    scopeElt = el.isolateScope();
  };

  var injectServices = function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
  };

  beforeEach(function() {
    module(function($provide) {
      $provide.value('gaLang', {
        getNoRm: function() {
          return 'somelang';
        }
      });
      $provide.value('gaBackground', {
        get: function() {
          return {};
        }
      });
      $provide.value('gaLayers', {
        getLayerProperty: function(id, prop) {
          return ['foo.ch', 'bar.ch'];
        }
      });
    });
    inject(function($injector) {
      injectServices($injector);
    });
    options = {
      serviceDocUrl: 'https://service-doc.html',
      surveyUrl: 'http://foo.ch/{lang}'
    };
  });

  it('creates the vector feedback directive', function() {
    loadDirective(options);
    expect(scope.options.serviceDocUrl).to.equal('https://service-doc.html');
    expect(el.find('.ga-vector-feeback-service-link')[0].href).to.equal('https://service-doc.html/');
    expect(el.find('[target="_blank"]').length).to.be(1);
    expect(el.find('[href="http://foo.ch/somelang"]').length).to.be(0);
  });

  it('get the survey url', function() {
    loadDirective({
      surveyUrl: 'http://foo.ch/{lang}'
    });
    expect(scopeElt.getSurveyUrl()).to.be('http://foo.ch/somelang');
  });

  it('open the survey in a new window on IE', function() {
    gaBrowserSniffer.msie = 56;
    loadDirective(options);
    expect(el.find('[target="_blank"]').length).to.be(2);
    expect(el.find('[href="http://foo.ch/somelang"]').length).to.be(1);
  });
});
