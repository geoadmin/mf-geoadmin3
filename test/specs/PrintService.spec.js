describe('ga_print_service', function() {

  describe('gaPrint', function() {
    var gaPrint, $window, mockDoc, mockWinPrint;
    var winPrint = {
      print: function() {},
      close: function() {},
      document: {
        write: function() {},
        close: function() {}
      }
    };

    var emptyHtml = '<html><head><link href="{{app.css}}" rel="stylesheet" type="text/css"></head><body onload="window.opener.printOnLoad(window);">undefined</body></html>';

    var completeHtml = '<html><head><meta></met<><script src="print.js"></script><link href="print.css"><link href="{{app.css}}" rel="stylesheet" type="text/css"></head><body onload="window.opener.printOnLoad(window);"><div>my body</div></body></html>';

    var getHtml = function(htmlTpl) {
      return htmlTpl.replace('{{app.css}}', getAppCssHref);
    };

    var getAppCssHref = function() {
      return $('link[href*="app.css"]').attr('href');
    };

    beforeEach(function() {

      module(function($provide) {
        $provide.value('$window', {
          open: function() {return winPrint;},
          alert: function() {}
         });
      });

      inject(function($injector) {
        $window = $injector.get('$window');
        gaPrint = $injector.get('gaPrint');
      });

      mockWinPrint = sinon.mock(winPrint);
      mockDoc = sinon.mock(winPrint.document);
    });

    afterEach(function() {
      mockWinPrint.restore();
      mockDoc.restore();
    });

    describe('#htmlPrintout()', function() {

      it('prints an empty html page', function() {
        var spy = sinon.spy($window, 'open');

        mockWinPrint.expects('close').never();
        mockDoc.expects('write').once().withExactArgs(getHtml(emptyHtml));
        mockDoc.expects('close').once().withExactArgs();
        gaPrint.htmlPrintout();
        mockWinPrint.verify();
        mockDoc.verify();
        expect(spy.calledWithExactly('', 'printout', 'height=400, width=600')).to.be(true);

        mockWinPrint.expects('print').once();
        $window.printOnLoad(winPrint);
        mockWinPrint.verify();
      });

      it('prints a complete html page', function() {
        var spy = sinon.spy($window, 'open');

        mockWinPrint.expects('close').never();
        mockDoc.expects('write').once().withExactArgs(getHtml(completeHtml));
        mockDoc.expects('close').once().withExactArgs();

        gaPrint.htmlPrintout('<div>my body</div>', '<meta></met<><script src="print.js"></script><link href="print.css">', function() {$window.isOnPrintLoad = true});

        mockWinPrint.verify();
        mockDoc.verify();

        expect(spy.calledWithExactly('', 'printout', 'height=400, width=600')).to.be(true);
        spy.restore();

        expect($window.isOnPrintLoad).to.be(undefined);
        $window.printOnLoad();
        expect($window.isOnPrintLoad).to.be(true);
      });

      it('closes the last print window opened', function() {
        mockWinPrint.expects('close').once();
        gaPrint.htmlPrintout();
        gaPrint.htmlPrintout();
        mockWinPrint.verify();
      });

      it('displays an alert message if the opening failed', function() {
        var stub = sinon.stub($window, 'open').returns(undefined);
        var spy = sinon.spy($window, 'alert');

        mockWinPrint.expects('close').never();
        mockDoc.expects('write').never();
        mockDoc.expects('close').never();

        gaPrint.htmlPrintout();

        mockWinPrint.verify();
        mockDoc.verify();

        expect(spy.calledWithExactly('popup_blocked')).to.be(true);
        spy.restore();
      });
    });
  });
});
