describe('ga_permalink_service', function() {

  var permalink, replaceStateSpy;

  beforeEach(function() {

    module(function($provide) {
      replaceStateSpy = sinon.spy();
      $provide.value('gaHistory', {
        replaceState: replaceStateSpy
      });
      $provide.value('$window', {
        location: {
          port: '443',
          protocol: 'https:',
          hostname: 'some-hostname',
          pathname: '/some/path',
          search: '?some=key&value=pairs'
        }
      });
      $provide.value('$sniffer', {
        history: true
      });
    });

    inject(function($injector) {
      permalink = $injector.get('gaPermalink');
    });

  });

  it('correctly initializes', function() {
    expect(permalink.getParams()).to.eql({some: 'key', value: 'pairs'});
    expect(permalink.getHref()).to.be(
      'https://some-hostname:443/some/path?some=key&value=pairs');
  });

  it('correctly updates params', function() {
    permalink.updateParams({some: 'other key', even: 'more'});
    expect(permalink.getParams()).to.eql(
      {some: 'other key', value: 'pairs', even: 'more'});
    expect(permalink.getHref()).to.be(
      'https://some-hostname:443/some/path?some=other%20key' +
      '&value=pairs&even=more');
  });

  it('calls replaceState on updateParams', function() {
    inject(function($rootScope) {
      $rootScope.$apply(function() {
        permalink.updateParams({value: 'foo'});
      });
    });
    expect(replaceStateSpy.calledOnce).to.be.ok();
    expect(replaceStateSpy.args[0][2]).to.be(
      'https://some-hostname:443/some/path?some=key&value=foo');
  });

  describe('correctly creates embed url', function() {
    var win, embedUrl = 'https://some-hostname:443/some/path/embed.html?some=key&value=pairs';
    
    beforeEach(function() {
      inject(function($injector) {
        win = $injector.get('$window');
      });
    });

    it('without / at the end', function() {
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    });
    it('with / at the end', function() {
      win.location.pathname += '/';
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    });
    it('with index.html at the end', function() {
      win.location.pathname += '/index.html';
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    });
    it('with mobile.html at the end', function() {
      win.location.pathname += '/mobile.html';
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    });
    it('with embed.html at the end', function() {
      win.location.pathname += '/embed.html';
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    }); 
    it('with mobile param defined', function() {
      win.location.pathname += '/embed.html';
      permalink.updateParams({mobile: false});
      expect(permalink.getEmbedHref()).to.be(embedUrl);
      permalink.updateParams({mobile: 'true'});
      expect(permalink.getEmbedHref()).to.be(embedUrl);
      permalink.updateParams({mobile: ''});
      expect(permalink.getEmbedHref()).to.be(embedUrl);
      permalink.updateParams({mobile: null});
      expect(permalink.getEmbedHref()).to.be(embedUrl);
    });
  });
  
  describe('correctly creates main url', function() {
    var win, url = 'https://some-hostname:443/some/path/?some=key&value=pairs';
    
    beforeEach(function() {
      inject(function($injector) {
        win = $injector.get('$window');
      });
    });

    it('without / at the end', function() {
      expect(permalink.getMainHref()).to.be(url);
    });
    it('with / at the end', function() {
      win.location.pathname += '/';
      expect(permalink.getMainHref()).to.be(url);
    });
    it('with index.html at the end', function() {
      win.location.pathname += '/index.html';
      expect(permalink.getMainHref()).to.be(url);
    });
    it('with mobile.html at the end', function() {
      win.location.pathname += '/mobile.html';
      expect(permalink.getMainHref()).to.be(url);
    });
    it('with embed.html at the end', function() {
      win.location.pathname += '/embed.html';
      expect(permalink.getMainHref()).to.be(url);
    }); 
    it('with mobile param defined', function() {
      win.location.pathname += '/embed.html';
      permalink.updateParams({mobile: false});
      expect(permalink.getMainHref()).to.be(url);
      permalink.updateParams({mobile: 'true'});
      expect(permalink.getMainHref()).to.be(url);
      permalink.updateParams({mobile: ''});
      expect(permalink.getMainHref()).to.be(url);
      permalink.updateParams({mobile: null});
      expect(permalink.getMainHref()).to.be(url);
    });
  });

});
