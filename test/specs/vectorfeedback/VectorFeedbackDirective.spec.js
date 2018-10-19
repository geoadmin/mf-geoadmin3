/* eslint-disable max-len */
describe('ga_vector_feedback_directive', function() {
  var $rootScope, $compile, el, map, options, submit;

  var loadDirective = function(map, options, submit) {
    var scope = $rootScope.$new();
    scope.map = map;
    scope.options = options;
    scope.submit = submit;
    var tpl =
      '<div ga-vector-feedback ' +
      'ga-vector-feedback-map="::map"' +
      'ga-vector-feedback-options="options"' +
      'ga-vector-feedback-submit="::submit">' +
      '</div>';
    el = $compile(tpl)(scope);
    $rootScope.$digest();
  };

  var createMap = function() {
    var mp = new ol.Map({});
    mp.setSize([600, 300]);
    mp.getView().fit([-20000000, -20000000, 20000000, 20000000]);
    return mp;
  };

  var injectServices = function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  };

  beforeEach(function() {
    inject(function($injector) {
      injectServices($injector);
    });

    map = createMap();
    options = {
      serviceDocUrl: 'https://service-doc.html',
      comment: '',
      likeSelect: ''
    };
    submit = sinon.spy(function() {});
  });

  it('creates the vector feedback directive', function() {
    loadDirective(map, options, submit);
    var submitBtn = el.find('button[type=submit]');
    expect(el.find('a:nth-child(2)').attr('href')).to.be('https://service-doc.html');
    expect(el.find('textarea').length).to.be(1);
    expect(submit.callCount).to.be(0);
    submitBtn.click();
    expect(submit.callCount).to.be(1);
  });
});
