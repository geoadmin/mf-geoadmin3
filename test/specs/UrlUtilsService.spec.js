/* eslint-disable max-len */
describe('ga_urlutils_service', function() {

  describe('gaUrlUtils', function() {
    var gaUrlUtils, gaGlobalOptions, $timeout;

    beforeEach(function() {
      inject(function($injector) {
        $timeout = $injector.get('$timeout');
        gaUrlUtils = $injector.get('gaUrlUtils');
        gaGlobalOptions = $injector.get('gaGlobalOptions');
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
        expect(gaUrlUtils.isValid('https://wmts.geo.admin.ch/1.0.0/ch.bafu.alpweiden-herdenschutzhunde/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.png')).to.be(true);
      });
    });

    describe('#isAdminValid()', function() {
      it('verifies admin validity', function() {
        expect(gaUrlUtils.isAdminValid('https://tileserver.int.bgdi.ch/styles/')).to.be(true);
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
        expect(gaUrlUtils.isValid('https://wmts.geo.admin.ch/1.0.0/ch.bafu.alpweiden-herdenschutzhunde/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.png')).to.be(true);
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

    describe('#proxifyUrlInstant()', function() {
      it('applies proxy correctly', function() {
        expect(gaUrlUtils.proxifyUrlInstant('http://data.geo.admin.ch')).to.be(
            gaGlobalOptions.proxyUrl + 'http/data.geo.admin.ch');
        expect(gaUrlUtils.proxifyUrlInstant('https://data.geo.admin.ch')).to.be(
            'https://data.geo.admin.ch');
        expect(gaUrlUtils.proxifyUrlInstant('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7')).to.be(
            'blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7');
      });
    });

    describe('#getCesiumProxy()', function() {
      it('applies proxy correctly', function() {
        var cProxy = gaUrlUtils.getCesiumProxy();
        expect(cProxy.getURL('http://dummyresource.com')).to.be(
            gaGlobalOptions.proxyUrl + 'http/dummyresource.com');
        cProxy = gaUrlUtils.getCesiumProxy();
        expect(cProxy.getURL('https://data.geo.admin.ch')).to.be(
            'https://data.geo.admin.ch');
      });
    });

    describe('#proxifyUrl()', function() {
      var $rootScope, $httpBackend;
      beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
      }));

      it('applies a proxy correctly on http://data.geo.admin.ch', function(done) {
        gaUrlUtils.proxifyUrl('http://data.geo.admin.ch').then(function(url) {
          expect(url).to.be(gaGlobalOptions.proxyUrl + 'http/data.geo.admin.ch');
          done();
        });
        $rootScope.$digest();
      });

      it('applies a proxy correctly on http://ineedaproxybadly.ch', function(done) {
        gaUrlUtils.proxifyUrl('http://ineedaproxybadly.ch').then(function(url) {
          expect(url).to.be(gaGlobalOptions.proxyUrl + 'http/ineedaproxybadly.ch');
          done();
        });
        $rootScope.$digest();
      });

      it('does not apply a proxy on https://data.geo.admin.ch', function(done) {
        gaUrlUtils.proxifyUrl('https://data.geo.admin.ch').then(function(url) {
          expect(url).to.be('https://data.geo.admin.ch');
          done();
        });
        $rootScope.$digest();
      });

      it('does not apply a proxy on blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7', function(done) {
        gaUrlUtils.proxifyUrl('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7').then(function(url) {
          expect(url).to.be('blob:https://myblob.ch/7a910681-938c-4011-8d75-2b64035a40a7');
          done();
        });
        $rootScope.$digest();
      });

      it('does not apply a proxy on https://corsenable.com/dummy.kml', function(done) {
        $httpBackend.expectHEAD('https://corsenable.com/dummy.kml').respond(200, '');
        gaUrlUtils.proxifyUrl('https://corsenable.com/dummy.kml').then(function(url) {
          expect(url).to.be('https://corsenable.com/dummy.kml');
          done();
        });
        $httpBackend.flush();
      });
    });

    describe('#shorten()', function() {
      var $httpBackend;
      var shortenUrl = 'http://api3.geo.admin.ch/shorten.json?url=foo';
      beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        try {
          $timeout.verifyNoPendingTasks();
        } catch (e) {
          $timeout.flush();
        }
      });

      it('shorten a url successfully', function(done) {
        $httpBackend.expectGET(shortenUrl).respond({shorturl: 'shortenfoo'});
        gaUrlUtils.shorten('foo').then(function(url) {
          expect(url).to.be('shortenfoo');
          done();
        });
        $httpBackend.flush();
        $timeout.flush();
      });

      it('handle service error displaying a log an returning the initial url', function(done) {
        var errorSpy = sinon.stub(window.console, 'error');
        $httpBackend.expectGET(shortenUrl).respond(501);
        gaUrlUtils.shorten('foo').then(function(url) {
          expect(url).to.be('foo');
          expect(errorSpy.callCount).to.be(1);
          done();
          errorSpy.restore();
          $timeout.flush();
        });
        $httpBackend.flush();
        $timeout.flush();
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

    describe('#unProxifyUrl()', function() {
      it('verifies unproxify url transformation valid', function() {
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.dev.bgdi.ch/http/dummy/somepath/myimage.png')).to.be('http://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.dev.bgdi.ch/https/dummy/somepath/myimage.png')).to.be('https://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.int.bgdi.ch/http/dummy/somepath/myimage.png')).to.be('http://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.int.bgdi.ch/https/dummy/somepath/myimage.png')).to.be('https://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.prod.bgdi.ch/http/dummy/somepath/myimage.png')).to.be('http://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://service-proxy.prod.bgdi.ch/http/dummy/somepath/myimage.png')).to.be('http://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://proxy.geo.admin.ch/http/dummy/somepath/myimage.png')).to.be('http://dummy/somepath/myimage.png');
        expect(gaUrlUtils.unProxifyUrl('https://proxy.geo.admin.ch/https/dummy/somepath/myimage.png')).to.be('https://dummy/somepath/myimage.png');
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

    describe('#getHostname()', function() {
      it('parses the hostname if available', function() {
        [
          'http://foo.ch/test.xml',
          'https://foo.ch/test.xml',
          'ftp://foo.ch/test.xml',
          'blob://foo.ch/test.xml'
        ].forEach(function(url) {
          var hn = gaUrlUtils.getHostname(url);
          expect(hn).to.be('foo.ch');
        });
      });

      it('returns empty', function() {
        [
          'foo.ch/test.xml'
        ].forEach(function(url) {
          var hn = gaUrlUtils.getHostname(url);
          expect(hn).to.be('');
        });
      });
    });

    describe('#parseSubdomainsTpl()', function() {
      [
        'undefined',
        undefined,
        null,
        0,
        'wms.geo.admin.ch',
        'wms{s}.geo.admin.ch',
        'wms{s:}.geo.admin.ch'
      ].forEach(function(val) {
        it('returns undefined for tpl=' + val, function() {
          expect(gaUrlUtils.parseSubdomainsTpl(val)).to.be();
        });
      });

      it('returns the list of subdomains available', function() {
        expect(gaUrlUtils.parseSubdomainsTpl('wms{s:,1,2,3}.geo.admin.ch')).to.eql(['', '1', '2', '3']);
        expect(gaUrlUtils.parseSubdomainsTpl('wms{s:1,2,3,}.geo.admin.ch')).to.eql(['1', '2', '3', '']);
        expect(gaUrlUtils.parseSubdomainsTpl('wms{s:abc,def,ghi}.geo.admin.ch')).to.eql(['abc', 'def', 'ghi']);

      });
    });

    describe('#hasSubdomainsTpl()', function() {
      [
        'undefined',
        undefined,
        null,
        0,
        'wms.geo.admin.ch',
        'wms{s.geo.admin.ch',
        'wms{s.geo.admin.ch}'
      ].forEach(function(val) {
        it('returns false for tpl=' + val, function() {
          expect(gaUrlUtils.hasSubdomainsTpl(val)).to.be(false);
        });
      });

      [
        'wms{s}.geo.admin.ch',
        'wms{s:}.geo.admin.ch',
        'wms{s:1,2,3,}.geo.admin.ch'
      ].forEach(function(val) {
        it('returns true for tpl=' + val, function() {
          expect(gaUrlUtils.hasSubdomainsTpl(val)).to.be(true);
        });
      });
    });

    describe('#getMultidomainsUrls()', function() {
      [
        'wms.geo.admin.ch',
        'wms{s.geo.admin.ch}'
      ].forEach(function(val) {
        it('returns only one url for tpl=' + val, function() {
          var urls = gaUrlUtils.getMultidomainsUrls(val);
          expect(urls.length).to.be(1);
          expect(urls[0]).to.be(val);
        });
      });

      it('returns a list of one url without the subdomain tpl', function() {
        var urls = gaUrlUtils.getMultidomainsUrls('wms{s}.geo.admin.ch');
        expect(urls[0]).to.be('wms.geo.admin.ch');
      });

      it('returns the list of urls with default subdomains', function() {
        var urls = gaUrlUtils.getMultidomainsUrls('wms{s}.geo.admin.ch', ['100', '101']);
        expect(urls[0]).to.be('wms100.geo.admin.ch');
        expect(urls[1]).to.be('wms101.geo.admin.ch');
      });

      it('returns the list of urls', function() {
        var urls = gaUrlUtils.getMultidomainsUrls('wms{s:,1,2,3}.geo.admin.ch');
        expect(urls[0]).to.be('wms.geo.admin.ch');
        expect(urls[1]).to.be('wms1.geo.admin.ch');
        expect(urls[2]).to.be('wms2.geo.admin.ch');
        expect(urls[3]).to.be('wms3.geo.admin.ch');
      });
    });

    describe('#resolveStyleUrl', function() {
      it('uses the external style url if valid', function() {
        var styleUrl = 'https://toto.admin.ch/style.json';
        var externalUrl = 'https://externalstyle.json';
        var url = gaUrlUtils.resolveStyleUrl(styleUrl, externalUrl);
        expect(url).to.equal(externalUrl);
      });

      it('adds protocol to agnostic external style url', function() {
        var styleUrl = 'https://toto.admin.ch/style.json';
        var externalUrl = '//externalstyle.json';
        var url = gaUrlUtils.resolveStyleUrl(styleUrl, externalUrl);
        expect(url).to.equal('http:' + externalUrl);
      });

      it('uses the base style url if external style is undefined', function() {
        var styleUrl = 'https://toto.admin.ch/style.json';
        var externalUrl;
        var url = gaUrlUtils.resolveStyleUrl(styleUrl, externalUrl);
        expect(url).to.equal(styleUrl);
      });

      it('uses the base style url if external style is not valid', function() {
        var styleUrl = 'https://toto.admin.ch/style.json';
        var externalUrl = 'invalid_url';
        var url = gaUrlUtils.resolveStyleUrl(styleUrl, externalUrl);
        expect(url).to.equal(styleUrl);
      });

      it('adds to protocol to base style url if agnostic', function() {
        var styleUrl = '//toto.admin.ch/style.json';
        var externalUrl;
        var url = gaUrlUtils.resolveStyleUrl(styleUrl, externalUrl);
        expect(url).to.equal('http:' + styleUrl);
      });
    });
  });
});
