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

