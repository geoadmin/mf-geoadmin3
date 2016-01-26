describe('ga_browsersniffer_service', function() {
  var snif, win, injector;
 
  // For each multi platform browser we need to test 3 things OS, JS engine and browser.
  // All the user agent are on on google docs:
  // https://docs.google.com/document/d/1RBMkQ_NCI15IbDhWvBE2SER30F_HtyVoQtZqU1elyqw/edit?pli=1

  // Expect OS
  var expectNotApple = function() {
    expect(snif.mac).to.not.be.ok();
    expect(snif.ios).to.not.be.ok();
  };

  var expectMac = function() {
    expect(snif.mac).to.be.ok();
    expect(snif.ios).to.not.be.ok();
    expect(snif.msie).to.not.be.ok();
  };
  
  var expectIOS = function(version) {
    expect(snif.mac).to.not.be.ok();
    expect(snif.ios).to.equal(version);
    expect(snif.msie).to.not.be.ok();
  };
   
  // Expect JS engine
  var expectWebkit = function() {
    expect(snif.webkit).to.be.ok();
    expect(snif.msie).to.not.be.ok();
  };

  var expectNotWebkit = function() {
    expect(snif.webkit).to.not.be.ok();
  };

  // Expect browser
  var expectIE = function(version) {
    expect(snif.mac).to.not.be.ok();
    expect(snif.ios).to.not.be.ok();
    expect(snif.webkit).to.not.be.ok();
    expect(snif.msie).to.equal(version);
    expect(snif.safari).to.not.be.ok();
    expect(snif.iosChrome).to.not.be.ok();
    expect(snif.chrome).to.not.be.ok();
  };
  
  var expectOperaOrFF = function(version) {
    expect(snif.msie).to.not.be.ok();
    expect(snif.safari).to.not.be.ok();
    expect(snif.iosChrome).to.not.be.ok();
    expect(snif.chrome).to.not.be.ok();
  };

  var expectSafari = function() {
    expect(snif.webkit).to.be.ok();
    expect(snif.msie).to.not.be.ok();
    expect(snif.iosChrome).to.not.be.ok();
    expect(snif.chrome).to.not.be.ok();
  };

  var expectIOSChrome = function(version) {
    expect(snif.mac).to.not.be.ok();
    expect(snif.ios).to.be.ok();
    expect(snif.webkit).to.be.ok();
    expect(snif.msie).to.not.be.ok();
    expect(snif.safari).to.not.be.ok();
    expect(snif.iosChrome).to.be.ok();
    expect(snif.chrome).to.equal(version);
  };

   var expectChrome = function(version) {
    expect(snif.ios).to.not.be.ok();
    expect(snif.webkit).to.be.ok();
    expect(snif.msie).to.not.be.ok();
    expect(snif.safari).to.not.be.ok();
    expect(snif.iosChrome).to.not.be.ok();
    expect(snif.chrome).to.equal(version);
  };

 
  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', 
        {
          navigator: {
            userAgent: 'ie11'
          },
          location: {
            port: '',
            search: '',
            pathname: ''
          }
        });
    });
    inject(function($injector) {
      win = $injector.get('$window');
      win.parent = win;
      injector = $injector;
    });
  });
  
  it('detects it\'s not the embed page', function() {
    win.location.pathname = 'http://geoadmin.ch/embed/src/';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(false);
    expect(snif.mobile).to.be.eql(false);
    
    win.location.pathname = 'http://geoadmin.ch/embed';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(false);
    expect(snif.mobile).to.be.eql(false);
    
    win.location.pathname = 'http://geoadmin.ch/index.html';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(false);
    expect(snif.mobile).to.be.eql(false);
  
    win.location.pathname = 'http://geoadmin.ch/mobile.html';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(false);
    expect(snif.mobile).to.be.eql(false);
  });
  
  it('detects the embed page', function() {
    win.location.pathname = 'http://geoadmin.ch/embed/src/embed.html';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(true);
    expect(snif.mobile).to.be.eql(false);
    
    win.location.pathname = 'http://geoadmin.ch/embed/embed.html';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(true);
    expect(snif.mobile).to.be.eql(false);
   
    win.location.pathname = 'http://geoadmin.ch/embed.html';
    snif = injector.get('gaBrowserSniffer');
    expect(snif.embed).to.be.eql(true);
    expect(snif.mobile).to.be.eql(false);
  });

  describe('detects browser:', function() {
    
    describe('IE 9', function() {
      it('(compatibility mode) on win 7', function() {
        win.navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)";
        snif = injector.get('gaBrowserSniffer');
        expectIE(9);
      });
       
      it('(compatibility mode) on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C)";
        expectIE(9);
      });
    });
    
    describe('IE 10', function() {
   
      it('(compatibility mode) on win 7', function() {
        win.navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)";
        snif = injector.get('gaBrowserSniffer');
        expectIE(10);
      });

      it('(compatibility mode) on win 8.1 desktop', function() {
        win.navigator.userAgent ="Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C)";
        snif = injector.get('gaBrowserSniffer');
        expectIE(10);
      });
    });
     
    describe('IE 11', function() {

      it('on win 7', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko";
        snif = injector.get('gaBrowserSniffer');
        expectIE(11);
      });
      
      it('on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko";
        snif = injector.get('gaBrowserSniffer');
        expectIE(11);
      }); 
      
      // ex: Surface
      it('on win RT 8.1 tablet', function() {
        win.navigator.userAgent ="Mozilla/5.0 (Windows NT 6.3; ARM; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecko"
        snif = injector.get('gaBrowserSniffer');
        expectIE(11);
      });

      // ex: Nokia Lumia 915
      it('on win 8.1 phone', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; Microsoft; Virtual) like Gecko";
        snif = injector.get('gaBrowserSniffer');
        expectIE(11);
      });
       
      // ex: Nokia Lumia 930
      it('on win 8.1 U1 phone', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; Microsoft; Virtual) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537";
        snif = injector.get('gaBrowserSniffer');
        expectIE(11);
      });
    });

    describe('IE EDGE', function() {

      it('on win 10 ', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240";
        snif = injector.get('gaBrowserSniffer');
        expectIE(12);
      });
    });

    describe('Chrome', function() {
      
      it('40.0.2214.111 on win 7', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectNotApple();
        expectWebkit();
        expectChrome(40);
      });

      it('40.0.2214.91 on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectNotApple();
        expectWebkit();
        expectChrome(40);
      });

      it('40.0.2214.115 on mac osx 10.10.2', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectMac();
        expectWebkit();
        expectChrome(40);
      });
      
      it('40.0.2214.73 on min-iPad iOS 8.1.3', function() {
        win.navigator.userAgent = "Mozilla/5.0 (iPad; CPU OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/40.0.2214.73 Mobile/12B466 Safari/600.1.4 (000501)";
        snif = injector.get('gaBrowserSniffer');
        expectIOS(8);
        expectWebkit();
        expectIOSChrome(40);
      });
    });

    describe('Safari', function() {
      
      it('8.0.3 on mac osx 10.10.2', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18";
        snif = injector.get('gaBrowserSniffer');
        expectMac();
        expectWebkit();
        expectSafari();
      });
      
      it('8.0 on min-iPad iOS 8.1.3', function() {
        win.navigator.userAgent = "Mozilla/5.0 (iPad; CPU OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B466 Safari/600.1.4";
        snif = injector.get('gaBrowserSniffer');
        expectIOS(8);
        expectWebkit();
        expectSafari();
      });
    });
     
    describe('Firefox', function() {
       
      it('36 on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:36.0) Gecko/20100101 Firefox/36.0";
        snif = injector.get('gaBrowserSniffer');
        expectNotApple();
        expectNotWebkit();
        expectOperaOrFF();
      });

      it('36 on mac osx 10.10.2', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:36.0) Gecko/20100101 Firefox/36.0";
        snif = injector.get('gaBrowserSniffer');
        expectMac();
        expectNotWebkit();
        expectOperaOrFF();
      });
    });

    describe('Opera', function() {
       
      it('27 on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36 OPR/27.0.1689.76";
        snif = injector.get('gaBrowserSniffer');
        expectNotApple();
        expectWebkit();
        expectOperaOrFF();
      });

      it('27.0.1689.76 on mac osx 10.10.2', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36 OPR/27.0.1689.76";
        snif = injector.get('gaBrowserSniffer');
        expectMac();
        expectWebkit();
        expectOperaOrFF();
      });
      
      it(' on min-iPad iOS 8.1.3', function() {
        win.navigator.userAgent = "Mozilla/5.0 (iPad; CPU OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) OPiOS/9.2.0.88656 Mobile/12B466 Safari/9537.53";
        snif = injector.get('gaBrowserSniffer');
        expectIOS(8);
        expectWebkit();
        expectOperaOrFF();
      });
    });
  });
});
 
