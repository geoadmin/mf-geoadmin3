/* eslint-disable max-len */
describe('ga_print_directive', function() {

  describe('gaPrint', function() {
    var elt, scope, parentScope, $compile, $rootScope, map, $timeout, $httpBackend;
    var $q, gaUrlUtils, $http, $window, gaPermalink, gaPrintLayer, gaAttribution, gaBrowserSniffer;
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

    var layersConfig = {
      'layerWithLegendAndTime': {
        hasLegend: true,
        timeEnabled: true
      },
      'ch.swisstopo.zeitreihen': {
        timeEnabled: true,
        timestamps: ['1964', '1985', '2011'],
        hasLegend: true
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

    var grp = new ol.layer.Group({
      extent: [10000, 10000, 10000, 10000]
    });
    grp.visible = true;
    grp.opacity = 1;

    var layerWithLegendAndTime = new ol.layer.Tile({
      source: new ol.source.TileWMS({}),
      extent: [10000, 10000, 10000, 10000]
    });
    layerWithLegendAndTime.bodId = 'layerWithLegendAndTime';
    layerWithLegendAndTime.time = '19871231';
    layerWithLegendAndTime.visible = true;
    layerWithLegendAndTime.opacity = 1;
    layerWithLegendAndTime.useThirdPartyData = true;

    var layerZeitreihen = new ol.layer.Tile({
      source: new ol.source.TileWMS({}),
      extent: [10000, 10000, 10000, 10000]
    });
    layerZeitreihen.bodId = 'ch.swisstopo.zeitreihen';
    layerZeitreihen.time = '19871231';
    layerZeitreihen.visible = true;
    layerZeitreihen.opacity = 1;

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
          return layersConfig[id];
        },
        getLayerProperty: function(id, prop) {
          return layersConfig[id][prop];
        }
      });
      $provide.value('$window', {
        alert: window.alert,
        navigator: window.navigator,
        addEventListener: window.addEventListener.bind(window),
        document: window.document,
        location: {
          port: '8008',
          search: ''
        },
        parent: window.parent,
        open: angular.noop
      });
      $provide.value('gaLang', {
        get: function() {
          return 'en';
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
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaAttribution = $injector.get('gaAttribution');
      gaPrintLayer = $injector.get('gaPrintLayer');
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

        spy6.resetHistory();
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
          var dlUrl = 'http://foo.ch/dl';
          var createUrl = 'http://foo.ch/print/create.json?url=http%3A%2F%2Ffoo.ch%2Fprint%2Fcreate.json';
          var createUrlMulti = 'http://foo.ch/printmulti/create.json?url=http%3A%2F%2Ffoo.ch%2Fprintmulti%2Fcreate.json';

          var expectConfig = function(conf) {
            expect(conf.layout).to.be('1 A4 landscape');
            expect(conf.srs).to.be('EPSG:3857');
            expect(conf.units).to.be('m');
            expect(conf.rotation).to.be(0);
            expect(conf.app).to.be('config');
            expect(conf.lang).to.be('en');
            expect(conf.dpi).to.be('150');
            expect(conf.qrcodeurl).to.be('http://foo.ch/qrcodegenerator?url=http%3A%2F%2Flocalhost%3A8081%2Fcontext.html%3Flang%3Den');
            expect(conf.pages[0].center).to.eql([10000, 10000]);
            expect(conf.pages[0].bbox).to.eql([10000, 10000, 10000, 10000]);
            expect(conf.pages[0].display).to.eql([802, 530]);
            expect(conf.pages[0].scale).to.eql('500.0');
            expect(conf.pages[0].shortLink).to.eql('http://foo.ch');
            expect(conf.pages[0].rotation).to.eql(0);
            expect(conf.pages[0].langen).to.be(true);
          };

          beforeEach(function() {
            sinon.stub(gaPermalink, 'getHref').returns(hrefUrl);
            sinon.stub(gaUrlUtils, 'shorten').returns($q.when(shortUrl));
          });

          it('fails to request the print', function() {
            $httpBackend.expectPOST(createUrl).respond(404, '');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            scope.submit();
            $httpBackend.flush();
            expect(stub.callCount).to.be(0);
            expect(scope.options.printing).to.be(false);
          });

          it('fails because specs it too large', function() {
            $httpBackend.expectPOST(createUrl).respond(413, '');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            var stub2 = sinon.stub($window, 'alert');
            scope.submit();

            $httpBackend.flush();
            expect(stub.callCount).to.be(0);
            expect(stub2.args[0][0]).to.be('print_request_too_large');
            expect(scope.options.printing).to.be(false);
          });

          it('ignores invisible layers and displays alert message for reprojected layers', function() {

            var spy = sinon.spy($http, 'post');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            var stub2 = sinon.stub($window, 'alert');
            $httpBackend.expectPOST(createUrl).respond({getURL: dlUrl});

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

          it('encodes a empty layer group', function() {
            var grp = new ol.layer.Group({
              extent: [10000, 10000, 10000, 10000]
            });
            grp.visible = true;
            grp.opacity = 1;
            var stub = sinon.stub(gaPrintLayer, 'encodeGroup').withArgs(grp, map.getView().getProjection(), 500,
                [10000, 10000, 10000, 10000], 152.8740565703525, '150').returns([]);
            var spy = sinon.stub($http, 'post');
            map.addLayer(grp);
            scope.submit();
            $timeout.flush();
            expect(stub.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers.length).to.be(0);
          });

          it('encodes a layer group with layers', function() {
            var encLayers = [{foo: 'bar'}, {bar: 'foo'}];
            var stub = sinon.stub(gaPrintLayer, 'encodeGroup').withArgs(grp, map.getView().getProjection(), 500,
                [10000, 10000, 10000, 10000], 152.8740565703525, '150').returns(encLayers);
            var spy = sinon.stub($http, 'post');
            map.addLayer(grp);
            scope.submit();
            $timeout.flush();
            expect(stub.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql(encLayers);
          });

          it('encodes layers', function() {
            var encLayer = {foo: 'bar'};
            var stub = sinon.stub(gaPrintLayer, 'encodeLayer').withArgs(layerWithLegendAndTime, map.getView().getProjection(), 500,
                [10000, 10000, 10000, 10000], 152.8740565703525, '150').returns({
              layer: encLayer
            });
            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaAttribution, 'getTextFromLayer').returns('attribution');
            var spy = sinon.stub($http, 'post');
            map.addLayer(layerWithLegendAndTime);
            map.addLayer(grp);
            scope.submit();
            $timeout.flush();
            expect(stub.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql([encLayer, encLayer]);
            expect(config.layers[0].legend).to.be();
            expect(config.layers[1].legend).to.be();
            expect(config.pages[0].dataOwner).to.eql('© attribution, attribution');
            expect(config.pages[0].timestamp).to.eql('1987');
          });

          it('encodes legend', function() {
            var encLayer = {foo: 'bar'};
            var encLgd = {name: 'foo layer', classes: [{icon: 'barLegend.png'}]};

            var spy = sinon.spy($http, 'post');
            var stub = sinon.stub(gaPrintLayer, 'encodeLayer').returns({layer: encLayer});
            var stub1 = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl, []).returns();

            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLegend').returns(encLgd);
            sinon.stub(gaAttribution, 'getTextFromLayer').returns();
            $httpBackend.expectPOST(createUrl).respond({getURL: dlUrl});

            // Activate print of legends
            scope.options.legend = true
            map.addLayer(layerWithLegendAndTime);
            map.addLayer(grp);

            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            // Expectations
            expect(stub.callCount).to.be(1);
            expect(stub1.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql([encLayer, encLayer]);
            expect(config.legends[0]).to.eql(encLgd);
            expect(config.enableLegends).to.be(true);
          });

          it('encodes pdf legend', function() {
            var encLayer = {foo: 'bar'};
            var encPdfLgd = {name: 'foo layer', classes: [{icon: 'barLegend_big.pdf'}]};

            var spy = sinon.spy($http, 'post');
            var stub = sinon.stub(gaPrintLayer, 'encodeLayer').returns({layer: encLayer});
            var stub1 = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl, ['barLegend_big.pdf']).returns();
            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLegend').returns(encPdfLgd);
            sinon.stub(gaAttribution, 'getTextFromLayer').returns();
            $httpBackend.expectPOST(createUrl).respond({getURL: dlUrl});

            // Activate print of legends
            scope.options.legend = true
            map.addLayer(layerWithLegendAndTime);
            map.addLayer(grp);

            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            // Expectations
            expect(stub.callCount).to.be(1);
            expect(stub1.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql([encLayer, encLayer]);
            expect(config.legends[0]).to.eql();
            expect(config.enableLegends).to.be(false);
          });

          it('encodes graticule', function() {
            var encLayer = {foo: 'bar'};

            var spy = sinon.spy($http, 'post');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl, []).returns();
            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeGraticule').withArgs('150').returns(encLayer);
            sinon.stub(gaAttribution, 'getTextFromLayer').returns();
            $httpBackend.expectPOST(createUrl).respond({getURL: dlUrl});

            // Activate print of graticule
            scope.options.graticule = true
            map.addLayer(grp);

            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            // Expectations
            expect(stub.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql([encLayer, encLayer]);
            expect(config.legends[0]).to.eql();
            expect(config.enableLegends).to.be(false);
          });

          it('encodes overlays', function() {
            var ovElt = $('<div id="ov"></div>');
            var ovStopElt = $('<div id="ovStop"></div>');
            $(document.body).append(ovElt);
            $(document.body).append(ovStopElt);
            var ov = new ol.Overlay({
              element: ovElt[0],
              stopEvent: false
            });
            var ovStop = new ol.Overlay({
              element: ovStopElt[0]
            });
            var encLayer = {foo: 'bar'};
            var encOvLayer = {foo: 'bar2'};
            var encOvStopLayer = {foo: 'bar3'};

            var spy = sinon.spy($http, 'post');
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl, []).returns();
            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeOverlay').
                withArgs(ov, 152.8740565703525, scope.options).returns(encOvLayer).
                withArgs(ovStop, 152.8740565703525, scope.options).returns(encOvStopLayer);
            sinon.stub(gaAttribution, 'getTextFromLayer').returns();
            $httpBackend.expectPOST(createUrl).respond({getURL: dlUrl});

            map.addLayer(grp);
            map.addOverlay(ovStop);
            map.addOverlay(ov);
            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            // Expectations
            expect(stub.callCount).to.be(1);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.layers).to.eql([encLayer, encOvLayer, encOvStopLayer]);
            expect(config.legends[0]).to.eql();
            expect(config.enableLegends).to.be(false);
            ovElt.remove();
            ovStopElt.remove();
          });

          it('uses multiprint', function() {
            var noCacheUrl = 'http://foo.ch/printprogress?id=1111';
            var encLayer = {foo: 'bar'};
            var encPdfLgd = {name: 'foo layer', classes: [{icon: 'barLegend_big.pdf'}]};

            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLayer').returns({
              layer: encLayer
            });
            sinon.stub(gaPrintLayer, 'encodeLegend').returns(encPdfLgd);
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl, ['barLegend_big.pdf']).returns();
            var spy = sinon.spy($http, 'post');
            $httpBackend.expectPOST(createUrlMulti).respond({getURL: dlUrl, idToCheck: '1111'});

            // Activate multi print
            scope.options.movie = true
            scope.options.legend = true
            map.addLayer(layerZeitreihen);
            map.addLayer(grp);
            $rootScope.$digest();
            expect(scope.options.multiprint).to.be(true);
            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            expect(stub.callCount).to.be(0);
            expect(spy.callCount).to.be(1);
            var config = spy.args[0][1];
            expectConfig(config);
            expect(config.movie).to.be(true);
            expect(config.layers).to.eql([encLayer, encLayer]);
            expect(config.layers[0].legend).to.be();
            expect(config.layers[1].legend).to.be();
            expect(config.pages[0].dataOwner).to.eql('');
            expect(config.pages[0].timestamp).to.eql('1987');

            // Launch printprogress
            $httpBackend.expectGET(noCacheUrl).respond({status: 'done'});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond(404);
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond({status: 'ongoing', done: 25, total: 100});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('15%');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond({status: 'done', merged: 25, done: 70, total: 100});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('67%');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond({status: 'done', written: 5, filesize: 10});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('85%');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond({status: 'done', getURL: dlUrl});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('85%');
            expect(scope.options.printing).to.be(true);
            expect(stub.callCount).to.be(1);
          });

          it('fails if printprogress returns status = failed', function() {
            var noCacheUrl = 'http://foo.ch/printprogress?id=1111';
            var encLayer = {foo: 'bar'};

            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLayer').returns({
              layer: encLayer
            });
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            $httpBackend.expectPOST(createUrlMulti).respond({getURL: dlUrl, idToCheck: '1111'});

            // Activate multi print
            scope.options.movie = true
            map.addLayer(layerZeitreihen);
            map.addLayer(grp);
            $rootScope.$digest();
            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            expect(stub.callCount).to.be(0);

            // Launch printprogress
            $httpBackend.expectGET(noCacheUrl).respond({status: 'failed'});
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(false);
          });
          
          it('fails if printprogress returns more than 2 errors', function() {
            var noCacheUrl = 'http://foo.ch/printprogress?id=1111';
            var encLayer = {foo: 'bar'};

            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLayer').returns({
              layer: encLayer
            });
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            $httpBackend.expectPOST(createUrlMulti).respond({getURL: dlUrl, idToCheck: '1111'});

            // Activate multi print
            scope.options.movie = true
            map.addLayer(layerZeitreihen);
            map.addLayer(grp);
            $rootScope.$digest();
            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            expect(stub.callCount).to.be(0);

            // Launch printprogress
            $httpBackend.expectGET(noCacheUrl).respond(404);
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond(404);
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(true);

            $httpBackend.expectGET(noCacheUrl).respond(404);
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.options.progress).to.be('');
            expect(scope.options.printing).to.be(false);
            expect(stub.callCount).to.be(0);
          });

          it('adds a parameter to print progress to avoid cache on ie9', function() {
            var clock = sinon.useFakeTimers()
            gaBrowserSniffer.msie = 9;
            var noCacheUrl = 'http://foo.ch/printprogress?id=1111&0';
            var encLayer = {foo: 'bar'};

            sinon.stub(gaPrintLayer, 'encodeGroup').returns([encLayer]);
            sinon.stub(gaPrintLayer, 'encodeLayer').returns({
              layer: encLayer
            });
            var stub = sinon.stub(scope, 'downloadUrl').withArgs(dlUrl).returns();
            $httpBackend.expectPOST(createUrlMulti).respond({getURL: dlUrl, idToCheck: '1111'});

            // Activate multi print
            scope.options.movie = true
            map.addLayer(layerZeitreihen);
            map.addLayer(grp);
            $rootScope.$digest();
            scope.submit();
            $timeout.flush();
            $httpBackend.flush();

            expect(stub.callCount).to.be(0);

            // Launch printprogress with an extra date parameter
            $httpBackend.expectGET(noCacheUrl).respond({getURL: dlUrl});
            $timeout.flush();
            $httpBackend.flush();
            expect(stub.callCount).to.be(1);
            clock.restore();
          });
        });

        describe('#downloadUrl', function() {

          it('changes windows location', function() {
            expect(scope.options.printsuccess).to.be(false);
            expect(scope.options.printing).to.be(false);
            scope.downloadUrl('http://foo.ch/dl', []);
            expect($window.location).to.be('http://foo.ch/dl');
            expect(scope.options.printsuccess).to.be(true);
            expect(scope.options.printing).to.be(false);
          });

          it('opens a new window on ie9', function() {
            gaBrowserSniffer.msie = 9;
            var stub = sinon.stub($window, 'open').withArgs('http://foo.ch/dl');
            expect(scope.options.printsuccess).to.be(false);
            expect(scope.options.printing).to.be(false);
            scope.downloadUrl('http://foo.ch/dl', []);
            expect(stub.callCount).to.be(1);
            expect(scope.options.printsuccess).to.be(true);
            expect(scope.options.printing).to.be(false);
          });

          it('loads pdf legends in new windows', function() {
            gaBrowserSniffer.msie = 9;
            var stub = sinon.stub($window, 'open');
            expect(scope.options.printsuccess).to.be(false);
            expect(scope.options.printing).to.be(false);
            scope.downloadUrl('http://foo.ch/dl', ['a.pdf', 'b.pdf']);
            expect(stub.callCount).to.be(3);
            expect(scope.options.printsuccess).to.be(true);
            expect(scope.options.printing).to.be(false);
          });
        });
      });
    });
  });
});
