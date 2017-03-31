describe('ga_event_service', function() {

  describe('gaEvent', function() {
    var gaEvent;

    beforeEach(function() {
      inject(function($injector) {
        gaEvent = $injector.get('gaEvent');
      });
    });

    describe('#isMouse()', function() {

      // Native events mock
      var mouseEvts = [
        $.Event('mousedown'),
        $.Event('pointerdown', {pointerType: 'mouse'})
      ];

      var notMouseEvts = [
        $.Event('touchstart'),
        $.Event('pointerdown', {pointerType: 'pen'}),
        $.Event('pointerdown', {pointerType: 'touch'})
      ];

      // Jquery/ol events mock (with originalEvent stored)
      var origMouseEvts = [];
      mouseEvts.forEach(function(evt) {
        origMouseEvts.push({originalEvent: evt});
      });

      var origNotMouseEvts = [];
      notMouseEvts.forEach(function(evt) {
        origNotMouseEvts.push({originalEvent: evt});
      });

      it('detects mouse events as mouse', function() {
        mouseEvts.concat(origMouseEvts).forEach(function(evt) {
          expect(gaEvent.isMouse(evt)).to.be(true);
        });
      });

      it('detects others events as not mouse', function() {
        notMouseEvts.concat(origNotMouseEvts).forEach(function(evt) {
          expect(gaEvent.isMouse(evt)).to.be(false);
        });
      });
    });
  });
});

