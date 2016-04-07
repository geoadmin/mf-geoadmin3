describe('ga_debounce_service', function() {
  var gaDebounce, $timeout;

  beforeEach(function() {
    inject(function($injector) {
      gaDebounce = $injector.get('gaDebounce');
      $timeout = $injector.get('$timeout');
    });
  });
  
  it('it invoked callback after specified delay', function() {
    var spy = sinon.spy(function () {});
    var debounced = gaDebounce.debounce(spy, 100, false, false);
    debounced()
    expect(spy.called).to.be(false);
    $timeout.flush(100);
    expect(spy.called).to.be(true);
  });

  it('it wait again if another call arrives during wait', function() {
    var spy = sinon.spy(function () {});
    var debounced = gaDebounce.debounce(spy, 100, false, false);
    debounced();
    $timeout.flush(99);
    debounced();
    $timeout.flush(99);
    expect(spy.called).to.be(false);
    $timeout.flush(1);
    expect(spy.called).to.be(true);
  });
});
