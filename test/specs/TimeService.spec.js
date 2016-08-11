describe('ga_time_service', function() {
  var gaTime;

  beforeEach(function() {
    inject(function($injector) {
      gaTime = $injector.get('gaTime');
    });
  });

  it('converts correct timestamps to year', function() {
    var t = '20101231';
    var y = gaTime.getYearFromTimestamp(t);
    expect(y).to.equal(2010);

    t = '2002';
    y = gaTime.getYearFromTimestamp(t);
    expect(y).to.equal(2002);

    t = 'abc';
    y = gaTime.getYearFromTimestamp(t);
    expect(y).to.equal(undefined);

    t = '2100';
    y = gaTime.getYearFromTimestamp(t);
    expect(y).to.equal(undefined);

    t = 'current';
    y = gaTime.getYearFromTimestamp(t);
    expect(y).to.equal(new Date().getFullYear());
  });
});
