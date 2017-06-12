describe('ga_import_controller', function() {

  describe('GaImportController', function() {

    var scope, parentScope, $compile, $rootScope, $window, $q, $document, $timeout, $httpBackend,
        ngeoFile, gaKml, gaBrowserSniffer, gaWms, gaUrlUtils, gaLang, gaPreviewLayers,
        gaMapUtils, gaWmts, map;

    var loadController = function(map) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      var tpl = '<div ng-controller="GaImportController"></div>';
      elt = $compile(tpl)(parentScope);
      $rootScope.$digest();
      scope = elt.scope();
    };

    var injectServices = function($injector) {
      $q = $injector.get('$q');
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $window = $injector.get('$window');
      $document = $injector.get('$document');
      $timeout = $injector.get('$timeout');
      ngeoFile = $injector.get('ngeoFile');
      gaKml = $injector.get('gaKml');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
      gaWms = $injector.get('gaWms');
      gaUrlUtils = $injector.get('gaUrlUtils');
      gaLang = $injector.get('gaLang');
      gaPreviewLayers = $injector.get('gaPreviewLayers');
      gaMapUtils = $injector.get('gaMapUtils');
      gaWmts = $injector.get('gaWmts');
    };

    beforeEach(function() {
      map = new ol.Map({});
    });

    describe('on ie 9', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        gaBrowserSniffer.msie = 9;
      });


      it('set scope values', function() {
        loadController(map);
        expect(scope.supportDnd).to.be(false);
        $timeout.flush();
      });
    });

    describe('on ie > 9', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        gaBrowserSniffer.msie = 10;
      });


      it('set scope values', function() {
        loadController(map);
        expect(scope.supportDnd).to.be(true);
        $timeout.flush();
      });
    });

    describe('on browser which supports dnd', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        loadController(map);
      });

      afterEach(function() {
        $timeout.flush();
      });

      it('set scope values', function() {
        expect(scope.supportDnd).to.be(true);
        expect(scope.options.urls.length).to.be(146);
        expect(scope.options.urls[0]).to.be('https://wms.geo.admin.ch/?lang=');
        expect(scope.options.isValidUrl).to.be(gaUrlUtils.isValid);
        expect(scope.options.getOlLayerFromGetCapLayer).to.be.a(Function);
        expect(scope.options.addPreviewLayer).to.be.a(Function);
        expect(scope.options.removePreviewLayer).to.be(gaPreviewLayers.removeAll);
        expect(scope.options.transformExtent).to.be(gaMapUtils.intersectWithDefaultExtent);
        expect(scope.options.transformUrl).to.be.a(Function);
        expect(scope.options.handleFileContent).to.be.a(Function);
      });

      describe('#options.getOlLayerFromGetCapLayer()', function() {
        it('uses gaWms', function() {
          var layer = {wmsUrl: 'test.com'};
          var spy = sinon.stub(gaWms, 'getOlLayerFromGetCapLayer').withArgs(layer);
          scope.options.getOlLayerFromGetCapLayer(layer);
          expect(spy.callCount).to.be(1);
        });

        it('uses gaWmts', function() {
          var layer = {capabilitiesUrl: 'foo'};
          var spy = sinon.stub(gaWmts, 'getOlLayerFromGetCapLayer').withArgs(layer);
          scope.options.getOlLayerFromGetCapLayer(layer);
          expect(spy.callCount).to.be(1);
          spy.reset();
        });
      });

      describe('#options.addPreviewLayer()', function() {
        it('calls gaPreviewLayers', function() {
          var layer = {};
          var spy = sinon.stub(gaPreviewLayers, 'addGetCapLayer').withArgs(map, layer);
          scope.options.addPreviewLayer(map, layer);
          expect(spy.callCount).to.be(1);
          spy.reset();
        });
      });

      describe('#options.transformUrl()', function() {

        it('returns a WMS GetCapabiltiies url', function() {
          var urls = [
            'https://foo.ch',
            'https://foo.ch ',
            'https://foo.ch/',
            'https://foo.ch/?',
            'https://foo.ch/?paramter=custom'
          ];
          var spy = sinon.spy(gaUrlUtils, 'proxifyUrl');
          urls.forEach(function(url) {
            var p = scope.options.transformUrl(url);
            expect(spy.args[0][0]).to.contain('SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0');
            expect(scope.getCapUrl).to.be(spy.args[0][0]);
            spy.reset();
          });
        });

        it('returns a WMS GetCapabiltiies url with lang parameter', function() {
          var urls = [
            'https://admin.ch'
          ];
          var spy = sinon.spy(gaUrlUtils, 'proxifyUrl');
          urls.forEach(function(url) {
            var p = scope.options.transformUrl(url);
            expect(spy.args[0][0]).to.contain('SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&lang=en');
            expect(scope.getCapUrl).to.be(spy.args[0][0]);
            spy.reset();
          });
        });


        it('returns a WMTS GetCapabiltiies url', function() {
          var urls = [
            'https://wmts.ch',
            'https://wmts.ch/',
            'https://wmts.ch/?',
            'https://wmts.ch/?parmeter=custom'
          ];
          var spy = sinon.spy(gaUrlUtils, 'proxifyUrl');
          urls.forEach(function(url) {
            var p = scope.options.transformUrl(url);
            expect(spy.args[0][0]).to.contain('SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0');
            expect(scope.getCapUrl).to.be(spy.args[0][0]);
            spy.reset();
          });
        });

        it('returns a URL unchanged', function() {
          var urls = [
            'https://foo.kml',
            'https://foo.kmz',
            'https://foo.txt',
            'https://foo.xml',
            'https://foo.ch/serv.php?file=lal.kml&parameter=custom',
            'https://wmts.ch/wms/foo.ext',
          ];
          var spy = sinon.spy(gaUrlUtils, 'proxifyUrl');
          urls.forEach(function(url) {
            var p = scope.options.transformUrl(url);
            expect(spy.args[0][0]).to.be(url);
            expect(scope.getCapUrl).to.be(spy.args[0][0]);
            spy.reset();
          });
        });
      });

      describe('#options.handleFileContent()', function() {

        it('detects a WMS GetCapabilities content', function(done) {
          $.get('base/test/data/wms-basic.xml', function(response) {
            scope.options.handleFileContent(response).then(function(resp) {
              expect(scope.wmsGetCap).to.be(response);
              expect(scope.wmtsGetCap).to.be(null);
              expect(resp.message).to.be('upload_succeeded');
              done();
            });
            $rootScope.$digest();
          }, 'text');
        });

        it('detects a WMTS GetCapabilities content', function(done) {
          $.get('base/test/data/wmts-basic.xml', function(response) {
            scope.options.handleFileContent(response).then(function(resp) {
              expect(scope.wmtsGetCap).to.be(response);
              expect(scope.wmsGetCap).to.be(null);
              expect(resp.message).to.be('upload_succeeded');
              done();
            });
            $rootScope.$digest();
          }, 'text');
        });

        describe('detects a KML content', function(done) {

          it('then parsing succeeds', function(done) {
            scope.options.handleFileContent('<kml></kml>').then(function(resp) {
              expect(scope.wmtsGetCap).to.be(null);
              expect(scope.wmsGetCap).to.be(null);
              expect(resp.message).to.be('parse_succeeded');
              done();
            });
            $rootScope.$digest();
          });

          it('then parsing fails', function(done) {
            var defer = $q.defer();
            var stub = sinon.stub($window.console, 'error');
            var stub2 = sinon.stub(gaKml, 'addKmlToMap').returns(defer.promise);
            scope.options.handleFileContent('<kml>ba>dtag></kml>').then(angular.noop, function(resp) {
              expect(resp.message).to.be('parse_failed');
              expect(resp.reason).to.be('reason');
              expect(stub.args[0][0]).to.be('KML parsing failed: ');
              expect(stub.args[0][1]).to.be(resp.reason);
              stub.restore();
              stub2.restore();
              done();
            });
            defer.reject('reason');
            $rootScope.$digest();
          });

          it('and use file (Object) parameter', function(done) {
            var file = {
              url: 'foo.kml',
              size: 20000001
            };
            var spy = sinon.spy(gaKml, 'addKmlToMap');
            scope.options.handleFileContent('<kml></kml>', file).then(function(resp) {
              expect(spy.args[0][2].url).to.be(file.url);
              expect(spy.args[0][2].useImageVector).to.be(true);
              expect(spy.args[0][2].zoomToExtent).to.be(true);
              done();
            });
            $rootScope.$digest();
          });

          it('and use file (File) parameter', function(done) {
            // Simulate a File object
            var file = {
              size: 10
            };
            var spy = sinon.spy(gaKml, 'addKmlToMap');
            var spy2 = sinon.spy(URL, 'createObjectURL');
            scope.options.handleFileContent('<kml></kml>', file).then(function(resp) {
              expect(spy2.calledOnce).to.be(true);
              expect(spy2.args[0][0]).to.be(file);
              expect(spy.args[0][2].useImageVector).to.be(false);
              expect(spy.args[0][2].zoomToExtent).to.be(true);
              done();
            });
            $rootScope.$digest();
          });
        });

        it('detects nothing', function(done) {
          var stub = sinon.stub($window.console, 'error');
          scope.options.handleFileContent('<gpx></gpx>').then(angular.noop, function(resp) {
            expect(scope.wmtsGetCap).to.be(null);
            expect(scope.wmsGetCap).to.be(null);
            expect(resp.message).to.be('parse_failed');
            expect(resp.reason).to.be('format_not_supported');
            expect(stub.args[0][0]).to.be('Unparseable content: ');
            expect(stub.args[0][1]).to.be('<gpx></gpx>');
            stub.restore();
            done();
          });
          $rootScope.$digest();
        });
      });
    });
  });
});

