describe('ga_browsersniffer_service', function() {
  var snif, win, injector;
   
  var expectIE = function(version) {
    expect(snif.msie).to.equal(version);
    expect(snif.webkit).to.not.be.ok();
    expect(snif.mac).to.not.be.ok();
    expect(snif.safari).to.not.be.ok();
    expect(snif.ios).to.not.be.ok();
    expect(snif.iosChrome).to.not.be.ok();
  };
  
  // TODO test iOS 
  /*var expectIOS = function(version) {
    expect(snif.msie).to.not.be.ok();
    expect(snif.mac).to.not.be.ok();
    expect(snif.ios).to.equal(version);
  };*/

  var expectWebkit = function() {
    expect(snif.msie).to.not.be.ok();
    expect(snif.webkit).to.be.ok();
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
            search: ''
          }
        });
    });
    inject(function($injector) {
      win = $injector.get('$window');
      win.parent = win;
      injector = $injector;
    });
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
          
    describe('webkit', function() {
      
      it('Chrome 40.0.2214.111 on win 7', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectWebkit();
      });

      it('Chrome 40.0.2214.91 on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectWebkit();
      });

      it('Opera 27 on win 8.1 desktop', function() {
        win.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36";
        snif = injector.get('gaBrowserSniffer');
        expectWebkit();
      });
    });
  });
});
 
