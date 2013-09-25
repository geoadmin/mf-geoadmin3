describe('ga_search_service', function() {

  var extent = [420000, 30000, 900000, 350000];
  var getCoordinate;

  beforeEach(function() {
    inject(function($injector) {
      getCoordinate = $injector.get('gaGetCoordinate');
    });
  });

  it('supports CH1903 coordinate', function() {
    expect(getCoordinate(extent,'600000 200000')).to.eql([600000,200000]);
  });

  it('supports CH1903+ coordinate', function() {
    expect(getCoordinate(extent,'2600000 1200000')).to.eql([600000,200000]);
  });

  it('supports latitude and longitude as decimal', function() {
    expect(getCoordinate(extent,'6.96948 46.9712')).to.eql([564298.937, 202343.701]);
    expect(getCoordinate(extent,'46.9712 6.96948')).to.eql([564298.937, 202343.701]);
  });

  it('supports latitude and longitude as DMS', function() {
    expect(getCoordinate(extent,'7° E 46° N')).to.eql([566016.05, 94366.859]);
    expect(getCoordinate(extent,'7° 1\' E 46° N')).to.eql([567307.273, 94359.756]);
    expect(getCoordinate(extent,'7° 1\' 25.0\'\' E 46° N')).to.eql([567845.283, 94356.877]);
    expect(getCoordinate(extent,'7° 1\' 25.0\'\' E 46° 1\' N')).to.eql([567855.114, 96209.641]);
    expect(getCoordinate(extent,'7° 1\' 25.0\'\' E 46° 1\' 25.0\'\' N')).to.eql([567859.21, 96981.625]);
    expect(getCoordinate(extent,'46° 1\' 25.0\'\' N 7° 1\' 25.0\'\' E')).to.eql([567859.21, 96981.625]);
  });

  it('checks the swiss extent', function() {
    expect(getCoordinate(extent,'1600000 1200000')).to.be(undefined);
    expect(getCoordinate(extent,'10° E 50° N')).to.be(undefined);
  });

  it('works only in north east', function() {
    expect(getCoordinate(extent,'10° W 50° N')).to.be(undefined);
    expect(getCoordinate(extent,'10° W 50° S')).to.be(undefined);
    expect(getCoordinate(extent,'10° E 50° S')).to.be(undefined);
  });
});
