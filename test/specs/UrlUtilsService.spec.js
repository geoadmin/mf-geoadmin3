describe('ga_urlutils_service', function() {

  describe('gaUrlUtils', function() {
    var gaUrlUtils;

    beforeEach(function() {
      inject(function($injector) {
        gaUrlUtils = $injector.get('gaUrlUtils');
      });
    });

    describe('#isValid()', function() {
      it('verifies validity', function() {
        expect(gaUrlUtils.isValid(undefined)).to.be(false);
        expect(gaUrlUtils.isValid(null)).to.be(false);
        expect(gaUrlUtils.isValid('')).to.be(false);
        expect(gaUrlUtils.isValid('this is not a url')).to.be(false);
        expect(gaUrlUtils.isValid('http//admin.ch')).to.be(false);
        expect(gaUrlUtils.isValid('http:/dfsdf.com')).to.be(false);
        expect(gaUrlUtils.isValid('http:this.com')).to.be(false);
        expect(gaUrlUtils.isValid('http://')).to.be(false);
        expect(gaUrlUtils.isValid('https://')).to.be(false);
        expect(gaUrlUtils.isValid('http://admin.ch')).to.be(true);
        expect(gaUrlUtils.isValid('https://admin.ch')).to.be(true);
        expect(gaUrlUtils.isValid('ftp://admin.ch')).to.be(true);
        expect(gaUrlUtils.isValid('https://admin.ch/?mit space im query')).to.be(true);
        expect(gaUrlUtils.isValid('https://admin.ch/space in URLtrue?query')).to.be(true);
        expect(gaUrlUtils.isValid('https://domain admin.ch/space in URLfalse?query')).to.be(false);
        expect(gaUrlUtils.isValid('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(true);
      });
    });

    describe('#isAdminValid()', function() {
      it('verifies admin validity', function() {
        expect(gaUrlUtils.isAdminValid('http://')).to.be(false);
        expect(gaUrlUtils.isAdminValid('https://')).to.be(false);
        expect(gaUrlUtils.isAdminValid('http://heig.ch')).to.be(false);
        expect(gaUrlUtils.isAdminValid('https://heig.ch')).to.be(false);
        expect(gaUrlUtils.isAdminValid('http://bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isAdminValid('https://bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isAdminValid('ftp://bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isAdminValid('http://test.bgdi.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('https://test.bgdi.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('ftp://test.bgdi.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('http://wms.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('https://wms.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('ftp://wms.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('https://public.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('https://public.dev.bgdi.ch')).to.be(true);
        expect(gaUrlUtils.isAdminValid('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(false);
      });
    });

    describe('#isBlob()', function() {
      it('verifies blob validity', function() {
        expect(gaUrlUtils.isBlob('blob:http://public.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.isBlob('noblob:http://public.geo.bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isBlob('http://public.geo.bgdi.ch')).to.be(false);
      });
    });

    describe('#isHttps()', function() {
      it('verifies https', function() {
        expect(gaUrlUtils.isHttps('http://public.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isHttps('ftp://public.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isHttps('http://public.geo')).to.be(false);
        expect(gaUrlUtils.isHttps('https')).to.be(false);
        expect(gaUrlUtils.isHttps('https://test.com')).to.be(true);
        expect(gaUrlUtils.isHttps('https://public.geo.admin.ch')).to.be(true);
      });
    });

    describe('#needsProxy()', function() {
      it('verifies proxy needs', function() {
        expect(gaUrlUtils.needsProxy('http://public.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.needsProxy('https://public.geo.admin.ch/')).to.be(false);
        expect(gaUrlUtils.needsProxy('http://data.geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.needsProxy('https://data.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.needsProxy('https://google.com')).to.be(true);
        expect(gaUrlUtils.needsProxy('https://admin.ch')).to.be(true);
        expect(gaUrlUtils.needsProxy('ftp://geo.admin.ch')).to.be(true);
        expect(gaUrlUtils.needsProxy('https://some.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.needsProxy('https://public.geo.admin.ch/test.kml')).to.be(false);
        expect(gaUrlUtils.needsProxy('https://data.geo.admin.ch/test.kml')).to.be(false);
        expect(gaUrlUtils.needsProxy('https://public.geo.admin.ch/test.kmz')).to.be(true);
        expect(gaUrlUtils.needsProxy('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(false);
      });
    });

    describe('#proxifyUrl()', function() {
      it('applies proxy correctly', function() {
        expect(gaUrlUtils.proxifyUrl('http://data.geo.admin.ch')).to.be(window.location.protocol + '//api3.geo.admin.ch/ogcproxy?url=http%3A%2F%2Fdata.geo.admin.ch');
        expect(gaUrlUtils.proxifyUrl('https://data.geo.admin.ch')).to.be('https://data.geo.admin.ch');
        expect(gaUrlUtils.proxifyUrl('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7');
      });
    });

    describe('#shorten()', function() {
      var $rootScope, $httpBackend;
      var shortenUrl = 'http://api3.geo.admin.ch/shorten.json?url=foo';
      beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('shorten a url successfully', function(done) {
        $httpBackend.expectGET(shortenUrl).respond({shorturl: 'shortenfoo'});
        gaUrlUtils.shorten('foo').then(function(url) {
          expect(url).to.be('shortenfoo');
          done();
        });
        $httpBackend.flush();
      });


      it('handle service error displaying a log an returning the initial url', function(done) {
        var errorSpy = sinon.stub(window.console, 'error');
        $httpBackend.expectGET(shortenUrl).respond(501);
        gaUrlUtils.shorten('foo').then(function(url) {
          expect(url).to.be('foo');
          expect(errorSpy.callCount).to.be(1);
          done();
          errorSpy.restore();
        });
        $httpBackend.flush();
      });
    });
    describe('#isThirdPartyValid()', function() {
      it('verifies third party validity', function() {
        expect(gaUrlUtils.isThirdPartyValid('http://public.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isThirdPartyValid('http://public.geo.admin.ch/dfilghjdfigfdj')).to.be(true);
        expect(gaUrlUtils.isThirdPartyValid('http://public.bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isThirdPartyValid('http://public.fre.bgdi.ch/dfilghjdfigfdj')).to.be(true);
        expect(gaUrlUtils.isThirdPartyValid('https://wms.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isThirdPartyValid('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(true);
      });
    });

    describe('#isPublicValid()', function() {
      it('verifies public valid', function() {
        expect(gaUrlUtils.isPublicValid('http://public.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isPublicValid('http://public.geo.bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isPublicValid('http://public.geo.admin.ch/auie')).to.be(true);
        expect(gaUrlUtils.isPublicValid('http://public.geo.bgdi.ch/auie')).to.be(true);
        expect(gaUrlUtils.isPublicValid('http://heig.ch')).to.be(false);
        expect(gaUrlUtils.isPublicValid('http://bgdi.ch')).to.be(false);
        expect(gaUrlUtils.isPublicValid('ftp://wms.geo.admin.ch')).to.be(false);
        expect(gaUrlUtils.isPublicValid('blob:https://mf-geoadmin3.dev.bgdi.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(false);
      });
    });

    describe('#append()', function() {
      it('appends parameter string', function() {
        var url = 'http://wms.admin.ch';
        url = gaUrlUtils.append(url, 'SERVICE=WMS');
        expect(url).to.be('http://wms.admin.ch?SERVICE=WMS');
        url = gaUrlUtils.append(url, 'VERSION=1.1.1');
        expect(url).to.be('http://wms.admin.ch?SERVICE=WMS&VERSION=1.1.1');

        url = 'http://wms.admin.ch?';
        url = gaUrlUtils.append(url, 'Service=WMS');
        expect(url).to.be('http://wms.admin.ch?Service=WMS');
        url = gaUrlUtils.append(url, 'VERSION=1.1.1');
        expect(url).to.be('http://wms.admin.ch?Service=WMS&VERSION=1.1.1');
      });
    });

    describe('#remove()', function() {
      it('removes an array of parameters', function() {
        var url = 'http://wms.admin.ch?SErvice=WMS&VERSION=1.1.1';
        expect(gaUrlUtils.remove(url, ['SERVICE'], true)).to.be('http://wms.admin.ch?VERSION=1.1.1');
        expect(gaUrlUtils.remove(url, ['SERVICE'], false)).to.be('http://wms.admin.ch?SErvice=WMS&VERSION=1.1.1');
        expect(gaUrlUtils.remove(url, ['SERVICE', 'VERSION'], true)).to.be('http://wms.admin.ch');
        expect(gaUrlUtils.remove(url, ['SERVICE', 'VERSION'], false)).to.be('http://wms.admin.ch?SErvice=WMS');
      });
    });

    describe('#encodeUriQuery()', function() {
      it('encodes URI query', function() {
        var stringToEncode = 'test:$test@te&st.com, ';
        expect(gaUrlUtils.encodeUriQuery(stringToEncode)).to.be('test:$test@te%26st.com,+');
        expect(gaUrlUtils.encodeUriQuery(stringToEncode, true)).to.be('test:$test@te%26st.com,%20');
      });
    });

    describe('#parseKeyValue()', function() {
      it('parses KVP', function() {
        var kvp = 'key1=value%201&Key2=value2';
        var obj = gaUrlUtils.parseKeyValue(kvp);
        expect(obj).to.be.a(Object);
        expect(obj.key1).to.be('value 1');
        expect(obj.Key2).to.be('value2');
      });
    });

    describe('#toKeyValue()', function() {
      it('parses Object to KVP', function() {
        var obj = {
          key1: 'value 1',
          Key2: 'value2'
        };
        var kvp = gaUrlUtils.toKeyValue(obj);
        expect(kvp).to.be('key1=value%201&Key2=value2');
      });
    });
  });
});
