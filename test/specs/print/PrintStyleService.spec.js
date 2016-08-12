describe('ga_printstyle_service', function() {
  var gaStylesFromLiterals;

  beforeEach(function() {
    inject(function($injector) {
      gaPrintStyle = $injector.get('gaPrintStyle');
    });
  });

  describe('#olPointToPolygon()', function() {
    var pt = new ol.geom.Point([1, 2]);

    it('returns nothing if mandatory values are not defined', function() {
      var poly = gaPrintStyle.olPointToPolygon();
      expect(poly).to.be(undefined);
      poly = gaPrintStyle.olPointToPolygon(pt, 100);
      expect(poly).to.be(undefined);
      poly = gaPrintStyle.olPointToPolygon(new ol.geom.Polygon(), 100, 100);
      expect(poly).to.be(undefined);
    });

    describe('transforms a point to polygon', function() {

      it('using default values', function() {
        var poly = gaPrintStyle.olPointToPolygon(pt, 100, 50);
        expect(poly).to.be.an(ol.geom.Polygon);
        expect(poly.getCoordinates()).to.eql([[
          [1, 4002],
          [-3999, 2.000000000000245],
          [0.9999999999995102, -3998],
          [4001, 1.9999999999992653],
          [1, 4002]
        ]]);
      });

      it('using all parameters', function() {
        var poly = gaPrintStyle.olPointToPolygon(pt, 100, 50, 10, 45);
        expect(poly).to.be.an(ol.geom.Polygon);
        expect(poly.getCoordinates()).to.eql([[
          [-3402.614098136474, 2103.287955270919],
          [-3987.687718614618, -298.616505489822],
          [-3049.218201091239, -2585.695678732669],
          [-945.6690038545548, -3884.363055240854],
          [1519.4755767585675, -3698.5718372689016],
          [3404.6140981365106, -2099.2879552708587],
          [3989.687718614613, 302.61650548989235],
          [3051.2182010911934, 2589.6956787327226],
          [947.6690038544864, 3888.363055240871],
          [-1517.4755767586328, 3702.5718372688752],
          [-3402.614098136474, 2103.287955270919]
        ]]);
      });
    });
  });

  describe('#olCircleToPolygon()', function() {

    it('returns nothing if mandatory values are not defined', function() {
      var poly = gaPrintStyle.olCircleToPolygon();
      expect(poly).to.be(undefined);
      poly = gaPrintStyle.olCircleToPolygon(new ol.geom.Point());
      expect(poly).to.be(undefined);
    });

    describe('transforms a circle to polygon', function() {
      var circle = new ol.geom.Circle([1, 2], 100);

      it('using default values', function() {
        var poly = gaPrintStyle.olCircleToPolygon(circle);
        expect(poly).to.be.an(ol.geom.Polygon);
        expect(poly.getCoordinates()).to.eql([[
          [8.8459095727845, -97.6917333733128],
          [24.344536385590548, -95.23699203976766],
          [39.26834323650898, -90.38795325112868],
          [53.24985647159489, -83.26401643540922],
          [65.94480483301837, -74.0405965600031],
          [77.0405965600031, -62.94480483301837],
          [86.26401643540922, -50.24985647159488],
          [93.38795325112868, -36.268343236508976],
          [98.23699203976766, -21.34453638559054],
          [100.6917333733128, -5.845909572784494],
          [100.6917333733128, 9.845909572784494],
          [98.23699203976767, 25.34453638559052],
          [93.38795325112868, 40.268343236508976],
          [86.26401643540922, 54.24985647159488],
          [77.0405965600031, 66.94480483301837],
          [65.94480483301837, 78.0405965600031],
          [53.24985647159489, 87.26401643540922],
          [39.26834323650898, 94.38795325112868],
          [24.344536385590548, 99.23699203976766],
          [8.8459095727845, 101.6917333733128],
          [-6.845909572784487, 101.6917333733128],
          [-22.344536385590533, 99.23699203976767],
          [-37.268343236508926, 94.38795325112869],
          [-51.24985647159488, 87.26401643540923],
          [-63.94480483301835, 78.04059656000311],
          [-75.0405965600031, 66.94480483301838],
          [-84.26401643540922, 54.24985647159489],
          [-91.38795325112868, 40.26834323650899],
          [-96.23699203976766, 25.34453638559055],
          [-98.6917333733128, 9.845909572784507],
          [-98.6917333733128, -5.845909572784482],
          [-96.23699203976767, -21.344536385590526],
          [-91.38795325112868, -36.26834323650897],
          [-84.26401643540923, -50.24985647159487],
          [-75.04059656000311, -62.94480483301835],
          [-63.94480483301841, -74.04059656000305],
          [-51.24985647159486, -83.26401643540925],
          [-37.26834323650903, -90.38795325112865],
          [-22.344536385590516, -95.23699203976767],
          [-6.8459095727845565, -97.6917333733128],
          [8.8459095727845, -97.6917333733128]
        ]]);
      });

      it('using all parameters', function() {
        var poly = gaPrintStyle.olCircleToPolygon(circle, 5, 45);
        expect(poly).to.be.an(ol.geom.Polygon);
        expect(poly.getCoordinates()).to.eql([[
          [99.76883405951378, -13.643446504023087],
          [46.39904997395468, 91.10065241883677],
          [-69.71067811865474, 72.71067811865476],
          [-88.10065241883679, -43.39904997395467],
          [16.643446504023068, -96.76883405951378],
          [99.76883405951378, -13.643446504023087]
        ]]);
      });
    });

  });

  describe('#olStyleToPrintLiterals()', function() {

    var dfltFill = new ol.style.Fill({
      color: [21, 22, 23, 0.1]
    });

    var dfltStroke = new ol.style.Stroke({
      color: [24, 25, 26, 0.2],
      width: 3.2,
      lineCap: 'round',
      lineJoin: 'bevel',
      lineDash: [5, 6]
    });

    it('returns nothing if style and/or dpi are not defined', function() {
      var literal = gaPrintStyle.olStyleToPrintLiteral();
      expect(literal).to.be(undefined);
      literal = gaPrintStyle.olStyleToPrintLiteral(new ol.style.Style());
      expect(literal).to.be(undefined);
      literal = gaPrintStyle.olStyleToPrintLiteral(undefined, 96);
      expect(literal).to.be(undefined);
      literal = gaPrintStyle.olStyleToPrintLiteral({}, 96);
      expect(literal).to.be(undefined);
    });

    it('transforms correctly a minimal style', function() {
      var literal = gaPrintStyle.olStyleToPrintLiteral(new ol.style.Style(), 96);
      expect(literal).to.eql({
        zIndex: undefined,
        fillOpacity: 0,
        strokeOpacity: 0
      });
    });

    it('transforms correctly a complete style', function() {
      var allStyle = new ol.style.Style({
        zIndex: 3,
        fill: dfltFill,
        stroke: dfltStroke,
        text: new ol.style.Text({
          text: 'test',
          textAlign: 'center',
          fill: new ol.style.Fill({
            color: [27, 28, 29, 0.3]
          }),
          font: 'bold 14px Arial'
        }),
        image: new ol.style.Icon({
          scale: 0.4,
          rotation: 34,
          size: [15, 16],
          anchor: [0.6, 0.7],
          src: 'http://test.png'
        })
      });
      var literal = gaPrintStyle.olStyleToPrintLiteral(allStyle, 96);
      expect(literal).to.eql({
        zIndex: 3,
        rotation: 34,
        externalGraphic: 'http://test.png',
        fillOpacity: 0.1,
        graphicWidth: 5.625,
        graphicHeight: 6,
        graphicXOffset: -3.375,
        graphicYOffset: -4.199999999999999,
        fillColor: '#151617',
        strokeWidth: 3,
        strokeColor: '#18191a',
        strokeOpacity: 0.2,
        strokeLinecap: 'round',
        strokeLinejoin: 'bevel',
        strokeDashstyle: 'dash',
        label: 'test',
        labelAlign: 'center',
        fontColor: '#1b1c1d',
        fontFamily: 'ARIAL',
        fontSize: 14,
        fontWeight: 'bold'
      });
    });

    it('transforms correctly a color with an hexa value of one letter(#3322)', function() {
       var style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: [12, 0, 1, 0.2]
          })
        });
        var literal = gaPrintStyle.olStyleToPrintLiteral(style, 96);
        expect(literal).to.eql({
          zIndex: undefined,
          fillColor: '#0c0001',
          fillOpacity: 0.2,
          strokeOpacity: 0
        });
    });

    describe('transforms correctly a image style', function() {

      it('containing an ol.style.Circle', function() {
        var style = new ol.style.Style({
          image: new ol.style.Circle({
            fill: dfltFill,
            stroke: dfltStroke,
            radius: 567.2
          })
        });
        var literal = gaPrintStyle.olStyleToPrintLiteral(style, 96);
        expect(literal).to.eql({
          zIndex: undefined,
          rotation: 0,
          pointRadius: 567.2,
          graphicWidth: 1000.7226562500001,
          graphicHeight: 1000.7226562500001,
          graphicXOffset: -500.36132812500006,
          graphicYOffset: -500.36132812500006,
          fillColor: '#151617',
          fillOpacity: 0.1,
          strokeWidth: 3,
          strokeColor: '#18191a',
          strokeOpacity: 0.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'bevel',
          strokeDashstyle: 'dash'
        });
      });

      it('containing an ol.style.RegularShape', function() {
        var style = new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: dfltFill,
            stroke: dfltStroke,
            radius: 567.2
          })
        });
        var literal = gaPrintStyle.olStyleToPrintLiteral(style, 96);
        expect(literal).to.eql({
          zIndex: undefined,
          rotation: 0,
          pointRadius: 567.2,
          graphicWidth: 1000.7226562500001,
          graphicHeight: 1000.7226562500001,
          graphicXOffset: -500.36132812500006,
          graphicYOffset: -500.36132812500006,
          fillColor: '#151617',
          fillOpacity: 0.1,
          strokeWidth: 3,
          strokeColor: '#18191a',
          strokeOpacity: 0.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'bevel',
          strokeDashstyle: 'dash'
        });
      });

      it('uses an image size of 0.1 if no image size defined', function() {
        var style = new ol.style.Style({
          image: new ol.style.Icon({
            src: 'https://test.png',
            size: [0, 0]
          })
        });
        var literal = gaPrintStyle.olStyleToPrintLiteral(style, 96);
        expect(literal).to.eql({
          zIndex: undefined,
          rotation: 0,
          externalGraphic: 'https://test.png',
          fillOpacity: 1,
          graphicWidth: 0.09375,
          graphicHeight: 0.09375,
          graphicXOffset: undefined,
          graphicYOffset: undefined,
          strokeOpacity: 0
        });
      });
    });

    describe('transforms correctly a stroke style', function() {

      it('using default values (lineCap, lineJoin, lineDash ...)', function() {
        var style = new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: [28, 255, 0, 0.2],
            width: 1.2
          })
        });
        var literal = gaPrintStyle.olStyleToPrintLiteral(style, 96);
        expect(literal).to.eql({
          zIndex: undefined,
          fillOpacity: 0,
          strokeWidth: 1.125,
          strokeColor: '#1cff00',
          strokeOpacity: 0.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        });
      });
    });
  });
});
