describe('ga_throttle_service', function() {
  var gaThrottle, now, last, cpt, cptNoTrail, runs;

  beforeEach(function() {
    inject(function($injector) {
      gaThrottle = $injector.get('gaThrottle');
      cpt = 0, cptNoTrail = 0, runs = 0;
      now = +new Date();
      last = now + 1000; 
    });
  });
  
  it('throttles', inject(function($timeout) {
    var funcThrottled = gaThrottle.throttle(function() {
      cpt++;
    }, 100);
    var funcThrottledNoTrail = gaThrottle.throttle(function() {
      cptNoTrail++;
    }, 100, true);
    while (now < last) {
      runs++;
      funcThrottled();
      funcThrottledNoTrail();
      now = +new Date();
    }
    $timeout.flush();
    expect(runs).to.be.above(0);
    expect(cpt).to.be.above(0);
    expect(cptNoTrail).to.be.above(0);
    expect(runs).to.be.greaterThan(cpt);
    expect(runs).to.be.greaterThan(cptNoTrail);
    expect(cpt).to.be.lessThan(12);
    expect(cptNoTrail).to.be.lessThan(12);
    expect(cpt >= cptNoTrail).to.be(true);
  }));
});
