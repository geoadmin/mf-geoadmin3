/* eslint-disable max-len */
describe('ga_waitcursor_service', function() {

  describe('gaWaitCursor', function() {
    var gaWait, $document, $rootScope;

    beforeEach(function() {
      inject(function($injector) {
        $document = $injector.get('$document');
        $rootScope = $injector.get('$rootScope');
        gaWait = $injector.get('gaWaitCursor');
      });
    });

    it('increments on ajaxSend event', function() {
      var spy = sinon.spy(gaWait, 'increment');
      $document[0].dispatchEvent(new Event('ajaxSend'));
      expect(spy.calledOnce).to.be(true);
      spy.restore();
    });

    it('decrements on ajaxComplete event', function() {
      var spy = sinon.spy(gaWait, 'decrement');
      $document[0].dispatchEvent(new Event('ajaxComplete'));
      expect(spy.calledOnce).to.be(true);
      spy.restore();
    });

    describe('#increment()', function() {

      it('adds body css class', function() {
        gaWait.increment();
        expect($($document[0].body).hasClass('ga-wait-cursor')).to.be(true);
      });
    });

    describe('#decrement()', function() {

      it('removes body css class', function() {
        gaWait.increment();
        expect($($document[0].body).hasClass('ga-wait-cursor')).to.be(true);
        gaWait.decrement();
        expect($($document[0].body).hasClass('ga-wait-cursor')).to.be(false);
      });

      it('broadcasts gaIdle after 4 seconds', inject(function($timeout) {
        $timeout.flush(); // Be sure $timeout is clean before the begininning of this test
        var clock = sinon.useFakeTimers();
        var spy = sinon.spy($rootScope, '$broadcast');
        var spy2 = sinon.spy($timeout, 'cancel');
        gaWait.increment();
        gaWait.decrement();

        clock.tick(3000);
        $timeout.flush(3000);
        expect(spy.callCount).to.be(0);
        expect(spy2.callCount).to.be(0);
        gaWait.increment();
        gaWait.decrement();

        clock.tick(2000);
        $timeout.flush(2000);
        expect(spy.callCount).to.be(0);
        expect(spy2.callCount).to.be(1);

        clock.tick(4000);
        $timeout.flush(4000);
        expect(spy.callCount).to.be(1);
        expect(spy.calledWithExactly('gaIdle')).to.be(true);
        expect(spy2.callCount).to.be(1);
        spy.restore();
        spy2.restore();
        clock.restore();
      }));
    });
  });
});
