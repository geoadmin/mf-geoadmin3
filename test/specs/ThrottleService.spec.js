describe('ga_throttle_service', function() {
  var gaThrottle, now, last, cpt, cptNoTrail;

  beforeEach(function() {
    inject(function($injector) {
      gaThrottle = $injector.get('gaThrottle');
      cpt = 0, cptNoTrail = 0;
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
      funcThrottled();
      funcThrottledNoTrail();
      now = +new Date();
    }
    $timeout.flush();
    // We can't test value of cpt (because it depends of the machine)
    // but we test if the noTrailing options is used
    // correctly. 
    expect(cpt).to.be.eql(cptNoTrail + 1);
  }));
});
