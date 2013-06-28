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

});
