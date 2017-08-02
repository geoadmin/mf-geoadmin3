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
        $.Event('pointerdown', {pointerType: 'mouse'}),
        $.Event('pointerdown', {pointerType: 4})
      ];

      var notMouseEvts = [
        $.Event('touchstart'),
        $.Event('pointerdown', {pointerType: 'pen'}),
        $.Event('pointerdown', {pointerType: 'touch'}),
        $.Event('pointerdown', {pointerType: 2}),
        $.Event('pointerdown', {pointerType: 3})
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

    describe('#onMouseOverOut()', function() {
      var elt, spyOver, spyOut;

      beforeEach(function() {
        elt = $('<div></div>');
        spyOver = sinon.spy(function() {});
        spyOut = sinon.spy(function() {});
      });

      it('calls mouseover callback on mouse event', function() {
        gaEvent.onMouseOverOut(elt, spyOver, spyOut);

        elt.trigger('mouseover');
        expect(spyOver.callCount).to.be(1);
        expect(spyOut.callCount).to.be(0);

        elt.trigger('mouseout');
        expect(spyOver.callCount).to.be(1);
        expect(spyOut.callCount).to.be(1);
      });

      it('doesn\'t call mouseover callback on touch event', function() {
        gaEvent.onMouseOverOut(elt, spyOver, spyOut);

        elt.trigger('touchstart');
        elt.trigger('mouseover');
        expect(spyOver.callCount).to.be(0);
        expect(spyOut.callCount).to.be(0);

        elt.trigger('mouseout');
        expect(spyOver.callCount).to.be(0);
        expect(spyOut.callCount).to.be(1);
      });
    });

    describe('#onMouseEnterLeave()', function() {
      var elt, spyOver, spyOut;

      beforeEach(function() {
        elt = $('<div></div>');
        spyOver = sinon.spy(function() {});
        spyOut = sinon.spy(function() {});
      });

      it('calls mouseenter callback on mouse event', function() {
        gaEvent.onMouseOverOut(elt, spyOver, spyOut);

        elt.trigger('mouseenter');
        expect(spyOver.callCount).to.be(1);
        expect(spyOut.callCount).to.be(0);

        elt.trigger('mouseleave');
        expect(spyOver.callCount).to.be(1);
        expect(spyOut.callCount).to.be(1);
      });

      it('doesn\'t call mouseenter callback on touch event', function() {
        gaEvent.onMouseOverOut(elt, spyOver, spyOut);

        elt.trigger('touchstart');
        elt.trigger('mouseenter');
        expect(spyOver.callCount).to.be(0);
        expect(spyOut.callCount).to.be(0);

        elt.trigger('mouseleave');
        expect(spyOver.callCount).to.be(0);
        expect(spyOut.callCount).to.be(1);
      });
    });
  });
});

