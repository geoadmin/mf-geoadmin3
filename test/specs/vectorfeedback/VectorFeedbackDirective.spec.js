/* eslint-disable max-len */
describe('ga_vector_feedback_directive', function() {
  var $rootScope,
    $compile,
    scope,
    el,
    map,
    options,
    spySetById,
    spyApplyGLStyleToOlLayer,
    spyGetMapBackgroundLayer,
    spyGet,
    spyFilter,
    spyEdit,
    spyResetFilters,
    spyResetEdits;

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

      spyApplyGLStyleToOlLayer = sinon.spy(function() {});
      spyGetMapBackgroundLayer = sinon.spy(function() {
        return { bodId: 'toto' };
      });
      $provide.value('gaMapUtils', {
        applyGLStyleToOlLayer: spyApplyGLStyleToOlLayer,
        getMapBackgroundLayer: spyGetMapBackgroundLayer
      });

      spyGet = sinon.spy(function() {
        return { style: {}, sprite: {} };
      });
      spyFilter = sinon.spy(function() {
        return { style: {}, sprite: {} };
      });
      spyEdit = sinon.spy(function() {
        return { style: {}, sprite: {} };
      });
      spyResetFilters = sinon.spy(function() {
        return { style: {}, sprite: {} };
      });
      spyResetEdits = sinon.spy(function() {
        return { style: {}, sprite: {} };
      });
      $provide.value('gaGLStyle', {
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
            {
              value: 'background',
              label: 'Background',
              edit: ['id', 'landuse-residential', 'paint|fill-color|{color}']
            },
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
      ],
      colors: [
        { value: '#acc864', label: 'Light Green' },
        { value: '#3a8841', label: 'Green' }
      ]
    };
  });

  it('creates the vector feedback directive', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();

    expect(scope.options.backgroundLayer.id).to.equal(bodid);
    expect(scope.options.selectedLayer.value).to.equal('background');
    expect(scope.options.showLabel.value).to.equal(true);
    expect(scope.options.activeColor).to.equal(null);
    expect(el.find('.ga-vector-feeback-service-link').attr('href')).to.equal(
        'https://service-doc.html'
    );
  });

  it('calls the right services when changing the background layer', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.backgroundLayer = scope.options.backgroundLayers[1];
    $rootScope.$digest();

    expect(spyGetMapBackgroundLayer.calledTwice).to.be.ok();
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

    expect(spyGetMapBackgroundLayer.calledTwice).to.be.ok();
    expect(spyApplyGLStyleToOlLayer.calledOnce).to.be.ok();
    expect(spyResetEdits.calledOnce).to.be.ok();
  });

  it('calls the right services when hiding the labels', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.showLabel = scope.options.showLabels[1];
    $rootScope.$digest();

    expect(spyGetMapBackgroundLayer.calledTwice).to.be.ok();
    expect(spyFilter.calledOnce).to.be.ok();
    expect(spyApplyGLStyleToOlLayer.calledOnce).to.be.ok();
  });

  it('calls the right services when changing the color', function() {
    var bodid = 'toto';
    loadDirective(map, options);
    $rootScope.$broadcast('gaBgChange', { id: bodid, label: 'Toto' });
    $rootScope.$digest();
    scope.options.activeColor = scope.options.colors[0];
    $rootScope.$digest();

    expect(spyGetMapBackgroundLayer.calledTwice).to.be.ok();
    expect(spyEdit.calledOnce).to.be.ok();
    expect(spyApplyGLStyleToOlLayer.calledOnce).to.be.ok();
  });
});
