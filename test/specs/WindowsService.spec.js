describe('ga_window_service', function() {

  describe('gaWindow', function() {
    var gaWindow, $window, widthDiv, heightDiv;

    beforeEach(function() {
      inject(function($injector) {
        $window = $injector.get('$window');
        gaWindow = $injector.get('gaWindow');
      });
      widthDiv = $('.ga-window.ga-window-width');
      heightDiv = $('.ga-window.ga-window-height');
    });

    afterEach(function() {
      widthDiv.find('> div').hide();
      heightDiv.find('> div').hide();
    });

    it('adds html elements', function() {
      expect(widthDiv.length).to.be(1);
      expect(heightDiv.length).to.be(1);
      ['xs', 's', 'm', 'l'].forEach(function(alias) {
        expect(widthDiv.find('.ga-visible-' + alias).length).to.be(1);
        expect(heightDiv.find('.ga-visible-' + alias).length).to.be(1);
      });
    });

    // The PhantomJS window is 400*300, so we can only test xs screen.
    describe('#isWidth()', function() {

      describe('using an l screen', function() {
        [
          '>xs', '>=xs',
          '>s', '>=s',
          '>m', '>=m',
          '<=l', 'l', '>=l'
        ].forEach(function(alias) {
          it('returns true for alias \'' + alias + '\'', function() {
             expect(gaWindow.isWidth(alias)).to.be(true);
          });
        });

        [
          '<xs', '<=xs', 'xs',
          '<s', '<=s', 's',
          '<m', '<=m', 'm',
          '<l', '>l'
        ].forEach(function(alias) {
          it('returns false for alias \'' + alias + '\'', function() {
             expect(gaWindow.isWidth(alias)).to.be(false);
          });
        });
      });
    });

    describe('#isHeight()', function() {

      describe('using an m screen', function() {
        [
          '>xs', '>=xs',
          '>s', '>=s',
          '<=m', 'm', '>=m',
          '<l', '<=l'
        ].forEach(function(alias) {
          it('returns true for alias \'' + alias + '\'', function() {
             expect(gaWindow.isHeight(alias)).to.be(true);
          });
        });

        [
          '<xs', '<=xs', 'xs',
          '<s', '<=s', 's',
          '<m', '>m',
          'l', '>=l', '>l'
        ].forEach(function(alias) {
          it('returns false for alias \'' + alias + '\'', function() {
             expect(gaWindow.isHeight(alias)).to.be(false);
          });
        });
      });
    });
  });
});
