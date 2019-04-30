/* eslint-disable max-len */
describe('ga_layermanager_directive', function() {
  // Valid layers

  var layerMngr = new ol.layer.Tile({});
  layerMngr.displayInLayerManager = true;

  // Unvalid layer
  var layerBg = new ol.layer.Tile({});
  layerBg.background = true;

  var layerPrev = new ol.layer.Tile({});
  layerPrev.preview = true;

  var layerUnvalid = new ol.layer.Tile({});
  layerBg.visible = true;

  // Third party layer layer
  var layerThirdParty = new ol.layer.Tile({});
  layerThirdParty.displayInLayerManager = true;
  layerThirdParty.url = 'http://foo.ch/admin/wms';

  var layerThirdPartyStyle = new ol.layer.Tile({});
  layerThirdPartyStyle.displayInLayerManager = true;
  layerThirdPartyStyle.externalStyleUrl = 'http://mystyle.json';

  describe('gaLayermanager', function() {
    var elt, map, $httpBackend, scope, parentScope, $compile, $rootScope, $timeout, $window;
    /* Keep for future tests
      gaBrowserSniffer, gaLayerFilters, gaLayerMetadataPopup, gaLayers,
      gaAttribution, gaUrlUtils, gaMapUtils, gaEvent;
    */
    var loadDirective = function(map) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      var tpl = '<div ga-layermanager ga-layermanager-map="map"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      /* Keep for future tests
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaLayerFilters = $injector.get('gaLayerFilters');
      gaLayerMetadataPopup = $injector.get('gaLayerMetadataPopup');
      gaLayers = $injector.get('gaLayers');
      gaAttribution = $injector.get('gaAttribution');
      gaUrlUtils = $injector.get('gaUrlUtils');
      gaMapUtils = $injector.get('gaMapUtils');
      gaEvent = $injector.get('gaEvent');
      */
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      map = new ol.Map({});
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on modern browsers', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
      });

      afterEach(function() {
        $timeout.flush();
      });

      it('verifies html elements', function() {
        loadDirective(map);
        expect(elt.find('> ul').length).to.be(1);
        expect(elt.find('li').length).to.be(0);
      });

      it('set scope values', function() {
        loadDirective(map);
        expect(scope.layers).to.be.an(Array);
        expect(scope.layerFilter).to.be.a(Function);
        expect(scope.disableDragAndDrop).to.be.a(Function);
        expect(scope.enableDragAndDrop).to.be.a(Function);
        expect(scope.displayTimestamps).to.be.a(Function);
        expect(scope.isDefaultValue).to.be.a(Function);
        expect(scope.duplicateLayer).to.be.a(Function);
        expect(scope.moveLayer).to.be.a(Function);
        expect(scope.removeLayer).to.be.a(Function);
        expect(scope.isBodLayer).to.be.a(Function);
        expect(scope.hasMetadata).to.be.a(Function);
        expect(scope.showWarning).to.be.a(Function);
        expect(scope.displayLayerMetadata).to.be.a(Function);
        expect(scope.setLayerTime).to.be.a(Function);
        expect(scope.useRange).to.be.a(Function);
        expect(scope.opacityValues).to.be.an(Array);
      });

      [layerMngr, layerThirdParty, layerThirdPartyStyle].forEach(function(layer) {
        it('updates content when a good layer is added', function() {
          loadDirective(map);
          map.addLayer(layer);
          $rootScope.$digest();
          expect(elt.find('li').length).to.be(1);
        });
      });

      [layerBg, layerPrev, layerUnvalid].forEach(function(layer) {
        it('does nozthing when a bad layer is added', function() {
          loadDirective(map);
          map.addLayer(layer);
          $rootScope.$digest();
          expect(elt.find('li').length).to.be(0);
        });
      });

      it('adds third party warning tooltip', function() {
        loadDirective(map);
        map.addLayer(layerThirdParty);
        $rootScope.$digest();
        var w = elt.find('.fa-user');
        expect(w.length).to.be(1);
        expect(w.data('bs.tooltip')).to.be(undefined);

        w.trigger('mouseover');
        expect(w.data('bs.tooltip')).to.be.an(Object);
      });

      it('adds third party warning tooltip with external style url', function() {
        loadDirective(map);
        map.addLayer(layerThirdPartyStyle);
        $rootScope.$digest();
        var w = elt.find('.fa-user');
        expect(w.length).to.be(1);
        expect(w.data('bs.tooltip')).to.be(undefined);

        w.trigger('mouseover');
        expect(w.data('bs.tooltip')).to.be.an(Object);
      });

      it('show/hide third party warning tooltip on mouse events', function() {
        loadDirective(map);
        map.addLayer(layerThirdParty);
        $rootScope.$digest();
        var isShown, w = elt.find('.fa-user');
        w.on('show.bs.tooltip', function() {
          isShown = true;
        });
        w.on('hide.bs.tooltip', function() {
          isShown = false;
        });
        expect(w.length).to.be(1);
        expect(w.data('bs.tooltip')).to.be(undefined);
        expect(isShown).to.be(undefined);

        w.trigger('mouseover');
        expect(w.data('bs.tooltip')).to.be.an(Object);
        expect(isShown).to.be(true);

        w.trigger('mouseout');
        expect(w.data('bs.tooltip')).to.be.an(Object);
        expect(isShown).to.be(false);
      });

      it('doesn\'t show third party warning tooltip on touch events', function() {
        loadDirective(map);
        map.addLayer(layerThirdParty);
        $rootScope.$digest();
        var isShown, w = elt.find('.fa-user');
        w.on('show.bs.tooltip', function() {
          isShown = true;
        });
        w.on('hide.bs.tooltip', function() {
          isShown = false;
        });
        expect(w.length).to.be(1);
        expect(w.data('bs.tooltip')).to.be(undefined);
        expect(isShown).to.be(undefined);

        w.trigger('touchstart');
        w.trigger('mouseover');
        expect(w.data('bs.tooltip')).to.be(undefined);
        expect(isShown).to.be(undefined);

        w.trigger('mouseout');
        expect(w.data('bs.tooltip')).to.be(undefined);
        expect(isShown).to.be(undefined);
      });

      it('opens alert message on click', function() {
        loadDirective(map);
        map.addLayer(layerThirdParty);
        $rootScope.$digest();
        var spy = sinon.stub($window, 'alert').withArgs('external_data_warning').returns({});
        var w = elt.find('.fa-user');
        w.trigger('click');
        expect(spy.callCount).to.be(1);
        $window.alert.restore();
      });
    });
  });
});
