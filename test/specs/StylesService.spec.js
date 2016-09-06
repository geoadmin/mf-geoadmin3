describe('ga_styles_service', function() {

  describe('gaStyleFactory', function() {
    var gaStyle;
    var styles = [
      'select',
      'highlight',
      'selectrectangle',
      'geolocation',
      'offline',
      'kml',
      'redCircle',
      'marker',
      'bowl',
      'cross',
      'circle',
      'point'
    ];
    var circleStyles = ['transparentCircle'];
    var styleFuncs = styles.concat(circleStyles, ['geolocation', 'measure']);

    beforeEach(function() {
      inject(function($injector) {
        gaStyle = $injector.get('gaStyleFactory');
      });
    });

    describe('constants', function() {

      it('exists', function() {
        expect(gaStyle.ZPOLYGON).to.be(10);
        expect(gaStyle.ZLINE).to.be(20);
        expect(gaStyle.ZICON).to.be(30);
        expect(gaStyle.ZTEXT).to.be(40);
        expect(gaStyle.ZSELECT).to.be(50);
        expect(gaStyle.ZSKETCH).to.be(60);
        expect(gaStyle.FONT).to.be('normal 16px Helvetica');
      });
    });

    describe('#getStyle()', function() {

      styles.forEach(function(id) {
        it('gets the \'' + id + '\' style', function() {
          expect(gaStyle.getStyle(id)).to.be.an(ol.style.Style);
        });
      });

      circleStyles.forEach(function(id) {
        it('gets the \'' + id + '\' circle style', function() {
          expect(gaStyle.getStyle(id)).to.be.an(ol.style.Circle);
        });
      });
    });

    describe('#getStyleFunction()', function() {

      styleFuncs.forEach(function(id) {
        it('gets the \'' + id + '\' style function', function() {
          expect(gaStyle.getStyleFunction(id)).to.be.a(Function);
        });
      });
    });

    describe('#getFeatureStyleFunction()', function() {

      styleFuncs.forEach(function(id) {
        it('gets the \'' + id + '\' feature style function', function() {
          expect(gaStyle.getStyleFunction(id)).to.be.a(Function);
        });
      });
    });

    describe('#getTextStroke()', function() {

      it('gets a black text\'s stroke color', function() {
        var black = [0 , 0 , 0 , 1];
        var stroke = gaStyle.getTextStroke([25, 160, 25]);
        expect(stroke.getColor()).to.eql(black);
        expect(stroke.getWidth()).to.eql(3);

        stroke = gaStyle.getTextStroke([25, 255, 25]);
        expect(stroke.getColor()).to.eql(black);
        expect(stroke.getWidth()).to.eql(3);
      });

      it('gets a black text\'s stroke color', function() {
        var white = [255 , 255 , 255 , 1];
        var stroke = gaStyle.getTextStroke([160, 25, 160]);
        expect(stroke.getColor()).to.eql(white);
        expect(stroke.getWidth()).to.eql(3);

        stroke = gaStyle.getTextStroke([179, 25, 178]);
        expect(stroke.getColor()).to.eql(white);
        expect(stroke.getWidth()).to.eql(3);
      });
    });
  });
});
