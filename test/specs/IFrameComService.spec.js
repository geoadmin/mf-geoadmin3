describe('ga_iframecom_service', function() {

  describe('gaIframeCom', function() {
    var gaIframe, $window;
    var type = 'sometype';
    var payload = {
      layerId: 'somelayer',
      featureId: 'someId'
    };
    var injectIframe = function() {
      inject(function($injector) {
        $window = $injector.get('$window');
        gaIframe = $injector.get('gaIFrameCom');
      });
    };

    describe('when the browser manage postMessage with object', function() {

      beforeEach(function() {
        module(function($provide) {
          $provide.value('$window', {
            postMessage: function() {},
            top: {},
            parent: {
              postMessage: function() {}
            }
          });
        });
        injectIframe();
      });

      describe('#stringsOnly()', function() {
        it('returns false', function() {
          expect(gaIframe.stringsOnly).to.be(false);
        });
      });

      describe('#send()', function() {
        it('send the msg to the parent window', function() {
          var spy = sinon.spy($window.parent, 'postMessage');
          gaIframe.send(type, payload);
          expect(spy.calledWith({type: type, payload: payload}, '*')).to.be(true);
          spy.restore();
        });

        it('send the msg with the targetOrigin in parameter', function() {
          var spy = sinon.spy($window.parent, 'postMessage');
          gaIframe.send(type, payload, 'origin');
          expect(spy.calledWith({type: type, payload: payload}, 'origin')).to.be(true);
          spy.restore();
        });
      });
    });

    describe('when the browser doesn\'t manage postMessage with object', function() {

      beforeEach(function() {
        module(function($provide) {
          $provide.value('$window', {
            postMessage: function(msg) {
              msg.toString();
            },
            top: {},
            parent: {
              postMessage: function() {}
            }
          });
        });
        injectIframe();
      });

      describe('#stringsOnly()', function() {
        it('returns true', function() {
          expect(gaIframe.stringsOnly).to.be(true);
        });
      });

      describe('#send()', function() {
        it('stringify the msg before sending it', function() {
          var spy = sinon.spy($window.parent, 'postMessage');
          gaIframe.send(type, payload);
          expect(spy.calledWith('{"type":"sometype","payload":{"layerId":"somelayer","featureId":"someId"}}', '*')).to.be(true);
        });
      });
    });

    describe('when the window has no parent', function() {

      beforeEach(function() {
        module(function($provide) {
          $provide.value('$window', {
            postMessage: function() {},
            parent: {
              postMessage: function() {}
            }
          });
        });
        injectIframe();
        $window.top = $window;
      });

      describe('#send()', function() {
        it('doesn\'t send the msg to the parent window', function() {
          var spy = sinon.spy($window.parent, 'postMessage');
          gaIframe.send(type, payload);
          expect(spy.callCount).to.be(0);
          spy.restore();
        });
      });
    });
  });
});
