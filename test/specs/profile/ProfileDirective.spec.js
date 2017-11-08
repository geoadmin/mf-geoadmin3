/* eslint-disable max-len */
describe('ga_profile_directive', function() {

  describe('gaProfile', function() {
    var elt, scope, parentScope, $compile, $rootScope, $timeout, $httpBackend, gaProfile,
      $q, $window, pElt, gaMapUtils, gaStyleFactory, posLayer;

    var feature, map, layer, options, profile;
    var initProfile = function() {
      pElt = $('<div class="ga-profile-graph">' +
      '  <div class="ga-profile-inner ng-scope">' +
      '    <svg width="1694" height="145" class="ga-profile-svg">' +
      '      <g class="ga-profile-group" transform="translate(60, 6)">' +
      '        <g class="x axis" transform="translate(0, 109)">' +
      '          <g class="tick" transform="translate(0,0)" style="opacity: 1;"><line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0</text></g>' +
      '          <g class="tick" transform="translate(121.39902218879278,0)" style="opacity: 1;"><line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">20</text></g>' +
      '          <path class="domain" d="M0,6V0H1614V6"></path>' +
      '        </g>' +
      '        <g class="y axis">' +
      '          <g class="tick" transform="translate(0,102.8948087431693)" style="opacity: 1;"><line x2="-6" y2="0"></line><text dy=".32em" x="-9" y="0" style="text-anchor: end;">530</text></g>' +
      '          <g class="tick" transform="translate(0,78.0769581056466)" style="opacity: 1;"><line x2="-6" y2="0"></line><text dy=".32em" x="-9" y="0" style="text-anchor: end;">535</text></g>' +
      '          <path class="domain" d="M-6,0H0V109H-6"></path>' +
      '          <text transform="rotate(-90)" y="6" dy=".71em" style="text-anchor: end;"></text>' +
      '        </g>' +
      '        <g class="ga-profile-grid-x" transform="translate(0, 109)">' +
      '          <g class="tick" transform="translate(0,0)" style="opacity: 1;"><line y2="-109" x2="0"></line><text dy=".71em" y="3" x="0" style="text-anchor: middle;"></text></g>' +
      '          <g class="tick" transform="translate(121.39902218879278,0)" style="opacity: 1;"><line y2="-109" x2="0"></line><text dy=".71em" y="3" x="0" style="text-anchor: middle;"></text></g>' +
      '          <path class="domain" d="M0,0V0H1614V0"></path>' +
      '        </g>' +
      '        <g class="ga-profile-grid-y">' +
      '          <g class="tick" transform="translate(0,102.8948087431693)" style="opacity: 1;"><line x2="1614" y2="0"></line><text dy=".32em" x="-3" y="0" style="text-anchor: end;"></text></g>' +
      '          <g class="tick" transform="translate(0,78.0769581056466)" style="opacity: 1;"><line x2="1614" y2="0"></line><text dy=".32em" x="-3" y="0" style="text-anchor: end;"></text></g>' +
      '          <g class="tick" transform="translate(0,53.259107468123865)" style="opacity: 1;"><line x2="1614" y2="0"></line><text dy=".32em" x="-3" y="0" style="text-anchor: end;"></text></g>' +
      '          <path class="domain" d="M0,0H0V109H0"></path>' +
      '        </g>' +
      '        <path class="ga-profile-area" d="M0,99.91666666666649L7.890936442271531,99.42030965391591L16.38886799548703,98.42759562841535L24.279804437758557,97.4348816029142L32.17074088003009,95.94581056466306L40.06167732230162,94.95309653916193L48.559608875517114,93.4640255009108L56.45054531778865,91.9749544626591L64.34148176006018,90.98224043715851L72.83941331327567,89.9895264116574L80.73034975554721,89.49316939890682L88.62128619781873,88.50045537340625L97.11921775103423,87.50774134790511L105.01015419330577,86.01867030965398L112.9010906355773,85.02595628415284L120.79202707784883,84.03324225865227L129.28995863106434">' +
      '        </path>' +
      '        <text class="ga-profile-legend" x="1496" y="11" width="100" height="30">swissALTI3D/DHM25</text>' +
      '        <text class="ga-profile-label ga-profile-label-x" x="807" y="134" font-size="0.95em" style="text-anchor: middle;">Distance [m]</text>' +
      '        <text class="ga-profile-label ga-profile-label-y" transform="rotate(-90)" y="-60" x="-84.5" dy="1em" font-size="0.95em">Altitude [m]</text>' +
      '      </g>' +
      '    </svg>' +
      '  </div>' +
      '</div>');
      var obj = {
        element: pElt[0],
        unitX: 'unitX',
        domain: {
          X: angular.noop,
          Y: angular.noop
        },
        elevDiff: function() { return 50; },
        twoElevDiff: function() { return [50, 60]; },
        elPoints: function() { return [70, 80]; },
        distance: function() { return 90; },
        slopeDistance: function() { return 100; },
        hikingTime: function() { return 110; },
        findMapCoordinates: function() {
          return [100, 100];
        },
        update: angular.noop,
        updateLabels: angular.noop
      };
      obj.domain.X.invert = angular.noop;
      obj.domain.Y.invert = angular.noop;
      return obj;
    };

    var loadDirective = function(feature, map, layer, options) {
      parentScope = $rootScope.$new();
      parentScope.feature = feature;
      parentScope.map = map;
      parentScope.layer = layer;
      parentScope.options = options;
      var tpl = '<div ga-profile="feature" ga-profile-map="map" ga-profile-layer="layer" ga-profile-options="options"></div>';
      elt = $compile(tpl)(parentScope);
      $('[ga-profile]').remove();
      $(document.body).append(elt);
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $window = $injector.get('$window');
      gaProfile = $injector.get('gaProfile');
      gaMapUtils = $injector.get('gaMapUtils');
      gaStyleFactory = $injector.get('gaStyleFactory');
    };

    beforeEach(function() {
      inject(injectServices);

      map = new ol.Map({});
      feature = new ol.Feature(new ol.geom.LineString([[0, 0], [0, 1]]));
      layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [feature]
        })
      });
      posLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: []
        })
      });
      options = {
        margin: {
          left: 0,
          top: 0
        }
      };
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

    it('verifies html elements', function() {
      loadDirective();
      expect(elt.find('.ga-profile-graph').length).to.be(1);
      expect(elt.find('.ga-profile-icons .ga-wrapper > div').length).to.be(8);
      expect(elt.find('button').length).to.be(0);
    });

    it('display trash button if a layer is specified', function() {
      loadDirective(null, null, {});
      expect(elt.find('button').length).to.be(1);
    });

    it('set scope values', function() {
      loadDirective(feature, map, layer, options);
      expect(scope.feature).to.be(feature);
      expect(scope.map).to.be(map);
      expect(scope.layer).to.be(layer);
      expect(scope.options).to.be(options);
      expect(scope.coordinates).to.eql([0, 0]);
      expect(scope.unitX).to.be('');
      expect(scope.diff).to.be.a(Function);
      expect(scope.twoDiff).to.be.a(Function);
      expect(scope.twoDiff1).to.be.a(Function);
      expect(scope.elPoi).to.be.a(Function);
      expect(scope.elPoi1).to.be.a(Function);
      expect(scope.hikTime).to.be.a(Function);
      expect(scope.deleteSelectedFeature).to.be.a(Function);
    });

    it('does nothing if profile is not created yet', function() {
      loadDirective(feature, map, layer, options);
      expect(scope.diff()).to.be(undefined);
      expect(scope.twoDiff()).to.be(undefined);
      expect(scope.twoDiff1()).to.be(undefined);
      expect(scope.elPoi()).to.be(undefined);
      expect(scope.elPoi1()).to.be(undefined);
      expect(scope.hikTime()).to.be(undefined);
    });

    describe('when a profile is created', function() {
      var stubOv;

      beforeEach(function() {
        stubOv = sinon.stub(gaMapUtils, 'getFeatureOverlay').returns(posLayer);
        profile = initProfile();
        sinon.stub(gaProfile, 'create').withArgs(feature).returns($q.when(profile));
        loadDirective(feature, map, layer, options);
        $timeout.flush();
        $rootScope.$digest();
      });

      it('set scope values', function() {
        expect(scope.unitX).to.be('unitX');
      });

      it('updates labels on $translateChangeEnd event', function() {
        var spy = sinon.spy(profile, 'updateLabels');
        $rootScope.$broadcast('$translateChangeEnd');
        expect(spy.callCount).to.be(1);
      });

      it('updates profile\'s size on resize event', function() {
        var spy = sinon.spy(profile, 'update').withArgs(null, [1694, 145]);
        $(window).trigger('resize');
        $timeout.flush();
        expect(spy.callCount).to.be(1);
      });

      it('updates profile on feature\'s change event', function() {
        var spy = sinon.stub(gaProfile, 'update').withArgs(profile, feature).returns($q.when({unitX: 'newUnitX'}));
        expect(spy.callCount).to.be(0);
        feature.setGeometry(new ol.geom.LineString([[1, 2], [2, 3]]));
        $timeout.flush();
        expect(spy.callCount).to.be(1);
        expect(scope.unitX).to.be('newUnitX');
      });

      it('update map position on mouse events on areaChartPath', function() {
        var spy = sinon.spy(posLayer, 'setMap');
        expect(stubOv.callCount).to.be(1);
        var posFeat = stubOv.args[0][0][0];
        expect(posFeat.getGeometry().getCoordinates()).to.eql([0, 0]);
        expect(stubOv.args[0][1]).to.be(gaStyleFactory.getStyle('redCircle'));
        var area = $window.d3.select('.ga-profile-area');
        expect($('.ga-profile-area').length).to.be(1);
        spy.withArgs(map);
        area.node().dispatchEvent(new Event('mouseover'));
        expect(spy.callCount).to.be(1);
        area.node().dispatchEvent(new Event('mousemove'));
        expect(posFeat.getGeometry().getCoordinates()).to.eql([100, 100]);
        spy.reset();
        spy.withArgs(null);
        area.node().dispatchEvent(new Event('mouseout'));
        expect(spy.callCount).to.be(1);
      });

      describe('#diff()', function() {
        it('returns a value', function() {
          expect(scope.diff()).to.be('50.00m');
        });
      });

      describe('#twoDiff()', function() {
        it('returns a value', function() {
          expect(scope.twoDiff()).to.be('50.00m');
        });
      });

      describe('#twoDiff1()', function() {
        it('returns a value', function() {
          expect(scope.twoDiff1()).to.be('60.00m');
        });
      });

      describe('#elPoi()', function() {
        it('returns a value', function() {
          expect(scope.elPoi()).to.be('70.00m');
        });
      });

      describe('#elPoi1()', function() {
        it('returns a value', function() {
          expect(scope.elPoi1()).to.be('80.00m');
        });
      });

      describe('#dist()', function() {
        it('returns value', function() {
          expect(scope.dist()).to.be('90m');
        });
      });

      describe('#slopeDist()', function() {
        it('returns a value', function() {
          expect(scope.slopeDist()).to.be('100m');
        });
      });

      describe('#hikTime()', function() {
        it('returns a value', function() {
          expect(scope.hikTime()).to.be('1h 50min');
        });
      });

      describe('#deleteSelectedFeature()', function() {
        var stub;

        beforeEach(function() {
          stub = sinon.stub($window, 'confirm');
        });

        afterEach(function() {
          stub.restore();
        });

        it('remove the unique feature of the layer', function() {
          stub.withArgs('confirm_remove_all_features').returns(true);
          expect(scope.feature).to.be(feature);
          scope.deleteSelectedFeature(layer, feature);
          expect(scope.feature).to.be(undefined);
          expect(layer.getSource().getFeatures().length).to.be(0);
        });

        it('remove one of the layer\'s features', function() {
          stub.withArgs('confirm_remove_all_features').returns(false);
          stub.withArgs('confirm_remove_selected_features').returns(true);
          expect(scope.feature).to.be(feature);
          scope.deleteSelectedFeature(layer, feature);
          expect(scope.feature).to.be(undefined);
          expect(layer.getSource().getFeatures().length).to.be(0);
        });

        it('doesn\'t remove the feature', function() {
          stub.withArgs('confirm_remove_all_features').returns(false);
          stub.withArgs('confirm_remove_selected_features').returns(false);
          expect(scope.feature).to.be(feature);
          scope.deleteSelectedFeature(layer, feature);
          expect(scope.feature).to.be(undefined);
          expect(layer.getSource().getFeatures().length).to.be(1);
        });
      });
    });
  });
});
