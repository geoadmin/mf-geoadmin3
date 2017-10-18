/* eslint-disable max-len */
describe('ga_measure_filter', function() {
  var measureFilter;

  beforeEach(function() {

    inject(function($injector) {
      measureFilter = $injector.get('measureFilter');
    });
  });

  it('displays "-" when value is not a number', function() {
    expect(measureFilter(null)).to.eql('-');
    expect(measureFilter(undefined)).to.eql('-');
    expect(measureFilter('')).to.eql('-');
    expect(measureFilter('123')).to.eql('-');
    expect(measureFilter(+Infinity)).to.eql('-');
    expect(measureFilter(-Infinity)).to.eql('-');
    expect(measureFilter(NaN)).to.eql('-');
  });

  it('displays a distance', function() {
    var num = 1234.5678;
    expect(measureFilter(num)).to.eql('1.23 km');
    expect(measureFilter(num, 'distance')).to.eql('1.23 km');
    expect(measureFilter(num, 'distance', ' m')).to.eql('1234.57 m');
    expect(measureFilter(num, 'distance', [' m'])).to.eql('1234.57 m');
    expect(measureFilter(num, 'distance', [' m'], 1)).to.eql('1234.6 m');
    expect(measureFilter(1234.00, 'distance', ' m')).to.eql('1234 m');
  });

  it('displays an area', function() {
    var num = 1234567.9428;
    expect(measureFilter(num, 'area')).to.eql('1.23 km&sup2');
    expect(measureFilter(num, 'area', ' m&sup2')).to.eql('1234567.94 m&sup2');
    expect(measureFilter(num, 'area', [' m&sup2'])).to.eql('1234567.94 m&sup2');
    expect(measureFilter(num, 'area', [' m&sup2'], 1)).to.eql('1234567.9 m&sup2');
    expect(measureFilter(1234.00, 'area', ' m&sup2')).to.eql('1234 m&sup2');
  });

  it('displays an angle', function() {
    var num = 240.1234;
    expect(measureFilter(num, 'angle')).to.eql('240.12&deg');
    expect(measureFilter(num, 'angle', '&deg')).to.eql('240.12&deg');
    expect(measureFilter(num, 'angle', ['&deg'])).to.eql('240.12&deg');
    expect(measureFilter(num, 'angle', '&deg', 1)).to.eql('240.1&deg');
    expect(measureFilter(240.00, 'angle')).to.eql('240&deg');
  });
});
