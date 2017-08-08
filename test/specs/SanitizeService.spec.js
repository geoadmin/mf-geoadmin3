describe('ga_sanitize_service', function() {

  describe('gaSanitize', function() {
    var sanitize;
    var html = '<div><p></p></div>';
    var htmlEncoded = '&lt;div&gt;&lt;p&gt;&lt;/p&gt;&lt;/div&gt;';
    var htmlWithEvts = '<div onmousedown="alert(document.cookie)"><p ' +
        'onpointerdown="alert(document.cookie)"></p></div>';
    var htmlWithEvts2 = '<div onmousedown=\'alert(document.cookie)\'><p ' +
        'onpointerdown=\'alert(document.cookie)\'></p></div>';
    var htmlWithScriptTags = '<div><script> alert(document.cookie) ' +
        '</script><p></p></div>';
    var htmlEncodedWithScriptTags = '&lt;div&gt;&lt;script&gt; ' +
        'alert(document.cookie) &lt;/script&gt;&lt;p&gt;&lt;/p&gt;&lt;/div&gt;';

    beforeEach(function() {
      inject(function($injector) {
        gaSanitize = $injector.get('gaSanitize');
      });
    });

    describe('#clean', function() {

      it('does nothing', function() {
        expect(gaSanitize.html(html)).to.be(html);
      });

      it('removes all onXXX attributes from html tags', function() {
        expect(gaSanitize.html(htmlWithEvts)).to.be(html);
        expect(gaSanitize.html(htmlWithEvts2)).to.be(html);
      });

      it('removes script tags', function() {
        expect(gaSanitize.html(htmlWithScriptTags)).to.be(html);
        expect(gaSanitize.html(htmlEncodedWithScriptTags)).to.be(htmlEncoded);
      });
    });
  });
});
