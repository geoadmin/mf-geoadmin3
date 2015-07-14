describe('ga_urlutils_service', function() {
  var gaUrlUtils;

  beforeEach(function() {
    inject(function($injector) {
      gaUrlUtils = $injector.get('gaUrlUtils');
    });
  });
  
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
  });

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
  });

  it('verifies third party validity', function() {
    expect(gaUrlUtils.isThirdPartyValid('http://public.geo.admin.ch')).to.be(true);
    expect(gaUrlUtils.isThirdPartyValid('http://public.geo.admin.ch/dfilghjdfigfdj')).to.be(true);
    expect(gaUrlUtils.isThirdPartyValid('http://public.bgdi.ch')).to.be(true);
    expect(gaUrlUtils.isThirdPartyValid('http://public.fre.bgdi.ch/dfilghjdfigfdj')).to.be(true);
    expect(gaUrlUtils.isThirdPartyValid('https://wms.geo.admin.ch')).to.be(false);
  });

  it('verifies public valid', function() {
    expect(gaUrlUtils.isPublicValid('http://public.geo.admin.ch')).to.be(true);
    expect(gaUrlUtils.isPublicValid('http://public.geo.bgdi.ch')).to.be(true);
    expect(gaUrlUtils.isPublicValid('http://public.geo.admin.ch/auie')).to.be(true);
    expect(gaUrlUtils.isPublicValid('http://public.geo.bgdi.ch/auie')).to.be(true);
    expect(gaUrlUtils.isPublicValid('http://heig.ch')).to.be(false);
    expect(gaUrlUtils.isPublicValid('http://bgdi.ch')).to.be(false);
    expect(gaUrlUtils.isPublicValid('ftp://wms.geo.admin.ch')).to.be(false);
  });

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
  
  it('removes an array of parameters', function() {
    var url = 'http://wms.admin.ch?SErvice=WMS&VERSION=1.1.1';
    expect(gaUrlUtils.remove(url, ['SERVICE'], true)).to.be('http://wms.admin.ch?VERSION=1.1.1');
    expect(gaUrlUtils.remove(url, ['SERVICE'], false)).to.be('http://wms.admin.ch?SErvice=WMS&VERSION=1.1.1');
    expect(gaUrlUtils.remove(url, ['SERVICE', 'VERSION'], true)).to.be('http://wms.admin.ch');
    expect(gaUrlUtils.remove(url, ['SERVICE', 'VERSION'], false)).to.be('http://wms.admin.ch?SErvice=WMS');
  });
  
  it('encodes URI query', function() {
    var stringToEncode = 'test:$test@te&st.com, ';
    expect(gaUrlUtils.encodeUriQuery(stringToEncode)).to.be('test:$test@te%26st.com,+');
    expect(gaUrlUtils.encodeUriQuery(stringToEncode, true)).to.be('test:$test@te%26st.com,%20');
  });
  
  it('parses KVP', function() {
    var kvp = 'key1=value%201&Key2=value2';
    var obj = gaUrlUtils.parseKeyValue(kvp);
    expect(obj).to.be.a(Object);
    expect(obj.key1).to.be('value 1');
    expect(obj.Key2).to.be('value2');
  });
 
  it('parses Object to KVP', function() {
    var obj = {
      key1: 'value 1',
      Key2: 'value2'
    }
    var kvp = gaUrlUtils.toKeyValue(obj);
    expect(kvp).to.be('key1=value%201&Key2=value2');
  });
});

