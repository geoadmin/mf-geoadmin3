/* eslint-disable max-len */
describe('ga_vector_feedback_directive', function() {
  var $rootScope, $compile, el, map, options, submit, spySetById;

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
    return scope;
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
    module(function($provide) {
      spySetById = sinon.spy(function() {});
      $provide.value('gaBackground', {
        init: function() {},
        setById: spySetById
      });
    });
    inject(function($injector) {
      injectServices($injector);
    });

    map = createMap();
    options = {
      serviceDocUrl: 'https://service-doc.html',
      comment: '',
      likeSelect: '',
      backgroundLayers: [
        {
          id: 'toto',
          label: 'Toto'
        },
        {
          id: 'procrastinator',
          label: 'ElProcrastinator'
        }
      ],
      layers: {
        toto: {
          selectableLayers: [
            { value: 'background', label: 'Background' },
            { value: 'rivers', label: 'Rivers' }
          ],
          labelsFilters: [
            ['source-layer', '==', 'place'],
            ['source-layer', '==', 'transportation_name']
          ]
        },
        procrastinator: {
          selectableLayers: [
            { value: 'background', label: 'Background' },
            { value: 'lakes', label: 'Lakes' }
          ],
          labelsFilters: [['source', '==', 'ch.swissnames3d']]
        }
      },
      showLabels: [
        {
          value: true,
          label: 'Show'
        },
        {
          value: false,
          label: 'Hide'
        }
      ]
    };
    submit = sinon.spy(function() {});
  });

  it('creates the vector feedback directive', function() {
    loadDirective(map, options, submit);
    var submitBtn = el.find('button[type=submit]');
    expect(el.find('.ga-vector-feeback-service-link').attr('href')).to.equal(
        'https://service-doc.html'
    );
    expect(el.find('textarea').length).to.equal(1);
    expect(submit.callCount).to.equal(0);
    submitBtn.click();
    expect(submit.callCount).to.equal(1);
  });
});
