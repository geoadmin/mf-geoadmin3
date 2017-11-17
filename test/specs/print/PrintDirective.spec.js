/* eslint-disable max-len */
describe('ga_print_directive', function() {

  describe('gaPrint', function() {
    var elt, scope, parentScope, $compile, $rootScope, map, $timeout, $httpBackend;
    var $q, gaUrlUtils, $http, $window, gaPermalink;// gaAttribution, gaPrintLayer, gaUrlUtils, $window, gaBrowserSniffer;
    var hrefUrl = 'http://localhost:8081/context.html?lang=en';
    var opt = {
      printPath: 'http://foo.ch/print',
      printConfigUrl: 'http://foo.ch/cached/print/info.json?url=' + encodeURIComponent('http://foo.ch/print'),
      legendUrl: 'http://foo.ch/static/images/legends/',
      qrcodeUrl: 'http://foo.ch/qrcodegenerator?url=',
      markerUrl: 'http://foo.ch/img/marker.png',
      bubbleUrl: 'http://foo.chimg/bubble.png',
      heightMargin: 89,
      widthMargin: 320,
      pdfLegendList: [
        'layerWithPdf',
        'layerWithPdf2'
      ]
    };

    var config = {
      'layerWithLegend': {
        hasLegend: true
      },
      'layerTimeEnabled': {
        timeEnabled: true
      }
    };

    var printConfig = {
      scales: [{
        name: '1:500',
        value: '500.0'
      }, {
        name: '1:1,000',
        value: '1000.0'
      }, {
        name: '1:2,500',
        value: '2500.0'
      }],
      dpis: [{
        name: '150',
        value: '150'
      }],
      outputFormats: [{
        name: 'pdf'
      }],
      layouts: [{
        name: '1 A4 landscape',
        map: {
          width: 802,
          height: 530
        },
        rotation: true
      }, {
        name: '4 A3 portrait',
        map: {
          width: 802,
          height: 1108
        },
        rotation: true
      }],
      printURL: 'http://foo.ch/print/print.pdf',
      createURL: 'http://foo.ch/print/create.json'
    };

    // Layers ignored by the print directive
    var layerNotVisible = new ol.layer.Tile({});
    layerNotVisible.visible = false;

    var layerOpacity0 = new ol.layer.Tile({});
    layerOpacity0.visible = true;
    layerOpacity0.opacity = 0;

    var layerWithoutExtent = new ol.layer.Tile({});
    layerWithoutExtent.visible = true;
    layerWithoutExtent.opacity = 1;

    var layerNotIntersectPrintExtent = new ol.layer.Tile({
      extent: [0, 0, 1, 1]
    });
    layerNotIntersectPrintExtent.visible = true;
    layerNotIntersectPrintExtent.opacity = 1;

    var layerWithDifferentProjection = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://wms.foo.ch',
        projection: ol.proj.get('EPSG:4326')
      }),
      extent: [10000, 10000, 10000, 10000]
    });
    layerWithDifferentProjection.visible = true;
    layerWithDifferentProjection.opacity = 1;
    layerWithDifferentProjection.label = 'layerWithDifferentProjection';

    // Layers not ignored by the print directive
    var layerIntersectPrintExtent = new ol.layer.Tile({
      extent: [10000, 10000, 10000, 10000]
    });
    layerIntersectPrintExtent.visible = true;
    layerIntersectPrintExtent.opacity = 1;

    var layerWithoutProjection = new ol.layer.Tile({
      source: new ol.source.TileWMS({}),
      extent: [10000, 10000, 10000, 10000]
    });
    layerWithoutProjection.visible = true;
    layerWithoutProjection.opacity = 1;

    var layerWithSameProjection = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        projection: ol.proj.get('EPSG:3857')
      }),
      extent: [10000, 10000, 10000, 10000]
    });
    layerWithSameProjection.visible = true;
    layerWithSameProjection.opacity = 1;
    /* var layerTimeEnabled = new ol.layer.Tile({});
    layerTimeEnabled.time = '19871231';

    var layerThirdParty = new ol.layer.Tile({});
    layerTimeEnabled.useThirdPartyData = true;

    var layerWithAttribution = new ol.layer.Tile();
    layerWithAttribution.attribution = 'layerWithAttribution';
*/
    // var ov = new ol.Overlay(); 

    var loadDirective = function(map, options, active) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      parentScope.options = options;
      parentScope.active = active;
      var tpl = '<div ga-print ga-print-map="map" ga-print-options="options" ga-print-active="active"></div>';
      elt = $compile(tpl)(parentScope);
      $('[ga-print]').remove();
      $('#map').remove();
      $(document.body).append(elt);
      $(document.body).append($('<div id="map" style="width:600px;height:300px;"></div>'));
      $rootScope.$digest();
      scope = elt.isolateScope();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {
        getLayer: function(id) {
          return config[id];
        }
      });
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      // gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      // gaAttribution = $injector.get('gaAttribution');
      // gaPrintLayer = $injector.get('gaPrintLayer');
      gaPermalink = $injector.get('gaPermalink');
      gaUrlUtils = $injector.get('gaUrlUtils');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 10
        })
      });
      map.setSize([600, 300]);
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

      it('verifies html elements', function() {
        loadDirective(map, {});

        expect(elt.find('form').length).to.be(1);
        expect(elt.find('select').length).to.be(2);
        expect(elt.find('input[type=checkbox]').length).to.be(2);
        expect(elt.find('button[ng-click="submit()"]').length).to.be(1);
        expect(elt.find('button[ng-click="abort()"]').length).to.be(1);
        $timeout.flush();
      });

      it('set scope values', function() {
        loadDirective(map, {});
        expect(scope.map).to.be(map);
        expect(scope.active).to.be();
        expect(scope.scale).to.be();
        expect(scope.scales).to.be();
        expect(scope.layout).to.be();
        expect(scope.dpi).to.be();
        expect(scope.isIE).to.be(false);
        expect(scope.printConfigLoaded).to.be(false);
        expect(scope.capabilities).to.be();
        expect(scope.layers).to.be.an(Array);
        expect(scope.options.legend).to.be();
        expect(scope.options.graticule).to.be();
        expect(scope.options.multiprint).to.be(false);
        expect(scope.options.movie).to.be(false);
        expect(scope.options.printsuccess).to.be(false);
        expect(scope.options.progress).to.be('');
        expect(scope.options.prnting).to.be();
        expect(scope.options.printConfigUrl).to.be();
        expect(scope.options.printPath).to.be();
        expect(scope.options.qrcodeUrl).to.be();
        expect(scope.options.widthMargin).to.be();
        expect(scope.options.heightMargin).to.be();
        expect(scope.layerFilter).to.be.a(Function);
        expect(scope.downloadUrl).to.be.a(Function);
        expect(scope.abort).to.be.a(Function);
        expect(scope.submit).to.be.a(Function);
        expect(scope.layerFilter).to.be.a(Function);
        $timeout.flush();
      });

      it('set scope values from options', function() {
        loadDirective(map, opt);
        expect(scope.options.printConfigUrl).to.be(opt.printConfigUrl);
        expect(scope.options.printPath).to.be(opt.printPath);
        expect(scope.options.qrcodeUrl).to.be(opt.qrcodeUrl);
        expect(scope.options.widthMargin).to.be(320);
        expect(scope.options.heightMargin).to.be(89);
        $timeout.flush();
      });

      it('set scope values when active', function() {
        $httpBackend.expectGET(opt.printConfigUrl).respond(printConfig);
        loadDirective(map, opt, true);
        $httpBackend.flush();
        expect(scope.map).to.be(map);
        expect(scope.active).to.be(true);
        expect(scope.scale.name).to.eql(printConfig.scales[0].name);
        expect(scope.scale.value).to.be(printConfig.scales[0].value);
        scope.scales.forEach(function(scale, i) {
          expect(scale.name).to.eql(printConfig.scales[i].name);
          expect(scale.value).to.be(printConfig.scales[i].value);
        });
        expect(scope.layout.name).to.be(printConfig.layouts[0].name);
        expect(scope.layout.stripped).to.be('A4 landscape');
        expect(scope.dpi).to.eql(printConfig.dpis);
        expect(scope.isIE).to.be(false);
        expect(scope.printConfigLoaded).to.be(true);
        expect(scope.capabilities).to.be.an(Object);
        expect(scope.layers).to.be.an(Array);
        expect(scope.options.legend).to.be(false);
        expect(scope.options.graticule).to.be(false);
        expect(scope.options.multiprint).to.be(false);
        expect(scope.options.movie).to.be(false);
        expect(scope.options.printsuccess).to.be(false);
        expect(scope.options.progress).to.be('');
        expect(scope.options.printing).to.be(false);
        $timeout.flush();
      });

      it('registers/unregsisters events on activation/deactivation', function() {
        $httpBackend.expectGET(opt.printConfigUrl).respond(printConfig);
        loadDirective(map, opt);
        var spy = sinon.spy(map, 'on');
        var spy2 = sinon.spy(map.getView(), 'on');
        var spy3 = sinon.spy(scope, '$watchGroup');
        scope.active = true;
        $rootScope.$digest();
        $httpBackend.flush();
        expect(spy.args[0][0]).to.be('precompose');
        expect(spy.args[1][0]).to.be('postcompose');
        expect(spy.args[2][0]).to.be('change:size');
        expect(spy2.args[0][0]).to.be('propertychange');
        expect(spy3.args[0][0]).to.eql(['scale', 'layout']);

        // Only test if no js errors on events
        var spy6 = sinon.spy(map, 'render');
        try {
          $('#map').trigger('precompose');
          $('#map').trigger('postcompose');
          map.setSize([599, 300]);
          map.getView().setCenter([0, 1]);
          scope.scale = scope.scales[1];
          $rootScope.$digest();
          scope.layout = scope.capabilities.layouts[1];
          $rootScope.$digest();
          expect(spy6.callCount).to.be(6);
        } catch (e) {
          sinon.assert.fail(e)
        }

        spy6.reset();
        var spy4 = sinon.spy(ol.Observable, 'unByKey');
        var spy5 = sinon.spy(angular, 'isFunction');
        scope.active = false;
        $rootScope.$digest();
        expect(spy4.callCount).to.be(4);
        expect(spy5.callCount).to.be(5);
        expect(spy6.callCount).to.be(1);
        spy4.restore();
      });

      describe('when print is active', function() {

        beforeEach(function() {
          $httpBackend.expectGET(opt.printConfigUrl).respond(printConfig);
          loadDirective(map, opt, true);
          $httpBackend.flush();
          // This function returns an error so we override it
          sinon.stub(map, 'getCoordinateFromPixel').returns([10000, 10000]);
        });

        describe('#submit()', function() {

          var shortUrl = 'http://foo.ch/shorten';
          var dlUrl = 'http://foo.ch/dl'; ;
          /* var expectedConf = {
            layout: '1 A4 landscape',
            srs: 'EPSG:3857',
            units: 'm',
            rotation: 0,
            app: 'config',
            lang: 'en',
            dpi: '150',
            layers: [],
            legends: undefined,
            enableLegends: undefined,
            qrcodeurl: 'http://foo.ch/qrcodegenerator?url=http%3A%2F%2Flocalhost%3A8081%2Fcontext.html%3Flang%3Den',
            movie: false,
            pages: [{
              center: [10000, 10000],
              bbox: [10000, 10000, 10000, 10000],
              display: [802, 530],
              scale: '500.0',
              dataOwner: '',
              thirdPartyDataOwner: '',
              shortLink: 'http://foo.ch',
              rotation: 0,
              langen: true,
              timestamp: ''
            }]
          }; */

          var expectConfig = function(conf) {
            expect(conf.layout).to.be('1 A4 landscape');
            expect(conf.srs).to.be('EPSG:3857');
            expect(conf.units).to.be('m');
            expect(conf.rotation).to.be(0);
            expect(conf.app).to.be('config');
            expect(conf.lang).to.be('en');
            expect(conf.dpi).to.be('150');
            expect(conf.qrcodeurl).to.be('http://foo.ch/qrcodegenerator?url=http%3A%2F%2Flocalhost%3A8081%2Fcontext.html%3Flang%3Den');
            expect(conf.movie).to.be(false);
            expect(conf.pages[0]).to.eql({
              center: [10000, 10000],
              bbox: [10000, 10000, 10000, 10000],
              display: [802, 530],
              scale: '500.0',
              dataOwner: '',
              thirdPartyDataOwner: '',
              shortLink: 'http://foo.ch',
              rotation: 0,
              langen: true,
              timestamp: ''
            });
          };

          beforeEach(function() {
            sinon.stub(gaPermalink, 'getHref').returns(hrefUrl);
            sinon.stub(gaUrlUtils, 'shorten').withArgs(hrefUrl).returns($q.when(shortUrl));
          });

          it('fails to request the print', function() {
            $httpBackend.expectPOST('http://foo.ch/print/create.json?url=http%3A%2F%2Ffoo.ch%2Fprint%2Fcreate.json').respond(404, '');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            scope.submit();
            $httpBackend.flush();
            expect(stub.callCount).to.be(0);
            expect(scope.options.printing).to.be(false);
          });

          it('ignores invisible layers and displays yalert message for reprojected layers', function() {

            var spy = sinon.spy($http, 'post');
            $httpBackend.expectPOST('http://foo.ch/print/create.json?url=http%3A%2F%2Ffoo.ch%2Fprint%2Fcreate.json').respond({getURL: dlUrl});
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            var stub2 = sinon.stub($window, 'alert');

            map.addLayer(layerNotVisible);
            map.addLayer(layerOpacity0);
            map.addLayer(layerWithoutExtent);
            map.addLayer(layerNotIntersectPrintExtent);
            map.addLayer(layerWithDifferentProjection);
            scope.submit();

            $timeout.flush();
            $httpBackend.flush();
            expect(stub.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers.length).to.be(0);
            expect(stub2.args[0][0]).to.be('layer_cant_be_printed\nlayerWithDifferentProjection');
          });
        });
      })
    });
  });
});
