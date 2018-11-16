/* eslint-disable max-len */
describe('ga_vector_feedback_directive', function() {
  var $rootScope,
    $compile,
    $httpBackend,
    $q,
    scope,
    scopeElt,
    el,
    map,
    options,
    editConfig,
    spyGetLayer,
    spySetById,
    spyApplyGlStyleToOlLayer,
    spyGet,
    spyFilter,
    spyEdit,
    spyResetFilters,
    spyResetEdits,
    gaBrowserSniffer;

  var loadDirective = function(map, options) {
    scope = $rootScope.$new();
    scope.map = map;
    scope.options = options;
    var tpl =
      '<div ga-vector-feedback ' +
      'ga-vector-feedback-map="map"' +
      'ga-vector-feedback-options="options">' +
      '</div>';
    el = $compile(tpl)(scope);
    $rootScope.$digest();
    scopeElt = el.isolateScope();
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
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    gaBrowserSniffer = $injector.get('gaBrowserSniffer');
  };

  beforeEach(function() {
    editConfig = {
      selectableLayers: [
        'layer1',
        'layer2'
      ],
      labelsFilters: [
        ['source-layer', '==', 'place']
      ],
      'layer1': [
        ['paint', 'fill-color', 'blue']
      ],
      'layer2': [
        ['paint', 'fill-color', 'yellow']
      ]
    };
    module(function($provide) {
      spySetById = sinon.spy(function() {});
      $provide.value('gaBackground', {
        init: function() {},
        setById: spySetById
      });
      $provide.value('gaLang', {
        getNoRm: function() {
          return 'somelang'
        }
      });

      spyApplyGlStyleToOlLayer = sinon.spy(function() {});
      $provide.value('gaMapUtils', {
        applyGlStyleToOlLayer: spyApplyGlStyleToOlLayer
      });

      spyGet = sinon.spy(function() {
        return $q.when();
      });
      spyFilter = sinon.spy(function() {
        return {};
      });
      spyEdit = sinon.spy(function() {
        return {};
      });
      spyResetFilters = sinon.spy(function() {
        return {};
      });
      spyResetEdits = sinon.spy(function() {
        return {};
      });
      spyGetLayer = sinon.spy(function() {
        return { editConfig: editConfig, styleUrl: 'https://style.ch' };
      });
      $provide.value('gaLayers', {
        getLayer: spyGetLayer
      });
      $provide.value('gaGlStyle', {
        get: spyGet,
        filter: spyFilter,
        edit: spyEdit,
        resetFilters: spyResetFilters,
        resetEdits: spyResetEdits
      });
    });
    inject(function($injector) {
      injectServices($injector);
    });

    map = createMap();
    options = {
      mobile: true,
      serviceDocUrl: 'https://service-doc.html',
      surveyUrl: 'http://foo.ch/{lang}',
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
        toto: editConfig
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
      ],
      colors: [
        { value: '#acc864', label: 'Light Green' },
        { value: '#3a8841', label: 'Green' }
      ],
      initialize: true
    };
    $httpBackend.expectGET('https://example.com/all?lang=en').respond({});
  });

  it('creates the vector feedback directive', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();

    expect(scope.options.backgroundLayer.id).to.equal(bodid);
    expect(scope.options.selectedLayer).to.equal('layer1');
    expect(scope.options.showLabel.value).to.equal(true);
    expect(scope.options.activeColor).to.equal(null);
    expect(scope.options.serviceDocUrl).to.equal('https://service-doc.html');
    expect($(el).find('.ga-vector-feeback-service-link')[1].href).to.equal('https://service-doc.html/');
    expect(el.find('[target="_blank"]').length).to.be(1);
    expect(el.find('[href="http://foo.ch/somelang"]').length).to.be(0);
  });

  it('calls the right services when changing the background layer', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.backgroundLayer = scope.options.backgroundLayers[1];
    $rootScope.$digest();

    expect(spyGetLayer.calledOnce).to.be.ok();
    expect(spySetById.calledOnce).to.be.ok();
  });

  it('calls the right services when changing a selectable layer on a bg layer', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.selectedLayer =
      scope.options.layers[bodid].selectableLayers[1];
    $rootScope.$digest();

    expect(spyGetLayer.calledOnce).to.be.ok();
    expect(spyApplyGlStyleToOlLayer.calledOnce).to.be.ok();
    expect(spyResetEdits.calledOnce).to.be.ok();
  });

  it('calls the right services when hiding the labels', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.showLabel = scope.options.showLabels[1];
    $rootScope.$digest();

    expect(spyGetLayer.calledOnce).to.be.ok();
    expect(spyFilter.calledOnce).to.be.ok();
    expect(spyApplyGlStyleToOlLayer.calledOnce).to.be.ok();
  });

  it('calls the right services when changing the color', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.activeColor = scope.options.colors[0];
    $rootScope.$digest();

    expect(spyGetLayer.calledOnce).to.be.ok();
    expect(spyEdit.calledOnce).to.be.ok();
    expect(spyApplyGlStyleToOlLayer.calledOnce).to.be.ok();
  });

  it('get the survey url', function() {
    expect(scope.getSurveyUrl)
    loadDirective(map, {
      surveyUrl: 'http://foo.ch/{lang}'
    });
    expect(scopeElt.getSurveyUrl()).to.be('http://foo.ch/somelang');
  });

  it('open the survey in a new window on IE', function() {
    gaBrowserSniffer.msie = 56;
    loadDirective(map, options);
    expect(el.find('[target="_blank"]').length).to.be(2);
    expect(el.find('[href="http://foo.ch/somelang"]').length).to.be(1);
  });
});
